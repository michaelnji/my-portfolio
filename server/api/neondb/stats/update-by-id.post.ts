
import { sql } from 'kysely';
import { sendServerResponse } from 'nexus-req';

const ALLOWED_FIELDS = ['hearts', 'claps', 'stars', 'dislikes'] as const
type AllowedField = typeof ALLOWED_FIELDS[number]

export default defineEventHandler(async (event) => {

    try {
        const db = getDb()
        const body = await readBody<{ id?: string; data?: Record<string, unknown> } | null>(event)
        if (!body?.id || !body.id.trim()) {
            setResponseStatus(event, 400)
            return sendServerResponse(400, 'Post ID is required')
        }
        const postId = body.id.trim()

        const keys = Object.keys(body.data ?? {}).filter(
            (k): k is AllowedField => ALLOWED_FIELDS.includes(k as AllowedField)
        )
        if (keys.length !== 1) {
            setResponseStatus(event, 400)
            return sendServerResponse(400, 'Exactly one reaction field required')
        }

        const field = keys[0]

        const userHash = getUserFingerprint(event)
        const limited = await tryRateLimit(db, postId, userHash, 'like', field)
        if (limited) {
            await trackRateLimitHit(event, db, 'like', postId, field)
            setResponseStatus(event, 429)
            return sendServerResponse(429, 'Rate limit exceeded')
        }

        const resp = await db
            .updateTable("stats")
            .set({ [field]: sql`${sql.ref(field)} + 1` })
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
