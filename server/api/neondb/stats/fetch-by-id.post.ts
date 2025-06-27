
import { createKysely } from "@vercel/postgres-kysely";
import { sendServerResponse } from 'nexus-req';
import type { Database } from "../../../types/index.types";


export default defineEventHandler(async (event) => {

    try {
        const config = useRuntimeConfig()
        const db = createKysely<Database>({
            connectionString: config.postgresUrl,
        });
        const body = await readBody<{ id: string }>(event)
        const resp = await db
            .selectFrom("stats")
            .selectAll()
            .where("postId", "=", body.id)
            .executeTakeFirstOrThrow();
        return sendServerResponse(200, 'success', resp)
    } catch (error) {
        if (error instanceof Error) {
            setResponseStatus(event, 500, error.message.includes('fetch') || error.message.includes('getaddrinfo') ? 'Fetch failed' : error.message)
            return sendServerResponse(500, error.message.includes('fetch') || error.message.includes('getaddrinfo') ? 'Fetch failed' : error.message)
        }
    }
})
