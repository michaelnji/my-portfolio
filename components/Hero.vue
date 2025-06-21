<script lang="ts" setup>
import img from '../assets/images/file_00000000121462308afdcbf5e05b88cc.png'
</script>
<template>
    <div class="flex gap-12 py-12 ">
        <div class="h-max w-1/3 sticky top-12">
            <div class="avatar">
                <div class="w-48 rounded-full ring border-6 border-secondary outline-6 outline-primary">
                    <img :src="img" alt="">
                </div>

            </div>
            <div class="mt-12 flex">
                <ul class="space-y-4">
                    <li class="text-lg flex text-primary gap-x-3 items-center font-bold ">
                        <Icon name="solar:hand-shake-broken" size="28" /> Hello there
                    </li>
                    <li class="text-lg flex  gap-x-3 items-center font-bold opacity-40">
                        <Icon name="solar:code-broken" size="28" /> Tech background
                    </li>
                    <li class="text-lg flex  gap-x-3 items-center font-bold opacity-40">
                        <Icon name="solar:bookmark-square-minimalistic-broken" size="28" /> Currently working on
                    </li>
                </ul>
            </div>
        </div>
        <div class="w-2/2">
            <h1 class="font-semibold text-8xl font-display">Hi, I'm <span
                    class="text-primary font-medium italic">Michael</span>
                A Frontend Web
                developer & Blogger.
            </h1>



            <p class="text-xl leading-8 mt-6 opacity-70">I am the creator of
                <HeroLink text="nexus-req" /> , A simple library for formulating consistent response objects.Iam the
                main developer @
                <HeroLink text="HCS shuttles & Tours" /> . I work
                as a
                freelance web developer in Cameroon and also run a forex trading blog called
                <HeroLink text="gemma-fx" /> as a side hobby during my spare time. Here are quick links to my Github &
                social media
            </p>
            <div class="!mt-6 !flex !gap-3">

                <div
                    class="!py-2 px-2 rounded-lg bg-base-200  inline-flex shadow-xl border-1 border-dashed text-base border-base-content/30 font-mono">

                    <Icon name="simple-icons:github" class="text-white" size="36" />
                </div>

                <div
                    class="!py-2 px-2 rounded-lg bg-base-200  inline-flex shadow-xl border-1 border-dashed text-base border-base-content/30 font-mono">

                    <Icon name="simple-icons:discord" size="36" class="" />
                </div>
                <div
                    class="!py-2 px-2 rounded-lg bg-base-200  inline-flex shadow-xl border-1 border-dashed text-base border-base-content/30 font-mono">

                    <Icon name="simple-icons:gmail" size="36" class="" />
                </div>
            </div>

            <div class="mt-16">
                <div class="flex gap-x-2">
                    <Icon name="solar:clock-circle-line-duotone" size="36" class="text-secondary" />
                    <h2 class="font-display font-medium text-4xl">I started coding in <span
                            class="font-bold ">2022</span></h2>

                </div>
                <p class="text-xl leading-8 mt-6 opacity-70">I have been building projects with web technologies foe
                    over 3 years now, gaining valuable experience through practice & consistent learning. I have
                    experience with technologies like:

                </p>
                <div class="mt-2 flex flex-wrap gap-3">
                    <span
                        class="!py-1 px-3 rounded-lg bg-base-200  inline-flex shadow-xl border-1 border-dashed text-base border-base-content/30 font-mono flex items-center gap-2 ">
                        <Icon name="logos:vue" /> Vue.js
                    </span>
                    <span
                        class="!py-1 px-3 rounded-lg bg-base-200  inline-flex shadow-xl border-1 border-dashed text-base border-base-content/30 font-mono flex items-center gap-2 ">
                        <Icon name="logos:typescript-icon-round" />Typescript
                    </span>
                    <span
                        class="!py-1 px-3 rounded-lg bg-base-200  inline-flex shadow-xl border-1 border-dashed text-base border-base-content/30 font-mono flex items-center gap-2 ">
                        <Icon name="logos:supabase-icon" />Supaase
                    </span>
                    <span
                        class="!py-1 px-3 rounded-lg bg-base-200  inline-flex shadow-xl border-1 border-dashed text-base border-base-content/30 font-mono flex items-center gap-2 ">
                        <Icon name="logos:tailwindcss-icon" />TailwindCSS
                    </span>
                    <span
                        class="!py-1 px-3 rounded-lg bg-base-200  inline-flex shadow-xl border-1 border-dashed text-base border-base-content/30 font-mono flex items-center gap-2 ">
                        <Icon name="logos:bun" />bunjs
                    </span>
                    <span
                        class="!py-1 px-3 rounded-lg bg-base-200  inline-flex shadow-xl border-1 border-dashed text-base border-base-content/30 font-mono flex items-center gap-2 ">
                        <Icon name="logos:nodejs-icon-alt" />nodejs
                    </span>
                    <span
                        class="!py-1 px-3 rounded-lg bg-base-200  inline-flex shadow-xl border-1 border-dashed text-base border-base-content/30 font-mono flex items-center gap-2 ">
                        <Icon name="logos:git-icon" />git
                    </span>
                    <span
                        class="!py-1 px-3 rounded-lg bg-base-200  inline-flex shadow-xl border-1 border-dashed text-base border-base-content/30 font-mono flex items-center gap-2 ">
                        <Icon name="simple-icons:github" />Github
                    </span>
                </div>
                <p class="text-xl leading-8 mt-6 opacity-70">I also have some experience in design and backend web
                    development, and I have built fully functional full stack projects in the past.

                </p>
            </div>
            <div class="mt-16">
                <div class="flex gap-x-2">
                    <Icon name="solar:laptop-line-duotone" size="36" class="text-secondary" />
                    <h2 class="font-display font-medium text-4xl">I'm currently working on <span
                            class="font-bold text-primary">Gemma Fx</span></h2>

                </div>
                <p class="text-xl leading-8 mt-6 opacity-70">I am developing my forex trading website, which will launch
                    later this year and will be phenomenal! <NuxtLink to="https://gemmafx.vercel.app" target="_blank"
                        class="underline text-primary">
                        Check it out here
                    </NuxtLink>

                </p>

            </div>
        </div>

    </div>
</template>