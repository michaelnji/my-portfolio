import { fetchInternalNeondb } from '~/server/utils/fetchInternalNeondb'

export default defineEventHandler(async (event) => {
    return await fetchInternalNeondb(event, 'get-all', {
        method: 'GET',
    })
})
