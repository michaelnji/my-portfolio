/** Matches /admin and /admin/**, including pre-login pages like /admin/login. */
export function isAdminPath(path: string | null | undefined): boolean {
    if (!path) return false
    const p = path.split('?')[0]
    return p === '/admin' || p.startsWith('/admin/')
}
