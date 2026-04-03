import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getMapData } from '@/api/city';
import type { CityMapItem } from '@/types/game';

export const useMapStore = defineStore('map', () => {
  const cities = ref<CityMapItem[]>([]);
  const loading = ref(false);

  async function loadMap(seasonId: string) {
    loading.value = true;
    try {
      cities.value = await getMapData(seasonId);
    } finally {
      loading.value = false;
    }
  }

  return {
    cities,
    loading,
    loadMap
  };
});
