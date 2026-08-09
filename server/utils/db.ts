import { createKysely } from '@vercel/postgres-kysely'
import type { Database } from '../types/index.types'

/**
 * Shared, memoized Kysely instance. createKysely() opens a real pg.Pool
 * (TCP+TLS to Neon) — calling it fresh per request (the old behavior here)
 * meant every admin/tracking request paid a brand-new connection handshake,
 * and admin page nav triggers 2-4 of these (middleware session check + page
 * data fetch), which is what made navigation feel multi-second slow.
 * Module-level reuse is the standard pattern for serverless Postgres: the
 * pool survives across warm invocations of the same lambda instance.
 */
let db: ReturnType<typeof createKysely<Database>> | null = null

export function getDb() {
    if (db) return db
    const config = useRuntimeConfig()
    db = createKysely<Database>({
        connectionString: config.postgresUrl,
    })
    return db
}
