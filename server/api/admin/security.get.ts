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
export default defineEventHandler(async (event) => {
    try {
        const db = getDb()

        const [recentLogins, failedAttempts, failedByDay] = await Promise.all([
            db
                .selectFrom('admin_sessions')
                .select(['created_at', 'expires_at'])
                .orderBy('created_at', 'desc')
                .limit(20)
                .execute(),
            db
                .selectFrom('login_attempts')
                .select(['created_at', 'fingerprint'])
                .orderBy('created_at', 'desc')
                .limit(50)
                .execute(),
            sql<DailyCountRow>`
                SELECT date_trunc('day', created_at) AS day, COUNT(*)::text AS count
                FROM login_attempts
                WHERE created_at >= now() - interval '14 days'
                GROUP BY day
                ORDER BY day ASC
            `.execute(db),
        ])

        return sendServerResponse(200, 'success', {
            recentLogins: recentLogins as LoginRow[],
            failedAttempts: failedAttempts as FailedAttemptRow[],
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
