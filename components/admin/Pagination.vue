<script lang="ts" setup>
defineProps<{ page: number; hasMore: boolean; disabled?: boolean }>()
const emit = defineEmits<{ 'update:page': [number] }>()
</script>

<template>
    <div class="flex items-center justify-end gap-3 mt-auto pt-2">
        <span class="text-xs text-content-secondary">Page {{ page }}</span>
        <div class="join">
            <button
                type="button"
                class="btn btn-xs join-item btn-ghost"
                :disabled="disabled || page <= 1"
                @click="emit('update:page', page - 1)"
            >
                <Icon name="ph:caret-left-bold" size="12" /> Prev
            </button>
            <button
                type="button"
                class="btn btn-xs join-item btn-ghost"
                :disabled="disabled || !hasMore"
                @click="emit('update:page', page + 1)"
            >
                Next <Icon name="ph:caret-right-bold" size="12" />
            </button>
        </div>
    </div>
</template>
