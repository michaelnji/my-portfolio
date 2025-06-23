<script lang="ts" setup>
onMounted(() => {
    window.scroll({ behavior: 'instant', top: 0 })
})
</script>
<template>
    <div class="w-full ">

        <div class=" ">
            <slot />
        </div>
        <!-- <Footer /> -->
    </div>
</template>
