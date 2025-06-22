import type { ServerResponse, StatusCodes } from 'nexus-req';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Post } from '../server/types/index.types';

export const usePostsStore = defineStore('Posts', () => {

    const posts = ref<Post[] | null>(null)



    const fetchPosts = async () => {


        const response = await $fetch<ServerResponse<StatusCodes, Post[]>>('/api/sanity/posts/', {
            retry: 0, retryDelay: 0
        });

        if (!response.ok) {
            throw new Error(response.message);
        }
        if (response.data) {
            posts.value = response.data;

        }


    }


    return {

        posts,

        fetchPosts,

    };
});
