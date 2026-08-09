const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function ordinal(n: number): string {
    const v = n % 100
    if (v >= 11 && v <= 13) return `${n}th`
    switch (n % 10) {
        case 1: return `${n}st`
        case 2: return `${n}nd`
        case 3: return `${n}rd`
        default: return `${n}th`
    }
}

/** House format for point-in-time admin timestamps: "Tue 20th Dec @ 10:50pm". Local time. */
export function formatAdminDateTime(input: string | Date): string {
    const d = typeof input === 'string' ? new Date(input) : input
    const weekday = WEEKDAYS[d.getDay()]
    const day = ordinal(d.getDate())
    const month = MONTHS[d.getMonth()]
    let hours = d.getHours()
    const minutes = String(d.getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'pm' : 'am'
    hours = hours % 12 || 12
    return `${weekday} ${day} ${month} @ ${hours}:${minutes}${ampm}`
}
