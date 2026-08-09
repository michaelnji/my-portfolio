import type { H3Event } from 'h3'

export interface Geo {
    country: string | null
    region: string | null
}

/** Vercel injects these at the edge — no external lookup, no IP storage. */
export function getGeo(event: H3Event): Geo {
    return {
        country: getRequestHeader(event, 'x-vercel-ip-country') ?? null,
        region: getRequestHeader(event, 'x-vercel-ip-country-region') ?? null,
    }
}
