<script lang="ts" setup>
import type { ServerResponse, StatusCodes } from 'nexus-req';
import type { StatTable } from '~/server/types/index.types';

const postsStore = usePostsStore()

const allStats = ref<StatTable[]>([])
const isLoading = ref(true)

// Fetch stats on mount
onMounted(async () => {
    try {
        if (!postsStore.posts) {
            await postsStore.fetchPosts()
        }
        
        const resp = await $fetch<ServerResponse<StatusCodes, StatTable[]>>('/api/neondb/stats/get-all')
        if (resp.ok && resp.data) {
            allStats.value = resp.data
        }
    } catch (error) {
        console.error('Failed to fetch stats:', error)
    } finally {
        isLoading.value = false
    }
})

// Helper to find post by ID
const getPost = (postId: string) => postsStore.posts?.find(p => p._id === postId)

// Computed Stats
const mostPopular = computed(() => {
    if (!allStats.value.length || !postsStore.posts) return null
    const stat = [...allStats.value].sort((a, b) => b.views - a.views)[0]
    return { stat, post: getPost(stat.postId) }
})

const mostLiked = computed(() => {
    if (!allStats.value.length || !postsStore.posts) return null
    const stat = [...allStats.value].sort((a, b) => b.hearts - a.hearts)[0]
    return { stat, post: getPost(stat.postId) }
})

const mostDisliked = computed(() => {
    if (!allStats.value.length || !postsStore.posts) return null
    const stat = [...allStats.value].sort((a, b) => b.dislikes - a.dislikes)[0]
    return { stat, post: getPost(stat.postId) }
})

const oldestPost = computed(() => {
    if (!postsStore.posts?.length) return null
    const post = [...postsStore.posts].sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())[0];
     // Find stats for this post, or default to 0s if not found (though backend should have them)
    const stat = allStats.value.find(s => s.postId === post._id)
    return { post, stat }
})

const youngestPost = computed(() => {
    if (!postsStore.posts?.length) return null
    const post = [...postsStore.posts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())[0];
    const stat = allStats.value.find(s => s.postId === post._id)
    return { post, stat }
})

const totalStats = computed(() => {
    const stats = allStats.value.reduce((acc, curr) => {
        acc.views += curr.views || 0
        acc.hearts += curr.hearts || 0
        acc.claps += curr.claps || 0
        acc.stars += curr.stars || 0
        acc.dislikes += curr.dislikes || 0
        return acc
    }, { views: 0, hearts: 0, claps: 0, stars: 0, dislikes: 0 })
    return {
        ...stats,
        totalReactions: stats.hearts + stats.claps + stats.stars + stats.dislikes
    }
})

const loadingCards = [1, 2, 3, 4, 5]

</script>

