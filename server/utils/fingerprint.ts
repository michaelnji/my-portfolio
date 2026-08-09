import type { H3Event } from 'h3'
import { createHash } from 'node:crypto'

export function getUserFingerprint(event: H3Event): string {
    // Primary signal: stable first-party anon id (see anonId.ts), forwarded
    // from the public-facing route via x-anon-id. Immune to shared-IP/UA
    // collisions and IP rotation, unlike the IP+UA fallback below.
    const anonId = getRequestHeader(event, 'x-anon-id')
    if (anonId) {
        return createHash('sha256').update(`aid:${anonId}`).digest('hex')
    }

    // Fallback for clients with no anon id (bots, cookies blocked, direct
    // calls to the internal endpoint). socket.remoteAddress is the
    // proxy/gateway address on serverless platforms (constant across every
    // request), not the client — only used as a last resort so unrelated
    // visitors don't collapse into one fingerprint when no proxy header
    // is present either.
    const forwardedFor = getRequestHeader(event, 'x-vercel-forwarded-for')
        ?? getRequestHeader(event, 'x-forwarded-for')
    const ip = forwardedFor
        ? forwardedFor.split(',')[0].trim()
        : (getRequestHeader(event, 'x-real-ip')
            ?? getRequestHeader(event, 'cf-connecting-ip')
            ?? event.node.req.socket?.remoteAddress
            ?? 'unknown')
    const ua = getRequestHeader(event, 'user-agent') ?? ''
    return createHash('sha256').update(`${ip}:${ua}`).digest('hex')
}
