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
        <NuxtLink :to="value?.href ?? '/'" target="_blank" class='
            font-normal group !opacity-100 !no-underline !p-0'>
            <span class="border-primary  group-hover:border-dashed transition-all border-b-[0.5px]">
                <slot></slot>
            </span> <small class="rotate-3 group-hover:text-primary text-2xl"> » </small>
        </NuxtLink>
    </span>
</template>