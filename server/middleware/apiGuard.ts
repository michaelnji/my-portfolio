export default defineEventHandler((event) => {
    const url = getRequestURL(event)
    if (!url.pathname.startsWith('/api/neondb/')) return

    const config = useRuntimeConfig()
    const key = getRequestHeader(event, 'x-api-key')
    if (!key || key !== config.apiKey) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }
})
