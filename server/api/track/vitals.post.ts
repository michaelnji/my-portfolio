import { sendServerResponse } from 'nexus-req'

const ALLOWED_METRICS = new Set(['LCP', 'CLS', 'INP', 'FCP', 'TTFB'])

interface VitalBody {
    path?: string
    metric?: string
    value?: number
}

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody<VitalBody | null>(event)
        if (!body?.metric || !ALLOWED_METRICS.has(body.metric) || typeof body.value !== 'number') {
            setResponseStatus(event, 400)
            return sendServerResponse(400, 'valid metric and value are required')
        }

        if (hasAdminCookie(event) || isBotRequest(event) || isAdminPath(body.path)) {
            return sendServerResponse(200, 'skipped', null)
        }

        const anonId = getOrSetAnonId(event)
        const db = getDb()
        await db
            .insertInto('web_vitals')
            .values({
                path: body.path?.slice(0, 500) ?? null,
                metric: body.metric,
                value: body.value,
                anon_id: anonId,
            })
            .execute()

        return sendServerResponse(200, 'success', null)
    } catch (error) {
        if (error instanceof Error) {
            console.error('Failed to record web vital:', error)
            setResponseStatus(event, 500)
            return sendServerResponse(500, 'Failed to record web vital')
        }
    }
})
