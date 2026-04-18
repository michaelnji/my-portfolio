import { fetchInternalNeondb } from '~/server/utils/fetchInternalNeondb'

export default defineEventHandler(async (event) => {
    const body = await readBody<{ id: string }>(event)
    if (!body || typeof body.id !== 'string' || !body.id.trim()) {
        throw createError({ statusCode: 400, statusMessage: 'Post ID is required' })
    }

    return await fetchInternalNeondb(event, 'increment-view', {
        method: 'POST',
        body: { id: body.id.trim() },
    })
})
