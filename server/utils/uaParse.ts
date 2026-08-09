export interface ParsedUA {
    device: 'mobile' | 'tablet' | 'desktop'
    browser: string
    os: string
}

/**
 * Minimal regex-based UA parser — good enough for dashboard breakdowns
 * without pulling in a full UA-parsing dependency. Order matters: more
 * specific patterns (Edge, Opera) are checked before the engines they're
 * built on (Chrome/Safari).
 */
export function parseUserAgent(ua: string | null | undefined): ParsedUA {
    const s = ua ?? ''

    let device: ParsedUA['device'] = 'desktop'
    if (/iPad|Tablet(?!.*Mobile)/i.test(s)) device = 'tablet'
    else if (/Mobi|iPhone|Android.*Mobile|Windows Phone/i.test(s)) device = 'mobile'

    let browser = 'Other'
    if (/EdgA?\//i.test(s)) browser = 'Edge'
    else if (/OPR\/|Opera/i.test(s)) browser = 'Opera'
    else if (/Firefox\//i.test(s)) browser = 'Firefox'
    else if (/CriOS\//i.test(s)) browser = 'Chrome'
    else if (/Chrome\//i.test(s) && !/Chromium/i.test(s)) browser = 'Chrome'
    else if (/Safari\//i.test(s) && /Version\//i.test(s)) browser = 'Safari'
    else if (/MSIE|Trident/i.test(s)) browser = 'IE'

    let os = 'Other'
    if (/Windows/i.test(s)) os = 'Windows'
    else if (/Mac OS X/i.test(s) && !/iPhone|iPad/i.test(s)) os = 'macOS'
    else if (/Android/i.test(s)) os = 'Android'
    else if (/iPhone|iPad|iOS/i.test(s)) os = 'iOS'
    else if (/Linux/i.test(s)) os = 'Linux'

    return { device, browser, os }
}
