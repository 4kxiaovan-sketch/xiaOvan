import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getMapData } from '@/api/city';
export const useMapStore = defineStore('map', () => {
    const cities = ref([]);
    const loading = ref(false);
    async function loadMap(seasonId) {
        loading.value = true;
        try {
            cities.value = await getMapData(seasonId);
        }
        finally {
            loading.value = false;
        }
    }
    return {
        cities,
        loading,
        loadMap
    };
});
