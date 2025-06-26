import type { ServerResponse, StatusCodes } from 'nexus-req';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Post } from '../server/types/index.types';

export const usePostsStore = defineStore('Posts', () => {

    const posts = ref<Post[] | null>(null)
    const loading = ref(false)


    const fetchPosts = async () => {

        loading.value = true
        const response = await $fetch<ServerResponse<StatusCodes, Post[]>>('/api/sanity/posts/', {
            retry: 0, retryDelay: 0,
            onResponseError({ response }) {
                loading.value = false
            }
        });

        if (!response.ok) {
            loading.value = false
            throw new Error(response.message);
        }
        if (response.data) {
            loading.value = false
            posts.value = response.data;

        }


    }


    return {

        posts,
        loading,
        fetchPosts,

    };
});
