import { sendServerResponse } from 'nexus-req'

/** Lightweight session check used by the admin route middleware. */
export default defineEventHandler(async (event) => {
    try {
        const db = getDb()
        const authed = await verifyAdminSession(event, db)
        if (!authed) {
            setResponseStatus(event, 401)
            return sendServerResponse(401, 'Not authenticated')
        }
        return sendServerResponse(200, 'success', null)
    } catch (error) {
        if (error instanceof Error) {
            console.error('Admin session check failed:', error)
            setResponseStatus(event, 500)
            return sendServerResponse(500, 'Session check failed')
        }
    }
})
