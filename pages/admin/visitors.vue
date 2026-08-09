<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'admin', middleware: 'admin' })

interface PageCountRow {
    path: string
    count: string
}
interface VisitorsData {
    sessionCount: number
    avgPageviewsPerSession: number
    bounceRate: number
    newVisitors: number
    returningVisitors: number
    entryPages: PageCountRow[]
    exitPages: PageCountRow[]
}

const { range } = useAdminRange()

const {
    data,
    isPending: loading,
    isFetching,
    error,
    refetch,
} = useQuery({
    queryKey: computed(() => ['admin', 'visitors', range.value]),
    queryFn: () =>
        $fetch<{ data: VisitorsData }>('/api/admin/visitors', { query: { range: range.value } }).then((r) => r.data),
})

watch(error, (e) => {
    if (e) toast.error('Failed to load visitor data')
})

function fmt(n: number | undefined) {
    return Number(n ?? 0).toLocaleString()
}
function fmtPercent(n: number | undefined) {
    return `${Math.round((n ?? 0) * 100)}%`
}
const totalVisitors = computed(() => (data.value?.newVisitors ?? 0) + (data.value?.returningVisitors ?? 0))

const entryPagesLeaderboard = computed(() =>
    (data.value?.entryPages ?? []).map((row) => ({
        key: row.path,
        label: row.path,
        value: Number(row.count),
        icon: 'solar:login-3-bold',
        mono: true,
    }))
)
const exitPagesLeaderboard = computed(() =>
    (data.value?.exitPages ?? []).map((row) => ({
        key: row.path,
        label: row.path,
        value: Number(row.count),
        icon: 'solar:logout-3-bold',
        mono: true,
    }))
)
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex items-center justify-between gap-4 flex-wrap">
            <h1 class="text-2xl font-semibold">Visitors</h1>
            <div class="flex items-center gap-3">
                <AdminRangeFilter />
                <AdminSpinner :fetching="isFetching" @sync="refetch()" />
            </div>
        </div>

        <div class="stats stats-vertical sm:stats-horizontal shadow bg-base-200 border border-base-300 w-full">
            <div class="stat">
                <div class="stat-title">Sessions</div>
                <div class="stat-value"><AdminSkel v-if="loading" w="w-20" h="h-9" /><template v-else>{{ fmt(data?.sessionCount) }}</template></div>
            </div>
            <div class="stat">
                <div class="stat-title">Avg pages / session</div>
                <div class="stat-value"><AdminSkel v-if="loading" w="w-16" h="h-9" /><template v-else>{{ (data?.avgPageviewsPerSession ?? 0).toFixed(1) }}</template></div>
            </div>
            <div class="stat">
                <div class="stat-title">Bounce rate</div>
                <div class="stat-value"><AdminSkel v-if="loading" w="w-16" h="h-9" /><template v-else>{{ fmtPercent(data?.bounceRate) }}</template></div>
            </div>
            <div class="stat">
                <div class="stat-title">New visitors</div>
                <div class="stat-value"><AdminSkel v-if="loading" w="w-16" h="h-9" /><template v-else>{{ fmt(data?.newVisitors) }}</template></div>
                <div class="stat-desc mt-2">
                    <AdminSkel v-if="loading" w="w-24" h="h-3" />
                    <template v-else>of {{ fmt(totalVisitors) }} total</template>
                </div>
            </div>
            <div class="stat">
                <div class="stat-title">Returning visitors</div>
                <div class="stat-value"><AdminSkel v-if="loading" w="w-16" h="h-9" /><template v-else>{{ fmt(data?.returningVisitors) }}</template></div>
                <div class="stat-desc mt-2">
                    <AdminSkel v-if="loading" w="w-24" h="h-3" />
                    <template v-else>of {{ fmt(totalVisitors) }} total</template>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="card bg-base-200 border border-base-300">
                <div class="card-body">
                    <h2 class="card-title text-base">Entry pages</h2>
                    <AdminLeaderboard :items="entryPagesLeaderboard" :loading="loading" :skeleton-count="8" value-label="sessions" empty-text="No data yet." />
                </div>
            </div>
            <div class="card bg-base-200 border border-base-300">
                <div class="card-body">
                    <h2 class="card-title text-base">Exit pages</h2>
                    <AdminLeaderboard :items="exitPagesLeaderboard" :loading="loading" :skeleton-count="8" value-label="sessions" empty-text="No data yet." />
                </div>
            </div>
        </div>
    </div>
</template>
