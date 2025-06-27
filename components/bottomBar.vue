<script lang="ts" setup>
import click from '../assets/sounds/button-click.mp3'
const playSounds = usePlaySound()
const { play } = useSound(click, {
    volume: 0.2
})
const playSound = () => {
    if (playSounds.value) play()
}
const route = useRoute()
</script>
<template>
    <div class="fixed z-1 bottom-4 left-1/2 -translate-x-1/2 !rounded-full glass !border-none p-3 px-6 flex gap-x-4">

        <NuxtLink @click="playSound" to="/">
            <div class="flex items-center  rounded-full group transition-all  p-2 md:p-3 gap-x-2 hover:bg-base-300"
                :class="{ '!text-primary-content !bg-primary !rounded-box': route.fullPath === '/' }">

                <Icon name="ph:house-simple-duotone" size="28" />
                <p class="text-lg  hidden md:inline">Home</p>
            </div>


        </NuxtLink>
        <NuxtLink @click="playSound" to="/projects"
            class="flex items-center  rounded-full group transition-all  p-2 md:p-3 gap-x-2 hover:bg-base-300"
            :class="{ '!text-primary-content !bg-primary !rounded-box': route.fullPath === '/projects' }">
            <Icon name="ph:laptop-duotone" size="28" />
            <p class="text-lg  hidden md:inline">Projects</p>


        </NuxtLink>

        <NuxtLink @click="playSound" to="/blog"
            class="flex items-center  rounded-full group transition-all  p-2 md:p-3 gap-x-2 hover:bg-base-300"
            :class="{ '!text-primary-content !bg-primary !rounded-box': route.fullPath === '/blog' || route.fullPath.includes('/blog') }">
            <Icon name="ph:book-bookmark-duotone" size="28" />

            <p class="text-lg  hidden md:inline">Blog</p>


        </NuxtLink>
        <NuxtLink @click="playSound" to="/games"
            class="flex items-center  rounded-full group transition-all  p-2 md:p-3 gap-x-2 hover:bg-base-300"
            :class="{ '!text-primary-content !bg-primary !rounded-box': route.fullPath === '/games' }">
            <Icon name="solar:gameboy-line-duotone" size="28" />

            <p class="text-lg  hidden md:inline">Games</p>


        </NuxtLink>



    </div>
</template>