export type AdminRange = '24h' | '3d' | '7d' | '30d' | '90d'

interface RangeConfig {
    /** Postgres interval literal for `now() - interval '...'`. */
    interval: string
    /** date_trunc() unit for time-series bucketing. */
    bucket: 'hour' | 'day'
}

const RANGES: Record<AdminRange, RangeConfig> = {
    '24h': { interval: '24 hours', bucket: 'hour' },
    '3d': { interval: '3 days', bucket: 'hour' },
    '7d': { interval: '7 days', bucket: 'day' },
    '30d': { interval: '30 days', bucket: 'day' },
    '90d': { interval: '90 days', bucket: 'day' },
}

const VALID_RANGES = new Set(Object.keys(RANGES))

/** Validates against a fixed whitelist — safe to interpolate into raw SQL. */
export function parseRange(input: unknown): AdminRange {
    return typeof input === 'string' && VALID_RANGES.has(input) ? (input as AdminRange) : '7d'
}

export function rangeConfig(range: AdminRange): RangeConfig {
    return RANGES[range]
}
