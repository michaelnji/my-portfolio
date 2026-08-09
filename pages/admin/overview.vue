<script lang="ts" setup>
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
    liveNow: number
    daily: DailyRow[]
    topPages: TopPageRow[]
}

const data = ref<OverviewData | null>(null)
const loading = ref(true)
const { range } = useAdminRange()

async function load() {
    try {
        const res = await $fetch<{ data: OverviewData }>('/api/admin/overview', { query: { range: range.value } })
        data.value = res.data
    } finally {
        loading.value = false
    }
}

onMounted(load)
useIntervalFn(load, 15000)
watch(range, () => {
    loading.value = true
    load()
})

const categories = {
    views: { name: 'Views', color: '#3987e5' },
    visitors: { name: 'Visitors', color: '#d95926' },
}

const chartData = computed(
    () => data.value?.daily.map((d) => ({ ...d, views: Number(d.views), visitors: Number(d.visitors) })) ?? []
)
const xFormatter = (i: number) => {
    const row = chartData.value[i]
    if (!row) return ''
    const date = new Date(row.day)
    return isHourlyRange(range.value)
        ? date.toLocaleTimeString(undefined, { hour: 'numeric' })
        : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function fmt(n: string | number | undefined) {
    return Number(n ?? 0).toLocaleString()
}
function fmtDuration(seconds: string | null | undefined) {
    const s = Number(seconds ?? 0)
    if (!s) return '—'
    return `${Math.round(s)}s`
}
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex items-center justify-between gap-4 flex-wrap">
            <h1 class="text-2xl font-semibold">Overview</h1>
            <AdminRangeFilter />
        </div>

        <div class="stats stats-vertical sm:stats-horizontal shadow bg-base-200 border border-base-300 w-full">
            <div class="stat">
                <div class="stat-title">Live now</div>
                <div class="stat-value text-primary">
                    <AdminSkel v-if="loading" w="w-10" h="h-9" />
                    <template v-else>{{ data?.liveNow ?? 0 }}</template>
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
                <h2 class="card-title text-base capitalize">Traffic — {{ rangeLabelLong(range) }}</h2>
                <div v-if="loading" class="skeleton w-full h-[260px]" />
                <LineChart
                    v-else-if="chartData.length"
                    :data="chartData"
                    :categories="categories"
                    :height="260"
                    :x-formatter="xFormatter"
                />
                <p v-else class="text-content-secondary text-sm">No data yet.</p>
            </div>
        </div>

        <div class="card bg-base-200 border border-base-300">
            <div class="card-body">
                <h2 class="card-title text-base capitalize">Top pages — {{ rangeLabelLong(range) }}</h2>
                <div class="overflow-x-auto">
                    <table class="table table-sm">
                        <thead><tr><th>Path</th><th class="text-right">Views</th></tr></thead>
                        <tbody v-if="loading">
                            <tr v-for="i in 10" :key="i">
                                <td><AdminSkel w="w-48" h="h-3" /></td>
                                <td class="text-right"><AdminSkel w="w-8" h="h-3" class="ml-auto" /></td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr v-for="row in data?.topPages ?? []" :key="row.path">
                                <td class="font-mono text-xs">{{ row.path }}</td>
                                <td class="text-right">{{ fmt(row.views) }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p v-if="!loading && !data?.topPages?.length" class="text-content-secondary text-sm py-4">No data yet.</p>
                </div>
            </div>
        </div>
    </div>
</template>
