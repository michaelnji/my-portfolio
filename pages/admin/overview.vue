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

async function load() {
    try {
        const res = await $fetch<{ data: OverviewData }>('/api/admin/overview')
        data.value = res.data
    } finally {
        loading.value = false
    }
}

onMounted(load)
useIntervalFn(load, 15000)

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
    return new Date(row.day).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
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
        <h1 class="text-2xl font-semibold">Overview</h1>

        <div class="stats stats-vertical sm:stats-horizontal shadow bg-base-200 border border-base-300 w-full">
            <div class="stat">
                <div class="stat-title">Live now</div>
                <div class="stat-value text-primary">{{ data?.liveNow ?? '—' }}</div>
            </div>
            <div class="stat">
                <div class="stat-title">Today</div>
                <div class="stat-value">{{ fmt(data?.today.pageviews) }}</div>
                <div class="stat-desc">{{ fmt(data?.today.visitors) }} visitors · avg {{ fmtDuration(data?.today.avg_duration) }}</div>
            </div>
            <div class="stat">
                <div class="stat-title">Last 7 days</div>
                <div class="stat-value">{{ fmt(data?.last7d.pageviews) }}</div>
                <div class="stat-desc">{{ fmt(data?.last7d.visitors) }} visitors · avg {{ fmtDuration(data?.last7d.avg_duration) }}</div>
            </div>
            <div class="stat">
                <div class="stat-title">Last 30 days</div>
                <div class="stat-value">{{ fmt(data?.last30d.pageviews) }}</div>
                <div class="stat-desc">{{ fmt(data?.last30d.visitors) }} visitors · avg {{ fmtDuration(data?.last30d.avg_duration) }}</div>
            </div>
        </div>

        <div class="card bg-base-200 border border-base-300">
            <div class="card-body">
                <h2 class="card-title text-base">Traffic — last 30 days</h2>
                <LineChart
                    v-if="chartData.length"
                    :data="chartData"
                    :categories="categories"
                    :height="260"
                    :x-formatter="xFormatter"
                />
                <p v-else class="text-content-secondary text-sm">{{ loading ? 'Loading…' : 'No data yet.' }}</p>
            </div>
        </div>

        <div class="card bg-base-200 border border-base-300">
            <div class="card-body">
                <h2 class="card-title text-base">Top pages — last 7 days</h2>
                <div class="overflow-x-auto">
                    <table class="table table-sm">
                        <thead><tr><th>Path</th><th class="text-right">Views</th></tr></thead>
                        <tbody>
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
