<script lang="ts" setup>
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
interface HealthData {
    vitals: VitalRow[]
    errors: ErrorRow[]
    errorsToday: number
}

const data = ref<HealthData | null>(null)
const loading = ref(true)

onMounted(async () => {
    try {
        const res = await $fetch<{ data: HealthData }>('/api/admin/health')
        data.value = res.data
    } finally {
        loading.value = false
    }
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
</script>

<template>
    <div class="flex flex-col gap-6">
        <h1 class="text-2xl font-semibold">Health</h1>
        <p class="text-content-secondary text-sm -mt-4">Core Web Vitals (p75, last 7 days) and API error rates.</p>

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

        <div class="stats shadow bg-base-200 border border-base-300 w-full">
            <div class="stat">
                <div class="stat-title">API errors today</div>
                <div class="stat-value" :class="data && data.errorsToday > 0 ? 'text-error' : ''">
                    <AdminSkel v-if="loading" w="w-10" h="h-9" />
                    <template v-else>{{ data?.errorsToday ?? 0 }}</template>
                </div>
            </div>
        </div>

        <div class="card bg-base-200 border border-base-300">
            <div class="card-body">
                <h2 class="card-title text-base">Top API errors — last 7 days</h2>
                <div class="overflow-x-auto">
                    <table class="table table-sm">
                        <thead><tr><th>Path</th><th>Status</th><th class="text-right">Count</th></tr></thead>
                        <tbody v-if="loading">
                            <tr v-for="i in 6" :key="i">
                                <td><AdminSkel w="w-32" h="h-3" /></td>
                                <td><AdminSkel w="w-10" h="h-4" /></td>
                                <td class="text-right"><AdminSkel w="w-6" h="h-3" class="ml-auto" /></td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr v-for="(row, i) in data?.errors ?? []" :key="i">
                                <td class="font-mono text-xs">{{ row.path }}</td>
                                <td><span class="badge badge-error badge-sm">{{ row.status }}</span></td>
                                <td class="text-right">{{ row.count }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p v-if="!loading && !data?.errors?.length" class="text-content-secondary text-sm py-4">No API errors 🎉</p>
                </div>
            </div>
        </div>
    </div>
</template>
