export interface Post {

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
