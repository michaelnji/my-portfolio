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

export default defineEventHandler(async (event) => {
    try {
        const db = getDb()

        const [vitals, errors, errorsToday] = await Promise.all([
            sql<VitalRow>`
                SELECT
                    metric,
                    percentile_cont(0.75) WITHIN GROUP (ORDER BY value)::text AS p75,
                    COUNT(*)::text AS samples
                FROM web_vitals
                WHERE created_at >= now() - interval '7 days'
                GROUP BY metric
            `.execute(db),
            sql<ErrorRow>`
                SELECT path, status, COUNT(*)::text AS count
                FROM api_errors
                WHERE created_at >= now() - interval '7 days'
                GROUP BY path, status
                ORDER BY count DESC
                LIMIT 20
            `.execute(db),
            sql<{ count: string }>`
                SELECT COUNT(*)::text AS count
                FROM api_errors
                WHERE created_at >= date_trunc('day', now())
            `.execute(db),
        ])

        return sendServerResponse(200, 'success', {
            vitals: vitals.rows,
            errors: errors.rows,
            errorsToday: Number(errorsToday.rows[0]?.count ?? 0),
        })
    } catch (error) {
        if (error instanceof Error) {
            console.error('Failed to load health stats:', error)
            setResponseStatus(event, 500)
            return sendServerResponse(500, 'Failed to load health stats')
        }
    }
})
