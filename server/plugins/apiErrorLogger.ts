/**
 * Site-health signal: logs 5xx responses from our own /api/** routes into
 * api_errors, so the admin Health page can show error rates without needing
 * an external APM tool. Best-effort — a logging failure must never affect
 * the actual response.
 */
export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('afterResponse', async (event) => {
        try {
            const url = getRequestURL(event)
            if (!url.pathname.startsWith('/api/')) return
            if (url.pathname.startsWith('/api/track/')) return // avoid logging-about-logging

            const status = event.node.res.statusCode
            if (status < 500) return

            const config = useRuntimeConfig()
            if (!config.postgresUrl) return

            const db = getDb()
            await db
                .insertInto('api_errors')
                .values({
                    path: url.pathname.slice(0, 500),
                    method: event.node.req.method ?? null,
                    status,
                    message: null,
                })
                .execute()
        } catch (error) {
            console.error('Failed to log api error:', error)
        }
    })
})
