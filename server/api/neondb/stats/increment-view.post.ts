
import { createKysely } from "@vercel/postgres-kysely";
import { sql } from 'kysely';
import { sendServerResponse } from 'nexus-req';
import type { Database } from "../../../types/index.types";


export default defineEventHandler(async (event) => {

    try {
        const config = useRuntimeConfig()
        const db = createKysely<Database>({
            connectionString: config.postgresUrl,
        });
        const body = await readBody<{ id?: string } | null>(event)
        if (!body?.id || !body.id.trim()) {
            setResponseStatus(event, 400)
            return sendServerResponse(400, 'Post ID is required')
        }
        const postId = body.id.trim()

        const userHash = getUserFingerprint(event)
        const limited = await tryRateLimit(db, postId, userHash, 'view')
        if (limited) {
            // silent — no UX disruption
            return sendServerResponse(200, 'success', null)
        }

        const resp = await db
            .updateTable("stats")
            .set(() => ({ views: sql`views + 1` }))
            .where("postId", "=", postId)
            .returningAll()
            .executeTakeFirstOrThrow();
        
        return sendServerResponse(200, 'success', resp)
    } catch (error) {
        if (error instanceof Error) {
            const msg = error.message.includes('fetch') || error.message.includes('getaddrinfo') ? 'Fetch failed' : error.message
            setResponseStatus(event, 500, msg)
            return sendServerResponse(500, msg)
        }
    }
})
