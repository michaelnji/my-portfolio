<script lang="ts" setup>
const projects = [
    {
        image: 'kira.png',
        title: 'Kira Template',
        link: 'https://kira-template.vercel.app',
        type: 'open source',
        description: 'A starter template for building nuxtjs apps, with typescrippt & tailwindcss',
        duration: 'April 2025 - April 2025',
        status: "complete" as const,
    },
    {
        image: 'nexus.png',
        title: 'nexus-req',
        link: 'https://cod3vils-organization.gitbook.io/michaelnji/small-libraries/nexus-req',
        type: 'open source',
        description: 'Typescript library for normalizing server responses in full stack web applications',
        duration: 'May 2025 - June 2025',
        status: "complete" as const,
    },



]
</script>
<template>
    <div class="">

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <LazyProjectsCard v-for="project in projects" :details="project" />
        </div>
    </div>
</template>