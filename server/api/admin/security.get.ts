import { sql } from 'kysely'
import { sendServerResponse } from 'nexus-req'

interface LoginRow {
    created_at: string
    expires_at: string
}

interface FailedAttemptRow {
    created_at: string
    fingerprint: string
}

interface DailyCountRow {
    day: string
    count: string
}

/**
 * Login history / audit log. Fixed recent-N window, no range filter — this
 * is an audit trail, not a historical metric (matches Overview's precedent
 * of keeping some things fixed regardless of the selected range).
 */
const PAGE_SIZE = 20

export default defineEventHandler(async (event) => {
    try {
        const db = getDb()
        const query = getQuery(event)
        const loginsPage = Math.max(1, Number(query.loginsPage) || 1)
        const attemptsPage = Math.max(1, Number(query.attemptsPage) || 1)

        // Fetch one extra row per page — cheap way to know whether a next
        // page exists without a separate COUNT(*) query.
        const [loginRows, attemptRows, failedByDay] = await Promise.all([
            db
                .selectFrom('admin_sessions')
                .select(['created_at', 'expires_at'])
                .orderBy('created_at', 'desc')
                .limit(PAGE_SIZE + 1)
                .offset((loginsPage - 1) * PAGE_SIZE)
                .execute(),
            db
                .selectFrom('login_attempts')
                .select(['created_at', 'fingerprint'])
                .orderBy('created_at', 'desc')
                .limit(PAGE_SIZE + 1)
                .offset((attemptsPage - 1) * PAGE_SIZE)
                .execute(),
            sql<DailyCountRow>`
                SELECT date_trunc('day', created_at) AS day, COUNT(*)::text AS count
                FROM login_attempts
                WHERE created_at >= now() - interval '14 days'
                GROUP BY day
                ORDER BY day ASC
            `.execute(db),
        ])

        const recentLoginsHasMore = loginRows.length > PAGE_SIZE
        const failedAttemptsHasMore = attemptRows.length > PAGE_SIZE

        return sendServerResponse(200, 'success', {
            recentLogins: (recentLoginsHasMore ? loginRows.slice(0, PAGE_SIZE) : loginRows) as LoginRow[],
            recentLoginsHasMore,
            failedAttempts: (failedAttemptsHasMore ? attemptRows.slice(0, PAGE_SIZE) : attemptRows) as FailedAttemptRow[],
            failedAttemptsHasMore,
            failedByDay: failedByDay.rows,
        })
    } catch (error) {
        if (error instanceof Error) {
            console.error('Failed to load security stats:', error)
            setResponseStatus(event, 500)
            return sendServerResponse(500, 'Failed to load security stats')
        }
    }
})
