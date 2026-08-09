const BOT_PATTERN =
    /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|headless|phantom|curl|wget|python-requests|axios|go-http-client|postmanruntime|scrapy|monitor|pingdom|uptimerobot|lighthouse|pagespeed/i

export function isBotRequest(event: import('h3').H3Event): boolean {
    const ua = getRequestHeader(event, 'user-agent')
    if (!ua) return true // no UA at all — treat as non-human
    return BOT_PATTERN.test(ua)
}
