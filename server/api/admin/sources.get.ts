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

        const [referrers, utmSource, utmCampaign] = await Promise.all([
            sql<BucketRow>`
                SELECT
                    CASE
                        WHEN referrer IS NULL OR referrer = '' THEN 'Direct'
                        ELSE regexp_replace(referrer, '^https?://([^/]+).*$', '\\1')
                    END AS key,
                    COUNT(*)::text AS count
                FROM page_views
                WHERE created_at >= now() - ${window}
                GROUP BY key
                ORDER BY count DESC
                LIMIT 20
            `.execute(db),
            sql<BucketRow>`
                SELECT utm_source AS key, COUNT(*)::text AS count
                FROM page_views
                WHERE created_at >= now() - ${window} AND utm_source IS NOT NULL
                GROUP BY key
                ORDER BY count DESC
                LIMIT 20
            `.execute(db),
            sql<BucketRow>`
                SELECT utm_campaign AS key, COUNT(*)::text AS count
                FROM page_views
                WHERE created_at >= now() - ${window} AND utm_campaign IS NOT NULL
                GROUP BY key
                ORDER BY count DESC
                LIMIT 20
            `.execute(db),
        ])

        return sendServerResponse(200, 'success', {
            referrers: referrers.rows,
            utmSource: utmSource.rows,
            utmCampaign: utmCampaign.rows,
        })
    } catch (error) {
        if (error instanceof Error) {
            console.error('Failed to load source stats:', error)
            setResponseStatus(event, 500)
            return sendServerResponse(500, 'Failed to load source stats')
        }
    }
})
