export const ADMIN_RANGES = [
    { value: '24h', label: '24h' },
    { value: '3d', label: '3d' },
    { value: '7d', label: '7d' },
    { value: '30d', label: '30d' },
    { value: '90d', label: '90d' },
] as const

export type AdminRangeValue = (typeof ADMIN_RANGES)[number]['value']

const DEFAULT_RANGE: AdminRangeValue = '7d'

/**
 * Shared time-range filter, synced to ?range= so it's shareable/bookmarkable
 * and carries across admin pages when the sidebar nav preserves the query.
 */
export function useAdminRange() {
    const route = useRoute()
    const router = useRouter()

    const range = computed<AdminRangeValue>(() => {
        const q = route.query.range
        const match = ADMIN_RANGES.find((r) => r.value === q)
        return match?.value ?? DEFAULT_RANGE
    })

    function setRange(value: AdminRangeValue) {
        router.replace({ query: { ...route.query, range: value } })
    }

    return { range, setRange }
}

/** Mirrors server/utils/timeRange.ts's bucket choice — 24h/3d chart hourly, the rest daily. */
export function isHourlyRange(range: AdminRangeValue): boolean {
    return range === '24h' || range === '3d'
}
