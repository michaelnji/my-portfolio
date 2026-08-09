interface InternalFetchOptions {
    method?: 'get' | 'GET' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'connect' | 'CONNECT' | 'options' | 'OPTIONS' | 'trace' | 'TRACE'
    body?: BodyInit | Record<string, any> | null
    headers?: Record<string, string>
}

export async function fetchInternalNeondb<T>(
    event: Parameters<typeof useRuntimeConfig>[0] & Parameters<typeof getRequestHeader>[0],
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

    // This is a server-to-server hop: the internal handler otherwise sees
    // this fetch's own headers, not the original visitor's — forward the
    // real client identity so rate-limit fingerprinting stays accurate.
    const forwardedFor = getRequestHeader(event, 'x-vercel-forwarded-for')
        ?? getRequestHeader(event, 'x-forwarded-for')
        ?? getRequestHeader(event, 'x-real-ip')
        ?? getRequestHeader(event, 'cf-connecting-ip')
    const userAgent = getRequestHeader(event, 'user-agent')

    return await $fetch(`/api/neondb/stats/${path}`, {
        ...options,
        headers: {
            ...(options.headers ?? {}),
            'x-api-key': config.apiKey,
            ...(forwardedFor ? { 'x-forwarded-for': forwardedFor } : {}),
            ...(userAgent ? { 'user-agent': userAgent } : {}),
        },
    }) as T
}
