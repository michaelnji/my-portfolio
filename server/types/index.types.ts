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

export interface RateLimitTable {
    id: Generated<number>;
    resource_type: string;
    post_id: string;
    user_hash: string;
    field: string;
    date: Generated<string>;
}

export interface Database {
    stats: StatTable;
    rate_limits: RateLimitTable;
}

export type PostStat = Selectable<StatTable>;