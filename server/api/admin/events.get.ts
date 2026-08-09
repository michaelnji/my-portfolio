import { sql } from 'kysely'
import { sendServerResponse } from 'nexus-req'

const PAGE_SIZE = 20

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)
        const type = typeof query.type === 'string' ? query.type : undefined
        const page = Math.max(1, Number(query.page) || 1)
        const { interval } = rangeConfig(parseRange(query.range))
        const window = sql.raw(`interval '${interval}'`)

        const db = getDb()

        // One extra row per page — cheap way to know whether a next page
        // exists without a separate COUNT(*) query.
        let rowsQuery = db
            .selectFrom('events')
            .selectAll()
            .where(sql<boolean>`created_at >= now() - ${window}`)
            .orderBy('created_at', 'desc')
            .limit(PAGE_SIZE + 1)
            .offset((page - 1) * PAGE_SIZE)
        if (type) rowsQuery = rowsQuery.where('type', '=', type)

        const [rows, counts, clicksByKind] = await Promise.all([
            rowsQuery.execute(),
            sql<{ type: string; count: string }>`
                SELECT type, COUNT(*)::text AS count
                FROM events
                WHERE created_at >= now() - ${window}
                GROUP BY type
                ORDER BY COUNT(*) DESC
            `.execute(db),
            sql<{ kind: string; count: string }>`
                SELECT COALESCE(payload->>'kind', 'other') AS kind, COUNT(*)::text AS count
                FROM events
                WHERE type = 'outbound_click' AND created_at >= now() - ${window}
                GROUP BY kind
                ORDER BY COUNT(*) DESC
            `.execute(db),
        ])

        const eventsHasMore = rows.length > PAGE_SIZE

        return sendServerResponse(200, 'success', {
            events: eventsHasMore ? rows.slice(0, PAGE_SIZE) : rows,
            eventsHasMore,
            countsByType: counts.rows,
            clicksByKind: clicksByKind.rows,
        })
    } catch (error) {
        if (error instanceof Error) {
            console.error('Failed to load events:', error)
            setResponseStatus(event, 500)
            return sendServerResponse(500, 'Failed to load events')
        }
    }
})
