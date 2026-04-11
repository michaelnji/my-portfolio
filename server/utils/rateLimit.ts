import type { Kysely } from 'kysely'
import type { Database } from '../types/index.types'

export async function tryRateLimit(
    db: Kysely<Database>,
    postId: string,
    userHash: string,
    type: 'like' | 'view',
    field = ''
): Promise<boolean> {
    const result = await db
        .insertInto('rate_limits')
        .values({
            resource_type: type,
            post_id: postId,
            user_hash: userHash,
            field,
        })
        .onConflict((oc) => oc.doNothing())
        .returningAll()
        .executeTakeFirst()
    // undefined = conflict = already used today
    return result === undefined
}
