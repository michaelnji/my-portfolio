<script lang="ts" setup>
defineProps<{ options: string[]; placeholder?: string }>()
const model = defineModel<string>({ default: '' })

function select(value: string, event: MouseEvent) {
    model.value = value
    ;(event.currentTarget as HTMLElement)?.blur()
}
</script>

<template>
    <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-sm btn-ghost gap-2">
            {{ model || placeholder || 'All' }}
            <Icon name="ph:caret-down-bold" size="12" />
        </div>
        <ul tabindex="0" class="dropdown-content menu bg-base-200 rounded-box z-10 w-52 p-2 mt-2 shadow-lg border border-base-300">
            <li>
                <a :class="{ 'menu-active': model === '' }" @click="select('', $event)">{{ placeholder ?? 'All' }}</a>
            </li>
            <li v-for="opt in options" :key="opt">
                <a :class="{ 'menu-active': model === opt }" @click="select(opt, $event)">{{ opt }}</a>
            </li>
        </ul>
    </div>
</template>
