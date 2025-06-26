
import { sendServerResponse } from 'nexus-req'
import type { Post } from '~/server/types/index.types'


export default defineEventHandler(async (event) => {

  try {
    const query = `*[_type == "post"]{
        "imgUrl": mainImage.asset->url,
         body,
         "tags": categories[]->{
        title
      },
      "slug":slug.current,
      title,
      excerpt,
      publishedAt,
      _updatedAt,
      "authorInfo": author-> {
        name,
        "imageUrl": image.asset->url,
      },

        }`
    const sanity = useSanity()
    const resp: Post[] = await sanity.fetch(query)
    setResponseStatus(event, 200)
    return sendServerResponse(200, 'success', resp)
  } catch (error) {
    if (error instanceof Error) {
      setResponseStatus(event, 500, error.message.includes('fetch') || error.message.includes('getaddrinfo') ? 'Fetch failed' : error.message)
      return sendServerResponse(500, error.message.includes('fetch') || error.message.includes('getaddrinfo') ? 'Fetch failed' : error.message)
    }
  }
})
