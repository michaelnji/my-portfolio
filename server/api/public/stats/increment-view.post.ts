import { fetchInternalNeondb } from '~/server/utils/fetchInternalNeondb'

export default defineEventHandler(async (event) => {
    const body = await readBody<{ id: string }>(event)
    return await fetchInternalNeondb(event, 'increment-view', {
        method: 'POST',
        body,
    })
})
