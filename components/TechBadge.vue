<script setup lang="ts">
defineProps<{
  name: string
  icon: string
  theme?: string
}>()
</script>

<template>
  <span
    class="py-2 px-3 rounded-lg bg-base-200 inline-flex shadow-sm border border-dashed border-base-300 text-sm font-mono items-center gap-2 transition-all duration-200 ease-out hover:shadow-md hover:border-base-200"
    :title="name">
    <Icon :class="[theme == 'light' && 'bg-white p-3 shrink size-6']" :name="icon"
      class="text-base shrink-0" />
    <span class="whitespace-nowrap">{{ name }}</span>
  </span>
</template>
