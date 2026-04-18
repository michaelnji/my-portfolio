import { timingSafeEqual } from 'node:crypto'

const PROTECTED_PREFIXES = ['/api/neondb/'] as const

export default defineEventHandler((event) => {
    const url = getRequestURL(event)
    const needsGuard = PROTECTED_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))
    if (!needsGuard) return

    const config = useRuntimeConfig()
    if (!config.apiKey) {
        throw createError({ statusCode: 500, statusMessage: 'Server API key not configured' })
    }

    const key = getRequestHeader(event, 'x-api-key')
    if (!key) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }

    const sameLength = key.length === config.apiKey.length
    const valid = sameLength && timingSafeEqual(Buffer.from(key), Buffer.from(config.apiKey))
    if (!valid) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }
})
