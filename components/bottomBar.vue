<script lang="ts" setup>
import { UseMouseInElement } from '@vueuse/components'
</script>
<template>
    <div
        class="fixed bottom-12 left-1/2 -translate-x-1/2 rounded-full bg-base-200 border border-base-300 p-3 px-6 flex gap-x-4">

        <div
            class="flex items-center group transition-all transition-all text-primary-content bg-primary rounded-box p-3 gap-x-2">
            <Icon name="solar:home-2-bold-duotone" size="36" />

        </div>


        <div class="flex items-center group transition-all  hover:bg-base-100 rounded-full transition-all p-3 gap-x-2">
            <Icon name="ph:laptop-duotone" size="36" />

        </div>
        <div class="flex items-center group transition-all  hover:bg-base-100 rounded-full transition-all p-3 gap-x-2">
            <Icon name="ph:pencil-circle-duotone" size="36" />

        </div>
    </div>
</template>