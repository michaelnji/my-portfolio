import type { Generated, Selectable } from "kysely";

export interface Post {
    _id: string;
    _updatedAt: string;
    authorInfo: {
        imageUrl: string;
        name: string;
    };
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    body: any[];
    title: string;
    excerpt: string;
    imgUrl: string;
    publishedAt: string;
    slug: string;
    tags: Array<{
        title: string;
    }>;


}


export interface StatTable {
    id: Generated<number>;
    postId: string;
    views: number;
    hearts: number;
    claps: number;
    stars: number;
    dislikes: number;

}

export type PostStatEventType = 'view' | 'hearts' | 'claps' | 'stars' | 'dislikes';

export interface PostStatEventTable {
    id: Generated<number>;
    post_id: string;
    type: PostStatEventType;
    created_at: Generated<string>;
}

export interface RateLimitTable {
    id: Generated<number>;
    resource_type: string;
    post_id: string;
    user_hash: string;
    field: string;
    date: Generated<string>;
}

export interface AdminSessionTable {
    id: Generated<number>;
    token: string;
    created_at: Generated<string>;
    expires_at: string;
}

export interface LoginAttemptTable {
    id: Generated<number>;
    fingerprint: string;
    created_at: Generated<string>;
}

export interface PageViewTable {
    id: Generated<number>;
    anon_id: string | null;
    path: string;
    referrer: string | null;
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    device: string | null;
    browser: string | null;
    os: string | null;
    country: string | null;
    region: string | null;
    screen_width: number | null;
    screen_height: number | null;
    language: string | null;
    timezone: string | null;
    duration_seconds: number | null;
    scroll_depth: number | null;
    is_bot: Generated<boolean>;
    created_at: Generated<string>;
}

export type EventType =
    | 'outbound_click'
    | 'game_play'
    | 'game_complete'
    | 'form_submit'
    | 'not_found'
    | 'js_error'
    | 'project_tab'
    | 'sound_toggle'
    | 'copy_code'
    | 'rate_limited';

export interface EventTable {
    id: Generated<number>;
    type: string;
    path: string | null;
    anon_id: string | null;
    // biome-ignore lint/suspicious/noExplicitAny: jsonb payload, shape varies by event type
    payload: any;
    created_at: Generated<string>;
}

export interface WebVitalTable {
    id: Generated<number>;
    path: string | null;
    metric: string;
    value: number;
    anon_id: string | null;
    created_at: Generated<string>;
}

export interface ApiErrorTable {
    id: Generated<number>;
    path: string | null;
    method: string | null;
    status: number | null;
    message: string | null;
    created_at: Generated<string>;
}

export interface ApiRequestTable {
    id: Generated<number>;
    path: string | null;
    method: string | null;
    status: number | null;
    duration_ms: number | null;
    created_at: Generated<string>;
}

export interface Database {
    stats: StatTable;
    post_stat_events: PostStatEventTable;
    rate_limits: RateLimitTable;
    admin_sessions: AdminSessionTable;
    login_attempts: LoginAttemptTable;
    page_views: PageViewTable;
    events: EventTable;
    web_vitals: WebVitalTable;
    api_errors: ApiErrorTable;
    api_requests: ApiRequestTable;
}

export type PostStat = Selectable<StatTable>;