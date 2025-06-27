<script lang="ts" setup>
import { generateHumanMessage } from 'nexus-req'
import { toast } from 'vue-sonner'
import { defaultSiteSettings } from '~/data/siteSettings'

useHead({
    htmlAttrs: { lang: 'en-US' }, // BCP 47 language code
    link: [{
        rel: 'canonical',
        href: `${defaultSiteSettings.siteUrl}/blog`,
        // content: `${defaultSiteSettings.siteUrl}/blog`
    }]
})

useSeoMeta({
    title: 'My Blog',
    titleTemplate: '%s',
    description: 'My blog posts and tech experiences',
    ogType: 'website',
    ogUrl: `${defaultSiteSettings.siteUrl}/blog`,
    ogLocale: 'en_US',
    ogSiteName: defaultSiteSettings.siteName,
    twitterTitle: 'Michael Nji - Blog',
    twitterDescription: 'My blog posts and tech experiences',

    // no longer explicitly used by X but may be useful for SEO
    // twitterSite: '@example',
    // twitterCreator: '@example',

    // og image
    ogImage: {
        url: `${defaultSiteSettings.siteUrl}/seo/og-image-blog.png`,
        width: 1200,
        height: 800,
        alt: `Blog page of ${defaultSiteSettings.siteName}`,
        type: 'image/png'
    },
    twitterImage: {
        url: `${defaultSiteSettings.siteUrl}/seo/og-image-blog.png`,
        width: 1200,
        height: 800,
        alt: `Blog page of ${defaultSiteSettings.siteName}`,
        type: 'image/png'
    },
    // twitter image (note: ogImage is used as a fallback so this is optional)
    twitterCard: 'summary_large_image', // or summary
})
const postsStore = usePostsStore()
const isLoading = ref(false)
definePageMeta({
    layout: 'other'
})
async function retry() {

    await postsStore.fetchPosts()

}
onMounted(async () => {

    try {
        isLoading.value = true
        await postsStore.fetchPosts()
        isLoading.value = false
    } catch (error) {
        toast.error(generateHumanMessage(`${error}`), {
            duration: 5000, action: {
                label: 'Retry',
                onClick: () => toast.promise(retry, {
                    loading: 'Fetching...',
                    success: 'Data has been loaded successfully',
                    error: 'An error has occured, please reload this page'



                })
            },
        })
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

