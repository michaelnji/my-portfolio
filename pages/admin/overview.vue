<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'admin', middleware: 'admin' })

interface Totals {
    pageviews: string
    visitors: string
    avg_duration: string | null
}
interface DailyRow {
    day: string
    views: string
    visitors: string
}
interface TopPageRow {
    path: string
    views: string
}
interface OverviewData {
    today: Totals
    last7d: Totals
    last30d: Totals
    daily: DailyRow[]
    topPages: TopPageRow[]
}
interface LiveData {
    liveNow: number
}

const { range } = useAdminRange()

const {
    data,
    isPending: loading,
    isFetching,
    error,
} = useQuery({
    queryKey: computed(() => ['admin', 'overview', range.value]),
    queryFn: () =>
        $fetch<{ data: OverviewData }>('/api/admin/overview', { query: { range: range.value } }).then((r) => r.data),
})

const { data: liveData, isPending: liveLoading, refetch: refetchLive } = useQuery({
    queryKey: ['admin', 'live'],
    queryFn: () => $fetch<{ data: LiveData }>('/api/admin/live').then((r) => r.data),
    staleTime: 10_000,
})
useIntervalFn(() => refetchLive(), 15000)

watch(error, (e) => {
    if (e) toast.error('Failed to load overview data')
})

const trafficSeries = [
    { key: 'views', name: 'Views', color: '#3987e5' },
    { key: 'visitors', name: 'Visitors', color: '#d95926' },
]

const chartData = computed(
    () =>
        data.value?.daily.map((d) => {
            const date = new Date(d.day)
            const label = isHourlyRange(range.value)
                ? date.toLocaleTimeString(undefined, { hour: 'numeric' })
                : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            return { label, views: Number(d.views), visitors: Number(d.visitors) }
        }) ?? []
)

function fmt(n: string | number | undefined) {
    return Number(n ?? 0).toLocaleString()
}
function fmtDuration(seconds: string | null | undefined) {
    const s = Number(seconds ?? 0)
    if (!s) return '—'
    return `${Math.round(s)}s`
}

const topPagesLeaderboard = computed(() =>
    (data.value?.topPages ?? []).map((row) => ({
        key: row.path,
        label: row.path,
        value: Number(row.views),
        icon: 'solar:document-bold',
        mono: true,
    }))
)
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex items-center justify-between gap-4 flex-wrap">
            <h1 class="text-2xl font-semibold">Overview</h1>
            <div class="flex items-center gap-3">
                <AdminRangeFilter />
                <AdminSpinner :fetching="isFetching" />
            </div>
        </div>

        <div class="stats stats-vertical sm:stats-horizontal shadow bg-base-200 border border-base-300 w-full">
            <div class="stat">
                <div class="stat-title">Live now</div>
                <div class="stat-value text-primary">
                    <AdminSkel v-if="liveLoading" w="w-10" h="h-9" />
                    <template v-else>{{ liveData?.liveNow ?? 0 }}</template>
                </div>
            </div>
            <div class="stat">
                <div class="stat-title">Today</div>
                <div class="stat-value"><AdminSkel v-if="loading" w="w-20" h="h-9" /><template v-else>{{ fmt(data?.today.pageviews) }}</template></div>
                <div class="stat-desc mt-2">
                    <AdminSkel v-if="loading" w="w-36" h="h-3" />
                    <template v-else>{{ fmt(data?.today.visitors) }} visitors · avg {{ fmtDuration(data?.today.avg_duration) }}</template>
                </div>
            </div>
            <div class="stat">
                <div class="stat-title">Last 7 days</div>
                <div class="stat-value"><AdminSkel v-if="loading" w="w-20" h="h-9" /><template v-else>{{ fmt(data?.last7d.pageviews) }}</template></div>
                <div class="stat-desc mt-2">
                    <AdminSkel v-if="loading" w="w-36" h="h-3" />
                    <template v-else>{{ fmt(data?.last7d.visitors) }} visitors · avg {{ fmtDuration(data?.last7d.avg_duration) }}</template>
                </div>
            </div>
            <div class="stat">
                <div class="stat-title">Last 30 days</div>
                <div class="stat-value"><AdminSkel v-if="loading" w="w-20" h="h-9" /><template v-else>{{ fmt(data?.last30d.pageviews) }}</template></div>
                <div class="stat-desc mt-2">
                    <AdminSkel v-if="loading" w="w-36" h="h-3" />
                    <template v-else>{{ fmt(data?.last30d.visitors) }} visitors · avg {{ fmtDuration(data?.last30d.avg_duration) }}</template>
                </div>
            </div>
        </div>

        <div class="card bg-base-200 border border-base-300">
            <div class="card-body">
                <h2 class="card-title text-base">Traffic</h2>
                <div v-if="loading" class="skeleton w-full h-[260px]" />
                <AdminSimpleLineChart v-else-if="chartData.length" :data="chartData" x-key="label" :series="trafficSeries" :height="260" />
                <p v-else class="text-content-secondary text-sm">No data yet.</p>
            </div>
        </div>

        <div class="card bg-base-200 border border-base-300">
            <div class="card-body">
                <h2 class="card-title text-base">Top pages</h2>
                <AdminLeaderboard :items="topPagesLeaderboard" :loading="loading" :skeleton-count="10" value-label="views" empty-text="No data yet." />
            </div>
        </div>
    </div>
</template>
