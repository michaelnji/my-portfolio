<script lang="ts" setup>
import { defaultSiteSettings } from '~/data/siteSettings'

definePageMeta({
    layout: 'home'
})

const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))
const isFlagSprint = computed(() => slug.value === 'flag-sprint')

const {
    TOTAL_QUESTIONS,
    QUESTION_SECONDS,
    status,
    currentIndex,
    score,
    selectedAnswer,
    timeLeft,
    bestScore,
    errorMessage,
    timedOut,
    currentQuestion,
    progressLabel,
    timerPercent,
    canGoNext,
    optionClass,
    handleSelectAnswer,
    startGameFromUI,
    retryFromUI,
    playAgainFromUI,
    goToNextFromUI,
} = useFlagSprintGame()

const flagLoadError = ref(false)
const flagImageSrc = computed(() => {
    if (!currentQuestion.value) return ''
    if (flagLoadError.value) return '/images/flag-placeholder.svg'
    return currentQuestion.value.flag
})

const handleFlagError = () => {
    flagLoadError.value = true
}

watch(() => currentQuestion.value?.flag, () => {
    flagLoadError.value = false
})

const canonicalUrl = computed(() => `${defaultSiteSettings.siteUrl}/games/${slug.value}`)

useHead(computed(() => ({
    htmlAttrs: { lang: 'en-US' },
    link: [{
        rel: 'canonical',
        href: canonicalUrl.value,
    }]
})))

useSeoMeta(computed(() => ({
    title: isFlagSprint.value ? 'FlagSprint' : 'Game Not Found',
    titleTemplate: '%s',
    description: isFlagSprint.value
        ? 'Guess the country from the flag in 10 quick rounds.'
        : 'Requested game does not exist.',
    ogType: 'website',
    ogUrl: canonicalUrl.value,
    ogLocale: 'en_US',
    ogSiteName: defaultSiteSettings.siteName,
    twitterTitle: isFlagSprint.value ? 'FlagSprint - Michael Nji' : 'Game Not Found',
    twitterDescription: isFlagSprint.value
        ? 'Guess the country from the flag in 10 quick rounds.'
        : 'Requested game does not exist.',
    twitterCard: 'summary_large_image',
})))
</script>

