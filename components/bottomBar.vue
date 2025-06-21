<script lang="ts" setup>
const route = useRoute()
</script>
<template>
    <div class="fixed bottom-4 left-1/2 -translate-x-1/2 !rounded-full glass !border-none p-3 px-6 flex gap-x-4">

        <NuxtLink to="/">
            <div class="flex items-center rounded-full group transition-all  p-2 md:p-3 gap-x-2 hover:bg-base-100"
                :class="{ '!text-primary-content !bg-primary !rounded-box': route.fullPath === '/' }">

                <Icon name="solar:home-2-bold-duotone" size="28" />
                <p class="text-lg font-mono hidden md:inline">Home</p>
            </div>


        </NuxtLink>
        <NuxtLink to="/projects"
            class="flex items-center rounded-full group transition-all  p-2 md:p-3 gap-x-2 hover:bg-base-100"
            :class="{ '!text-primary-content !bg-primary !rounded-box': route.fullPath === '/projects' }">
            <Icon name="ph:laptop-duotone" size="28" />
            <p class="text-lg font-mono hidden md:inline">Projects</p>


        </NuxtLink>

        <NuxtLink to="/blog"
            class="flex items-center rounded-full group transition-all  p-2 md:p-3 gap-x-2 hover:bg-base-100"
            :class="{ '!text-primary-content !bg-primary !rounded-box': route.fullPath === '/blog' }">
            <Icon name="ph:book-bookmark-duotone" size="28" />

            <p class="text-lg font-mono hidden md:inline">Blog</p>


        </NuxtLink>
        <NuxtLink to="/games"
            class="flex items-center rounded-full group transition-all  p-2 md:p-3 gap-x-2 hover:bg-base-100"
            :class="{ '!text-primary-content !bg-primary !rounded-box': route.fullPath === '/games' }">
            <Icon name="solar:gameboy-line-duotone" size="28" />

            <p class="text-lg font-mono hidden md:inline">Games</p>


        </NuxtLink>



    </div>
</template>