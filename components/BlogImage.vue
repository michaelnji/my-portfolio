    <script lang="ts" setup>
    import type { PortableTextComponentProps } from '@portabletext/vue';

    const props = defineProps<
        PortableTextComponentProps<{
            asset: { _ref: string }
        }>
    >();
    const imgUrl = computed(() => {
        if (props.value.asset._ref) return `https://cdn.sanity.io/images/${useRuntimeConfig().public.sanity.projectId}/production/${props.value.asset._ref.split('image-')[1].replace('-png', '.png')}`
    })

</script>
<template>

    <NuxtImg :src="$urlFor(imgUrl).format('webp').url()" alt=""
        class="w-full object-cover border border-base-300 rounded-box shadow-xl shadow-base-300/10" :custom="true"
        v-slot="{ src, isLoaded, imgAttrs }">

        <!-- Show the actual image when loaded -->
        <img v-if="isLoaded" v-bind="imgAttrs" :src="src" class="w-full object-cover">

        <!-- Show a placeholder while loading -->
        <div class="skeleton  bg-base-300 lg:bg-base-200 w-full h-[25rem]" v-if="!isLoaded"></div>
    </NuxtImg>


</template>
