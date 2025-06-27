<script lang="ts" setup>
import { ProjectsOSS } from '#components';
import { defaultSiteSettings } from '~/data/siteSettings';


useHead({
    htmlAttrs: { lang: 'en-US' }, // BCP 47 language code
    link: [{
        rel: 'canonical',
        href: `${defaultSiteSettings.siteUrl}/projects`,
        // content: `${defaultSiteSettings.siteUrl}/projects`
    }]
})

useSeoMeta({
    title: 'My Projects',
    titleTemplate: '%s',
    description: 'Projects I have built over the years',
    ogType: 'website',
    ogUrl: `${defaultSiteSettings.siteUrl}/projects`,
    ogLocale: 'en_US',
    ogSiteName: defaultSiteSettings.siteName,
    twitterTitle: 'Michael Nji - Projects',
    twitterDescription: 'Projects I have built over the years',

    // no longer explicitly used by X but may be useful for SEO
    // twitterSite: '@example',
    // twitterCreator: '@example',

    // og image
    ogImage: {
        url: `${defaultSiteSettings.siteUrl}/seo/og-image-projects.png`,
        width: 1200,
        height: 800,
        alt: `Projects page of ${defaultSiteSettings.siteName}`,
        type: 'image/png'
    },
    twitterImage: {
        url: `${defaultSiteSettings.siteUrl}/seo/og-image-projects.png`,
        width: 1200,
        height: 800,
        alt: `Projects page of ${defaultSiteSettings.siteName}`,
        type: 'image/png'
    },
    // twitter image (note: ogImage is used as a fallback so this is optional)
    twitterCard: 'summary_large_image', // or summary
})
definePageMeta({
    layout: 'other'
})
const activeTab = ref<"featured" | "personal" | "oss">('featured')
</script>

<template>
    <div class="container mx-auto  xl:max-w-7xl">
        <div class=" space-y-12 py-6  ">
            <div class="mx-3">
                <div class="  p-3 rounded-box max-w-xl bg-base-200 w-full  ">

                    <div class=" flex gap-4 w-full">
                        <button @click="activeTab = 'featured'"
                            :class="{ '!bg-base-300 !rounded-box': activeTab === 'featured' }"
                            class="flex w-full cursor-pointer items-center rounded-full justify-center  group transition-all duration-300  p-2 md:p-3 gap-x-2 hover:bg-base-300">

                            <Icon name="solar:verified-check-bold-duotone" size="24"
                                :class="{ '!text-primary': activeTab === 'featured' }" />
                            <p class="font-bold text-xs md:text-base">Featured </p>
                        </button>
                        <button @click="activeTab = 'personal'"
                            :class="{ '!bg-base-300 !rounded-box': activeTab === 'personal' }"
                            class="flex w-full cursor-pointer items-center rounded-full justify-center  group transition-all duration-300  p-2 md:p-3 gap-x-2 hover:bg-base-300">

                            <Icon name="solar:star-fall-minimalistic-bold-duotone" size="24"
                                :class="{ '!text-primary': activeTab === 'personal' }" />
                            <p class="font-bold text-xs md:text-base">Personal </p>
                        </button>
                        <button @click="activeTab = 'oss'" :class="{ '!bg-base-300 !rounded-box': activeTab === 'oss' }"
                            class="flex w-full cursor-pointer items-center rounded-full justify-center  group transition-all duration-300  p-2 md:p-3 gap-x-2 hover:bg-base-300">

                            <Icon name="ph:git-branch-duotone" size="24"
                                :class="{ '!text-primary': activeTab === 'oss' }" />
                            <p class="font-bold hidden md:inline">Open source</p>
                            <p class="font-bold text-xs  md:hidden">OSS</p>
                        </button>
                    </div>

                </div>
            </div>
            <div v-auto-animate class="min-h-screen px-6">

                <ProjectsFeatured v-if="activeTab === 'featured'" />
                <ProjectsPersonal v-if="activeTab === 'personal'" />
                <ProjectsOSS v-if="activeTab === 'oss'" />

                <!-- <div class="mt-16">
                    <CtaCard />
                </div> -->
            </div>

        </div>
    </div>
</template>

