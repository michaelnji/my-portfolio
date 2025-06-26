import type { ServerResponse, StatusCodes } from 'nexus-req';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Post } from '../server/types/index.types';

export const useCategoriesStore = defineStore('Categories', () => {

    const categories = ref<{ title: string }[] | null>(null)



    const fetchCategories = async () => {


        const response = await $fetch<ServerResponse<StatusCodes, { title: string }[]>>('/api/sanity/categories/', {
            retry: 0, retryDelay: 0
        });

        if (!response.ok) {
            throw new Error(response.message);
        }
        if (response.data) {
            categories.value = response.data;

        }


    }


    return {

        categories,

        fetchCategories,

    };
});
