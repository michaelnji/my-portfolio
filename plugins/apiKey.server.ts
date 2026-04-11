export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    useState<string>('apiKey', () => config.apiKey)
})
