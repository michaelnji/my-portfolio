import { sendServerResponse } from 'nexus-req'

const ALLOWED_TYPES = new Set([
    'outbound_click',
    'game_play',
    'game_complete',
    'form_submit',
    'not_found',
    'js_error',
])

interface EventBody {
    type?: string
    path?: string
    // biome-ignore lint/suspicious/noExplicitAny: caller-defined shape per event type
    payload?: any
}

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody<EventBody | null>(event)
        if (!body?.type || !ALLOWED_TYPES.has(body.type)) {
            setResponseStatus(event, 400)
            return sendServerResponse(400, 'valid type is required')
        }

        if (hasAdminCookie(event) || isBotRequest(event) || isAdminPath(body.path)) {
            return sendServerResponse(200, 'skipped', null)
        }

        const anonId = getOrSetAnonId(event)
        const db = getDb()
        await db
            .insertInto('events')
            .values({
                type: body.type,
                path: body.path?.slice(0, 500) ?? null,
                anon_id: anonId,
                payload: body.payload ? JSON.stringify(body.payload) : null,
            })
            .execute()

        return sendServerResponse(200, 'success', null)
    } catch (error) {
        if (error instanceof Error) {
            console.error('Failed to record event:', error)
            setResponseStatus(event, 500)
            return sendServerResponse(500, 'Failed to record event')
        }
    }
})
