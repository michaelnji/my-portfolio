<script lang="ts" setup>
withDefaults(defineProps<{ fetching?: boolean }>(), { fetching: false })
</script>

<template>
    <span
        class="loading loading-spinner loading-lg text-content-secondary transition-opacity duration-200"
        :class="fetching ? 'opacity-100' : 'opacity-0'"
    />
</template>
