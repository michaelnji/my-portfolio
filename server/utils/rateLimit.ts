import { sql } from 'kysely'
import type { Kysely } from 'kysely'
import type { Database } from '../types/index.types'

export async function tryRateLimit(
    db: Kysely<Database>,
    postId: string,
    userHash: string,
    type: 'like' | 'view',
    field = ''
): Promise<boolean> {
    // Keep rate_limits table bounded to recent windows only.
    await db
        .deleteFrom('rate_limits')
        .where(sql<boolean>`date < CURRENT_DATE - INTERVAL '30 days'`)
        .execute()

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
