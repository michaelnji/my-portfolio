import { sql } from 'kysely'
import { sendServerResponse } from 'nexus-req'

interface GameRow {
    game_id: string
    plays: string
    completions: string
}

interface TopPageRow {
    path: string
    views: string
}

interface BlogSlugStatsRow {
    slug: string
    views: string
    visitors: string
    avg_duration: string | null
    avg_scroll: string | null
}

interface BlogSlugViewsRow {
    slug: string
    views: string
}

export default defineEventHandler(async (event) => {
    try {
        const { interval } = rangeConfig(parseRange(getQuery(event).range))
        const window = sql.raw(`interval '${interval}'`)
        const db = getDb()

        // Blog posts stay lifetime totals — the stats table has no
        // per-reaction timestamp to filter by. Games and top-pages come from
        // timestamped tables and do follow the selected range.
        const [posts, games, topPages, currentBlog, previousBlog] = await Promise.all([
            db.selectFrom('stats').selectAll().orderBy('views', 'desc').execute(),
            sql<GameRow>`
                SELECT
                    payload->>'gameId' AS game_id,
                    COUNT(*) FILTER (WHERE type = 'game_play')::text AS plays,
                    COUNT(*) FILTER (WHERE type = 'game_complete')::text AS completions
                FROM events
                WHERE type IN ('game_play', 'game_complete')
                    AND payload->>'gameId' IS NOT NULL
                    AND created_at >= now() - ${window}
                GROUP BY game_id
                ORDER BY plays DESC
            `.execute(db),
            sql<TopPageRow>`
                SELECT path, COUNT(*)::text AS views
                FROM page_views
                WHERE created_at >= now() - ${window} AND is_bot = false
                GROUP BY path
                ORDER BY views DESC
                LIMIT 30
            `.execute(db),
            // Blog traffic quality for the selected range — path is the raw
            // route string ('/blog/<slug>', possibly with a query string),
            // extracted here since page_views isn't otherwise blog-aware.
            sql<BlogSlugStatsRow>`
                SELECT
                    substring(path from '^/blog/([^/?]+)') AS slug,
                    COUNT(*)::text AS views,
                    COUNT(DISTINCT anon_id)::text AS visitors,
                    AVG(duration_seconds)::text AS avg_duration,
                    AVG(scroll_depth)::text AS avg_scroll
                FROM page_views
                WHERE path ~ '^/blog/[^/?]+' AND is_bot = false AND created_at >= now() - ${window}
                GROUP BY slug
            `.execute(db),
            // Same window, one period back — for trend % (view velocity).
            sql<BlogSlugViewsRow>`
                SELECT substring(path from '^/blog/([^/?]+)') AS slug, COUNT(*)::text AS views
                FROM page_views
                WHERE path ~ '^/blog/[^/?]+' AND is_bot = false
                    AND created_at >= now() - ${window} * 2
                    AND created_at < now() - ${window}
                GROUP BY slug
            `.execute(db),
        ])

        const previousBySlug = new Map(previousBlog.rows.map((r) => [r.slug, r.views]))
        const blogMetrics = currentBlog.rows.map((r) => ({
            slug: r.slug,
            views: r.views,
            visitors: r.visitors,
            avgDuration: r.avg_duration,
            avgScroll: r.avg_scroll,
            previousViews: previousBySlug.get(r.slug) ?? '0',
        }))

        return sendServerResponse(200, 'success', {
            posts,
            games: games.rows,
            topPages: topPages.rows,
            blogMetrics,
        })
    } catch (error) {
        if (error instanceof Error) {
            console.error('Failed to load content stats:', error)
            setResponseStatus(event, 500)
            return sendServerResponse(500, 'Failed to load content stats')
        }
    }
})
