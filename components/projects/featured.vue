<script lang="ts" setup>
const projects = [
    {
        image: 'hcs.png',
        title: 'HCS Tours & Services',
        link: 'https://hcsshuttleandtourservices.com',
        type: 'closed source',
        description: 'A platform for tourists coming to Cameroon to discover beautiful venues',
        duration: 'May 2025 - June 2025',
        status: "complete" as const
    },
    {
        image: 'hado.png',
        title: 'Hado',
        link: 'https://hado-website.vercel.app',
        type: 'closed source',
        description: 'Landing page for Hado, an Estate development project in Dubai',
        duration: 'January 2026 - Present',
        status: "wip" as const
    },

]
</script>
<template>
    <div class="">

        <div class=" grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <LazyProjectsCard v-for="project in projects" :details="project" />
        </div>
    </div>
</template>