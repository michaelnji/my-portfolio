    <script lang="ts" setup>
    import { useSound } from '@vueuse/sound';
    import { formatDate } from 'date-fns';
    import type { Post } from '~/server/types/index.types';
    import click from '../assets/sounds/button-click.mp3';
    const playSounds = usePlaySound()
    const { play } = useSound(click, {
        volume: 0.7
    })
    const playSound = () => {
        if (playSounds.value) play()
    }
    const props = defineProps<{
        post: Post
    }>()
</script>
<template>
    <NuxtLink @click="playSound" :to="`/blog/${post.slug}`" class="w-full">
        <div
            class="bg-base-200 shadow-xl hover:shadow-primary/10 w-full rounded-box hover:border-primary transition-all group border border-base-300 p-3">
            <div class="mb-2">

                <NuxtImg loading="lazy" :src="$urlFor(post.imgUrl).format('webp').url()" :alt="post.title"
                    :custom="true" class="rounded-box border border-base-300" v-slot="{ src, isLoaded, imgAttrs }">

                    <img height="150" width="300" v-if="isLoaded" v-bind="imgAttrs" :src="src"
                        class="w-full object-cover !h-[150px]">

                    <div class="skeleton p-1  bg-base-300 lg:bg-base-200 w-full h-[150px] rounded-box border border-base-300"
                        v-if="!isLoaded">
                    </div>
                </NuxtImg>
            </div>
            <div class="flex gap-2 items-center my-4">
                <div v-for="(tag, i) in post.tags" :key="i">
                    <span v-if="i < 2"
                        class="!py-1 px-3 rounded-lg bg-base-200  inline-flex shadow-xl  border line-clamp-1 text-sm font-medium capitalize    border-base-content/20 font-mono flex items-center gap-2 ">

                        {{ tag.title.replaceAll('-', ' ') }}
                    </span>
                </div>

            </div>

            <h2 class="font-bold transition-all group-hover:text-primary text-xl">
                {{ post.title }}
            </h2>
            <p class="mt-2 text-sm md:text-base opacity-80 line-clamp-2 text-pretty font-normal-weight">
                {{ post.excerpt }}
            </p>
            <p class="mt-4 flex items-center gap-2">
                <Icon name="solar:calendar-add-line-duotone" />
                <span class="opacity-60">
                    {{ formatDate(post.publishedAt ?? '', 'EEEE, do MMMM yyyy') }}
                </span>
            </p>
        </div>
    </NuxtLink>
</template>
