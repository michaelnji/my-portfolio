import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'

/**
 * Manual registration instead of an official Nuxt module — there isn't one
 * that's a clean fit here, and this project's admin queries are all
 * client-triggered anyway (no SSR data-fetching to hydrate), so the simple
 * path is: install the plugin universally so useQuery() never crashes
 * during SSR component setup, but keep every query disabled server-side via
 * the `enabled` default below so nothing actually fetches (and 401s on
 * missing cookies) before hydration.
 */
export default defineNuxtPlugin((nuxtApp) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60_000,
                refetchOnWindowFocus: true,
                enabled: import.meta.client,
            },
        },
    })

    nuxtApp.vueApp.use(VueQueryPlugin, { queryClient })
})
