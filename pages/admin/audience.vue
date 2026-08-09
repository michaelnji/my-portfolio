<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { COUNTRY_CENTROIDS } from '~/data/countryCentroids'

definePageMeta({ layout: 'admin', middleware: 'admin' })

interface BucketRow {
    key: string | null
    count: string
}
interface AudienceData {
    device: BucketRow[]
    browser: BucketRow[]
    os: BucketRow[]
    country: BucketRow[]
}

const { range } = useAdminRange()

const {
    data,
    isPending: loading,
    isFetching,
    error,
} = useQuery({
    queryKey: computed(() => ['admin', 'audience', range.value]),
    queryFn: () =>
        $fetch<{ data: AudienceData }>('/api/admin/audience', { query: { range: range.value } }).then((r) => r.data),
})

watch(error, (e) => {
    if (e) toast.error('Failed to load audience data')
})

const audienceSeries = [{ key: 'count', name: 'Views', color: '#3987e5' }]

function toChartData(rows: BucketRow[] | undefined) {
    return (rows ?? []).map((r) => ({ key: r.key ?? 'Unknown', count: Number(r.count) }))
}

const mapPins = computed(() => {
    const rows = (data.value?.country ?? []).filter((r) => r.key && COUNTRY_CENTROIDS[r.key])
    const max = Math.max(1, ...rows.map((r) => Number(r.count)))
    return rows.map((r) => {
        const centroid = COUNTRY_CENTROIDS[r.key as string]
        const count = Number(r.count)
        return {
            lat: centroid.lat,
            lng: centroid.lng,
            svgOptions: {
                color: '#b4ff22',
                radius: 2 + (count / max) * 6,
                strokeColor: '#0b0b0b',
                strokeWidth: 0.5,
            },
            data: { country: r.key, count },
        }
    })
})
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex items-center justify-between gap-4 flex-wrap">
            <h1 class="text-2xl font-semibold">Audience</h1>
            <div class="flex items-center gap-3">
                <AdminRangeFilter />
                <AdminSpinner :fetching="isFetching" />
            </div>
        </div>
        <p class="text-content-secondary text-sm -mt-4">By pageview.</p>

        <div class="card bg-base-200 border border-base-300">
            <div class="card-body">
                <h2 class="card-title text-base">Visitor map</h2>
                <div v-if="loading" class="skeleton w-full h-[300px]" />
                <DottedMap
                    v-else-if="mapPins.length"
                    :pins="mapPins"
                    :map-height="60"
                    color="#3a3a3d"
                    background-color="transparent"
                    :dot-size="0.4"
                />
                <p v-else class="text-content-secondary text-sm">No geo data yet.</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="dim in (['device', 'browser', 'os', 'country'] as const)" :key="dim" class="card bg-base-200 border border-base-300">
                <div class="card-body">
                    <h2 class="card-title text-base capitalize">{{ dim }}</h2>
                    <div v-if="loading" class="skeleton w-full h-[240px]" />
                    <AdminSimpleBarChart
                        v-else-if="toChartData(data?.[dim]).length"
                        :data="toChartData(data?.[dim])"
                        x-key="key"
                        :series="audienceSeries"
                        :height="240"
                        hide-legend
                    />
                    <p v-else class="text-content-secondary text-sm">No data yet.</p>
                </div>
            </div>
        </div>
    </div>
</template>
