/**
 * Site-health signal: logs every /api/** call into api_requests (path,
 * method, status, duration) so the admin Health page can show latency
 * percentiles, not just error rates. 5xx responses additionally land in
 * api_errors, unchanged from before. Best-effort — a logging failure must
 * never affect the actual response.
 */
export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('request', (event) => {
        event.context._trackStart = Date.now()
    })

    nitroApp.hooks.hook('afterResponse', async (event) => {
        try {
            const url = getRequestURL(event)
            if (!url.pathname.startsWith('/api/')) return
            if (url.pathname.startsWith('/api/track/')) return // avoid logging-about-logging

            const config = useRuntimeConfig()
            if (!config.postgresUrl) return

            const status = event.node.res.statusCode
            const path = url.pathname.slice(0, 500)
            const method = event.node.req.method ?? null
            const start = event.context._trackStart as number | undefined
            const durationMs = typeof start === 'number' ? Date.now() - start : null

            const db = getDb()
            await db
                .insertInto('api_requests')
                .values({ path, method, status, duration_ms: durationMs })
                .execute()

            if (status >= 500) {
                await db
                    .insertInto('api_errors')
                    .values({ path, method, status, message: null })
                    .execute()
            }
        } catch (error) {
            console.error('Failed to log api request:', error)
        }
    })
})
