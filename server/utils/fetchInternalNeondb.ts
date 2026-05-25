interface InternalFetchOptions {
    method?: 'get' | 'GET' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'connect' | 'CONNECT' | 'options' | 'OPTIONS' | 'trace' | 'TRACE'
    body?: BodyInit | Record<string, any> | null
    headers?: Record<string, string>
}

export async function fetchInternalNeondb<T>(
    event: Parameters<typeof useRuntimeConfig>[0],
    path: string,
    options: InternalFetchOptions = {}
): Promise<T> {
    const config = useRuntimeConfig(event)
    if (!config.apiKey) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal API key is not configured',
        })
    }

    return await $fetch(`/api/neondb/stats/${path}`, {
        ...options,
        headers: {
            ...(options.headers ?? {}),
            'x-api-key': config.apiKey,
        },
    }) as T
}
