<script lang="ts" setup>
import click from '../assets/sounds/button-click.mp3'
const playSounds = usePlaySound()
const { play } = useSound(click, { volume: 0.7 })

// Respect user's motion preference
const prefersReducedMotion = () => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const playSound = () => {
    // Only play if sounds are enabled AND user hasn't disabled motion
    if (playSounds.value && !prefersReducedMotion()) {
        play()
    }
}

const intro = useTemplateRef('intro')
const project = useTemplateRef('project')
const tech = useTemplateRef('tech')
const currentSection = ref(1)

// Use Intersection Observer instead of magic numbers
onMounted(() => {
    const options = {
        threshold: 0.5
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target.getAttribute('data-section')
                if (section) {
                    currentSection.value = parseInt(section)
                }
            }
        })
    }, options)

    // Observe sections
    if (intro.value) observer.observe(intro.value)
    if (tech.value) observer.observe(tech.value)
    if (project.value) observer.observe(project.value)

    onBeforeUnmount(() => observer.disconnect())
})

const technologies = [
    { name: 'Vue.js', icon: 'logos:vue' },
    { name: 'react.js', icon: 'logos:react' },
    { name: 'next.js', icon: 'logos:nextjs-icon' },
    { name: 'nuxt.js', icon: 'logos:nuxt-icon' },
    { name: 'claude code', icon: 'logos:claude-icon' },
    { name: 'bash', icon: 'logos:bash-icon' },
    { name: 'Copilot', icon: 'logos:github-copilot', theme: 'light' },
    { name: 'Gemini-cli', icon: 'logos:google-gemini' },
    { name: 'Typescript', icon: 'logos:typescript-icon' },
    { name: 'Supabase', icon: 'logos:supabase-icon' },
    { name: 'Sanity.io', icon: 'logos:sanity' },
    { name: 'TailwindCSS', icon: 'logos:tailwindcss-icon' },
    { name: 'DaisyUI', icon: 'logos:daisyui-icon' },
    { name: 'bunjs', icon: 'logos:bun' },
    { name: 'nodejs', icon: 'logos:nodejs-icon-alt' },
    { name: 'go', icon: 'logos:go' },
    { name: 'dart', icon: 'logos:dart' },
    { name: 'git', icon: 'logos:git-icon' }
]
</script>
<template>
    <div class="flex flex-col md:flex-row gap-8  py-6 md:p-6  ">
        <div class="h-max w-1/3 md:sticky md:top-28">
            <div class="relative">
                <div class="absolute  z-1 -bottom-0">
                    <span
                        class="!p-2 rounded-full bg-base-200  shadow-xl border-1 text-xs border-base-content/30 font-mono flex items-center gap-2 ">
                        🚀
                    </span>
                </div>
                <div class="avatar">
                    <div
                        class="lg:w-48 w-36 rounded-full ring border-6 border-base-200 outline-6 shadow-xl hover:shadow-primary/60 transition duration-700 hover:border-primary outline-base-300">
                        <NuxtImg height="500" width="500" format="webp" src="/images/me.png" preload
                            alt="A portrait of Michael Nji" :custom="true" class="rounded-box border border-base-300"
                            v-slot="{ src, isLoaded, imgAttrs }">

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
                    <li class="text-sm lg:text-lg  flex  gap-x-3 items-center font-normal-weight text-content-secondary"
                        :class="{ 'text-primary !opacity-100': currentSection === 1 }">
                        <span class="!hidden lg:!inline">👋🏽</span> Hello there
                    </li>
                    <li class="text-sm lg:text-lg  flex  gap-x-3 items-center font-normal-weight text-content-secondary"
                        :class="{ 'text-primary !opacity-100': currentSection === 2 }">
                        <span class="!hidden lg:!inline">👨🏽‍💻</span> Tech background
                    </li>
                    <li class="text-sm lg:text-lg  flex  gap-x-3 items-center font-normal-weight text-content-secondary"
                        :class="{ 'text-primary !opacity-100': currentSection === 3 }">
                        <span class="!hidden lg:!inline">👀</span>
                        Currently working on
                    </li>
                </ul>
            </div>
        </div>
        <div class="w-2/2">
            <h1 ref='intro' data-section="1" class="font-semibold  text-6xl xl:text-7xl font-display">Hey, I'm <span
                    class="text-primary underline font-medium ">Michael</span>
            </h1>
            <p class="text-lg md:text-xl leading-relaxed mt-4 font-medium text-base-content">
                I love building cool stuf with programming.
            </p>



            <p class="text-lg leading-8 mt-6 font-normal-weight text-content-secondary">I have been coding for well over
                3 years now, mostly websites, but now venturing into other stuff like backend services, cli tooling and
                even desktop and mobile apps. I have a passion for learning new technologies and building things that
                solve real problems.
            </p>
            <p class="text-lg leading-8 mt-6 font-normal-weight text-content-secondary">Here are my contact details
            </p>

            <div class="mt-6 flex !gap-3">
                <SocialIcon @click="playSound" href="https://github.com/michaelnji" ariaLabel="Visit GitHub profile"
                    icon="simple-icons:github" target="_blank" rel="noopener noreferrer" />

                <SocialIcon @click="playSound" href="https://wa.link/j63c5d" ariaLabel="Contact via WhatsApp"
                    icon="simple-icons:whatsapp" target="_blank" rel="noopener noreferrer" />

                <SocialIcon href="#" ariaLabel="Join Discord community" icon="simple-icons:discord" disabled />

                <SocialIcon @click="playSound" href="mailto:hello@michaelnji.codes"
                    ariaLabel="Send email to hello@michaelnji.codes" icon="simple-icons:gmail" />
            </div>

            <div class="mt-16">
                <div class="flex gap-x-2 items-center">
                    <h2 ref='tech' data-section="2" class=" font-medium text-2xl">I like using tools that help me <span
                            class="font-bold text-primary">ship quickly</span></h2>
                </div>
                <p class="text-lg font-normal-weight leading-8 mt-6 text-content-secondary">It's not just about writing
                    code. I love trying out new technologies, especially now with the advent of AI. Here are some tools
                    I work with:</p>

                <div class="mt-2 flex flex-wrap gap-3">
                    <TechBadge v-for="tech in technologies" :key="tech.name" :name="tech.name" :icon="tech.icon"
                        :theme="tech.theme" />
                </div>
                <p class="text-lg font-normal-weight leading-8 mt-6 text-content-secondary">I've also contributed to
                    open-source projects like <NuxtLink @click="playSound" to="https://github.com/biomejs/biome"
                        target="_blank" class="underline text-primary">Biome</NuxtLink> and built tools like my
                    <NuxtLink @click="playSound" to="https://github.com/michaelnji/kount-cli" target="_blank"
                        class="underline text-primary">kount-cli</NuxtLink>.
                </p>
            </div>
            <div class="mt-16">
                <div class="flex gap-x-2 items-center">
                    <h2 ref='project' data-section="3" class=" font-medium text-2xl">I'm currently working on <span
                            class="font-bold text-primary">Kairos</span></h2>
                </div>
                <p class="text-lg font-normal-weight leading-8 mt-6 text-content-secondary">I'm currently building
                    <NuxtLink @click="playSound" to="https://kairos.michaelnji.codes" target="_blank"
                        class="underline text-primary font-semibold">Kairos</NuxtLink>, a macOS/Linux app + Vscode
                    extension to replace wakatime in my dev environment. Totally open source and works offline too..
                </p>
            </div>
            <div class="mt-16">
                <h3 class="font-bold text-2xl">Let's work together</h3>
                <p class="text-lg font-normal-weight leading-8 mt-4 text-content-secondary">Whether you need a developer
                    for your next project, want to collaborate on something interesting, or just want to chat about web
                    development, I'd love to hear from you.</p>
                <div class="grid mt-8 md:grid-cols-2 gap-3">
                    <NuxtLink @click="playSound" to="/projects">
                        <LinkCard>
                            <template #title>
                                My Projects
                                <Icon name="simple-icons:git" />
                            </template>
                            <template #description>
                                See what I've built, from side projects to full-stack applications
                            </template>
                        </LinkCard>
                    </NuxtLink>
                    <NuxtLink @click="playSound" to="/blog">
                        <LinkCard>
                            <template #title>
                                Blog
                                <Icon name="ph:book-bookmark-duotone" />
                            </template>
                            <template #description>
                                I occasionally write technical articles about technologies I use & my experiences.
                            </template>
                        </LinkCard>
                    </NuxtLink>
                    <NuxtLink @click="playSound"
                        to="https://cod3vils-organization.gitbook.io/michaelnji/small-libraries/nexus-req">
                        <LinkCard>
                            <template #title>
                                Documentation
                                <Icon name="simple-icons:gitbook" />
                            </template>
                            <template #description>
                                This hosts documentation for all libraries and cli tools I have created.
                            </template>
                        </LinkCard>
                    </NuxtLink>
                    <NuxtLink @click="playSound" to="mailto:hello@michaelnji.codes">
                        <LinkCard highlight full>
                            <template #title>
                                Get in Touch
                                <Icon name="simple-icons:gmail" />
                            </template>
                            <template #description>
                                Ready to work together? Reach out at hello@michaelnji.codes
                            </template>
                        </LinkCard>
                    </NuxtLink>
                </div>
            </div>
            <div class="">
                <BlogStatsSection />
            </div>
        </div>

    </div>
</template>