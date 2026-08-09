import { sendServerResponse } from 'nexus-req'

interface PageviewBody {
    path?: string
    referrer?: string
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    screen_width?: number
    screen_height?: number
    language?: string
    timezone?: string
}

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody<PageviewBody | null>(event)
        if (!body?.path) {
            setResponseStatus(event, 400)
            return sendServerResponse(400, 'path is required')
        }

        // Don't track the site owner's own authenticated browsing elsewhere
        // on the site, or any /admin/** page itself — including pre-login
        // ones like /admin/login, which the session-cookie check alone can't
        // catch since there's no session yet at that point. Bots ARE
        // recorded now (is_bot flag below) rather than dropped, so crawler
        // volume is visible instead of invisible.
        if (hasAdminCookie(event) || isAdminPath(body.path)) {
            return sendServerResponse(200, 'skipped', { id: null })
        }

        const anonId = getOrSetAnonId(event)
        const isBot = isBotRequest(event)
        const { device, browser, os } = parseUserAgent(getRequestHeader(event, 'user-agent'))
        const { country, region } = getGeo(event)

        const db = getDb()
        const row = await db
            .insertInto('page_views')
            .values({
                anon_id: anonId,
                path: body.path.slice(0, 500),
                referrer: body.referrer?.slice(0, 500) ?? null,
                utm_source: body.utm_source?.slice(0, 100) ?? null,
                utm_medium: body.utm_medium?.slice(0, 100) ?? null,
                utm_campaign: body.utm_campaign?.slice(0, 100) ?? null,
                device,
                browser,
                os,
                country,
                region,
                screen_width: body.screen_width ?? null,
                screen_height: body.screen_height ?? null,
                language: body.language?.slice(0, 20) ?? null,
                timezone: body.timezone?.slice(0, 60) ?? null,
                duration_seconds: null,
                scroll_depth: null,
                is_bot: isBot,
            })
            .returning('id')
            .executeTakeFirstOrThrow()

        return sendServerResponse(200, 'success', { id: row.id })
    } catch (error) {
        if (error instanceof Error) {
            console.error('Failed to record pageview:', error)
            setResponseStatus(event, 500)
            return sendServerResponse(500, 'Failed to record pageview')
        }
    }
})
