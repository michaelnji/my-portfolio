<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
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
interface BlogMetric {
    slug: string
    views: string
    visitors: string
    avgDuration: string | null
    avgScroll: string | null
    previousViews: string
}
interface ContentData {
    posts: PostStat[]
    games: GameRow[]
    topPages: TopPageRow[]
    blogMetrics: BlogMetric[]
}

const postsStore = usePostsStore()
const { range } = useAdminRange()

onMounted(() => {
    if (!postsStore.posts?.length) postsStore.fetchPosts().catch(() => {})
})

const {
    data,
    isPending: loading,
    isFetching,
    error,
} = useQuery({
    queryKey: computed(() => ['admin', 'content', range.value]),
    queryFn: () =>
        $fetch<{ data: ContentData }>('/api/admin/content', { query: { range: range.value } }).then((r) => r.data),
})

watch(error, (e) => {
    if (e) toast.error('Failed to load content data')
})

function postTitle(postId: string) {
    return postsStore.posts?.find((p) => p._id === postId)?.title ?? postId
}
function slugFor(postId: string) {
    return postsStore.posts?.find((p) => p._id === postId)?.slug ?? ''
}
function fmt(n: string | number | undefined) {
    return Number(n ?? 0).toLocaleString()
}
function truncate(s: string, n = 20) {
    return s.length > n ? `${s.slice(0, n)}…` : s
}
function completionRate(row: GameRow) {
    const plays = Number(row.plays)
    if (!plays) return '—'
    return `${Math.round((Number(row.completions) / plays) * 100)}%`
}

// --- Post-level rankings ---------------------------------------------

interface EnrichedPost {
    postId: string
    title: string
    views: number
    hearts: number
    claps: number
    stars: number
    dislikes: number
    engagementRate: number
    velocity: number
    avgDuration: number | null
    avgScroll: number | null
    trendPercent: number | null
    tags: string[]
}

const enrichedPosts = computed<EnrichedPost[]>(() => {
    const metricsBySlug = new Map((data.value?.blogMetrics ?? []).map((m) => [m.slug, m]))
    return (data.value?.posts ?? []).map((post) => {
        const meta = postsStore.posts?.find((p) => p._id === post.postId)
        const metric = meta?.slug ? metricsBySlug.get(meta.slug) : undefined
        const views = Number(post.views)
        const reactions = Number(post.hearts) + Number(post.claps) + Number(post.stars)
        const daysSincePublished = meta?.publishedAt
            ? Math.max(1, (Date.now() - new Date(meta.publishedAt).getTime()) / 86_400_000)
            : null
        const currentViews = metric ? Number(metric.views) : 0
        const previousViews = metric ? Number(metric.previousViews) : 0
        return {
            postId: post.postId,
            title: meta?.title ?? post.postId,
            views,
            hearts: Number(post.hearts),
            claps: Number(post.claps),
            stars: Number(post.stars),
            dislikes: Number(post.dislikes),
            engagementRate: views > 0 ? reactions / views : 0,
            velocity: daysSincePublished ? views / daysSincePublished : 0,
            avgDuration: metric?.avgDuration ? Number(metric.avgDuration) : null,
            avgScroll: metric?.avgScroll ? Number(metric.avgScroll) : null,
            // No previous-period data at all → unranked, not an infinite/undefined %.
            trendPercent: previousViews > 0 ? ((currentViews - previousViews) / previousViews) * 100 : null,
            tags: meta?.tags?.map((t) => t.title) ?? [],
        }
    })
})

// --- Hero callouts (single best post per metric, BlogStatsSection-style) --

const sortedByViews = computed(() => [...enrichedPosts.value].sort((a, b) => b.views - a.views))
const mostViewedPost = computed(() => sortedByViews.value[0] ?? null)

const mostLikedPost = computed(() => [...enrichedPosts.value].sort((a, b) => b.hearts - a.hearts)[0] ?? null)

const mostDislikedPost = computed(() => {
    const sorted = [...enrichedPosts.value].filter((p) => p.dislikes > 0).sort((a, b) => b.dislikes - a.dislikes)
    return sorted[0] ?? null
})

