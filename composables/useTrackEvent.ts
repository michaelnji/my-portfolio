export function useTrackEvent() {
    const { $trackEvent } = useNuxtApp()
    return $trackEvent as (type: string, payload?: Record<string, unknown>) => void
}
