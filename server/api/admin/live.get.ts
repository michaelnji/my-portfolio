import { sql } from 'kysely'
import { sendServerResponse } from 'nexus-req'

/**
 * Dedicated lightweight endpoint for the Overview page's "Live now" stat —
 * split out so the 15s poll doesn't drag the whole overview payload
 * (today/7d/30d/chart/top-pages) along with it every time.
 */
export default defineEventHandler(async (event) => {
    try {
        const db = getDb()
        const live = await sql<{ count: string }>`
            SELECT COUNT(DISTINCT anon_id)::text AS count
            FROM page_views
            WHERE created_at >= now() - interval '5 minutes'
        `.execute(db)

        return sendServerResponse(200, 'success', {
            liveNow: Number(live.rows[0]?.count ?? 0),
        })
    } catch (error) {
        if (error instanceof Error) {
            console.error('Failed to load live count:', error)
            setResponseStatus(event, 500)
            return sendServerResponse(500, 'Failed to load live count')
        }
    }
})
