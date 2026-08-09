<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'admin', middleware: 'admin' })

interface LoginRow {
    created_at: string
    expires_at: string
}
interface FailedAttemptRow {
    created_at: string
    fingerprint: string
}
interface DailyCountRow {
    day: string
    count: string
}
interface SecurityData {
    recentLogins: LoginRow[]
    failedAttempts: FailedAttemptRow[]
    failedByDay: DailyCountRow[]
}

// No range filter — this is a fixed-window audit log, not a range-based
// metric (same precedent as Overview's fixed stat cards).
const {
    data,
    isPending: loading,
    isFetching,
    error,
} = useQuery({
    queryKey: ['admin', 'security'],
    queryFn: () => $fetch<{ data: SecurityData }>('/api/admin/security').then((r) => r.data),
})

watch(error, (e) => {
    if (e) toast.error('Failed to load security data')
})

const chartData = computed(() => (data.value?.failedByDay ?? []).map((d) => ({ day: d.day, count: Number(d.count) })))
const categories = { count: { name: 'Failed attempts', color: '#e34948' } }
const xFormatter = (i: number) => {
    const row = chartData.value[i]
    if (!row) return ''
    return new Date(row.day).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function fmtTime(iso: string) {
    return new Date(iso).toLocaleString()
}
function shortHash(hash: string) {
    return `${hash.slice(0, 12)}…`
}
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex items-center justify-between gap-4 flex-wrap">
            <h1 class="text-2xl font-semibold">Security</h1>
            <AdminSpinner :fetching="isFetching" />
        </div>
        <p class="text-content-secondary text-sm -mt-4">Admin login history — no range filter, always recent.</p>

        <div class="card bg-base-200 border border-base-300">
            <div class="card-body">
                <h2 class="card-title text-base">Failed attempts — last 14 days</h2>
                <div v-if="loading" class="skeleton w-full h-[180px]" />
                <BarChart
                    v-else-if="chartData.length"
                    :data="chartData"
                    :categories="categories"
                    x-axis="day"
                    :y-axis="['count']"
                    :height="180"
                    :x-formatter="xFormatter"
                    :hide-legend="true"
                />
                <p v-else class="text-content-secondary text-sm">No failed attempts. 🎉</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="card bg-base-200 border border-base-300">
                <div class="card-body">
                    <h2 class="card-title text-base">Recent logins</h2>
                    <div class="overflow-x-auto">
                        <table class="table table-sm">
                            <thead><tr><th>Logged in</th><th>Expires</th></tr></thead>
                            <tbody v-if="loading">
                                <tr v-for="i in 6" :key="i">
                                    <td><AdminSkel w="w-32" h="h-3" /></td>
                                    <td><AdminSkel w="w-32" h="h-3" /></td>
                                </tr>
                            </tbody>
                            <tbody v-else>
                                <tr v-for="(row, i) in data?.recentLogins ?? []" :key="i">
                                    <td class="whitespace-nowrap text-xs">{{ fmtTime(row.created_at) }}</td>
                                    <td class="whitespace-nowrap text-xs">{{ fmtTime(row.expires_at) }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <p v-if="!loading && !data?.recentLogins?.length" class="text-content-secondary text-sm py-4">No logins yet.</p>
                    </div>
                </div>
            </div>
            <div class="card bg-base-200 border border-base-300">
                <div class="card-body">
                    <h2 class="card-title text-base">Recent failed attempts</h2>
                    <div class="overflow-x-auto">
                        <table class="table table-sm">
                            <thead><tr><th>Time</th><th>Fingerprint</th></tr></thead>
                            <tbody v-if="loading">
                                <tr v-for="i in 6" :key="i">
                                    <td><AdminSkel w="w-28" h="h-3" /></td>
                                    <td><AdminSkel w="w-24" h="h-3" /></td>
                                </tr>
                            </tbody>
                            <tbody v-else>
                                <tr v-for="(row, i) in data?.failedAttempts ?? []" :key="i">
                                    <td class="whitespace-nowrap text-xs">{{ fmtTime(row.created_at) }}</td>
                                    <td class="font-mono text-xs">{{ shortHash(row.fingerprint) }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <p v-if="!loading && !data?.failedAttempts?.length" class="text-content-secondary text-sm py-4">No failed attempts. 🎉</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
