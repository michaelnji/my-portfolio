const PUBLIC_PATHS = ['/admin/login', '/api/admin/login'] as const

export default defineEventHandler(async (event) => {
    const url = getRequestURL(event)
    const path = url.pathname

    const isAdminPage = path === '/admin' || path.startsWith('/admin/')
    const isAdminApi = path.startsWith('/api/admin/')
    if (!isAdminPage && !isAdminApi) return
    if (PUBLIC_PATHS.some((p) => path === p)) return

    const db = getDb()
    const authed = await verifyAdminSession(event, db)
    if (authed) return

    if (isAdminApi) {
        throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
    }
    return sendRedirect(event, '/admin/login')
})
