<script lang="ts" setup>
import { useSound } from '@vueuse/sound'
import type { ServerResponse, StatusCodes } from 'nexus-req'
import clickSound from '../../assets/sounds/pop-click.mp3'
import errorSound from '../../assets/sounds/error-pop.mp3'
import successSound from '../../assets/sounds/success.mp3'
import { defaultSiteSettings } from '~/data/siteSettings'

interface FlagSprintQuestion {
    flag: string
    variants: string[]
    answer: string
}

interface CountryQuizResponse {
    questions: FlagSprintQuestion[]
}

type GameStatus = 'idle' | 'loading' | 'playing' | 'feedback' | 'finished' | 'error'

const TOTAL_QUESTIONS = 10
const QUESTION_SECONDS = 15
const AUTO_ADVANCE_DELAY_MS = 1200
const FLAG_SPRINT_BEST_SCORE_KEY = 'games.flagSprint.bestScore'

definePageMeta({
    layout: 'home'
})

const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))
const isFlagSprint = computed(() => slug.value === 'flag-sprint')

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

const playSounds = usePlaySound()
const { play: playClick } = useSound(clickSound, { volume: 0.65 })
const { play: playSuccess } = useSound(successSound, { volume: 0.65 })
const { play: playError } = useSound(errorSound, { volume: 0.65 })

const status = ref<GameStatus>('idle')
const questions = ref<FlagSprintQuestion[]>([])
const currentIndex = ref(0)
const score = ref(0)
const selectedAnswer = ref<string | null>(null)
const isLocked = ref(false)
const timeLeft = ref(QUESTION_SECONDS)
const bestScore = ref(0)
const errorMessage = ref('Unable to load game right now.')
const timedOut = ref(false)

const currentQuestion = computed(() => questions.value[currentIndex.value] ?? null)
const progressLabel = computed(() => `${Math.min(currentIndex.value + 1, TOTAL_QUESTIONS)}/${TOTAL_QUESTIONS}`)
const timerPercent = computed(() => (timeLeft.value / QUESTION_SECONDS) * 100)
const canGoNext = computed(() => status.value === 'feedback' && !timedOut.value)

let timerId: ReturnType<typeof setInterval> | null = null
let autoAdvanceId: ReturnType<typeof setTimeout> | null = null

const playIfEnabled = (kind: 'click' | 'success' | 'error') => {
    if (!playSounds.value) return
    if (kind === 'click') playClick()
    if (kind === 'success') playSuccess()
    if (kind === 'error') playError()
}

const clearTimers = () => {
    if (timerId) {
        clearInterval(timerId)
        timerId = null
    }
    if (autoAdvanceId) {
        clearTimeout(autoAdvanceId)
        autoAdvanceId = null
    }
}

const loadBestScore = () => {
    if (!import.meta.client) return
    try {
        const value = localStorage.getItem(FLAG_SPRINT_BEST_SCORE_KEY)
        const parsed = Number(value)
        if (!Number.isNaN(parsed) && parsed >= 0) {
            bestScore.value = parsed
        }
    } catch {
        bestScore.value = 0
    }
}

const persistBestScore = () => {
    if (!import.meta.client) return
    try {
        localStorage.setItem(FLAG_SPRINT_BEST_SCORE_KEY, String(bestScore.value))
    } catch {
        // Ignore storage failures
    }
}

const fetchQuestions = async () => {
    const response = await $fetch<ServerResponse<StatusCodes, CountryQuizResponse>>('/api/games/countries/country-quiz', {
        retry: 0,
        retryDelay: 0,
    })

    if (!response.ok || !response.data?.questions?.length) {
        throw new Error(response.message || 'Failed to load quiz questions')
    }

    questions.value = response.data.questions.slice(0, TOTAL_QUESTIONS)
}

const startTimer = () => {
    if (status.value !== 'playing') return
    timeLeft.value = QUESTION_SECONDS
    timerId = setInterval(() => {
        if (timeLeft.value <= 1) {
            timeLeft.value = 0
            if (timerId) {
                clearInterval(timerId)
                timerId = null
            }
            handleTimeout()
            return
        }

        timeLeft.value -= 1
    }, 1000)
}

const finishGame = () => {
    clearTimers()
    status.value = 'finished'
    isLocked.value = true
    if (score.value > bestScore.value) {
        bestScore.value = score.value
        persistBestScore()
    }
}

const goToNextQuestion = () => {
    if (currentIndex.value >= questions.value.length - 1) {
        finishGame()
        return
    }

    currentIndex.value += 1
    selectedAnswer.value = null
    isLocked.value = false
    timedOut.value = false
    status.value = 'playing'
    startTimer()
}

