
import { sql } from 'kysely';
import { sendServerResponse } from 'nexus-req';


export default defineEventHandler(async (event) => {

    try {
        const db = getDb()
        const body = await readBody<{ id?: string } | null>(event)
        if (!body?.id || !body.id.trim()) {
            setResponseStatus(event, 400)
            return sendServerResponse(400, 'Post ID is required')
        }
        const postId = body.id.trim()

        const existingPost = await db
            .selectFrom("stats")
            .select("postId")
            .where("postId", "=", postId)
            .executeTakeFirst()

        if (!existingPost) {
            setResponseStatus(event, 404)
            return sendServerResponse(404, 'Post not found')
        }

        const userHash = getUserFingerprint(event)
        const limited = await tryRateLimit(db, postId, userHash, 'view')
        if (limited) {
            await trackRateLimitHit(event, db, 'view', postId, '')
            // silent — no UX disruption
            return sendServerResponse(200, 'success', null)
        }

        const resp = await db
            .updateTable("stats")
            .set(() => ({ views: sql`views + 1` }))
            .where("postId", "=", postId)
            .returningAll()
            .executeTakeFirstOrThrow();

        // Timestamped mirror of the bump above — lets admin charts filter by
        // range. `stats` itself stays a lifetime counter (public page reads it).
        await db.insertInto("post_stat_events").values({ post_id: postId, type: "view" }).execute()

        return sendServerResponse(200, 'success', resp)
    } catch (error) {
        if (error instanceof Error) {
            console.error('Failed to increment post view:', error)
            const msg = error.message.includes('fetch') || error.message.includes('getaddrinfo')
                ? 'Fetch failed'
                : 'Failed to increment post view'
            setResponseStatus(event, 500, msg)
            return sendServerResponse(500, msg)
        }
    }
})
