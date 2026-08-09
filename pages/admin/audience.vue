<script lang="ts" setup>
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

const data = ref<AudienceData | null>(null)
const loading = ref(true)
const { range } = useAdminRange()

async function load() {
    try {
        const res = await $fetch<{ data: AudienceData }>('/api/admin/audience', { query: { range: range.value } })
        data.value = res.data
    } finally {
        loading.value = false
    }
}

onMounted(load)
watch(range, () => {
    loading.value = true
    load()
})

const categories = { count: { name: 'Views', color: '#3987e5' } }

function toChartData(rows: BucketRow[] | undefined) {
    return (rows ?? []).map((r) => ({ key: r.key ?? 'Unknown', count: Number(r.count) }))
}
const xFormatterFor = (rows: BucketRow[] | undefined) => (i: number) => toChartData(rows)[i]?.key ?? ''
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex items-center justify-between gap-4 flex-wrap">
            <h1 class="text-2xl font-semibold">Audience</h1>
            <AdminRangeFilter />
        </div>
        <p class="text-content-secondary text-sm -mt-4 capitalize">{{ rangeLabelLong(range) }}, by pageview.</p>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="dim in (['device', 'browser', 'os', 'country'] as const)" :key="dim" class="card bg-base-200 border border-base-300">
                <div class="card-body">
                    <h2 class="card-title text-base capitalize">{{ dim }}</h2>
                    <div v-if="loading" class="skeleton w-full h-[240px]" />
                    <BarChart
                        v-else-if="toChartData(data?.[dim]).length"
                        :data="toChartData(data?.[dim])"
                        :categories="categories"
                        x-axis="key"
                        :y-axis="['count']"
                        :height="240"
                        :x-formatter="xFormatterFor(data?.[dim])"
                        :hide-legend="true"
                    />
                    <p v-else class="text-content-secondary text-sm">No data yet.</p>
                </div>
            </div>
        </div>
    </div>
</template>
