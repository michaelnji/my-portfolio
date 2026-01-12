<script lang="ts" setup>
defineProps<{
    categories: { title: string }[]
}>()

</script>
<template>
    <div class="">
        <h3 class="font-medium transition-all group-hover:rotate-12 text-xl md:text-2xl mb-4">
            Tags
        </h3>
        <div class="flex gap-2 flex-wrap ">
            <div v-for="category in categories"
                class="flex items-center  py-1 px-3   rounded-box bg-base-200 border border-base-300 font-normal-weight   gap-x-2 group">
                {{ category.title }}
            </div>

        </div>
    </div>
</template>
