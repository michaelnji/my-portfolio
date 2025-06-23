<script lang="ts" setup>
import type { PortableTextComponentProps } from '@portabletext/vue';

const props = defineProps<
    PortableTextComponentProps<{
        style: string;
    }>
>();
const style = computed(() => props.value.style)
</script>
<template>
    <div>
        <h2 v-if="style === 'h2'" class="font-bold  text-4xl md:text-5xl">
            <slot></slot>
        </h2>
        <h3 v-if="style === 'h3'" class="font-bold  text-3xl md:text-2xl">
            <slot></slot>
        </h3>
        <h4 v-if="style === 'h4'" class=" font-bold  text-2xl md:text-3xl">
            <slot></slot>
        </h4>
    </div>
</template>
