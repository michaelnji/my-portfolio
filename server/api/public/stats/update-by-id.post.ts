import { fetchInternalNeondb } from '~/server/utils/fetchInternalNeondb'

export default defineEventHandler(async (event) => {
    const body = await readBody<{ id: string; data: Record<string, unknown> }>(event)
    if (!body || typeof body.id !== 'string' || !body.id.trim()) {
        throw createError({ statusCode: 400, statusMessage: 'Post ID is required' })
    }
    if (!body.data || typeof body.data !== 'object' || Array.isArray(body.data)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
    }

    return await fetchInternalNeondb(event, 'update-by-id', {
        method: 'POST',
        body: { id: body.id.trim(), data: body.data },
        headers: { 'x-anon-id': getOrSetAnonId(event) },
    })
})
