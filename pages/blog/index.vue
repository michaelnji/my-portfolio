<script lang="ts" setup>

const postsStore = usePostsStore()
const isLoading = ref(false)
definePageMeta({
    layout: 'other'
})
onMounted(async () => {
    if (!postsStore.posts) {
        try {
            isLoading.value = true
            await postsStore.fetchPosts()
            isLoading.value = false
        } catch (error) {

        }
    }

})
</script>

<template>
    <div class=" w-full p-6 md:p-12">
        <div class="container max-w-7xl mx-auto">
            <div v-if="isLoading" class="grid w-full h-screen place-items-center">
                <div class="flex items-center gap-x-6">
                    <div class="loader"></div>
                    <span class="opacity-60">Loading</span>
                </div>
            </div>
            <h3 v-if="!isLoading && postsStore.posts" class="font-bold font-display text-4xl mb-6 md:mb-12">Blog Posts
            </h3>
            <div v-if="!isLoading && postsStore.posts" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <BlogCard v-for="post in postsStore.posts" :post="post" />
            </div>
        </div>
    </div>
</template>

