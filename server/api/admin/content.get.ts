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

interface PostRangeStatRow {
    postId: string
    views: string
    hearts: string
    claps: string
    stars: string
    dislikes: string
}

export default defineEventHandler(async (event) => {
    try {
        const { interval } = rangeConfig(parseRange(getQuery(event).range))
        const window = sql.raw(`interval '${interval}'`)
        const db = getDb()

        // `posts` (the stats table) stays lifetime totals — no per-row
        // timestamp to filter by, and the public blog page reads it directly
        // for its always-cumulative counts. `postRangeStats` is the
        // range-scoped view: same counters, sourced from the timestamped
        // post_stat_events log instead, so admin charts can honor `range`.
        const [posts, postRangeStats, games, topPages, currentBlog, previousBlog] = await Promise.all([
            db.selectFrom('stats').selectAll().orderBy('views', 'desc').execute(),
            sql<PostRangeStatRow>`
                SELECT
                    post_id AS "postId",
                    COUNT(*) FILTER (WHERE type = 'view')::text AS views,
                    COUNT(*) FILTER (WHERE type = 'hearts')::text AS hearts,
                    COUNT(*) FILTER (WHERE type = 'claps')::text AS claps,
                    COUNT(*) FILTER (WHERE type = 'stars')::text AS stars,
                    COUNT(*) FILTER (WHERE type = 'dislikes')::text AS dislikes
                FROM post_stat_events
                WHERE created_at >= now() - ${window}
                GROUP BY post_id
                ORDER BY COUNT(*) FILTER (WHERE type = 'view') DESC
            `.execute(db),
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
                ORDER BY COUNT(*) FILTER (WHERE type = 'game_play') DESC
            `.execute(db),
            sql<TopPageRow>`
                SELECT path, COUNT(*)::text AS views
                FROM page_views
                WHERE created_at >= now() - ${window} AND is_bot = false
                GROUP BY path
                ORDER BY COUNT(*) DESC
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
            postRangeStats: postRangeStats.rows,
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