const trendingPost = computed(() => {
    const sorted = [...enrichedPosts.value]
        .filter((p) => p.trendPercent !== null)
        .sort((a, b) => (b.trendPercent ?? 0) - (a.trendPercent ?? 0))
    return sorted[0] ?? null
})

const fastestGrowingPost = computed(() => {
    const sorted = [...enrichedPosts.value].filter((p) => p.velocity > 0).sort((a, b) => b.velocity - a.velocity)
    return sorted[0] ?? null
})

const bestEngagementPost = computed(() => {
    const sorted = [...enrichedPosts.value].filter((p) => p.views > 0).sort((a, b) => b.engagementRate - a.engagementRate)
    return sorted[0] ?? null
})

const totals = computed(() =>
    enrichedPosts.value.reduce(
        (acc, p) => {
            acc.views += p.views
            acc.hearts += p.hearts
            acc.claps += p.claps
            acc.stars += p.stars
            acc.dislikes += p.dislikes
            return acc
        },
        { views: 0, hearts: 0, claps: 0, stars: 0, dislikes: 0 }
    )
)
const totalReactions = computed(() => totals.value.hearts + totals.value.claps + totals.value.stars + totals.value.dislikes)

// --- Charts -------------------------------------------------------------

const viewsChartData = computed(() =>
    sortedByViews.value.slice(0, 8).map((p) => ({ title: truncate(p.title), views: p.views }))
)
const viewsSeries = [{ key: 'views', name: 'Views', color: '#3987e5' }]

const reactionMixData = computed(() => [
    { name: 'Hearts', value: totals.value.hearts },
    { name: 'Claps', value: totals.value.claps },
    { name: 'Stars', value: totals.value.stars },
    { name: 'Dislikes', value: totals.value.dislikes },
])
const reactionColors = ['#e66767', '#c98500', '#3987e5', '#9085e9']

interface TagStat {
    tag: string
    views: number
    hearts: number
}
const tagPerformance = computed<TagStat[]>(() => {
    const map = new Map<string, TagStat>()
    for (const post of enrichedPosts.value) {
        for (const tag of post.tags) {
            const entry = map.get(tag) ?? { tag, views: 0, hearts: 0 }
            entry.views += post.views
            entry.hearts += post.hearts
            map.set(tag, entry)
        }
    }
    return [...map.values()].sort((a, b) => b.views - a.views)
})
const tagChartData = computed(() => tagPerformance.value.slice(0, 8).map((t) => ({ tag: truncate(t.tag, 14), views: t.views })))
const tagSeries = [{ key: 'views', name: 'Views', color: '#199e70' }]

const trendingChartData = computed(() =>
    [...enrichedPosts.value]
        .filter((p) => p.trendPercent !== null)
        .sort((a, b) => (b.trendPercent ?? 0) - (a.trendPercent ?? 0))
        .slice(0, 6)
        .map((p) => ({ title: truncate(p.title, 14), trendPercent: Math.round(p.trendPercent ?? 0) }))
)
const trendingSeries = [{ key: 'trendPercent', name: 'Change %', color: '#199e70' }]

const durationChartData = computed(() =>
    [...enrichedPosts.value]
        .filter((p) => p.avgDuration !== null)
        .sort((a, b) => (b.avgDuration ?? 0) - (a.avgDuration ?? 0))
        .slice(0, 6)
        .map((p) => ({ title: truncate(p.title, 14), avgDuration: Math.round(p.avgDuration ?? 0) }))
)
const durationSeries = [{ key: 'avgDuration', name: 'Seconds', color: '#d95926' }]

const scrollChartData = computed(() =>
    [...enrichedPosts.value]
        .filter((p) => p.avgScroll !== null)
        .sort((a, b) => (b.avgScroll ?? 0) - (a.avgScroll ?? 0))
        .slice(0, 6)
        .map((p) => ({ title: truncate(p.title, 14), avgScroll: Math.round(p.avgScroll ?? 0) }))
)
const scrollSeries = [{ key: 'avgScroll', name: 'Scroll %', color: '#d55181' }]

