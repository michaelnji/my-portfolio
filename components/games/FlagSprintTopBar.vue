<script setup lang="ts">
defineProps<{
    isFlagSprint: boolean
    bestScore: number
    totalQuestions: number
}>()
</script>

<template>
    <div class="flex items-center justify-between gap-4 py-2 border-b border-base-300/60">
        <NuxtLink to="/games" class="inline-flex items-center gap-2 text-sm text-content-secondary hover:text-primary">
            <Icon name="ph:house-simple-duotone" size="18" />
            Back to Games
        </NuxtLink>
        <div v-if="isFlagSprint" class="font-mono text-xs md:text-sm text-content-secondary">
            Best <span class="text-base-content">{{ bestScore }}/{{ totalQuestions }}</span>
        </div>
    </div>
</template>
