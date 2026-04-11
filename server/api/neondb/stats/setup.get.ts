
import { createKysely } from "@vercel/postgres-kysely";
import { sql } from 'kysely';
import { sendServerResponse } from 'nexus-req';
import type { Database, Post } from "../../../types/index.types";


export default defineEventHandler(async (event) => {

    try {
        const config = useRuntimeConfig()
        const db = createKysely<Database>({
            connectionString: config.postgresUrl,
        });

        await sql`
            CREATE TABLE IF NOT EXISTS rate_limits (
                id SERIAL PRIMARY KEY,
                resource_type VARCHAR(10) NOT NULL,
                post_id VARCHAR NOT NULL,
                user_hash VARCHAR(64) NOT NULL,
                field VARCHAR(10) NOT NULL DEFAULT '',
                date DATE NOT NULL DEFAULT CURRENT_DATE,
                UNIQUE (resource_type, post_id, user_hash, field, date)
            )
        `.execute(db)

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
