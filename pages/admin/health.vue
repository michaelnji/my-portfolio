<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'admin', middleware: 'admin' })

interface VitalRow {
    metric: string
    p75: string
    samples: string
}
interface ErrorRow {
    path: string | null
    status: number | null
    count: string
}
interface LatencyStats {
    p50: string | null
    p95: string | null
    samples: string
}
interface SlowPathRow {
    path: string | null
    p95: string | null
    samples: string
}
interface BotPathRow {
    path: string
    count: string
}
interface HealthData {
    vitals: VitalRow[]
    errors: ErrorRow[]
    errorsToday: number
    latency: LatencyStats
    slowestPaths: SlowPathRow[]
    botCount: number
    botPaths: BotPathRow[]
}

const { range } = useAdminRange()

const {
    data,
    isPending: loading,
    isFetching,
    error,
    refetch,
} = useQuery({
    queryKey: computed(() => ['admin', 'health', range.value]),
    queryFn: () =>
        $fetch<{ data: HealthData }>('/api/admin/health', { query: { range: range.value } }).then((r) => r.data),
})

watch(error, (e) => {
    if (e) toast.error('Failed to load health data')
})

// web.dev Core Web Vitals thresholds — good / needs-improvement / poor.
const THRESHOLDS: Record<string, [number, number]> = {
    LCP: [2500, 4000],
    CLS: [0.1, 0.25],
    INP: [200, 500],
    FCP: [1800, 3000],
    TTFB: [800, 1800],
}
const UNITS: Record<string, string> = { LCP: 'ms', CLS: '', INP: 'ms', FCP: 'ms', TTFB: 'ms' }

function vitalFor(metric: string) {
    return data.value?.vitals.find((v) => v.metric === metric)
}
function statusFor(metric: string, value: number) {
    const t = THRESHOLDS[metric]
    if (!t) return 'default'
    if (value <= t[0]) return 'success'
    if (value <= t[1]) return 'warning'
    return 'error'
}
function displayValue(metric: string, value: number) {
    if (metric === 'CLS') return value.toFixed(3)
    return Math.round(value).toLocaleString()
}

const slowestPathsLeaderboard = computed(() =>
    (data.value?.slowestPaths ?? []).map((row, i) => ({
        key: row.path ?? i,
        label: row.path ?? '(unknown)',
        sublabel: `${row.samples} samples`,
        value: row.p95 ? Math.round(Number(row.p95)) : 0,
        valueSuffix: 'ms',
        icon: 'solar:speedometer-bold',
        mono: true,
    }))
)
const botPathsLeaderboard = computed(() =>
    (data.value?.botPaths ?? []).map((row) => ({
        key: row.path,
        label: row.path,
        value: Number(row.count),
        icon: 'solar:radar-2-bold',
        mono: true,
    }))
)
const apiErrorsLeaderboard = computed(() =>
    (data.value?.errors ?? []).map((row, i) => ({
        key: `${row.path}-${row.status}-${i}`,
        label: row.path ?? '(unknown)',
        value: Number(row.count),
        icon: 'solar:danger-triangle-bold',
        mono: true,
        badge: row.status ? { text: row.status, class: 'badge-error' } : undefined,
    }))
)
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex items-center justify-between gap-4 flex-wrap">
            <h1 class="text-2xl font-semibold">Health</h1>
            <div class="flex items-center gap-3">
                <AdminRangeFilter />
                <AdminSpinner :fetching="isFetching" @sync="refetch()" />
            </div>
        </div>
        <p class="text-content-secondary text-sm -mt-4">Core Web Vitals (p75) and API error rates.</p>

        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div v-for="metric in ['LCP', 'CLS', 'INP', 'FCP', 'TTFB']" :key="metric"
                class="card bg-base-200 border border-base-300">
                <div class="card-body items-center text-center p-4">
                    <div class="text-content-secondary text-xs uppercase tracking-wide">{{ metric }}</div>
                    <template v-if="loading">
                        <AdminSkel w="w-14" h="h-7" />
                        <AdminSkel w="w-16" h="h-3" />
                    </template>
                    <template v-else-if="vitalFor(metric)">
                        <div class="text-2xl font-semibold"
                            :class="{
                                'text-success': statusFor(metric, Number(vitalFor(metric)?.p75)) === 'success',
                                'text-warning': statusFor(metric, Number(vitalFor(metric)?.p75)) === 'warning',
                                'text-error': statusFor(metric, Number(vitalFor(metric)?.p75)) === 'error',
                            }">
                            {{ displayValue(metric, Number(vitalFor(metric)?.p75)) }}{{ UNITS[metric] }}
                        </div>
                        <div class="text-content-secondary text-xs">{{ vitalFor(metric)?.samples }} samples</div>
                    </template>
                    <div v-else class="text-content-secondary text-sm">No data</div>
                </div>
            </div>
        </div>

        <div class="stats stats-vertical sm:stats-horizontal shadow bg-base-200 border border-base-300 w-full">
            <div class="stat">
                <div class="stat-title">API errors today</div>
                <div class="stat-value" :class="data && data.errorsToday > 0 ? 'text-error' : ''">
                    <AdminSkel v-if="loading" w="w-10" h="h-9" />
                    <template v-else>{{ data?.errorsToday ?? 0 }}</template>
                </div>
            </div>
            <div class="stat">
                <div class="stat-title">API latency p50</div>
                <div class="stat-value">
                    <AdminSkel v-if="loading" w="w-16" h="h-9" />
                    <template v-else>{{ data?.latency.p50 ? `${Math.round(Number(data.latency.p50))}ms` : '—' }}</template>
                </div>
                <div class="stat-desc mt-2">
                    <AdminSkel v-if="loading" w="w-20" h="h-3" />
                    <template v-else>{{ data?.latency.samples ?? 0 }} requests</template>
                </div>
            </div>
            <div class="stat">
                <div class="stat-title">API latency p95</div>
                <div class="stat-value">
                    <AdminSkel v-if="loading" w="w-16" h="h-9" />
                    <template v-else>{{ data?.latency.p95 ? `${Math.round(Number(data.latency.p95))}ms` : '—' }}</template>
                </div>
            </div>
            <div class="stat">
                <div class="stat-title">Bot traffic</div>
                <div class="stat-value">
                    <AdminSkel v-if="loading" w="w-14" h="h-9" />
                    <template v-else>{{ data?.botCount ?? 0 }}</template>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="card bg-base-200 border border-base-300">
                <div class="card-body">
                    <h2 class="card-title text-base">Slowest routes (p95)</h2>
                    <AdminLeaderboard :items="slowestPathsLeaderboard" :loading="loading" :skeleton-count="6" empty-text="No data yet." />
                </div>
            </div>
            <div class="card bg-base-200 border border-base-300">
                <div class="card-body">
                    <h2 class="card-title text-base">Top bot paths</h2>
                    <AdminLeaderboard :items="botPathsLeaderboard" :loading="loading" :skeleton-count="6" value-label="hits" empty-text="No bot traffic recorded." />
                </div>
            </div>
        </div>

        <div class="card bg-base-200 border border-base-300">
            <div class="card-body">
                <h2 class="card-title text-base">Top API errors</h2>
                <AdminLeaderboard :items="apiErrorsLeaderboard" :loading="loading" :skeleton-count="6" value-label="occurrences" empty-text="No API errors 🎉" />
            </div>
        </div>
    </div>
</template>
