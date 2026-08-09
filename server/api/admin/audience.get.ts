import { sql } from 'kysely'
import { sendServerResponse } from 'nexus-req'

interface BucketRow {
    key: string | null
    count: string
}

export default defineEventHandler(async (event) => {
    try {
        const db = getDb()
        const { interval } = rangeConfig(parseRange(getQuery(event).range))
        const window = sql.raw(`interval '${interval}'`)

        const byDimension = (column: 'device' | 'browser' | 'os' | 'country') =>
            sql<BucketRow>`
                SELECT ${sql.raw(column)} AS key, COUNT(*)::text AS count
                FROM page_views
                WHERE created_at >= now() - ${window}
                GROUP BY ${sql.raw(column)}
                ORDER BY count DESC
                LIMIT 15
            `.execute(db)

        const [device, browser, os, country] = await Promise.all([
            byDimension('device'),
            byDimension('browser'),
            byDimension('os'),
            byDimension('country'),
        ])

        return sendServerResponse(200, 'success', {
            device: device.rows,
            browser: browser.rows,
            os: os.rows,
            country: country.rows,
        })
    } catch (error) {
        if (error instanceof Error) {
            console.error('Failed to load audience stats:', error)
            setResponseStatus(event, 500)
            return sendServerResponse(500, 'Failed to load audience stats')
        }
    }
})
