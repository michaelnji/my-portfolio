import { sendServerResponse } from 'nexus-req'

/**
 * Lightweight session check used by the admin route middleware.
 * No DB call needed here — adminGuard.ts already ran verifyAdminSession for
 * this exact request and would have thrown 401 before this handler runs.
 */
export default defineEventHandler(() => {
    return sendServerResponse(200, 'success', null)
})
