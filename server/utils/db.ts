import { createKysely } from '@vercel/postgres-kysely'
import type { Database } from '../types/index.types'

/**
 * Shared Kysely instance factory. Every route opens its own client (matches
 * existing convention in server/api/neondb/*) — this just avoids repeating
 * the connectionString wiring in every new admin/tracking endpoint.
 */
export function getDb() {
    const config = useRuntimeConfig()
    return createKysely<Database>({
        connectionString: config.postgresUrl,
    })
}
