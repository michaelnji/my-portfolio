
import { createKysely } from "@vercel/postgres-kysely";
import { sendServerResponse } from 'nexus-req';
import type { Database, Post } from "../../../types/index.types";


export default defineEventHandler(async (event) => {

    try {
        const config = useRuntimeConfig()
        const db = createKysely<Database>({
            connectionString: config.postgresUrl,
        });
        const query = `*[_type == "post"]{
        _id
        }`
        const sanity = useSanity()
        const posts: Post[] = await sanity.fetch(query)
        for (const post of posts) {
            const resp = await db
                .selectFrom("stats")
                .selectAll()
                .where("postId", "=", post._id)
                .executeTakeFirst();

            if (!resp) {
                await db
                    .insertInto("stats")
                    .values({
                        postId: post._id,
                        views: 0,
                        hearts: 0,
                        dislikes: 0,
                        stars: 0,
                        claps: 0

                    })
                    .returningAll()
                    .executeTakeFirstOrThrow();
            }
        }
        return sendServerResponse(200, 'success', null)
    } catch (error) {
        console.log(error)
        if (error instanceof Error) {
            setResponseStatus(event, 500, error.message.includes('fetch') || error.message.includes('getaddrinfo') ? 'Fetch failed' : error.message)
            return sendServerResponse(500, error.message.includes('fetch') || error.message.includes('getaddrinfo') ? 'Fetch failed' : error.message)
        }
    }
})
