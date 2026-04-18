<script lang="ts" setup>
import click from '../../assets/sounds/button-click.mp3'
import { defaultSiteSettings } from '~/data/siteSettings'

definePageMeta({
    layout: 'home'
})

useHead({
    htmlAttrs: { lang: 'en-US' },
    link: [{
        rel: 'canonical',
        href: `${defaultSiteSettings.siteUrl}/games`,
    }]
})

useSeoMeta({
    title: 'Games',
    titleTemplate: '%s',
    description: 'Play mini games built by Michael Nji.',
    ogType: 'website',
    ogUrl: `${defaultSiteSettings.siteUrl}/games`,
    ogLocale: 'en_US',
    ogSiteName: defaultSiteSettings.siteName,
    twitterTitle: 'Michael Nji - Games',
    twitterDescription: 'Play mini games built by Michael Nji.',
    twitterCard: 'summary_large_image',
})

const playSounds = usePlaySound()
const { play } = useSound(click, { volume: 0.7 })

const prefersReducedMotion = () => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const playSound = () => {
    if (playSounds.value && !prefersReducedMotion()) play()
}

const gameCards = [
    {
        id: 'flag-sprint',
        title: 'FlagSprint',
        subtitle: 'Guess country from flag',
        description: '10 rounds. 4 choices each. Beat your best score.',
        route: '/games/flag-sprint',
        status: 'Live',
        icon: 'solar:verified-check-bold-duotone',
        active: true,
    },
    {
        id: 'coming-soon-1',
        title: 'Coming Soon',
        subtitle: 'New game',
        description: 'Another mini challenge is on the way.',
        route: '#',
        status: 'Locked',
        icon: 'solar:star-fall-minimalistic-bold-duotone',
        active: false,
    },
    {
        id: 'coming-soon-2',
        title: 'Coming Soon',
        subtitle: 'New game',
        description: 'More games will be added here.',
        route: '#',
        status: 'Locked',
        icon: 'solar:star-fall-minimalistic-bold-duotone',
        active: false,
    },
] as const
</script>

<template>
    <div class="w-full px-4 md:px-6">
        <div class="container max-w-7xl mx-auto min-h-[calc(100dvh-10.5rem)] flex flex-col py-4 md:py-6">
            <div class="mb-6 md:mb-8">
                <h1 class="font-display text-5xl md:text-6xl font-semibold">
                    Game Arcade
                </h1>
                <p class="mt-3 text-content-secondary text-base md:text-lg font-normal-weight">
                    Pick game. Jump in.
                </p>
            </div>

            <div class="border-y border-base-300/70 divide-y divide-base-300/70">
                <template v-for="game in gameCards" :key="game.id">
                    <NuxtLink
                        v-if="game.active"
                        @click="playSound"
                        :to="game.route"
                        class="group w-full px-2 py-4 md:px-4 md:py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-colors duration-200 hover:bg-base-200/40 hover:text-primary"
                    >
                        <div class="flex items-start gap-4 min-w-0">
                            <div class="size-11 md:size-12 rounded-full bg-primary/10 text-primary grid place-items-center shrink-0">
                                <Icon :name="game.icon" size="24" />
                            </div>
                            <div class="min-w-0">
                                <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
                                    <h2 class="text-2xl md:text-3xl font-display leading-none">
                                        {{ game.title }}
                                    </h2>
                                    <span class="font-mono text-xs md:text-sm border border-primary/60 text-primary px-2 py-0.5">
                                        {{ game.status }}
                                    </span>
                                </div>
                                <p class="mt-1 text-sm opacity-80">{{ game.subtitle }}</p>
                                <p class="mt-2 text-content-secondary font-normal-weight">{{ game.description }}</p>
                            </div>
                        </div>

                        <div class="text-sm font-medium text-primary flex items-center gap-2 md:shrink-0">
                            Play
                            <Icon name="ph:share" size="16" />
                        </div>
                    </NuxtLink>

                    <button
                        v-else
                        disabled
                        type="button"
                        class="w-full px-2 py-4 md:px-4 md:py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 opacity-70 cursor-not-allowed text-left"
                    >
                        <div class="flex items-start gap-4 min-w-0">
                            <div class="size-11 md:size-12 rounded-full bg-base-300/70 text-base-content/70 grid place-items-center shrink-0">
                                <Icon :name="game.icon" size="24" />
                            </div>
                            <div class="min-w-0">
                                <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
                                    <h2 class="text-2xl md:text-3xl font-display leading-none">
                                        {{ game.title }}
                                    </h2>
                                    <span class="font-mono text-xs md:text-sm border border-base-content/30 px-2 py-0.5">
                                        {{ game.status }}
                                    </span>
                                </div>
                                <p class="mt-1 text-sm opacity-80">{{ game.subtitle }}</p>
                                <p class="mt-2 text-content-secondary font-normal-weight">{{ game.description }}</p>
                            </div>
                        </div>
                    </button>
                </template>
            </div>
        </div>
    </div>
</template>
