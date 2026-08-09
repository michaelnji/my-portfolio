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

export default defineEventHandler(async (event) => {
    try {
        const { interval } = rangeConfig(parseRange(getQuery(event).range))
        const db = getDb()

        // Blog posts stay lifetime totals — the stats table has no
        // per-reaction timestamp to filter by. Games and top-pages come from
        // timestamped tables and do follow the selected range.
        const [posts, games, topPages] = await Promise.all([
            db.selectFrom('stats').selectAll().orderBy('views', 'desc').execute(),
            sql<GameRow>`
                SELECT
                    payload->>'gameId' AS game_id,
                    COUNT(*) FILTER (WHERE type = 'game_play')::text AS plays,
                    COUNT(*) FILTER (WHERE type = 'game_complete')::text AS completions
                FROM events
                WHERE type IN ('game_play', 'game_complete')
                    AND payload->>'gameId' IS NOT NULL
                    AND created_at >= now() - ${sql.raw(`interval '${interval}'`)}
                GROUP BY game_id
                ORDER BY plays DESC
            `.execute(db),
            sql<TopPageRow>`
                SELECT path, COUNT(*)::text AS views
                FROM page_views
                WHERE created_at >= now() - ${sql.raw(`interval '${interval}'`)}
                GROUP BY path
                ORDER BY views DESC
                LIMIT 30
            `.execute(db),
        ])

        return sendServerResponse(200, 'success', {
            posts,
            games: games.rows,
            topPages: topPages.rows,
        })
    } catch (error) {
        if (error instanceof Error) {
            console.error('Failed to load content stats:', error)
            setResponseStatus(event, 500)
            return sendServerResponse(500, 'Failed to load content stats')
        }
    }
})
