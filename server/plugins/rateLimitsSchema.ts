import { createKysely } from '@vercel/postgres-kysely'
import { sql } from 'kysely'
import type { Database } from '~/server/types/index.types'

export default defineNitroPlugin(async () => {
    const config = useRuntimeConfig()
    if (!config.postgresUrl) return

    try {
        const db = createKysely<Database>({
            connectionString: config.postgresUrl,
        })

        await sql`
            CREATE TABLE IF NOT EXISTS rate_limits (
                id SERIAL PRIMARY KEY,
                resource_type VARCHAR(10) NOT NULL,
                post_id VARCHAR NOT NULL,
                user_hash VARCHAR(64) NOT NULL,
                field VARCHAR(10) NOT NULL DEFAULT '',
                date DATE NOT NULL DEFAULT CURRENT_DATE
            )
        `.execute(db)

        await sql`
            CREATE UNIQUE INDEX IF NOT EXISTS rate_limits_daily_unique_idx
            ON rate_limits (resource_type, post_id, user_hash, field, date)
        `.execute(db)
    } catch (error) {
        console.error('Failed to ensure rate_limits schema:', error)
        throw error
    }
})
