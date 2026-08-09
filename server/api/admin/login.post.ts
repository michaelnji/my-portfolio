import { timingSafeEqual } from 'node:crypto'
import { sendServerResponse } from 'nexus-req'

export default defineEventHandler(async (event) => {
    try {
        const config = useRuntimeConfig()
        if (!config.adminPassword) {
            setResponseStatus(event, 500)
            return sendServerResponse(500, 'Admin password not configured')
        }

        const db = getDb()
        const fingerprint = getUserFingerprint(event)

        const allowed = await canAttemptLogin(db, fingerprint)
        if (!allowed) {
            setResponseStatus(event, 429)
            return sendServerResponse(429, 'Too many attempts — try again later')
        }

        const body = await readBody<{ password?: string } | null>(event)
        const password = body?.password ?? ''

        const candidate = Buffer.from(password)
        const expected = Buffer.from(config.adminPassword)
        const valid = candidate.length === expected.length && timingSafeEqual(candidate, expected)

        if (!valid) {
            await recordLoginAttempt(db, fingerprint)
            setResponseStatus(event, 401)
            return sendServerResponse(401, 'Invalid password')
        }

        await createAdminSession(event, db)
        return sendServerResponse(200, 'success', null)
    } catch (error) {
        if (error instanceof Error) {
            console.error('Admin login failed:', error)
            setResponseStatus(event, 500)
            return sendServerResponse(500, 'Login failed')
        }
    }
})
