<script lang="ts" setup>
import type { AdminRangeValue } from '~/composables/useAdminRange'

const { range, setRange } = useAdminRange()

const currentLabel = computed(() => ADMIN_RANGES.find((r) => r.value === range.value)?.label ?? range.value)

function select(value: AdminRangeValue, event: MouseEvent) {
    setRange(value)
    ;(event.currentTarget as HTMLElement)?.blur()
}
</script>

<template>
    <div class="join p-1 space-x-2! rounded-3xl! border! border-base-300! hidden sm:flex">
        <button
            v-for="r in ADMIN_RANGES"
            :key="r.value"
            type="button"
            class="btn btn-sm join-item"
            :class="range === r.value ? 'btn-primary' : 'btn-ghost'"
            @click="setRange(r.value)"
        >
            {{ r.label }}
        </button>
    </div>

    <div class="dropdown dropdown-end sm:hidden">
        <div tabindex="0" role="button" class="btn btn-sm btn-ghost gap-2 rounded-3xl! border! border-base-300!">
            {{ currentLabel }}
            <Icon name="ph:caret-down-bold" size="12" />
        </div>
        <ul tabindex="0" class="dropdown-content menu bg-base-200 rounded-box z-10 w-32 p-2 mt-2 shadow-lg border border-base-300">
            <li v-for="r in ADMIN_RANGES" :key="r.value">
                <a :class="{ 'menu-active': range === r.value }" @click="select(r.value, $event)">{{ r.label }}</a>
            </li>
        </ul>
    </div>
</template>
