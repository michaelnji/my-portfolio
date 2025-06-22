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
        image: 'gemmafx.png',
        title: 'Gemma FX',
        link: 'https://gemmafx.vercel.app',
        type: 'open source',
        description: 'A blog for aspiring forex traders in Cameroon, with reviews and coupons.',
        duration: 'May 2025 - now',
        status: "wip" as const
    },
    {
        image: 'atud.png',
        title: 'ATUD & Sons',
        link: 'https://atuds-and-sons.vercel.app',
        type: 'closed source',
        description: 'A website for a small tire repair shop in the US. Built this for a friend of mine.',
        duration: 'June 2024 - August 2024',
        status: "complete" as const
    },
]
</script>
<template>
    <div class="">
        <h2 class="font-bold text-4xl hidden md:block font-display">
            Featured
        </h2>
        <div class="md:mt-12 grid lg:grid-cols-2 gap-8">
            <LazyProjectsCard v-for="project in projects" :details="project" />
        </div>
    </div>
</template>