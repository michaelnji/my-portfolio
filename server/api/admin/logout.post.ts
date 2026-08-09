import { sendServerResponse } from 'nexus-req'

export default defineEventHandler(async (event) => {
    try {
        const db = getDb()
        await destroyAdminSession(event, db)
        return sendServerResponse(200, 'success', null)
    } catch (error) {
        if (error instanceof Error) {
            console.error('Admin logout failed:', error)
            setResponseStatus(event, 500)
            return sendServerResponse(500, 'Logout failed')
        }
    }
})
