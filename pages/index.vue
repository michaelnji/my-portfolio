<script lang="ts" setup>
import { defaultSiteSettings } from '~/data/siteSettings';


useHead({
    htmlAttrs: { lang: 'en-US' }, // BCP 47 language code
    link: [{
        rel: 'canonical',
        href: defaultSiteSettings.siteUrl,
        // content: defaultSiteSettings.siteUrl
    }]
})

useSeoMeta({
    title: defaultSiteSettings.seo.title,
    titleTemplate: '%s',
    description: defaultSiteSettings.seo.description,
    ogType: 'website',
    ogUrl: defaultSiteSettings.siteUrl,
    ogLocale: 'en_US',
    ogSiteName: defaultSiteSettings.siteName,
    twitterTitle: defaultSiteSettings.siteName,
    twitterDescription: defaultSiteSettings.seo.description,

    // no longer explicitly used by X but may be useful for SEO
    // twitterSite: '@example',
    // twitterCreator: '@example',

    // og image
    ogImage: {
        url: `${defaultSiteSettings.siteUrl}/seo/og-image.png`,
        width: 1200,
        height: 800,
        alt: `Homepage of ${defaultSiteSettings.siteName}`,
        type: 'image/png'
    },
    twitterImage: {
        url: `${defaultSiteSettings.siteUrl}/seo/og-image.png`,
        width: 1200,
        height: 800,
        alt: `Homepage of ${defaultSiteSettings.siteName}`,
        type: 'image/png'
    },
    // twitter image (note: ogImage is used as a fallback so this is optional)
    twitterCard: 'summary_large_image', // or summary
})

definePageMeta({
    layout: 'home'
})
</script>

<template>
    <div class=" w-full p-6">
        <div class="container max-w-6xl mx-auto">
            <Hero />

        </div>
    </div>
</template>
