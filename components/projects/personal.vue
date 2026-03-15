<script lang="ts" setup>
const projects = [
    {
        image: 'ranked-choices.png',
        title: 'Ranked Choices',
        link: 'https://ranked-choices.vercel.app',
        type: 'open source',
        description: 'An app to to help me make better choices based on criterias I set.',
        duration: 'Feb 2026 - Present',
        status: "wip" as const,
        note: 'This is made for mobile, buggy on larger screens'
    },
    {
        image: 'oldportfolio.png',
        title: 'My old Portfolio',
        link: 'https://mykenji-v2.vercel.app',
        type: 'open source',
        description: 'The second iteration of my personal portfolio website & blog',
        duration: 'March 2024 - April 2024',
        status: "complete" as const,
    },
    // {
    //     image: 'paytrack.png',
    //     title: 'Paytrack',
    //     link: 'https://gruvvy.vercel.app',
    //     type: 'open source',
    //     description: 'An app to track monthly incomes and expenses.',
    //     duration: 'March 2024 - April 2024',
    //     status: "abandoned" as const,
    //     note: 'This only works on mobile screens'
    // },
    // {
    //     image: 'waza.png',
    //     title: 'Waza',
    //     link: 'https://wazabills.vercel.app',
    //     type: 'open source',
    //     description: 'A platform that allows Nigerians to pay for utility bills and to buy/gift airtime & data',
    //     duration: 'June 2024 - August 2024',
    //     status: "abandoned" as const
    // },
    {
        image: 'avecas.png',
        title: 'Avecas',
        link: 'https://avecas.netlify.app/',
        type: 'open source',
        description: 'My very first web project. This is here to remind me of just how Far I have come.',
        duration: 'Jan 2021 - Dec 2021',
        status: "abandoned" as const
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