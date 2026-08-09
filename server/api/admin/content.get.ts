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
        const db = getDb()

        const [posts, games, topPages] = await Promise.all([
            db.selectFrom('stats').selectAll().orderBy('views', 'desc').execute(),
            sql<GameRow>`
                SELECT
                    payload->>'gameId' AS game_id,
                    COUNT(*) FILTER (WHERE type = 'game_play')::text AS plays,
                    COUNT(*) FILTER (WHERE type = 'game_complete')::text AS completions
                FROM events
                WHERE type IN ('game_play', 'game_complete') AND payload->>'gameId' IS NOT NULL
                GROUP BY game_id
                ORDER BY plays DESC
            `.execute(db),
            sql<TopPageRow>`
                SELECT path, COUNT(*)::text AS views
                FROM page_views
                WHERE created_at >= now() - interval '30 days'
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
