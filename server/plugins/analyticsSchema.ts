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
            CREATE TABLE IF NOT EXISTS admin_sessions (
                id SERIAL PRIMARY KEY,
                token VARCHAR(64) UNIQUE NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                expires_at TIMESTAMPTZ NOT NULL
            )
        `.execute(db)

        await sql`
            CREATE TABLE IF NOT EXISTS login_attempts (
                id SERIAL PRIMARY KEY,
                fingerprint VARCHAR(64) NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT now()
            )
        `.execute(db)
        await sql`
            CREATE INDEX IF NOT EXISTS login_attempts_fingerprint_idx
            ON login_attempts (fingerprint, created_at)
        `.execute(db)

        await sql`
            CREATE TABLE IF NOT EXISTS page_views (
                id SERIAL PRIMARY KEY,
                anon_id VARCHAR(64),
                path VARCHAR(500) NOT NULL,
                referrer VARCHAR(500),
                utm_source VARCHAR(100),
                utm_medium VARCHAR(100),
                utm_campaign VARCHAR(100),
                device VARCHAR(20),
                browser VARCHAR(50),
                os VARCHAR(50),
                country VARCHAR(2),
                region VARCHAR(100),
                screen_width INTEGER,
                screen_height INTEGER,
                language VARCHAR(20),
                timezone VARCHAR(60),
                duration_seconds INTEGER,
                scroll_depth INTEGER,
                created_at TIMESTAMPTZ NOT NULL DEFAULT now()
            )
        `.execute(db)
        await sql`
            CREATE INDEX IF NOT EXISTS page_views_created_at_idx ON page_views (created_at)
        `.execute(db)
        await sql`
            CREATE INDEX IF NOT EXISTS page_views_path_idx ON page_views (path)
        `.execute(db)
        await sql`
            CREATE INDEX IF NOT EXISTS page_views_anon_id_idx ON page_views (anon_id)
        `.execute(db)

        await sql`
            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                type VARCHAR(30) NOT NULL,
                path VARCHAR(500),
                anon_id VARCHAR(64),
                payload JSONB,
                created_at TIMESTAMPTZ NOT NULL DEFAULT now()
            )
        `.execute(db)
        await sql`
            CREATE INDEX IF NOT EXISTS events_type_created_at_idx ON events (type, created_at)
        `.execute(db)

        await sql`
            CREATE TABLE IF NOT EXISTS web_vitals (
                id SERIAL PRIMARY KEY,
                path VARCHAR(500),
                metric VARCHAR(10) NOT NULL,
                value DOUBLE PRECISION NOT NULL,
                anon_id VARCHAR(64),
                created_at TIMESTAMPTZ NOT NULL DEFAULT now()
            )
        `.execute(db)
        await sql`
            CREATE INDEX IF NOT EXISTS web_vitals_metric_created_at_idx ON web_vitals (metric, created_at)
        `.execute(db)

        await sql`
            CREATE TABLE IF NOT EXISTS api_errors (
                id SERIAL PRIMARY KEY,
                path VARCHAR(500),
                method VARCHAR(10),
                status INTEGER,
                message VARCHAR(500),
                created_at TIMESTAMPTZ NOT NULL DEFAULT now()
            )
        `.execute(db)
        await sql`
            CREATE INDEX IF NOT EXISTS api_errors_created_at_idx ON api_errors (created_at)
        `.execute(db)
    } catch (error) {
        console.error('Failed to ensure analytics schema:', error)
        throw error
    }
})
