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
        
        const resp = await $fetch<ServerResponse<StatusCodes, StatTable[]>>('/api/public/stats/get-all')
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

        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="i in loadingCards" :key="i" class="skeleton h-40 rounded-3xl"></div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Total Stats -->
            <div
                class="p-5 md:col-span-2 lg:col-span-3 rounded-2xl bg-base-200 border border-base-300 flex flex-col justify-between transition-all duration-200 ease-out hover:shadow-lg hover:border-primary">
                <div
                    class="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 flex-shrink-0 bg-secondary/10 text-secondary">
                    <Icon name="solar:chart-square-bold" size="24" />
                </div>
                <div class="mt-4">
                    <h3 class="text-xs font-semibold uppercase tracking-widest text-tertiary-content">All Time Stats
                    </h3>
                    <div class="text-2xl font-bold mt-2 text-base-content">{{ totalStats.views }} Total Views</div>
                    <div class="mt-3 flex items-center gap-2">
                        <Icon name="solar:star-bold-duotone" class="text-warning" size="20" />
                        <span class="text-lg font-bold">{{ totalStats.totalReactions }}</span>
                        <span
                            class="text-xs font-semibold uppercase tracking-widest text-tertiary-content">Reactions</span>
                    </div>
                </div>
            </div>
            <!-- Most Popular -->
            <NuxtLink v-if="mostPopular?.post" :to="`/blog/${mostPopular.post.slug}`"
                class="p-5 rounded-2xl bg-base-200 border border-base-300 flex flex-col justify-between transition-all duration-200 ease-out hover:shadow-lg hover:border-primary hover:bg-base-100 group">
                <div
                    class="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 flex-shrink-0 bg-primary/10 text-primary group-hover:scale-105">
                    <Icon name="solar:eye-bold" size="24" />
                </div>
                <div class="mt-4">
                    <h3 class="text-xs font-semibold uppercase tracking-widest text-tertiary-content">Most Popular</h3>
                    <div class="text-2xl font-bold mt-2 text-base-content">{{ mostPopular.stat?.views ?? 0 }} Views
                    </div>
                    <p
                        class="mt-2 text-sm font-medium text-content-secondary line-clamp-2 transition-colors duration-200 group-hover:text-primary">
                        {{ mostPopular.post.title }}</p>
                </div>
            </NuxtLink>

             <!-- Most Liked -->
            <NuxtLink v-if="mostLiked?.post" :to="`/blog/${mostLiked.post.slug}`"
                class="p-5 rounded-2xl bg-base-200 border border-base-300 flex flex-col justify-between transition-all duration-200 ease-out hover:shadow-lg hover:border-primary group">
                <div
                    class="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 flex-shrink-0 bg-error/10 text-error group-hover:scale-105">
                    <Icon name="solar:heart-bold" size="24" />
                </div>
                <div class="mt-4">
                    <h3 class="text-xs font-semibold uppercase tracking-widest text-tertiary-content">Most Liked</h3>
                    <div class="text-2xl font-bold mt-2 text-base-content">{{ mostLiked.stat?.hearts ?? 0 }} Hearts
                    </div>
                    <p
                        class="mt-2 text-sm font-medium text-content-secondary line-clamp-2 transition-colors duration-200 group-hover:text-primary">
                        {{ mostLiked.post.title }}</p>
                </div>
            </NuxtLink>

            <!-- Most Disliked -->
            <NuxtLink v-if="mostDisliked?.post" :to="`/blog/${mostDisliked.post.slug}`"
                class="p-5 rounded-2xl bg-base-200 border border-base-300 flex flex-col justify-between transition-all duration-200 ease-out hover:shadow-lg hover:border-primary group">
                <div
                    class="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 flex-shrink-0 bg-base-content/10 text-base-content/70 group-hover:scale-105">
                    <Icon name="solar:like-bold" class="transform rotate-180" size="24" />
                </div>
                <div class="mt-4">
                    <h3 class="text-xs font-semibold uppercase tracking-widest text-tertiary-content">Most Disliked</h3>
                    <div class="text-2xl font-bold mt-2 text-base-content">{{ mostDisliked.stat?.dislikes ?? 0 }}
                        Dislikes</div>
                    <p
                        class="mt-2 text-sm font-medium text-content-secondary line-clamp-2 transition-colors duration-200 group-hover:text-primary">
                        {{ mostDisliked.post.title }}</p>
                </div>
            </NuxtLink>

            <!-- Oldest Post -->
            <NuxtLink v-if="oldestPost?.post" :to="`/blog/${oldestPost.post.slug}`"
                class="p-5 rounded-2xl bg-base-200 border border-base-300 flex flex-col justify-between transition-all duration-200 ease-out hover:shadow-lg hover:border-primary group">
                <div
                    class="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 flex-shrink-0 bg-warning/10 text-warning group-hover:scale-105">
                    <Icon name="solar:history-bold" size="24" />
                </div>
                <div class="mt-4">
                    <h3 class="text-xs font-semibold uppercase tracking-widest text-tertiary-content">Oldest Post</h3>
                    <div class="text-2xl font-bold mt-2 text-base-content">
                        {{ new Date(oldestPost.post.publishedAt).toLocaleDateString('en-GB',{
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        }) }}
                    </div>
                    <p
                        class="mt-2 text-sm font-medium text-content-secondary line-clamp-2 transition-colors duration-200 group-hover:text-primary">
                        {{ oldestPost.post.title }}</p>
                </div>
            </NuxtLink>

            <!-- Youngest Post -->
            <NuxtLink v-if="youngestPost?.post" :to="`/blog/${youngestPost.post.slug}`"
                class="p-5 rounded-2xl bg-base-200 border border-base-300 flex flex-col justify-between transition-all duration-200 ease-out hover:shadow-lg hover:border-primary group">
                <div
                    class="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 flex-shrink-0 bg-success/10 text-success group-hover:scale-105">
                    <Icon name="solar:calendar-add-bold" size="24" />
                </div>
                <div class="mt-4">
                    <h3 class="text-xs font-semibold uppercase tracking-widest text-tertiary-content">Newest Post</h3>
                    <div class="text-2xl font-bold mt-2 text-base-content">
                        {{ new Date(youngestPost.post.publishedAt).toLocaleDateString('en-GB',{
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        }) }}
                    </div>
                    <p
                        class="mt-2 text-sm font-medium text-content-secondary line-clamp-2 transition-colors duration-200 group-hover:text-primary">
                        {{ youngestPost.post.title }}</p>
                </div>
            </NuxtLink>


        </div>
    </section>

</template>
