<script setup lang="ts">
interface Props {
  href: string
  ariaLabel: string
  icon: string
  disabled?: boolean
  target?: string
  rel?: string
}

defineProps<Props>()
defineEmits<{
  click: []
}>()
</script>

<template>
  <a
    v-if="!disabled"
    :href="href"
    :aria-label="ariaLabel"
    :target="target"
    :rel="rel"
    @click="$emit('click')"
    class="p-3 rounded-lg bg-base-200 inline-flex shadow-md border border-dashed border-base-300 font-mono transition-all duration-200 ease-out hover:shadow-lg hover:border-solid hover:border-primary hover:bg-base-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    :title="ariaLabel">
    <Icon :name="icon" size="24" />
  </a>
  <button
    v-else
    disabled
    :aria-label="ariaLabel"
    class="p-3 rounded-lg bg-base-200 inline-flex shadow-md border border-dashed border-base-300 font-mono transition-all duration-200 ease-out opacity-50 cursor-not-allowed hover:shadow-md hover:border-dashed hover:border-base-300 hover:bg-base-200"
    type="button"
    :title="`${ariaLabel} (coming soon)`">
    <Icon :name="icon" size="24" />
  </button>
</template>

