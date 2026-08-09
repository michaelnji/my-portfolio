import { sendServerResponse } from 'nexus-req'

interface UpdateBody {
    id?: number
    duration_seconds?: number
    scroll_depth?: number
}

/**
 * Called via navigator.sendBeacon on route-leave/unload to backfill the
 * engagement fields the initial pageview insert can't know yet.
 */
export default defineEventHandler(async (event) => {
    try {
        if (hasAdminCookie(event) || isBotRequest(event)) {
            return sendServerResponse(200, 'skipped', null)
        }

        const body = await readBody<UpdateBody | null>(event)
        if (!body?.id) {
            setResponseStatus(event, 400)
            return sendServerResponse(400, 'id is required')
        }

        const duration = typeof body.duration_seconds === 'number'
            ? Math.max(0, Math.min(body.duration_seconds, 60 * 60 * 6))
            : null
        const scroll = typeof body.scroll_depth === 'number'
            ? Math.max(0, Math.min(Math.round(body.scroll_depth), 100))
            : null

        const db = getDb()
        await db
            .updateTable('page_views')
            .set({ duration_seconds: duration, scroll_depth: scroll })
            .where('id', '=', body.id)
            .execute()

        return sendServerResponse(200, 'success', null)
    } catch (error) {
        if (error instanceof Error) {
            console.error('Failed to update pageview:', error)
            setResponseStatus(event, 500)
            return sendServerResponse(500, 'Failed to update pageview')
        }
    }
})
