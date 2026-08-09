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
const categories = { count: { name: 'Visits', color: '#3987e5' } }
const xFormatter = (i: number) => referrerChartData.value[i]?.key ?? ''

function fmt(n: string | number | undefined) {
    return Number(n ?? 0).toLocaleString()
}
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex items-center justify-between gap-4 flex-wrap">
            <h1 class="text-2xl font-semibold">Sources</h1>
            <AdminRangeFilter />
        </div>
        <div class="card bg-base-200 border border-base-300">
            <div class="card-body">
                <h2 class="card-title text-base">Top referrers</h2>
                <div v-if="loading" class="skeleton w-full h-[260px]" />
                <BarChart
                    v-else-if="referrerChartData.length"
                    :data="referrerChartData"
                    :categories="categories"
                    x-axis="key"
                    :y-axis="['count']"
                    :height="260"
                    :x-formatter="xFormatter"
                    :hide-legend="true"
                />
                <p v-else class="text-content-secondary text-sm">No data yet.</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="card bg-base-200 border border-base-300">
                <div class="card-body">
                    <h2 class="card-title text-base">UTM source</h2>
                    <div class="overflow-x-auto">
                        <table class="table table-sm">
                            <thead><tr><th>Source</th><th class="text-right">Visits</th></tr></thead>
                            <tbody v-if="loading">
                                <tr v-for="i in 5" :key="i">
                                    <td><AdminSkel w="w-20" h="h-3" /></td>
                                    <td class="text-right"><AdminSkel w="w-8" h="h-3" class="ml-auto" /></td>
                                </tr>
                            </tbody>
                            <tbody v-else>
                                <tr v-for="row in data?.utmSource ?? []" :key="row.key ?? ''">
                                    <td>{{ row.key }}</td>
                                    <td class="text-right">{{ fmt(row.count) }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <p v-if="!loading && !data?.utmSource?.length" class="text-content-secondary text-sm py-4">No campaign traffic yet.</p>
                    </div>
                </div>
            </div>
            <div class="card bg-base-200 border border-base-300">
                <div class="card-body">
                    <h2 class="card-title text-base">UTM campaign</h2>
                    <div class="overflow-x-auto">
                        <table class="table table-sm">
                            <thead><tr><th>Campaign</th><th class="text-right">Visits</th></tr></thead>
                            <tbody v-if="loading">
                                <tr v-for="i in 5" :key="i">
                                    <td><AdminSkel w="w-20" h="h-3" /></td>
                                    <td class="text-right"><AdminSkel w="w-8" h="h-3" class="ml-auto" /></td>
                                </tr>
                            </tbody>
                            <tbody v-else>
                                <tr v-for="row in data?.utmCampaign ?? []" :key="row.key ?? ''">
                                    <td>{{ row.key }}</td>
                                    <td class="text-right">{{ fmt(row.count) }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <p v-if="!loading && !data?.utmCampaign?.length" class="text-content-secondary text-sm py-4">No campaign traffic yet.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
