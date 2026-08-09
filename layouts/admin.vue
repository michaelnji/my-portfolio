<script lang="ts" setup>
const route = useRoute()

const links = [
    { to: '/admin/overview', label: 'Overview', icon: 'ph:gauge-duotone' },
    { to: '/admin/content', label: 'Content', icon: 'ph:article-duotone' },
    { to: '/admin/audience', label: 'Audience', icon: 'ph:users-three-duotone' },
    { to: '/admin/sources', label: 'Sources', icon: 'ph:arrows-in-line-horizontal' },
    { to: '/admin/events', label: 'Events', icon: 'ph:cursor-click-duotone' },
    { to: '/admin/health', label: 'Health', icon: 'ph:heartbeat-duotone' },
]
</script>

<template>
    <div class="w-full min-h-screen flex flex-col md:flex-row">
        <aside class="md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-base-300 bg-base-200">
            <div class="p-4 flex md:flex-col gap-1 md:sticky md:top-16 overflow-x-auto">
                <NuxtLink v-for="link in links" :key="link.to" :to="link.to" class="btn btn-ghost justify-start gap-2 shrink-0"
                    :class="{ 'btn-active': route.path === link.to }">
                    <Icon :name="link.icon" size="18" />
                    {{ link.label }}
                </NuxtLink>
            </div>
        </aside>
        <main class="flex-1 p-4 md:p-6 max-w-6xl">
            <slot />
        </main>
    </div>
</template>
