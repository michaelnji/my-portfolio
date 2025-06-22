<script lang="ts" setup>
const intro = useTemplateRef('intro')
const project = useTemplateRef('project')
const tech = useTemplateRef('tech')
const { top: introTop }
    = useElementBounding(intro)
const { top: techTop }
    = useElementBounding(tech)
const { top: projectTop }
    = useElementBounding(project)
const currentSection = computed(() => {
    if (introTop.value <= 200 && techTop.value > 400 && projectTop.value > 400) return 1
    if (projectTop.value <= 400 && techTop.value < 400) return 3
    if (techTop.value <= 400) return 2
})

</script>
<template>
    <div class="flex flex-col md:flex-row gap-8  py-6 md:p-6  ">
        <div class="h-max w-1/3 md:sticky md:top-12">
            <div class="relative">
                <div class="absolute  z-1 -bottom-0">
                    <span
                        class="!p-2 rounded-full bg-base-200  inline-flex shadow-xl border-1 text-xs text-base border-base-content/30 font-mono flex items-center gap-2 ">
                        🚀
                    </span>
                </div>
                <div class="avatar">
                    <div
                        class="lg:w-48 w-36 rounded-full ring border-6 border-base-200 outline-6 shadow-xl hover:shadow-primary/60 transition duration-700 hover:border-primary outline-base-300">
                        <NuxtImg format="webp" src="/images/me.png" alt="A portrait of Michael Nji" :custom="true"
                            class="rounded-box border border-base-300" v-slot="{ src, isLoaded, imgAttrs }">

                            <!-- Show the actual image when loaded -->
                            <img v-if="isLoaded" v-bind="imgAttrs" :src="src" class="w-full object-contain">

                            <!-- Show a placeholder while loading -->
                            <div class="skeleton  bg-base-300 lg:bg-base-200 w-full lg:size-48 size-36"
                                v-if="!isLoaded">
                            </div>
                        </NuxtImg>

                    </div>
                </div>

            </div>
            <div class="mt-12 hidden md:flex">
                <ul class="space-y-4">
                    <li class="text-base opacity-40 lg:text-lg  flex  gap-x-3 items-center font-bold "
                        :class="{ 'text-primary !opacity-100': currentSection === 1 }">
                        <Icon name="solar:hand-shake-broken" size="28" class="!hidden lg:!inline" /> Hello there
                    </li>
                    <li class="text-base lg:text-lg  flex  gap-x-3 items-center font-bold opacity-40"
                        :class="{ 'text-primary !opacity-100': currentSection === 2 }">
                        <Icon name="solar:code-broken" size="28" class="!hidden lg:!inline" /> Tech background
                    </li>
                    <li class="text-base lg:text-lg  flex  gap-x-3 items-center font-bold opacity-40"
                        :class="{ 'text-primary !opacity-100': currentSection === 3 }">
                        <Icon name="solar:bookmark-square-minimalistic-broken" size="28" class="!hidden lg:!inline" />
                        Currently working on
                    </li>
                </ul>
            </div>
        </div>
        <div class="w-2/2">
            <h1 ref='intro' class="font-semibold  text-6xl xl:text-8xl font-display">Hi, I'm <span
                    class="text-primary underline font-medium ">Michael</span>
                A Frontend Web
                developer.
            </h1>



            <p class="text-xl leading-8 mt-6 opacity-70">I am the
                creator
                of
                <NuxtLink to="https://cod3vils-organization.gitbook.io/michaelnji/small-libraries/nexus-req"
                    target="_blank">

                    <span
                        class="py-0 px-2 rounded-lg bg-base-200  inline-flex shadow-xl border-1 border-dashed text-base border-base-content/30 font-mono hover:border-solid hover:border-primary transition-all !opacity-100">

                        nexus-req
                    </span>
                </NuxtLink> , A simple library for formulating consistent response objects. I am the
                main developer @
                <NuxtLink to="https://hcsshuttleandtourservices.com" target="_blank">
                    <span
                        class="py-0 px-2 rounded-lg bg-base-200  inline-flex shadow-xl border-1 border-dashed text-base border-base-content/30 font-mono hover:border-solid hover:border-primary transition-all !opacity-100">

                        HCS shuttles & Tours
                    </span>
                </NuxtLink> . I work
                as a
                freelance web developer in Cameroon and also run a forex trading blog called
                <NuxtLink to="https://gemmafx.vercel.app" target="_blank">

                    <span
                        class="py-0 px-2 rounded-lg bg-base-200  inline-flex shadow-xl border-1 border-dashed text-base border-base-content/30 font-mono hover:border-solid hover:border-primary transition-all !opacity-100">
                        Gemma Fx
                    </span>
                </NuxtLink>
                as a hobby during my spare time. Here are quick links to my Github &
                social media
            </p>

            <div class="mt-6 flex !gap-3">

                <NuxtLink to="https://github.com/michaelnji" target="_blank">
                    <div
                        class="py-2 px-2 shadow-md hover:shadow-primary/30 rounded-lg bg-base-200  inline-flex shadow-xl border-1 border-dashed text-base border-base-content/30 font-mono hover:border-solid hover:border-primary transition-all">

                        <Icon name="simple-icons:github" class="text-white" size="36" />
                    </div>
                </NuxtLink>
                <NuxtLink to="https://github.com/michaelnji" target="_blank">
                    <div
                        class="py-2 px-2 shadow-md hover:shadow-primary/30 rounded-lg bg-base-200  inline-flex shadow-xl border-1 border-dashed text-base border-base-content/30 font-mono hover:border-solid hover:border-primary transition-all">

                        <Icon name="simple-icons:whatsapp" class="text-white" size="36" />
                    </div>
                </NuxtLink>

                <div
                    class="!py-2 px-2 shadow-md hover:shadow-primary/30 rounded-lg bg-base-200  inline-flex shadow-xl border-1 border-dashed text-base border-base-content/30 font-mono hover:border-solid hover:border-primary transition-all">

                    <Icon name="simple-icons:discord" size="36" class="" />
                </div>
                <div
                    class="!py-2 px-2 shadow-md hover:shadow-primary/30 rounded-lg bg-base-200  inline-flex shadow-xl border-1 border-dashed text-base border-base-content/30 font-mono hover:border-solid hover:border-primary transition-all">

                    <Icon name="simple-icons:gmail" size="36" class="" />
                </div>
            </div>

            <div class="mt-16">
                <div class="flex gap-x-2 items-center">

                    <h2 ref='tech' class=" font-medium text-3xl">I started coding in <span
                            class="font-bold ">2022</span>
                    </h2>

                </div>
                <p class="text-xl leading-8 mt-6 opacity-70">I have been building projects with web technologies for
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
                        <Icon name="logos:nuxt-icon" /> nuxt.js
                    </span>
                    <span
                        class="!py-1 px-3 rounded-lg bg-base-200  inline-flex shadow-xl border-1 border-dashed text-base border-base-content/30 font-mono flex items-center gap-2 ">
                        <Icon name="logos:typescript-icon" />Typescript
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
                <div class="flex gap-x-2 items-center">

                    <h2 ref='project' class=" font-medium text-3xl">I'm currently working on <span
                            class="font-bold text-primary">Gemma Fx</span></h2>

                </div>
                <p class="text-xl leading-8 mt-6 opacity-70">I am developing my forex trading website, which will launch
                    later this year and will be phenomenal! <NuxtLink to="https://gemmafx.vercel.app" target="_blank"
                        class="underline text-primary">
                        Check it out here
                    </NuxtLink>

                </p>

            </div>
            <div class="mt-16">
                <h3 class="font-bold text-2xl">Quick links</h3>
                <div class="grid mt-8 md:grid-cols-2 gap-3">
                    <NuxtLink to="/projects">
                        <div
                            class="!py-2 transition-all group hover:border-primary px-3 rounded-box bg-base-200   shadow-xl border-1  border-base-content/30">
                            <h3
                                class="font-medium transition-all group-hover:text-primary text-xl flex items-center gap-x-2">
                                My Projects
                                <Icon name="simple-icons:git" />
                            </h3>
                            <p class="mt-1  opacity-80">
                                Open source, personal and closed source projects I've worked on over the years
                            </p>
                        </div>
                    </NuxtLink>
                    <NuxtLink to="/blog">
                        <div
                            class="!py-2 transition-all group hover:border-primary px-3 rounded-box bg-base-200   shadow-xl border-1  border-base-content/30">
                            <h3
                                class="font-medium transition-all group-hover:text-primary text-xl flex items-center gap-x-2">
                                Blog
                                <Icon name="ph:book-bookmark-duotone" />

                            </h3>
                            <p class="mt-1  opacity-80">
                                I occasionally write technical articles about technologies I use & my experiences.
                            </p>
                        </div>
                    </NuxtLink>
                    <NuxtLink to="https://cod3vils-organization.gitbook.io/michaelnji/small-libraries/nexus-req">
                        <div
                            class="!py-2 transition-all group hover:border-primary px-3 rounded-box bg-base-200   shadow-xl border-1  border-base-content/30">
                            <h3
                                class="font-medium transition-all group-hover:text-primary text-xl flex items-center gap-x-2">
                                Documentation
                                <Icon name="simple-icons:gitbook" />
                            </h3>
                            <p class="mt-1  opacity-80">
                                This hosts documentation for all libraries I have created.
                            </p>
                        </div>
                    </NuxtLink>
                    <NuxtLink to="/games">
                        <div
                            class="!py-2 transition-all group hover:border-primary px-3 rounded-box bg-base-200   shadow-xl border-1  border-base-content/30">
                            <h3
                                class="font-medium transition-all group-hover:text-primary text-xl flex items-center gap-x-2">
                                Games
                                <Icon name="solar:gameboy-line-duotone" />
                            </h3>
                            <p class="mt-1  opacity-80">
                                This is a collection of fun little arcade games I have created.
                            </p>
                        </div>
                    </NuxtLink>
                </div>
            </div>
        </div>

    </div>
</template>