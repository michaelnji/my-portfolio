import type { H3Event } from 'h3'
import type { Kysely } from 'kysely'
import { randomBytes } from 'node:crypto'
import type { Database } from '../types/index.types'

export const ADMIN_COOKIE_NAME = 'admin_session'
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 days

export async function createAdminSession(event: H3Event, db: Kysely<Database>) {
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS)

    await db
        .insertInto('admin_sessions')
        .values({ token, expires_at: expiresAt.toISOString() })
        .execute()

    setCookie(event, ADMIN_COOKIE_NAME, token, {
        httpOnly: true,
        secure: !process.dev,
        sameSite: 'lax',
        maxAge: SESSION_TTL_MS / 1000,
        path: '/',
    })

    // Prune expired sessions on every login so the table stays small.
    await db.deleteFrom('admin_sessions').where('expires_at', '<', new Date().toISOString()).execute()

    return token
}

export async function verifyAdminSession(event: H3Event, db: Kysely<Database>): Promise<boolean> {
    const token = getCookie(event, ADMIN_COOKIE_NAME)
    if (!token) return false

    const session = await db
        .selectFrom('admin_sessions')
        .select('id')
        .where('token', '=', token)
        .where('expires_at', '>', new Date().toISOString())
        .executeTakeFirst()

    return session !== undefined
}

/** Cheap, cookie-only check for tracking endpoints — no DB round trip. */
export function hasAdminCookie(event: H3Event): boolean {
    return Boolean(getCookie(event, ADMIN_COOKIE_NAME))
}

export async function destroyAdminSession(event: H3Event, db: Kysely<Database>) {
    const token = getCookie(event, ADMIN_COOKIE_NAME)
    if (token) {
        await db.deleteFrom('admin_sessions').where('token', '=', token).execute()
    }
    deleteCookie(event, ADMIN_COOKIE_NAME, { path: '/' })
}
