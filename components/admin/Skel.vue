<script lang="ts" setup>
withDefaults(defineProps<{ w?: string; h?: string }>(), { w: 'w-20', h: 'h-4' })
</script>

<template>
    <div class="skeleton rounded" :class="[h, w]" />
</template>
