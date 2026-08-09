<script lang="ts" setup>
import type { PostStat } from '~/server/types/index.types'

definePageMeta({ layout: 'admin', middleware: 'admin' })

interface GameRow {
    game_id: string
    plays: string
    completions: string
}
interface TopPageRow {
    path: string
    views: string
}
interface ContentData {
    posts: PostStat[]
    games: GameRow[]
    topPages: TopPageRow[]
}

const data = ref<ContentData | null>(null)
const loading = ref(true)
const postsStore = usePostsStore()

onMounted(async () => {
    try {
        const [res] = await Promise.all([
            $fetch<{ data: ContentData }>('/api/admin/content'),
            postsStore.posts?.length ? Promise.resolve() : postsStore.fetchPosts().catch(() => {}),
        ])
        data.value = res.data
    } finally {
        loading.value = false
    }
})

function postTitle(postId: string) {
    return postsStore.posts?.find((p) => p._id === postId)?.title ?? postId
}
function fmt(n: string | number | undefined) {
    return Number(n ?? 0).toLocaleString()
}
function completionRate(row: GameRow) {
    const plays = Number(row.plays)
    if (!plays) return '—'
    return `${Math.round((Number(row.completions) / plays) * 100)}%`
}
</script>

<template>
    <div class="flex flex-col gap-6">
        <h1 class="text-2xl font-semibold">Content</h1>

        <div class="card bg-base-200 border border-base-300">
            <div class="card-body">
                <h2 class="card-title text-base">Blog posts</h2>
                <div class="overflow-x-auto">
                    <table class="table table-sm">
                        <thead>
                            <tr><th>Post</th><th class="text-right">Views</th><th class="text-right">Hearts</th><th class="text-right">Claps</th><th class="text-right">Stars</th></tr>
                        </thead>
                        <tbody>
                            <tr v-for="post in data?.posts ?? []" :key="post.postId">
                                <td class="max-w-xs truncate">{{ postTitle(post.postId) }}</td>
                                <td class="text-right">{{ fmt(post.views) }}</td>
                                <td class="text-right">{{ fmt(post.hearts) }}</td>
                                <td class="text-right">{{ fmt(post.claps) }}</td>
                                <td class="text-right">{{ fmt(post.stars) }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p v-if="!loading && !data?.posts?.length" class="text-content-secondary text-sm py-4">No posts tracked yet.</p>
                </div>
            </div>
        </div>

        <div class="card bg-base-200 border border-base-300">
            <div class="card-body">
                <h2 class="card-title text-base">Games</h2>
                <div class="overflow-x-auto">
                    <table class="table table-sm">
                        <thead><tr><th>Game</th><th class="text-right">Plays</th><th class="text-right">Completions</th><th class="text-right">Completion rate</th></tr></thead>
                        <tbody>
                            <tr v-for="row in data?.games ?? []" :key="row.game_id">
                                <td>{{ row.game_id }}</td>
                                <td class="text-right">{{ fmt(row.plays) }}</td>
                                <td class="text-right">{{ fmt(row.completions) }}</td>
                                <td class="text-right">{{ completionRate(row) }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p v-if="!loading && !data?.games?.length" class="text-content-secondary text-sm py-4">No game plays tracked yet.</p>
                </div>
            </div>
        </div>

        <div class="card bg-base-200 border border-base-300">
            <div class="card-body">
                <h2 class="card-title text-base">Top pages — last 30 days</h2>
                <div class="overflow-x-auto">
                    <table class="table table-sm">
                        <thead><tr><th>Path</th><th class="text-right">Views</th></tr></thead>
                        <tbody>
                            <tr v-for="row in data?.topPages ?? []" :key="row.path">
                                <td class="font-mono text-xs">{{ row.path }}</td>
                                <td class="text-right">{{ fmt(row.views) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
