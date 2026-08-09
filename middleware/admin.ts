export default defineNuxtRouteMiddleware(async (to) => {
    if (to.path === '/admin/login') return

    const requestFetch = useRequestFetch()
    try {
        await requestFetch('/api/admin/me')
    } catch {
        return navigateTo('/admin/login')
    }
})
