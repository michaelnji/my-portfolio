import { sql } from 'kysely'
import { sendServerResponse } from 'nexus-req'

interface VitalRow {
    metric: string
    p75: string
    samples: string
}

interface ErrorRow {
    path: string | null
    status: number | null
    count: string
}

interface LatencyRow {
    p50: string | null
    p95: string | null
    samples: string
}

interface SlowPathRow {
    path: string | null
    p95: string | null
    samples: string
}

interface BotPathRow {
    path: string
    count: string
}

export default defineEventHandler(async (event) => {
    try {
        const { interval } = rangeConfig(parseRange(getQuery(event).range))
        const window = sql.raw(`interval '${interval}'`)
        const db = getDb()

        const [vitals, errors, errorsToday, latency, slowestPaths, botCount, botPaths] = await Promise.all([
            sql<VitalRow>`
                SELECT
                    metric,
                    percentile_cont(0.75) WITHIN GROUP (ORDER BY value)::text AS p75,
                    COUNT(*)::text AS samples
                FROM web_vitals
                WHERE created_at >= now() - ${window}
                GROUP BY metric
            `.execute(db),
            sql<ErrorRow>`
                SELECT path, status, COUNT(*)::text AS count
                FROM api_errors
                WHERE created_at >= now() - ${window}
                GROUP BY path, status
                ORDER BY count DESC
                LIMIT 20
            `.execute(db),
            // Always "today" regardless of the selected range — a pulse
            // indicator, not a historical figure.
            sql<{ count: string }>`
                SELECT COUNT(*)::text AS count
                FROM api_errors
                WHERE created_at >= date_trunc('day', now())
            `.execute(db),
            sql<LatencyRow>`
                SELECT
                    percentile_cont(0.5) WITHIN GROUP (ORDER BY duration_ms)::text AS p50,
                    percentile_cont(0.95) WITHIN GROUP (ORDER BY duration_ms)::text AS p95,
                    COUNT(*)::text AS samples
                FROM api_requests
                WHERE created_at >= now() - ${window} AND duration_ms IS NOT NULL
            `.execute(db),
            sql<SlowPathRow>`
                SELECT
                    path,
                    percentile_cont(0.95) WITHIN GROUP (ORDER BY duration_ms)::text AS p95,
                    COUNT(*)::text AS samples
                FROM api_requests
                WHERE created_at >= now() - ${window} AND duration_ms IS NOT NULL
                GROUP BY path
                ORDER BY p95 DESC
                LIMIT 10
            `.execute(db),
            sql<{ count: string }>`
                SELECT COUNT(*)::text AS count
                FROM page_views
                WHERE created_at >= now() - ${window} AND is_bot = true
            `.execute(db),
            sql<BotPathRow>`
                SELECT path, COUNT(*)::text AS count
                FROM page_views
                WHERE created_at >= now() - ${window} AND is_bot = true
                GROUP BY path
                ORDER BY count DESC
                LIMIT 10
            `.execute(db),
        ])

        return sendServerResponse(200, 'success', {
            vitals: vitals.rows,
            errors: errors.rows,
            errorsToday: Number(errorsToday.rows[0]?.count ?? 0),
            latency: latency.rows[0] ?? { p50: null, p95: null, samples: '0' },
            slowestPaths: slowestPaths.rows,
            botCount: Number(botCount.rows[0]?.count ?? 0),
            botPaths: botPaths.rows,
        })
    } catch (error) {
        if (error instanceof Error) {
            console.error('Failed to load health stats:', error)
            setResponseStatus(event, 500)
            return sendServerResponse(500, 'Failed to load health stats')
        }
    }
})
