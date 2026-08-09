import type { H3Event } from 'h3'
import { randomUUID } from 'node:crypto'

const COOKIE_NAME = 'aid'
const MAX_AGE = 60 * 60 * 24 * 365 // 1 year

/**
 * Stable first-party anonymous id, used as the primary rate-limit signal.
 * Unlike IP+UA it doesn't collide across visitors sharing a network/browser
 * combo and survives IP rotation for the same visitor. Falls back to IP+UA
 * (see fingerprint.ts) only when the client has no cookie (bots, first
 * request race, cookies blocked).
 */
export function getOrSetAnonId(event: H3Event): string {
    const existing = getCookie(event, COOKIE_NAME)
    if (existing) return existing

    const id = randomUUID()
    setCookie(event, COOKIE_NAME, id, {
        httpOnly: true,
        secure: !process.dev,
        sameSite: 'lax',
        maxAge: MAX_AGE,
        path: '/',
    })
    return id
}
