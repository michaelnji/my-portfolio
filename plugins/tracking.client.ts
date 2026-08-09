import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals'

/**
 * First-party site analytics. Fires from the client only (no SSR double
 * counting) into /api/track/*. The server independently no-ops these for
 * bots and for the site owner's own admin session, so nothing here needs to
 * know about that — it just reports what happened.
 */
export default defineNuxtPlugin(() => {
    let currentId: number | null = null
    let startedAt = 0
    let maxScroll = 0
    let lastPath: string | null = null

    function beacon(url: string, payload: unknown) {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
        navigator.sendBeacon(url, blob)
    }

    function trackEvent(type: string, payload?: Record<string, unknown>) {
        beacon('/api/track/event', { type, path: window.location.pathname, payload })
    }

    function currentScrollPercent(): number {
        const doc = document.documentElement
        const scrolled = window.scrollY + window.innerHeight
        const total = doc.scrollHeight
        if (total <= 0) return 100
        return Math.min(100, Math.round((scrolled / total) * 100))
    }

    function flushCurrentPageview() {
        if (currentId === null) return
        const durationSeconds = Math.round((Date.now() - startedAt) / 1000)
        beacon('/api/track/pageview-update', {
            id: currentId,
            duration_seconds: durationSeconds,
            scroll_depth: maxScroll,
        })
        currentId = null
    }

    async function sendPageview(path: string) {
        const url = new URL(window.location.href)
        try {
            const res = await $fetch<{ data: { id: number | null } }>('/api/track/pageview', {
                method: 'POST',
                body: {
                    path,
                    referrer: lastPath ?? document.referrer ?? '',
                    utm_source: url.searchParams.get('utm_source') ?? undefined,
                    utm_medium: url.searchParams.get('utm_medium') ?? undefined,
                    utm_campaign: url.searchParams.get('utm_campaign') ?? undefined,
                    screen_width: window.screen.width,
                    screen_height: window.screen.height,
                    language: navigator.language,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
            })
            currentId = res?.data?.id ?? null
        } catch {
            currentId = null
        }
        startedAt = Date.now()
        maxScroll = 0
        lastPath = path
    }

    // Route changes: flush engagement for the page being left, then report
    // the new one. beforeEach/afterEach pair keeps 'from' and 'to' straight.
    const router = useRouter()
    router.beforeEach((_to, from) => {
        if (from.fullPath) flushCurrentPageview()
        return true
    })
    router.afterEach((to) => {
        if (to.matched.length === 0) {
            trackEvent('not_found', { path: to.fullPath })
            return
        }
        sendPageview(to.fullPath)
    })

    // First load isn't covered by afterEach's "from" transition.
    sendPageview(router.currentRoute.value.fullPath)

    // Scroll depth, throttled to one measurement per frame.
    let scrollScheduled = false
    window.addEventListener(
        'scroll',
        () => {
            if (scrollScheduled) return
            scrollScheduled = true
            requestAnimationFrame(() => {
                maxScroll = Math.max(maxScroll, currentScrollPercent())
                scrollScheduled = false
            })
        },
        { passive: true }
    )

    // Tab close / app backgrounded — pagehide survives bfcache navigation,
    // unlike beforeunload.
    window.addEventListener('pagehide', flushCurrentPageview)
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') flushCurrentPageview()
    })

    // Outbound link clicks.
    document.addEventListener(
        'click',
        (e) => {
            const anchor = (e.target as HTMLElement)?.closest?.('a[href]') as HTMLAnchorElement | null
            if (!anchor) return
            let target: URL
            try {
                target = new URL(anchor.href, window.location.href)
            } catch {
                return
            }
            if (target.hostname === window.location.hostname) return
            trackEvent('outbound_click', { href: target.href })
        },
        true
    )

    // Client-side error visibility.
    window.addEventListener('error', (e) => {
        trackEvent('js_error', { message: e.message?.slice(0, 500) })
    })
    window.addEventListener('unhandledrejection', (e) => {
        const message = e.reason instanceof Error ? e.reason.message : String(e.reason)
        trackEvent('js_error', { message: message?.slice(0, 500) })
    })

    // Core Web Vitals.
    const reportVital = (metric: { name: string; value: number }) => {
        beacon('/api/track/vitals', {
            path: window.location.pathname,
            metric: metric.name,
            value: metric.value,
        })
    }
    onLCP(reportVital)
    onCLS(reportVital)
    onINP(reportVital)
    onFCP(reportVital)
    onTTFB(reportVital)

    return {
        provide: { trackEvent },
    }
})
