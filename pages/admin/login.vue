<script lang="ts" setup>
import { toast } from 'vue-sonner';

definePageMeta({ layout: false })

const password = ref('')
const loading = ref(false)

async function submit() {
    if (!password.value) return
    loading.value = true
    try {
        await $fetch('/api/admin/login', {
            method: 'POST',
            body: { password: password.value },
        })
        await navigateTo('/admin/overview')
    } catch (error: any) {
        const status = error?.statusCode ?? error?.status
        toast.error(
            status === 429
                ? 'Too many attempts — try again later'
                : 'Invalid password'
        )
        password.value = ''
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="w-full min-h-screen flex items-center justify-center p-6" data-theme="mine">
        <form class="card w-full max-w-sm bg-base-200 border border-base-300 shadow-lg" @submit.prevent="submit">
            <div class="card-body gap-4">
                <h1 class="card-title">Admin</h1>
                <input
                    v-model="password"
                    type="password"
                    placeholder="Password"
                    autofocus
                    class="input input-bordered w-full"
                />
                <button type="submit" class="btn btn-primary w-full" :disabled="loading || !password">
                    {{ loading ? 'Checking…' : 'Log in' }}
                </button>
            </div>
        </form>
    </div>
</template>
