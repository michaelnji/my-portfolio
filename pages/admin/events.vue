<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'admin', middleware: 'admin' })

interface EventRow {
    id: number
    type: string
    path: string | null
    anon_id: string | null
    payload: unknown
    created_at: string
}
interface CountRow {
    type: string
    count: string
}
interface KindRow {
    kind: string
    count: string
}
interface EventsData {
    events: EventRow[]
    countsByType: CountRow[]
    clicksByKind: KindRow[]
}

const typeFilter = ref('')
const { range } = useAdminRange()

const TYPES = [
    'outbound_click',
    'game_play',
    'game_complete',
    'form_submit',
    'not_found',
    'js_error',
    'project_tab',
    'sound_toggle',
    'copy_code',
    'rate_limited',
]

const {
    data,
    isPending: loading,
    isFetching,
    error,
} = useQuery({
    queryKey: computed(() => ['admin', 'events', range.value, typeFilter.value]),
    queryFn: () =>
        $fetch<{ data: EventsData }>('/api/admin/events', {
            query: { range: range.value, ...(typeFilter.value ? { type: typeFilter.value } : {}) },
        }).then((r) => r.data),
})

watch(error, (e) => {
    if (e) toast.error('Failed to load events')
})

const chartData = computed(() => (data.value?.countsByType ?? []).map((c) => ({ type: c.type, count: Number(c.count) })))
const categories = { count: { name: 'Events', color: '#3987e5' } }
const xFormatter = (i: number) => chartData.value[i]?.type ?? ''

const kindChartData = computed(() => (data.value?.clicksByKind ?? []).map((c) => ({ kind: c.kind, count: Number(c.count) })))
const kindCategories = { count: { name: 'Clicks', color: '#d95926' } }
const kindXFormatter = (i: number) => kindChartData.value[i]?.kind ?? ''

function fmtTime(iso: string) {
    return formatAdminDateTime(iso)
}
function fmtPayload(payload: unknown) {
    if (!payload) return ''
    try {
        return typeof payload === 'string' ? payload : JSON.stringify(payload)
    } catch {
        return ''
    }
}
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex items-center justify-between gap-4 flex-wrap">
            <h1 class="text-2xl font-semibold">Events</h1>
            <div class="flex items-center gap-3">
                <AdminRangeFilter />
                <AdminSpinner :fetching="isFetching" />
            </div>
        </div>
        <p class="text-content-secondary text-sm -mt-4">By type.</p>

        <div class="card bg-base-200 border border-base-300">
            <div class="card-body">
                <h2 class="card-title text-base">By type</h2>
                <div v-if="loading" class="skeleton w-full h-[220px]" />
                <BarChart
                    v-else-if="chartData.length"
                    :data="chartData"
                    :categories="categories"
                    x-axis="type"
                    :y-axis="['count']"
                    :height="220"
                    :x-formatter="xFormatter"
                    :hide-legend="true"
                />
                <p v-else class="text-content-secondary text-sm">No events yet.</p>
            </div>
        </div>

        <div class="card bg-base-200 border border-base-300">
            <div class="card-body">
                <h2 class="card-title text-base">Outbound clicks by kind</h2>
                <div v-if="loading" class="skeleton w-full h-[180px]" />
                <BarChart
                    v-else-if="kindChartData.length"
                    :data="kindChartData"
                    :categories="kindCategories"
                    x-axis="kind"
                    :y-axis="['count']"
                    :height="180"
                    :x-formatter="kindXFormatter"
                    :hide-legend="true"
                />
                <p v-else class="text-content-secondary text-sm">No outbound clicks yet.</p>
            </div>
        </div>

        <div class="card bg-base-200 border border-base-300">
            <div class="card-body">
                <div class="flex items-center justify-between gap-4 flex-wrap">
                    <h2 class="card-title text-base">Recent events</h2>
                    <AdminTypeFilter v-model="typeFilter" :options="TYPES" placeholder="All types" />
                </div>
                <div class="overflow-x-auto">
                    <table class="table table-sm">
                        <thead><tr><th>Time</th><th>Type</th><th>Path</th><th>Payload</th></tr></thead>
                        <tbody v-if="loading">
                            <tr v-for="i in 8" :key="i">
                                <td><AdminSkel w="w-28" h="h-3" /></td>
                                <td><AdminSkel w="w-20" h="h-4" /></td>
                                <td><AdminSkel w="w-32" h="h-3" /></td>
                                <td><AdminSkel w="w-40" h="h-3" /></td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr v-for="ev in data?.events ?? []" :key="ev.id">
                                <td class="whitespace-nowrap text-xs">{{ fmtTime(ev.created_at) }}</td>
                                <td><span class="badge badge-sm">{{ ev.type }}</span></td>
                                <td class="font-mono text-xs max-w-[12rem] truncate">{{ ev.path }}</td>
                                <td class="font-mono text-xs max-w-xs truncate">{{ fmtPayload(ev.payload) }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p v-if="!loading && !data?.events?.length" class="text-content-secondary text-sm py-4">No events yet.</p>
                </div>
            </div>
        </div>
    </div>
</template>
