<script setup lang="ts">
interface Props {
  highlight?: boolean
  full?: boolean
}

defineProps<Props>()
defineEmits<{
  click: []
}>()
</script>

<template>
  <div
    :class="{
  'p-5 rounded-box  bg-base-200 shadow-md border border-base-300 transition-all duration-200 ease-out hover:border-primary hover:shadow-lg': true,
      'border-primary shadow-lg': highlight,
      'md:col-span-2': full
    }">
    <h3
      :class="{ 'font-semibold text-lg text-base-content transition-colors duration-200 flex items-center gap-2': true, 'text-primary': highlight }">
      <slot name="title" />
    </h3>
    <p :class="{ 'mt-2 text-sm leading-relaxed text-content-secondary': true, 'text-base-content': highlight }">
      <slot name="description" />
    </p>
  </div>
</template>
