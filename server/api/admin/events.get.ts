import { sql } from 'kysely'
import { sendServerResponse } from 'nexus-req'

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)
        const type = typeof query.type === 'string' ? query.type : undefined
        const limit = Math.min(Number(query.limit) || 50, 200)
        const { interval } = rangeConfig(parseRange(query.range))
        const window = sql.raw(`interval '${interval}'`)

        const db = getDb()

        let rowsQuery = db
            .selectFrom('events')
            .selectAll()
            .where(sql<boolean>`created_at >= now() - ${window}`)
            .orderBy('created_at', 'desc')
            .limit(limit)
        if (type) rowsQuery = rowsQuery.where('type', '=', type)

        const [rows, counts] = await Promise.all([
            rowsQuery.execute(),
            sql<{ type: string; count: string }>`
                SELECT type, COUNT(*)::text AS count
                FROM events
                WHERE created_at >= now() - ${window}
                GROUP BY type
                ORDER BY count DESC
            `.execute(db),
        ])

        return sendServerResponse(200, 'success', {
            events: rows,
            countsByType: counts.rows,
        })
    } catch (error) {
        if (error instanceof Error) {
            console.error('Failed to load events:', error)
            setResponseStatus(event, 500)
            return sendServerResponse(500, 'Failed to load events')
        }
    }
})