const handleTimeout = () => {
    if (!currentQuestion.value || isLocked.value) return

    timedOut.value = true
    selectedAnswer.value = null
    isLocked.value = true
    status.value = 'feedback'
    playIfEnabled('error')

    autoAdvanceId = setTimeout(() => {
        goToNextQuestion()
    }, AUTO_ADVANCE_DELAY_MS)
}

const handleSelectAnswer = (option: string) => {
    if (!currentQuestion.value || status.value !== 'playing' || isLocked.value) return

    clearTimers()
    timedOut.value = false
    selectedAnswer.value = option
    isLocked.value = true
    status.value = 'feedback'

    if (option === currentQuestion.value.answer) {
        score.value += 1
        playIfEnabled('success')
    } else {
        playIfEnabled('error')
    }
}

const startGame = async () => {
    if (!isFlagSprint.value) return

    clearTimers()
    status.value = 'loading'
    errorMessage.value = ''
    score.value = 0
    currentIndex.value = 0
    selectedAnswer.value = null
    isLocked.value = false
    timedOut.value = false

    try {
        await fetchQuestions()
        status.value = 'playing'
        startTimer()
    } catch (error) {
        status.value = 'error'
        errorMessage.value = error instanceof Error ? error.message : 'Unable to load game right now.'
    }
}

const optionClass = (option: string) => {
    const base = 'w-full h-full min-h-0 px-2 rounded-none border font-mono text-xs md:text-sm text-center leading-none overflow-hidden text-ellipsis whitespace-nowrap transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

    if (!currentQuestion.value) return `${base} border-base-300 bg-base-200`
    if (!isLocked.value) return `${base} border-info/40 bg-info/10 text-info hover:bg-info/20 hover:border-info`

    if (option === currentQuestion.value.answer) {
        return `${base} border-success bg-success/20 text-success`
    }

    if (selectedAnswer.value === option && option !== currentQuestion.value.answer) {
        return `${base} border-error bg-error/20 text-error`
    }

    return `${base} border-base-300 bg-base-300/40 text-content-secondary opacity-80`
}

const handlePlayAgain = async () => {
    playIfEnabled('click')
    await startGame()
}

onMounted(() => {
    if (isFlagSprint.value) loadBestScore()
})

onBeforeUnmount(() => {
    clearTimers()
})
</script>

<template>
    <div class="w-full px-3 md:px-5">
        <div class="container max-w-7xl mx-auto h-[calc(100dvh-10.5rem)] md:h-[calc(100dvh-11rem)] flex flex-col">
            <div class="flex items-center justify-between gap-4 py-2 border-b border-base-300/60">
                <NuxtLink to="/games" class="inline-flex items-center gap-2 text-sm text-content-secondary hover:text-primary">
                    <Icon name="ph:house-simple-duotone" size="18" />
                    Back to Games
                </NuxtLink>
                <div v-if="isFlagSprint" class="font-mono text-xs md:text-sm text-content-secondary">
                    Best <span class="text-base-content">{{ bestScore }}/{{ TOTAL_QUESTIONS }}</span>
                </div>
            </div>

            <div v-if="!isFlagSprint" class="flex-1 grid place-items-center text-center">
                <div>
                    <div class="size-14 mx-auto text-warning grid place-items-center">
                        <Icon name="ph:warning-fill" size="32" />
                    </div>
                    <h1 class="mt-4 text-3xl font-display font-semibold">Game not found</h1>
                    <p class="mt-3 text-content-secondary font-normal-weight">
                        This game slug is not available yet.
                    </p>
                    <NuxtLink to="/games" class="btn btn-primary mt-6">
                        Return to dashboard
                    </NuxtLink>
                </div>
            </div>

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
                                :src="currentQuestion.flag"
                                alt="Country flag to guess"
                                class="w-full h-full object-contain"
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
                        @click="() => {
                            playIfEnabled('click')
                            goToNextQuestion()
                        }"
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
                        @click="async () => {
                            playIfEnabled('click')
                            await startGame()
                        }"
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
                            @click="async () => {
                                playIfEnabled('click')
                                await startGame()
                            }"
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
                        Run complete
                    </h2>
                    <p class="mt-3 text-content-secondary font-normal-weight text-lg">
                        Score: <span class="font-semibold text-base-content">{{ score }}</span>/{{ TOTAL_QUESTIONS }}
                    </p>
                    <p class="mt-1 text-content-secondary font-normal-weight">
                        Best: <span class="font-semibold text-base-content">{{ bestScore }}</span>/{{ TOTAL_QUESTIONS }}
                    </p>
                    <div class="mt-7 flex flex-wrap items-center justify-center gap-3">
                        <button type="button" class="btn btn-primary" @click="handlePlayAgain">
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