const gamesChartData = computed(() =>
    (data.value?.games ?? []).map((g) => ({ game: g.game_id, plays: Number(g.plays), completions: Number(g.completions) }))
)
const gamesSeries = [
    { key: 'plays', name: 'Plays', color: '#3987e5' },
    { key: 'completions', name: 'Completions', color: '#199e70' },
]
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex items-center justify-between gap-4 flex-wrap">
            <h1 class="text-2xl font-semibold">Content</h1>
            <div class="flex items-center gap-3">
                <AdminRangeFilter />
                <AdminSpinner :fetching="isFetching" />
            </div>
        </div>

        <!-- Hero callouts -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="skeleton h-32 rounded-2xl md:col-span-2 lg:col-span-3" />
            <div v-for="i in 6" :key="i" class="skeleton h-40 rounded-2xl" />
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="p-5 rounded-2xl bg-base-200 border border-base-300 flex flex-col justify-between md:col-span-2 lg:col-span-3">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-secondary/10 text-secondary">
                    <Icon name="solar:chart-square-bold" size="24" />
                </div>
                <div class="mt-4">
                    <h3 class="text-xs font-semibold uppercase tracking-widest text-content-secondary">All posts, all time</h3>
                    <div class="text-2xl font-bold mt-2">{{ fmt(totals.views) }} total views</div>
                    <div class="mt-3 flex items-center gap-2">
                        <Icon name="solar:star-bold-duotone" class="text-warning" size="20" />
                        <span class="text-lg font-bold">{{ fmt(totalReactions) }}</span>
                        <span class="text-xs font-semibold uppercase tracking-widest text-content-secondary">reactions</span>
                    </div>
                </div>
            </div>

            <NuxtLink v-if="mostViewedPost" :to="`/blog/${slugFor(mostViewedPost.postId)}`" target="_blank" rel="noopener noreferrer"
                class="p-5 rounded-2xl bg-base-200 border border-base-300 flex flex-col justify-between transition-all duration-200 ease-out hover:shadow-lg hover:border-primary group">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 flex-shrink-0 bg-primary/10 text-primary group-hover:scale-105">
                    <Icon name="solar:eye-bold" size="24" />
                </div>
                <div class="mt-4">
                    <h3 class="text-xs font-semibold uppercase tracking-widest text-content-secondary">Most viewed</h3>
                    <div class="text-2xl font-bold mt-2">{{ fmt(mostViewedPost.views) }} views</div>
                    <p class="mt-2 text-sm font-medium text-content-secondary line-clamp-2 group-hover:text-primary">{{ mostViewedPost.title }}</p>
                </div>
            </NuxtLink>

            <NuxtLink v-if="mostLikedPost" :to="`/blog/${slugFor(mostLikedPost.postId)}`" target="_blank" rel="noopener noreferrer"
                class="p-5 rounded-2xl bg-base-200 border border-base-300 flex flex-col justify-between transition-all duration-200 ease-out hover:shadow-lg hover:border-primary group">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 flex-shrink-0 bg-error/10 text-error group-hover:scale-105">
                    <Icon name="solar:heart-bold" size="24" />
                </div>
                <div class="mt-4">
                    <h3 class="text-xs font-semibold uppercase tracking-widest text-content-secondary">Most liked</h3>
                    <div class="text-2xl font-bold mt-2">{{ fmt(mostLikedPost.hearts) }} hearts</div>
                    <p class="mt-2 text-sm font-medium text-content-secondary line-clamp-2 group-hover:text-primary">{{ mostLikedPost.title }}</p>
                </div>
            </NuxtLink>

            <NuxtLink v-if="mostDislikedPost" :to="`/blog/${slugFor(mostDislikedPost.postId)}`" target="_blank" rel="noopener noreferrer"
                class="p-5 rounded-2xl bg-base-200 border border-base-300 flex flex-col justify-between transition-all duration-200 ease-out hover:shadow-lg hover:border-primary group">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 flex-shrink-0 bg-base-content/10 text-base-content/70 group-hover:scale-105">
                    <Icon name="solar:like-bold" class="rotate-180" size="24" />
                </div>
                <div class="mt-4">
                    <h3 class="text-xs font-semibold uppercase tracking-widest text-content-secondary">Most disliked</h3>
                    <div class="text-2xl font-bold mt-2">{{ fmt(mostDislikedPost.dislikes) }} dislikes</div>
                    <p class="mt-2 text-sm font-medium text-content-secondary line-clamp-2 group-hover:text-primary">{{ mostDislikedPost.title }}</p>
                </div>
            </NuxtLink>
            <div v-else class="p-5 rounded-2xl bg-base-200 border border-base-300 flex flex-col justify-between">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-base-content/10 text-base-content/70">
                    <Icon name="solar:like-bold" class="rotate-180" size="24" />
                </div>
                <div class="mt-4">
                    <h3 class="text-xs font-semibold uppercase tracking-widest text-content-secondary">Most disliked</h3>
                    <div class="text-2xl font-bold mt-2">—</div>
                    <p class="mt-2 text-sm font-medium text-content-secondary">No dislikes yet. 🎉</p>
                </div>
            </div>

            <NuxtLink v-if="trendingPost" :to="`/blog/${slugFor(trendingPost.postId)}`" target="_blank" rel="noopener noreferrer"
                class="p-5 rounded-2xl bg-base-200 border border-base-300 flex flex-col justify-between transition-all duration-200 ease-out hover:shadow-lg hover:border-success group">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 flex-shrink-0 bg-success/10 text-success group-hover:scale-105">
                    <Icon name="solar:graph-new-up-bold" size="24" />
                </div>
                <div class="mt-4">
                    <h3 class="text-xs font-semibold uppercase tracking-widest text-content-secondary">Trending</h3>
                    <div class="text-2xl font-bold mt-2">{{ trendingPost.trendPercent! >= 0 ? '+' : '' }}{{ Math.round(trendingPost.trendPercent!) }}%</div>
                    <p class="mt-2 text-sm font-medium text-content-secondary line-clamp-2 group-hover:text-success">{{ trendingPost.title }}</p>
                </div>
            </NuxtLink>
            <div v-else class="p-5 rounded-2xl bg-base-200 border border-base-300 flex flex-col justify-between">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-success/10 text-success">
                    <Icon name="solar:graph-new-up-bold" size="24" />
                </div>
                <div class="mt-4">
                    <h3 class="text-xs font-semibold uppercase tracking-widest text-content-secondary">Trending</h3>
                    <div class="text-2xl font-bold mt-2">—</div>
                    <p class="mt-2 text-sm font-medium text-content-secondary">Not enough history yet — check back after this range has a full prior period.</p>
                </div>
            </div>

            <NuxtLink v-if="fastestGrowingPost" :to="`/blog/${slugFor(fastestGrowingPost.postId)}`" target="_blank" rel="noopener noreferrer"
                class="p-5 rounded-2xl bg-base-200 border border-base-300 flex flex-col justify-between transition-all duration-200 ease-out hover:shadow-lg hover:border-warning group">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 flex-shrink-0 bg-warning/10 text-warning group-hover:scale-105">
                    <Icon name="solar:rocket-bold" size="24" />
                </div>
                <div class="mt-4">
                    <h3 class="text-xs font-semibold uppercase tracking-widest text-content-secondary">Fastest growing</h3>
                    <div class="text-2xl font-bold mt-2">{{ fastestGrowingPost.velocity.toFixed(1) }} views/day</div>
                    <p class="mt-2 text-sm font-medium text-content-secondary line-clamp-2 group-hover:text-warning">{{ fastestGrowingPost.title }}</p>
                </div>
            </NuxtLink>
            <div v-else class="p-5 rounded-2xl bg-base-200 border border-base-300 flex flex-col justify-between">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-warning/10 text-warning">
                    <Icon name="solar:rocket-bold" size="24" />
                </div>
                <div class="mt-4">
                    <h3 class="text-xs font-semibold uppercase tracking-widest text-content-secondary">Fastest growing</h3>
                    <div class="text-2xl font-bold mt-2">—</div>
                    <p class="mt-2 text-sm font-medium text-content-secondary">No published dates to compare yet.</p>
                </div>
            </div>

            <NuxtLink v-if="bestEngagementPost" :to="`/blog/${slugFor(bestEngagementPost.postId)}`" target="_blank" rel="noopener noreferrer"
                class="p-5 rounded-2xl bg-base-200 border border-base-300 flex flex-col justify-between transition-all duration-200 ease-out hover:shadow-lg hover:border-info group">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 flex-shrink-0 bg-info/10 text-info group-hover:scale-105">
                    <Icon name="solar:medal-star-bold" size="24" />
                </div>
                <div class="mt-4">
                    <h3 class="text-xs font-semibold uppercase tracking-widest text-content-secondary">Best engagement</h3>
                    <div class="text-2xl font-bold mt-2">{{ (bestEngagementPost.engagementRate * 100).toFixed(1) }}%</div>
                    <p class="mt-2 text-sm font-medium text-content-secondary line-clamp-2 group-hover:text-info">{{ bestEngagementPost.title }}</p>
                </div>
            </NuxtLink>
            <div v-else class="p-5 rounded-2xl bg-base-200 border border-base-300 flex flex-col justify-between">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-info/10 text-info">
                    <Icon name="solar:medal-star-bold" size="24" />
                </div>
                <div class="mt-4">
                    <h3 class="text-xs font-semibold uppercase tracking-widest text-content-secondary">Best engagement</h3>
                    <div class="text-2xl font-bold mt-2">—</div>
                    <p class="mt-2 text-sm font-medium text-content-secondary">No views yet to measure engagement against.</p>
                </div>
            </div>
        </div>

        <!-- Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div class="card bg-base-200 border border-base-300">
                <div class="card-body">
                    <h2 class="card-title text-base">Views by post <span class="text-content-secondary font-normal text-sm">(all time)</span></h2>
                    <div v-if="loading" class="skeleton w-full h-[260px]" />
                    <AdminSimpleBarChart v-else-if="viewsChartData.length" :data="viewsChartData" x-key="title" :series="viewsSeries" :height="260" hide-legend />
                    <p v-else class="text-content-secondary text-sm">No posts tracked yet.</p>
                </div>
            </div>

            <div class="card bg-base-200 border border-base-300">
                <div class="card-body">
                    <h2 class="card-title text-base">Reaction mix <span class="text-content-secondary font-normal text-sm">(all time)</span></h2>
                    <div v-if="loading" class="skeleton w-full h-[260px]" />
                    <div v-else-if="totalReactions > 0" class="flex justify-center">
                        <AdminSimpleDonutChart :data="reactionMixData" data-key="value" name-key="name" :colors="reactionColors" :height="240" />
                    </div>
                    <p v-else class="text-content-secondary text-sm">No reactions yet.</p>
                </div>
            </div>

            <div class="card bg-base-200 border border-base-300">
                <div class="card-body">
                    <h2 class="card-title text-base">Views by topic <span class="text-content-secondary font-normal text-sm">(all time)</span></h2>
                    <div v-if="loading" class="skeleton w-full h-[260px]" />
                    <AdminSimpleBarChart v-else-if="tagChartData.length" :data="tagChartData" x-key="tag" :series="tagSeries" :height="260" hide-legend />
                    <p v-else class="text-content-secondary text-sm">No tagged posts yet.</p>
                </div>
            </div>

            <div class="card bg-base-200 border border-base-300">
                <div class="card-body">
                    <h2 class="card-title text-base">Trending <span class="text-content-secondary font-normal text-sm">(this range vs. previous)</span></h2>
                    <div v-if="loading" class="skeleton w-full h-[260px]" />
                    <AdminSimpleBarChart v-else-if="trendingChartData.length" :data="trendingChartData" x-key="title" :series="trendingSeries" :height="260" hide-legend />
                    <p v-else class="text-content-secondary text-sm">Not enough history yet.</p>
                </div>
            </div>

            <div class="card bg-base-200 border border-base-300">
                <div class="card-body">
                    <h2 class="card-title text-base">Avg. time on page <span class="text-content-secondary font-normal text-sm">(this range)</span></h2>
                    <div v-if="loading" class="skeleton w-full h-[260px]" />
                    <AdminSimpleBarChart v-else-if="durationChartData.length" :data="durationChartData" x-key="title" :series="durationSeries" :height="260" hide-legend />
                    <p v-else class="text-content-secondary text-sm">No data yet.</p>
                </div>
            </div>

            <div class="card bg-base-200 border border-base-300">
                <div class="card-body">
                    <h2 class="card-title text-base">Avg. scroll depth <span class="text-content-secondary font-normal text-sm">(this range)</span></h2>
                    <div v-if="loading" class="skeleton w-full h-[260px]" />
                    <AdminSimpleBarChart v-else-if="scrollChartData.length" :data="scrollChartData" x-key="title" :series="scrollSeries" :height="260" hide-legend />
                    <p v-else class="text-content-secondary text-sm">No data yet.</p>
                </div>
            </div>
        </div>

        <div class="card bg-base-200 border border-base-300">
            <div class="card-body">
                <h2 class="card-title text-base">Games</h2>
                <div v-if="loading" class="skeleton w-full h-[220px]" />
                <AdminSimpleBarChart v-else-if="gamesChartData.length" :data="gamesChartData" x-key="game" :series="gamesSeries" :height="220" />
                <p v-else class="text-content-secondary text-sm">No game plays tracked yet.</p>
                <div v-if="data?.games?.length" class="overflow-x-auto mt-2">
                    <table class="table table-sm">
                        <thead><tr><th>Game</th><th class="text-right">Plays</th><th class="text-right">Completions</th><th class="text-right">Completion rate</th></tr></thead>
                        <tbody>
                            <tr v-for="row in data.games" :key="row.game_id">
                                <td>{{ row.game_id }}</td>
                                <td class="text-right">{{ fmt(row.plays) }}</td>
                                <td class="text-right">{{ fmt(row.completions) }}</td>
                                <td class="text-right">{{ completionRate(row) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="card bg-base-200 border border-base-300">
            <div class="card-body">
                <h2 class="card-title text-base">All posts <span class="text-content-secondary font-normal text-sm">(all time)</span></h2>
                <div class="overflow-x-auto">
                    <table class="table table-sm">
                        <thead>
                            <tr><th>Post</th><th class="text-right">Views</th><th class="text-right">Hearts</th><th class="text-right">Claps</th><th class="text-right">Stars</th><th class="text-right">Dislikes</th></tr>
                        </thead>
                        <tbody v-if="loading">
                            <tr v-for="i in 8" :key="i">
                                <td><AdminSkel w="w-40" h="h-3" /></td>
                                <td class="text-right"><AdminSkel w="w-8" h="h-3" class="ml-auto" /></td>
                                <td class="text-right"><AdminSkel w="w-6" h="h-3" class="ml-auto" /></td>
                                <td class="text-right"><AdminSkel w="w-6" h="h-3" class="ml-auto" /></td>
                                <td class="text-right"><AdminSkel w="w-6" h="h-3" class="ml-auto" /></td>
                                <td class="text-right"><AdminSkel w="w-6" h="h-3" class="ml-auto" /></td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr v-for="post in data?.posts ?? []" :key="post.postId">
                                <td class="max-w-xs truncate">{{ postTitle(post.postId) }}</td>
                                <td class="text-right">{{ fmt(post.views) }}</td>
                                <td class="text-right">{{ fmt(post.hearts) }}</td>
                                <td class="text-right">{{ fmt(post.claps) }}</td>
                                <td class="text-right">{{ fmt(post.stars) }}</td>
                                <td class="text-right">{{ fmt(post.dislikes) }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p v-if="!loading && !data?.posts?.length" class="text-content-secondary text-sm py-4">No posts tracked yet.</p>
                </div>
            </div>
        </div>

        <div class="card bg-base-200 border border-base-300">
            <div class="card-body">
                <h2 class="card-title text-base">Top pages</h2>
                <div class="overflow-x-auto">
                    <table class="table table-sm">
                        <thead><tr><th>Path</th><th class="text-right">Views</th></tr></thead>
                        <tbody v-if="loading">
                            <tr v-for="i in 8" :key="i">
                                <td><AdminSkel w="w-48" h="h-3" /></td>
                                <td class="text-right"><AdminSkel w="w-8" h="h-3" class="ml-auto" /></td>
                            </tr>
                        </tbody>
                        <tbody v-else>
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
