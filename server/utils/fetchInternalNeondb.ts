interface InternalFetchOptions {
    method?: string
    body?: unknown
    headers?: Record<string, string>
}

export async function fetchInternalNeondb<T>(
    event: Parameters<typeof useRuntimeConfig>[0],
    path: string,
    options: InternalFetchOptions = {}
) {
    const config = useRuntimeConfig(event)
    if (!config.apiKey) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal API key is not configured',
        })
    }

    return await $fetch<T>(`/api/neondb/stats/${path}`, {
        ...options,
        headers: {
            ...(options.headers ?? {}),
            'x-api-key': config.apiKey,
        },
    })
}
