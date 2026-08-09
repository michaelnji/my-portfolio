<script lang="ts" setup>
interface LeaderboardItem {
    key: string | number
    label: string
    sublabel?: string
    value: number
    valuePrefix?: string
    valueSuffix?: string
    icon?: string
    href?: string
    external?: boolean
    mono?: boolean
    badge?: { text: string | number; class?: string }
}

const props = withDefaults(
    defineProps<{
        items: LeaderboardItem[]
        loading?: boolean
        skeletonCount?: number
        emptyText?: string
        /** What the value column measures (e.g. "views", "plays") — shown under
         * every value so a bare number is never ambiguous. Per-item valueSuffix
         * (e.g. "ms") takes precedence when set, since the unit is then already
         * inline with the number. */
        valueLabel?: string
    }>(),
    {
        loading: false,
        skeletonCount: 6,
        emptyText: 'Nothing tracked yet.',
        valueLabel: undefined,
    }
)

function fmt(n: number) {
    return n.toLocaleString()
}
// Rank number and bar width both depend on real descending order — sort
// here rather than trust every caller's query to have ordered rows
// correctly (a text-cast COUNT(*) sorted lexicographically bit us once:
// "16" < "5" as strings). This is the one place that can't regress.
const sortedItems = computed(() => [...props.items].sort((a, b) => Number(b.value) - Number(a.value)))
// Relative bar per row, scaled against the largest value in the list —
// gives the ranking a visual magnitude, not just a number to compare.
const maxValue = computed(() => Math.max(1, ...props.items.map((i) => Number(i.value) || 0)))
function barPct(item: LeaderboardItem) {
    return Math.max(4, Math.round((Number(item.value) / maxValue.value) * 100))
}
</script>

<template>
    <div v-if="loading" class="flex flex-col gap-1">
        <div v-for="i in skeletonCount" :key="i" class="flex items-center gap-3 px-3 py-2.5">
            <AdminSkel w="w-4" h="h-3" />
            <div class="skeleton w-9 h-9 rounded-lg flex-shrink-0" />
            <div class="flex-1"><AdminSkel w="w-40" h="h-3" /></div>
            <AdminSkel w="w-10" h="h-3" />
        </div>
    </div>

    <div v-else-if="items.length" class="flex flex-col">
        <component
            :is="item.href ? 'NuxtLink' : 'div'"
            v-for="(item, i) in sortedItems"
            :key="item.key"
            :to="item.href"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noopener noreferrer' : undefined"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-150 hover:bg-base-300/50"
        >
            <span class="w-5 text-xs font-semibold text-primary text-right flex-shrink-0">{{ i + 1 }}</span>
            <div class="w-9 h-9 rounded-lg bg-base-300 flex items-center justify-center flex-shrink-0 text-content-secondary">
                <Icon :name="item.icon || 'solar:widget-5-bold'" size="16" />
            </div>
            <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2 min-w-0">
                    <p class="truncate" :class="item.mono ? 'font-mono text-xs' : 'text-sm font-medium'">{{ item.label }}</p>
                    <span v-if="item.badge" class="badge badge-sm flex-shrink-0" :class="item.badge.class || 'badge-neutral'">{{ item.badge.text }}</span>
                </div>
                <p v-if="item.sublabel" class="text-xs text-content-secondary truncate">{{ item.sublabel }}</p>
                <div class="mt-1.5 h-1 rounded-full bg-base-300 overflow-hidden">
                    <div class="h-full rounded-full bg-primary/70" :style="{ width: barPct(item) + '%' }" />
                </div>
            </div>
            <div class="flex flex-col items-end flex-shrink-0">
                <span class="text-sm font-semibold tabular-nums whitespace-nowrap">{{ item.valuePrefix }}{{ fmt(item.value) }}{{ item.valueSuffix }}</span>
                <span v-if="valueLabel && !item.valueSuffix" class="text-[10px] text-content-secondary uppercase tracking-wide">{{ valueLabel }}</span>
            </div>
        </component>
    </div>

    <p v-else class="text-content-secondary text-sm py-4">{{ emptyText }}</p>
</template>
