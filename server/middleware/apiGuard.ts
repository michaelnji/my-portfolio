import { timingSafeEqual } from 'node:crypto'

export default defineEventHandler((event) => {
    const url = getRequestURL(event)
    if (!url.pathname.startsWith('/api/neondb/')) return

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
