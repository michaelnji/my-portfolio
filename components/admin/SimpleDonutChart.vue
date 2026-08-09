<script lang="ts" setup>
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'vccs'

withDefaults(
    defineProps<{
        // biome-ignore lint/suspicious/noExplicitAny: chart data shape varies per caller
        data: Record<string, any>[]
        dataKey: string
        nameKey?: string
        colors: string[]
        height?: number
        hideLegend?: boolean
    }>(),
    { nameKey: 'name', height: 260, hideLegend: false }
)

const tooltipStyle = {
    backgroundColor: 'var(--color-base-200)',
    border: '1px solid var(--color-base-300)',
    borderRadius: 'var(--radius-field)',
    fontSize: '12px',
}
const tooltipLabelStyle = { color: 'var(--color-base-content)' }
const tooltipItemStyle = { color: 'var(--color-base-content)' }
</script>

<template>
    <ResponsiveContainer width="100%" :height="height">
        <PieChart>
            <Tooltip :contentStyle="tooltipStyle" :labelStyle="tooltipLabelStyle" :itemStyle="tooltipItemStyle" />
            <Legend v-if="!hideLegend" />
            <Pie :data="data" :dataKey="dataKey" :nameKey="nameKey" innerRadius="60%" outerRadius="85%" :paddingAngle="2">
                <Cell v-for="(_entry, index) in data" :key="index" :fill="colors[index % colors.length]" />
            </Pie>
        </PieChart>
    </ResponsiveContainer>
</template>
