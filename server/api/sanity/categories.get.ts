
import { sendServerResponse } from 'nexus-req'
import type { Post } from '~/server/types/index.types'


export default defineEventHandler(async (event) => {

    try {
        const query = `*[_type == "category"]{title}`
        const sanity = useSanity()
        const resp: { title: string }[] = await sanity.fetch(query)
        setResponseStatus(event, 200)
        return sendServerResponse(200, 'success', resp)
    } catch (error) {
        if (error instanceof Error) {
            setResponseStatus(event, 500, error.message.includes('fetch') || error.message.includes('getaddrinfo') ? 'Fetch failed' : error.message)
            return sendServerResponse(500, error.message.includes('fetch') || error.message.includes('getaddrinfo') ? 'Fetch failed' : error.message)
        }
    }
})