<template>
    <section class="py-12 md:py-24">
         <div class="flex items-center gap-4 mb-8 md:mb-12">
            <h3 class="font-bold text-2xl">Stats</h3>
             <div class="h-px bg-base-content/20 flex-1"></div>
        </div>

        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <div v-for="i in loadingCards" :key="i" class="skeleton h-48 rounded-3xl"></div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Total Stats -->
            <div
                class="p-8 md:col-span-2 lg:col-span-3 rounded-3xl bg-base-200 border border-base-200 hover:border-base-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full aspect-[4/3] md:aspect-auto group">
                <div
                    class="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 bg-secondary/10 text-secondary">
                    <Icon name="solar:chart-square-bold" size="32" />
                </div>
                <div class="mt-4">
                    <h3 class="text-sm font-medium uppercase tracking-wider opacity-60">All Time Stats</h3>
                    <div class="text-3xl font-bold mt-2">{{ totalStats.views }} Total Views</div>
                    <div class="mt-4 flex items-center gap-2">
                        <Icon name="solar:star-bold-duotone" class="text-warning" size="24" />
                        <span class="text-xl font-bold">{{ totalStats.totalReactions }}</span>
                        <span class="text-sm font-medium opacity-60 uppercase tracking-wider">Reactions</span>
                    </div>
                </div>
            </div>
            <!-- Most Popular -->
            <NuxtLink v-if="mostPopular?.post" :to="`/blog/${mostPopular.post.slug}`" class="p-8 rounded-3xl bg-base-200 border border-base-200 hover:border-base-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full aspect-[4/3] md:aspect-auto group">
                <div class="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 bg-primary/10 text-primary">
                    <Icon name="solar:eye-bold" size="32" />
                </div>
                <div class="mt-4">
                    <h3 class="text-sm font-medium uppercase tracking-wider opacity-60">Most Popular</h3>
                    <div class="text-3xl font-bold mt-2">{{ mostPopular.stat?.views ?? 0 }} Views</div>
                    <p class="mt-2 text-lg font-medium group-hover:text-primary transition-colors line-clamp-2">{{ mostPopular.post.title }}</p>
                </div>
            </NuxtLink>

             <!-- Most Liked -->
            <NuxtLink v-if="mostLiked?.post" :to="`/blog/${mostLiked.post.slug}`" class="p-8 rounded-3xl bg-base-200 border border-base-200 hover:border-base-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full aspect-[4/3] md:aspect-auto group">
                <div class="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 bg-error/10 text-error">
                    <Icon name="solar:heart-bold" size="32" />
                </div>
                <div class="mt-4">
                    <h3 class="text-sm font-medium uppercase tracking-wider opacity-60">Most Liked</h3>
                    <div class="text-3xl font-bold mt-2">{{ mostLiked.stat?.hearts ?? 0 }} Hearts</div>
                    <p class="mt-2 text-lg font-medium group-hover:text-primary transition-colors line-clamp-2">{{ mostLiked.post.title }}</p>
                </div>
            </NuxtLink>

            <!-- Most Disliked -->
            <NuxtLink v-if="mostDisliked?.post" :to="`/blog/${mostDisliked.post.slug}`" class="p-8 rounded-3xl bg-base-200 border border-base-200 hover:border-base-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full aspect-[4/3] md:aspect-auto group">
                <div class="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 bg-base-content/10 text-base-content/70">
                    <Icon name="solar:like-bold" class="transform rotate-180" size="32" />
                </div>
                <div class="mt-4">
                     <h3 class="text-sm font-medium uppercase tracking-wider opacity-60">Most Disliked</h3>
                    <div class="text-3xl font-bold mt-2">{{ mostDisliked.stat?.dislikes ?? 0 }} Dislikes</div>
                    <p class="mt-2 text-lg font-medium group-hover:text-primary transition-colors line-clamp-2">{{ mostDisliked.post.title }}</p>
                </div>
            </NuxtLink>

            <!-- Oldest Post -->
            <NuxtLink v-if="oldestPost?.post" :to="`/blog/${oldestPost.post.slug}`" class="p-8 rounded-3xl bg-base-200 border border-base-200 hover:border-base-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full aspect-[4/3] md:aspect-auto group">
                 <div class="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 bg-warning/10 text-warning">
                    <Icon name="solar:history-bold" size="32" />
                </div>
                <div class="mt-4">
                    <h3 class="text-sm font-medium uppercase tracking-wider opacity-60">Oldest Post</h3>
                     <div class="text-xl font-bold mt-2 line-clamp-1">
                        {{ new Date(oldestPost.post.publishedAt).toLocaleDateString('en-GB',{
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        }) }}
                    </div>
                     <p class="mt-2 text-lg font-medium group-hover:text-primary transition-colors line-clamp-2">{{ oldestPost.post.title }}</p>
                </div>
            </NuxtLink>

            <!-- Youngest Post -->
            <NuxtLink v-if="youngestPost?.post" :to="`/blog/${youngestPost.post.slug}`" class="p-8 rounded-3xl bg-base-200 border border-base-200 hover:border-base-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full aspect-[4/3] md:aspect-auto group">
                 <div class="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 bg-success/10 text-success">
                    <Icon name="solar:calendar-add-bold" size="32" />
                </div>
                <div class="mt-4">
                    <h3 class="text-sm font-medium uppercase tracking-wider opacity-60">Newest Post</h3>
                    <div class="text-xl font-bold mt-2 line-clamp-1">
                        {{ new Date(youngestPost.post.publishedAt).toLocaleDateString('en-GB',{
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        }) }}
                    </div>
                    <p class="mt-2 text-lg font-medium group-hover:text-primary transition-colors line-clamp-2">{{ youngestPost.post.title }}</p>
                </div>
            </NuxtLink>



        </div>
    </section>

</template>

<style scoped>

</style>
