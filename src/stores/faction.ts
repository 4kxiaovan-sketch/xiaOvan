import { ref } from 'vue';
import { defineStore } from 'pinia';
import { createFaction, getMyRuledFaction, listFactions } from '@/api/faction';
import type { CreateFactionPayload } from '@/types/game';
import type { FactionRow } from '@/types/supabase';

export const useFactionStore = defineStore('faction', () => {
  const factions = ref<FactionRow[]>([]);
  const myFaction = ref<FactionRow | null>(null);
  const loading = ref(false);

  async function loadFactions(seasonId: string) {
    loading.value = true;
    try {
      factions.value = await listFactions(seasonId);
    } finally {
      loading.value = false;
    }
  }

  async function loadMyFaction(seasonId: string) {
    loading.value = true;
    try {
      myFaction.value = await getMyRuledFaction(seasonId);
    } finally {
      loading.value = false;
    }
  }

  async function createNewFaction(payload: CreateFactionPayload) {
    loading.value = true;
    try {
      const created = await createFaction(payload);
      myFaction.value = created;

      const exists = factions.value.some((item) => item.id === created.id);
      if (!exists) {
        factions.value = [...factions.value, created];
      }

      return created;
    } finally {
      loading.value = false;
    }
  }

  return {
    factions,
    myFaction,
    loading,
    loadFactions,
    loadMyFaction,
    createNewFaction
  };
});
