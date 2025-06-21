<script lang="ts" setup>
const props = defineProps<{
    text: string
}>()
</script>
<template>
    <div class="relative inline w-max">

        <div
            class="py-0 px-2 rounded-lg bg-base-200  inline-flex shadow-xl border-1 border-dashed text-base border-base-content/30 font-mono">

            {{ text }}
        </div>
    </div>
</template>