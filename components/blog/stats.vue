<script lang="ts" setup>

</script>
<template>
    <div class="">
        <h3 class="font-medium transition-all group-hover:rotate-12 text-xl md:text-2xl mb-4">
            Stats about this post
        </h3>
        <div class="flex gap-4 flex-wrap ">
            <div
                class="flex items-center font-mono py-1 px-3   rounded-box bg-base-content font-bold text-base-100 shadow-md shadow-base-content/30 gap-x-2 group">
                <Icon name="solar:eye-linear" size="28" /> 2.2K
            </div>
            <div
                class="flex items-center font-mono py-1 px-3 border border-transparent transition-all cursor-pointer active:scale-95 hover:shadow-lg hover:shadow-error/30 hover:border-error rounded-box bg-base-300/50 gap-x-2 group">
                <Icon name="solar:heart-angle-bold" size="28" class="transition-all group-hover:rotate-12 text-error" />
                20.0K
            </div>
           

            <div
                class="flex items-center font-mono py-1 px-3 border border-transparent transition-all hover:shadow-warning/30 cursor-pointer active:scale-95 hover:shadow-lg hover:border-warning rounded-box bg-base-300/50 gap-x-2 group">
                <Icon name="ph:thumbs-down-fill" size="28" class="transition-all group-hover:rotate-12 text-warning" />
                400
            </div>
            <div
                class="flex items-center font-mono py-1 px-3 border border-transparent transition-all cursor-pointer active:scale-95 hover:shadow-lg hover:border-secondary hover:shadow-secondary/30 rounded-box bg-base-300/50 gap-x-2 group">
                <Icon name="ph:hands-clapping-fill" size="28"
                    class="transition-all group-hover:rotate-12 text-secondary" /> 200
            </div>

        </div>
    </div>
</template>
