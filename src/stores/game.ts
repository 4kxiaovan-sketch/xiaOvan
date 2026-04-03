import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getActiveSeason } from '@/api/season';
import type { SeasonRow } from '@/types/supabase';

export const useGameStore = defineStore('game', () => {
  const activeSeason = ref<SeasonRow | null>(null);
  const loading = ref(false);

  async function loadActiveSeason() {
    loading.value = true;
    try {
      activeSeason.value = await getActiveSeason();
    } finally {
      loading.value = false;
    }
  }

  return {
    activeSeason,
    loading,
    loadActiveSeason
  };
});
