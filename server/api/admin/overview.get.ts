import { sql } from 'kysely'
import { sendServerResponse } from 'nexus-req'

interface PeriodTotals {
    pageviews: string
    visitors: string
    avg_duration: string | null
}

interface DailyRow {
    day: Date
    views: string
    visitors: string
}

interface TopPageRow {
    path: string
    views: string
}

export default defineEventHandler(async (event) => {
    try {
        const range = parseRange(getQuery(event).range)
        const { interval, bucket } = rangeConfig(range)
        const db = getDb()

        // Live now / Today / 7d / 30d are fixed reference points, independent
        // of the selected range — only the chart and top-pages list below
        // follow it.
        const totalsFor = (fixedInterval: string) =>
            sql<PeriodTotals>`
                SELECT
                    COUNT(*)::text AS pageviews,
                    COUNT(DISTINCT anon_id)::text AS visitors,
                    AVG(duration_seconds)::text AS avg_duration
                FROM page_views
                WHERE created_at >= now() - ${sql.raw(`interval '${fixedInterval}'`)}
            `.execute(db)

        const [today, last7d, last30d, live, daily, topPages] = await Promise.all([
            totalsFor('1 day'),
            totalsFor('7 days'),
            totalsFor('30 days'),
            sql<{ count: string }>`
                SELECT COUNT(DISTINCT anon_id)::text AS count
                FROM page_views
                WHERE created_at >= now() - interval '5 minutes'
            `.execute(db),
            sql<DailyRow>`
                SELECT
                    date_trunc(${sql.raw(`'${bucket}'`)}, created_at) AS day,
                    COUNT(*)::text AS views,
                    COUNT(DISTINCT anon_id)::text AS visitors
                FROM page_views
                WHERE created_at >= now() - ${sql.raw(`interval '${interval}'`)}
                GROUP BY day
                ORDER BY day ASC
            `.execute(db),
            sql<TopPageRow>`
                SELECT path, COUNT(*)::text AS views
                FROM page_views
                WHERE created_at >= now() - ${sql.raw(`interval '${interval}'`)}
                GROUP BY path
                ORDER BY views DESC
                LIMIT 10
            `.execute(db),
        ])

        return sendServerResponse(200, 'success', {
            today: today.rows[0],
            last7d: last7d.rows[0],
            last30d: last30d.rows[0],
            liveNow: Number(live.rows[0]?.count ?? 0),
            daily: daily.rows,
            topPages: topPages.rows,
        })
    } catch (error) {
        if (error instanceof Error) {
            console.error('Failed to load overview stats:', error)
            setResponseStatus(event, 500)
            return sendServerResponse(500, 'Failed to load overview stats')
        }
    }
})
