import type { Kysely } from 'kysely'
import type { Database } from '../types/index.types'

const WINDOW_MS = 1000 * 60 * 15 // 15 minutes
const MAX_ATTEMPTS = 5

/** True if this fingerprint has room for another login attempt. */
export async function canAttemptLogin(db: Kysely<Database>, fingerprint: string): Promise<boolean> {
    const windowStart = new Date(Date.now() - WINDOW_MS).toISOString()
    const { count } = await db
        .selectFrom('login_attempts')
        .select((eb) => eb.fn.countAll<string>().as('count'))
        .where('fingerprint', '=', fingerprint)
        .where('created_at', '>', windowStart)
        .executeTakeFirstOrThrow()

    return Number(count) < MAX_ATTEMPTS
}

export async function recordLoginAttempt(db: Kysely<Database>, fingerprint: string) {
    await db.insertInto('login_attempts').values({ fingerprint }).execute()
    // Keep the table bounded to recent windows only.
    await db
        .deleteFrom('login_attempts')
        .where('created_at', '<', new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString())
        .execute()
}
