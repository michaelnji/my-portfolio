<script lang="ts" setup>
onMounted(() => {
    window.scroll({ behavior: 'instant', top: 0 })
})
</script>
<template>
    <div class="w-full pb-24">

        <slot />
    </div>
</template>
