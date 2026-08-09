<script lang="ts" setup>
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'vccs'

interface Series {
    key: string
    name: string
    color: string
}

withDefaults(
    defineProps<{
        // biome-ignore lint/suspicious/noExplicitAny: chart data shape varies per caller
        data: Record<string, any>[]
        xKey: string
        series: Series[]
        height?: number
        hideLegend?: boolean
    }>(),
    { height: 260, hideLegend: false }
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
        <BarChart :data="data" :margin="{ top: 8, right: 8, left: -12, bottom: 0 }">
            <CartesianGrid :vertical="false" />
            <XAxis :dataKey="xKey" :tickLine="false" :axisLine="false" />
            <YAxis :tickLine="false" :axisLine="false" allow-decimals="false" />
            <Tooltip :contentStyle="tooltipStyle" :labelStyle="tooltipLabelStyle" :itemStyle="tooltipItemStyle" />
            <Legend v-if="!hideLegend && series.length > 1" />
            <Bar v-for="s in series" :key="s.key" :dataKey="s.key" :name="s.name" :fill="s.color" :radius="series.length > 1 ? 3 : [4, 4, 0, 0]" />
        </BarChart>
    </ResponsiveContainer>
</template>
