import type { H3Event } from 'h3'
import type { Kysely } from 'kysely'
import type { Database } from '../types/index.types'

/** Records a blog like/view rate-limit hit as an event (skipped for the site owner's own session). */
export async function trackRateLimitHit(
    event: H3Event,
    db: Kysely<Database>,
    resourceType: 'like' | 'view',
    postId: string,
    field: string
) {
    if (hasAdminCookie(event)) return
    const anonId = getOrSetAnonId(event)
    await db
        .insertInto('events')
        .values({
            type: 'rate_limited',
            path: null,
            anon_id: anonId,
            payload: JSON.stringify({ resource_type: resourceType, post_id: postId, field }),
        })
        .execute()
}
