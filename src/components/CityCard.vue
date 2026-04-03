<template>
  <article class="city-card">
    <div class="title-row">
      <h3>{{ name }}</h3>
      <span class="terrain">{{ terrainLabel }}</span>
    </div>

    <p class="owner">归属：{{ ownerName }}</p>

    <div class="stats">
      <span>驻军 {{ troops }}</span>
      <span>城防 {{ defense }}</span>
      <span>繁荣 {{ prosperity }}</span>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TerrainType } from '@/types/supabase';

const props = defineProps<{
  name: string;
  terrain: TerrainType;
  ownerName: string;
  troops: number;
  defense: number;
  prosperity: number;
}>();

const terrainLabel = computed(() => {
  const map: Record<TerrainType, string> = {
    plain: '平原',
    mountain: '山地',
    fortress: '城池'
  };

  return map[props.terrain];
});
</script>

<style scoped>
.city-card {
  padding: 16px;
  background: #fffaf1;
  border: 1px solid #dbcbb2;
  border-radius: 12px;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.title-row h3 {
  margin: 0;
  color: #5b3427;
}

.terrain {
  font-size: 12px;
  color: #7a4b27;
  background: #f0dfbf;
  padding: 4px 8px;
  border-radius: 999px;
}

.owner {
  margin: 10px 0 14px;
  color: #6e5a48;
}

.stats {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  color: #4f4032;
  font-size: 14px;
}
</style>
