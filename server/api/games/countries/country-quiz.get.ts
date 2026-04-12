import { sendServerResponse } from 'nexus-req'

interface RawQuestion {
    flag?: unknown
    variants?: unknown
    answer?: unknown
}

interface CountryQuizQuestion {
    flag: string
    variants: string[]
    answer: string
}

interface CountryQuizData {
    questions: CountryQuizQuestion[]
}

const COUNTRY_QUIZ_URL = 'https://shadify.yurace.pro/api/countries/country-quiz'
const QUIZ_VARIANTS = '4'
const QUIZ_AMOUNT = '10'

function asQuestionArray(payload: unknown): RawQuestion[] {
    if (Array.isArray(payload)) return payload

    if (payload && typeof payload === 'object') {
        const record = payload as Record<string, unknown>
        if (Array.isArray(record.data)) return record.data as RawQuestion[]
        if (record.data && typeof record.data === 'object') return [record.data as RawQuestion]
    }

    return []
}

function toNormalizedQuestion(raw: RawQuestion): CountryQuizQuestion | null {
    if (typeof raw.flag !== 'string') return null
    if (typeof raw.answer !== 'string') return null
    if (!Array.isArray(raw.variants)) return null

    const variants = raw.variants
        .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
        .map((value) => value.trim())

    if (variants.length !== 4) return null

    const answer = raw.answer.trim()
    const answerCount = variants.filter((variant) => variant === answer).length
    if (answerCount !== 1) return null

    return {
        flag: raw.flag.trim(),
        variants,
        answer,
    }
}

export default defineEventHandler(async (event) => {
    try {
        const url = new URL(COUNTRY_QUIZ_URL)
        url.searchParams.set('variants', QUIZ_VARIANTS)
        url.searchParams.set('amount', QUIZ_AMOUNT)

        const payload = await $fetch<unknown>(url.toString(), {
            retry: 0,
            retryDelay: 0,
        })

        const rawQuestions = asQuestionArray(payload)
        const normalized = rawQuestions
            .map(toNormalizedQuestion)
            .filter((question): question is CountryQuizQuestion => question !== null)

        if (normalized.length !== 10) {
            throw new Error('Invalid country quiz response shape')
        }

        const data: CountryQuizData = { questions: normalized }
        setResponseStatus(event, 200)
        return sendServerResponse(200, 'success', data)
    } catch (error) {
        const message = 'Failed to load FlagSprint quiz'
        setResponseStatus(event, 500, message)
        return sendServerResponse(500, message)
    }
})
