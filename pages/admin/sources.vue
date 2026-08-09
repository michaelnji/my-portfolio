<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'admin', middleware: 'admin' })

interface BucketRow {
    key: string | null
    count: string
}
interface SourcesData {
    referrers: BucketRow[]
    utmSource: BucketRow[]
    utmCampaign: BucketRow[]
}

const { range } = useAdminRange()

const {
    data,
    isPending: loading,
    isFetching,
    error,
} = useQuery({
    queryKey: computed(() => ['admin', 'sources', range.value]),
    queryFn: () =>
        $fetch<{ data: SourcesData }>('/api/admin/sources', { query: { range: range.value } }).then((r) => r.data),
})

watch(error, (e) => {
    if (e) toast.error('Failed to load source data')
})

const referrerChartData = computed(() => (data.value?.referrers ?? []).map((r) => ({ key: r.key ?? 'Direct', count: Number(r.count) })))
const referrerSeries = [{ key: 'count', name: 'Visits', color: '#3987e5' }]

const utmSourceLeaderboard = computed(() =>
    (data.value?.utmSource ?? []).map((row) => ({
        key: row.key ?? '(none)',
        label: row.key ?? '(none)',
        value: Number(row.count),
        icon: 'solar:link-bold',
    }))
)
const utmCampaignLeaderboard = computed(() =>
    (data.value?.utmCampaign ?? []).map((row) => ({
        key: row.key ?? '(none)',
        label: row.key ?? '(none)',
        value: Number(row.count),
        icon: 'solar:megaphone-bold',
    }))
)
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex items-center justify-between gap-4 flex-wrap">
            <h1 class="text-2xl font-semibold">Sources</h1>
            <div class="flex items-center gap-3">
                <AdminRangeFilter />
                <AdminSpinner :fetching="isFetching" />
            </div>
        </div>
        <div class="card bg-base-200 border border-base-300">
            <div class="card-body">
                <h2 class="card-title text-base">Top referrers</h2>
                <div v-if="loading" class="skeleton w-full h-[260px]" />
                <AdminSimpleBarChart
                    v-else-if="referrerChartData.length"
                    :data="referrerChartData"
                    x-key="key"
                    :series="referrerSeries"
                    :height="260"
                    hide-legend
                />
                <p v-else class="text-content-secondary text-sm">No data yet.</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="card bg-base-200 border border-base-300">
                <div class="card-body">
                    <h2 class="card-title text-base">UTM source</h2>
                    <AdminLeaderboard :items="utmSourceLeaderboard" :loading="loading" :skeleton-count="5" value-label="visits" empty-text="No campaign traffic yet." />
                </div>
            </div>
            <div class="card bg-base-200 border border-base-300">
                <div class="card-body">
                    <h2 class="card-title text-base">UTM campaign</h2>
                    <AdminLeaderboard :items="utmCampaignLeaderboard" :loading="loading" :skeleton-count="5" value-label="visits" empty-text="No campaign traffic yet." />
                </div>
            </div>
        </div>
    </div>
</template>
