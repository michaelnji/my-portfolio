import { fetchInternalNeondb } from '~/server/utils/fetchInternalNeondb'

export default defineEventHandler(async (event) => {
    const body = await readBody<{ id: string; data: Record<string, unknown> }>(event)
    return await fetchInternalNeondb(event, 'update-by-id', {
        method: 'POST',
        body,
    })
})
