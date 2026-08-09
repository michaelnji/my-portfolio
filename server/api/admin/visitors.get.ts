import { sql } from 'kysely'
import { sendServerResponse } from 'nexus-req'

interface SessionSummaryRow {
    session_count: string
    avg_pageviews: string | null
    bounced_sessions: string
}

interface PageCountRow {
    path: string
    count: string
}

interface NewVsReturningRow {
    new_visitors: string
    returning_visitors: string
}

// Sessions are derived, not stored: group each anon_id's page_views by a
// 30-minute gap rule via a LAG() window function. Shared CTE chain repeated
// per query (kept independent/parallel like every other admin endpoint here)
// rather than combined into one multi-result-set query.
const sessionsCte = (window: ReturnType<typeof sql.raw>) => sql`
    WITH ordered AS (
        SELECT
            anon_id, path, created_at,
            LAG(created_at) OVER (PARTITION BY anon_id ORDER BY created_at) AS prev_created_at
        FROM page_views
        WHERE created_at >= now() - ${window} AND is_bot = false AND anon_id IS NOT NULL
    ),
    sessioned AS (
        SELECT
            anon_id, path, created_at,
            SUM(CASE WHEN prev_created_at IS NULL OR created_at - prev_created_at > interval '30 minutes' THEN 1 ELSE 0 END)
                OVER (PARTITION BY anon_id ORDER BY created_at) AS session_num
        FROM ordered
    ),
    sessions AS (
        SELECT
            anon_id, session_num,
            COUNT(*) AS pageviews,
            (ARRAY_AGG(path ORDER BY created_at ASC))[1] AS entry_path,
            (ARRAY_AGG(path ORDER BY created_at DESC))[1] AS exit_path
        FROM sessioned
        GROUP BY anon_id, session_num
    )
`

export default defineEventHandler(async (event) => {
    try {
        const { interval } = rangeConfig(parseRange(getQuery(event).range))
        const window = sql.raw(`interval '${interval}'`)
        const db = getDb()

        const [summary, entryPages, exitPages, newVsReturning] = await Promise.all([
            sql<SessionSummaryRow>`
                ${sessionsCte(window)}
                SELECT
                    COUNT(*)::text AS session_count,
                    AVG(pageviews)::text AS avg_pageviews,
                    COUNT(*) FILTER (WHERE pageviews = 1)::text AS bounced_sessions
                FROM sessions
            `.execute(db),
            sql<PageCountRow>`
                ${sessionsCte(window)}
                SELECT entry_path AS path, COUNT(*)::text AS count
                FROM sessions
                GROUP BY entry_path
                ORDER BY COUNT(*) DESC
                LIMIT 10
            `.execute(db),
            sql<PageCountRow>`
                ${sessionsCte(window)}
                SELECT exit_path AS path, COUNT(*)::text AS count
                FROM sessions
                GROUP BY exit_path
                ORDER BY COUNT(*) DESC
                LIMIT 10
            `.execute(db),
            sql<NewVsReturningRow>`
                WITH active AS (
                    SELECT DISTINCT anon_id
                    FROM page_views
                    WHERE created_at >= now() - ${window} AND is_bot = false AND anon_id IS NOT NULL
                )
                SELECT
                    COUNT(*) FILTER (WHERE NOT EXISTS (
                        SELECT 1 FROM page_views pv2
                        WHERE pv2.anon_id = active.anon_id
                            AND pv2.created_at < now() - ${window}
                            AND pv2.is_bot = false
                    ))::text AS new_visitors,
                    COUNT(*) FILTER (WHERE EXISTS (
                        SELECT 1 FROM page_views pv2
                        WHERE pv2.anon_id = active.anon_id
                            AND pv2.created_at < now() - ${window}
                            AND pv2.is_bot = false
                    ))::text AS returning_visitors
                FROM active
            `.execute(db),
        ])

        const s = summary.rows[0]
        const sessionCount = Number(s?.session_count ?? 0)
        const bounced = Number(s?.bounced_sessions ?? 0)

        return sendServerResponse(200, 'success', {
            sessionCount,
            avgPageviewsPerSession: Number(s?.avg_pageviews ?? 0),
            bounceRate: sessionCount > 0 ? bounced / sessionCount : 0,
            newVisitors: Number(newVsReturning.rows[0]?.new_visitors ?? 0),
            returningVisitors: Number(newVsReturning.rows[0]?.returning_visitors ?? 0),
            entryPages: entryPages.rows,
            exitPages: exitPages.rows,
        })
    } catch (error) {
        if (error instanceof Error) {
            console.error('Failed to load visitor stats:', error)
            setResponseStatus(event, 500)
            return sendServerResponse(500, 'Failed to load visitor stats')
        }
    }
})
