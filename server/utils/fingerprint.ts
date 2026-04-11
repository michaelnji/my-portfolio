import { createHash } from 'node:crypto'
import type { H3Event } from 'h3'

export function getUserFingerprint(event: H3Event): string {
    const forwarded = getRequestHeader(event, 'x-forwarded-for')
    const ip = forwarded
        ? forwarded.split(',')[0].trim()
        : (event.node.req.socket?.remoteAddress ?? 'unknown')
    const ua = getRequestHeader(event, 'user-agent') ?? ''
    return createHash('sha256').update(`${ip}:${ua}`).digest('hex')
}
