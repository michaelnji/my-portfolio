<script lang="ts" setup>
withDefaults(defineProps<{ fetching?: boolean }>(), { fetching: false })
</script>

<template>
    <div
        class="admin-spinner hidden sm:block transition-opacity duration-200"
        :class="fetching ? 'opacity-100' : 'opacity-0'"
    />
</template>

<style scoped>
.admin-spinner {
    width: 22px;
    --b: 3px;
    aspect-ratio: 1;
    border-radius: 50%;
    padding: 1px;
    background: conic-gradient(#0000 10%, var(--color-primary)) content-box;
    -webkit-mask:
        repeating-conic-gradient(#0000 0deg, #000 1deg 20deg, #0000 21deg 36deg),
        radial-gradient(farthest-side, #0000 calc(100% - var(--b) - 1px), #000 calc(100% - var(--b)));
    mask:
        repeating-conic-gradient(#0000 0deg, #000 1deg 20deg, #0000 21deg 36deg),
        radial-gradient(farthest-side, #0000 calc(100% - var(--b) - 1px), #000 calc(100% - var(--b)));
    -webkit-mask-composite: destination-in;
    mask-composite: intersect;
    animation: admin-spinner-rotate 1s infinite steps(10);
}

@keyframes admin-spinner-rotate {
    to {
        transform: rotate(1turn);
    }
}
</style>
