<script lang="ts" setup>
const { range, setRange } = useAdminRange()
</script>

<template>
    <div class="join p-1 space-x-2! rounded-3xl! border! border-base-300!">
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
</template>
