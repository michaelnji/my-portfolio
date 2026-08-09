<script lang="ts" setup>
withDefaults(defineProps<{ fetching?: boolean }>(), { fetching: false })
const emit = defineEmits<{ sync: [] }>()
</script>

<template>
    <button type="button" class="admin-sync-btn btn btn-ghost btn-circle btn-sm" :disabled="fetching"
        :aria-label="fetching ? 'Syncing data…' : 'Sync data'" :title="fetching ? 'Syncing data…' : 'Sync data'"
        @click="emit('sync')">
        <span class="admin-spinner" :class="{ 'admin-spinner-active': fetching }" />
    </button>
</template>

<style scoped>
/* btn-circle's own padding/sizing math doesn't reliably resolve around an
   empty icon-only child — pin the box explicitly instead of trusting it. */
.admin-sync-btn {
    width: 2rem;
    height: 2rem;
    padding: 0;
}
.admin-spinner {
    /* Flex item sizing + aspect-ratio can collapse toward 0 with no forced
                   basis — flex: none locks it to width/height regardless of context. */
        flex: none;
        display: block;
        width: 18px;
        height: 18px;
    --b: 3px;
    border-radius: 50%;
    padding: 1px;
    background: conic-gradient(#0000 10%, color-mix(in oklch, var(--color-base-content) 80%, transparent)) content-box;
    -webkit-mask:
        repeating-conic-gradient(#0000 0deg, #000 1deg 20deg, #0000 21deg 36deg),
        radial-gradient(farthest-side, #0000 calc(100% - var(--b) - 1px), #000 calc(100% - var(--b)));
    mask:
        repeating-conic-gradient(#0000 0deg, #000 1deg 20deg, #0000 21deg 36deg),
        radial-gradient(farthest-side, #0000 calc(100% - var(--b) - 1px), #000 calc(100% - var(--b)));
    -webkit-mask-composite: destination-in;
    mask-composite: intersect;
}

.admin-spinner-active {
    background: conic-gradient(#0000 10%, var(--color-primary)) content-box;
    animation: admin-spinner-rotate 1s infinite steps(10);
}

@keyframes admin-spinner-rotate {
    to {
        transform: rotate(1turn);
    }
}
</style>
