import { useSound } from '@vueuse/sound'
import type { ServerResponse, StatusCodes } from 'nexus-req'
import clickSound from '~/assets/sounds/pop-click.mp3'
import errorSound from '~/assets/sounds/error-pop.mp3'
import successSound from '~/assets/sounds/success.mp3'

export interface FlagSprintQuestion {
    flag: string
    variants: string[]
    answer: string
}

interface CountryQuizResponse {
    questions: FlagSprintQuestion[]
}

export type GameStatus = 'idle' | 'loading' | 'playing' | 'feedback' | 'finished' | 'error'

const TOTAL_QUESTIONS = 10
const QUESTION_SECONDS = 15
const AUTO_ADVANCE_DELAY_MS = 1200
const FLAG_SPRINT_BEST_SCORE_KEY = 'games.flagSprint.bestScore'

export const useFlagSprintGame = () => {
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

    const startGameFromUI = async () => {
        playIfEnabled('click')
        await startGame()
    }

    const retryFromUI = async () => {
        playIfEnabled('click')
        await startGame()
    }

    const playAgainFromUI = async () => {
        playIfEnabled('click')
        await startGame()
    }

    const goToNextFromUI = () => {
        playIfEnabled('click')
        goToNextQuestion()
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

    onMounted(() => {
        loadBestScore()
    })

    onBeforeUnmount(() => {
        clearTimers()
    })

    return {
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
    }
}