<template>
    <div class="w-full px-3 md:px-5">
        <div class="container max-w-7xl mx-auto h-[calc(100dvh-10.5rem)] md:h-[calc(100dvh-11rem)] flex flex-col">
            <FlagSprintTopBar
                :is-flag-sprint="isFlagSprint"
                :best-score="bestScore"
                :total-questions="TOTAL_QUESTIONS"
            />

            <FlagSprintNotFound v-if="!isFlagSprint" />

            <div v-else-if="status === 'playing' || status === 'feedback'" class="flex-1 min-h-0 py-2 flex flex-col">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div class="px-2 py-1.5 border border-base-300/70 bg-base-200/40">
                        <p class="text-[11px] uppercase tracking-wider opacity-70">Question</p>
                        <p class="font-semibold">{{ progressLabel }}</p>
                    </div>
                    <div class="px-2 py-1.5 border border-base-300/70 bg-base-200/40">
                        <p class="text-[11px] uppercase tracking-wider opacity-70">Score</p>
                        <p class="font-semibold">{{ score }}/{{ TOTAL_QUESTIONS }}</p>
                    </div>
                    <div class="px-2 py-1.5 border border-base-300/70 bg-base-200/40">
                        <p class="text-[11px] uppercase tracking-wider opacity-70">Best</p>
                        <p class="font-semibold">{{ bestScore }}/{{ TOTAL_QUESTIONS }}</p>
                    </div>
                    <div class="px-2 py-1.5 border border-base-300/70 bg-base-200/40">
                        <p class="text-[11px] uppercase tracking-wider opacity-70">Timer</p>
                        <p :class="{ 'text-warning': timeLeft <= 5 }" class="font-semibold font-mono">
                            {{ timeLeft }}s
                        </p>
                    </div>
                </div>

                <progress class="progress progress-primary w-full mt-1.5 rounded-none" :value="timerPercent" max="100"></progress>

                <div class="mt-2 flex-1 min-h-0 grid lg:grid-cols-[1.45fr_1fr] gap-3">
                    <section class="min-h-0 border border-base-300/60 bg-gradient-to-b from-base-200/80 to-base-100/30 p-3 md:p-4 flex flex-col">
                        <div class="flex items-baseline justify-between gap-3">
                            <h1 class="font-display text-2xl md:text-3xl text-primary">
                                FlagSprint
                            </h1>
                            <p class="text-content-secondary text-xs md:text-sm uppercase tracking-widest">
                                Guess the country
                            </p>
                        </div>
                        <div class="mt-2 md:mt-3 flex-1 min-h-0 bg-base-100/60 border border-base-300/60 p-2 md:p-3">
                            <img
                                v-if="currentQuestion"
                                :src="flagImageSrc"
                                alt="Country flag to guess"
                                class="w-full h-full object-contain"
                                @error="handleFlagError"
                            >
                        </div>
                    </section>

                    <section class="min-h-0 border border-base-300/60 bg-base-200/50 p-3 md:p-4 flex flex-col">
                        <p class="text-content-secondary text-xs md:text-sm uppercase tracking-widest mb-2">
                            Options
                        </p>
                        <div class="grid grid-cols-2 grid-rows-2 gap-2 h-[6.25rem] md:h-[7rem] content-start">
                            <button
                                v-for="option in currentQuestion?.variants ?? []"
                                :key="option"
                                type="button"
                                :disabled="status !== 'playing'"
                                :class="optionClass(option)"
                                @click="handleSelectAnswer(option)"
                            >
                                {{ option }}
                            </button>
                        </div>
                    </section>
                </div>

                <div v-if="status === 'feedback'" class="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-base-300/60 pt-2">
                    <div v-if="timedOut" class="text-warning flex items-center gap-2">
                        <Icon name="ph:warning-fill" size="20" />
                        Time up. Next question...
                    </div>
                    <div v-else class="text-content-secondary font-normal-weight">
                        <span v-if="selectedAnswer === currentQuestion?.answer" class="text-success font-medium">
                            Correct.
                        </span>
                        <span v-else class="text-error font-medium">
                            Wrong.
                        </span>
                        Correct answer: <span class="font-semibold text-base-content">{{ currentQuestion?.answer }}</span>
                    </div>

                    <button
                        v-if="canGoNext"
                        type="button"
                        class="btn btn-primary rounded-none"
                        @click="goToNextFromUI"
                    >
                        {{ currentIndex >= TOTAL_QUESTIONS - 1 ? 'Finish' : 'Next' }}
                    </button>
                </div>
            </div>

            <div v-else-if="status === 'idle'" class="flex-1 min-h-0 grid lg:grid-cols-[1.2fr_1fr] gap-6 md:gap-8 items-center py-4">
                <section>
                    <h1 class="font-display text-5xl md:text-6xl leading-none">
                        FlagSprint
                    </h1>
                    <p class="mt-4 text-content-secondary max-w-xl font-normal-weight text-base md:text-lg">
                        Guess the country from each flag before the timer runs out.
                    </p>
                    <p class="mt-6 font-mono text-sm text-content-secondary">
                        {{ TOTAL_QUESTIONS }} questions · 4 options each · {{ QUESTION_SECONDS }}s per round
                    </p>
                </section>

                <section class="w-full">
                    <button
                        @click="startGameFromUI"
                        class="btn btn-primary btn-lg w-full"
                        type="button"
                    >
                        Start FlagSprint
                    </button>
                </section>
            </div>

            <div v-else-if="status === 'loading'" class="flex-1 grid place-items-center">
                <div class="flex items-center gap-4">
                    <div class="loader"></div>
                    <p class="text-content-secondary">Loading questions...</p>
                </div>
            </div>

            <div v-else-if="status === 'error'" class="flex-1 grid place-items-center">
                <div class="text-center">
                    <p class="text-error font-medium text-lg">Could not start FlagSprint.</p>
                    <p class="mt-2 text-content-secondary">{{ errorMessage }}</p>
                    <div class="mt-5 flex items-center justify-center gap-3">
                        <button
                            @click="retryFromUI"
                            type="button"
                            class="btn btn-primary"
                        >
                            Retry
                        </button>
                        <NuxtLink to="/games" class="btn btn-ghost">
                            Back
                        </NuxtLink>
                    </div>
                </div>
            </div>

            <div v-else-if="status === 'finished'" class="flex-1 grid place-items-center">
                <div class="text-center">
                    <div class="size-16 mx-auto text-primary grid place-items-center">
                        <Icon name="solar:verified-check-bold-duotone" size="34" />
                    </div>
                    <h2 class="mt-4 text-4xl md:text-5xl font-display font-semibold">
                        Session complete
                    </h2>
                    <p class="mt-3 text-content-secondary font-normal-weight text-lg">
                        Score: <span class="font-semibold text-base-content">{{ score }}</span>/{{ TOTAL_QUESTIONS }}
                    </p>
                    <p class="mt-1 text-content-secondary font-normal-weight">
                        Best: <span class="font-semibold text-base-content">{{ bestScore }}</span>/{{ TOTAL_QUESTIONS }}
                    </p>
                    <div class="mt-7 flex flex-wrap items-center justify-center gap-3">
                        <button type="button" class="btn btn-primary" @click="playAgainFromUI">
                            Play Again
                        </button>
                        <NuxtLink to="/games" class="btn btn-ghost">
                            Back to Games
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
