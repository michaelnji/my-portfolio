<script lang="ts" setup>
import type { PortableTextMarkComponentProps } from '@portabletext/vue';

const props = defineProps<PortableTextMarkComponentProps<{
    _type: string;
    _key?: string;
    href: string
    text: string
}>>();

</script>

<template>
    <span>
        <NuxtLink :to="value?.href ?? '/'"
            class='
            font-bold hover:border-primary hover:border-dashed transition-all border-b-2 !opacity-100 !no-underline !p-0'>
            <slot></slot> <small class="rotate-3"> » </small>
        </NuxtLink>
    </span>
</template>