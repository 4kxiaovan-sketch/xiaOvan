<template>
  <article class="faction-card">
    <div class="card-top">
      <h3>{{ faction.name }}</h3>
      <span v-if="faction.is_npc" class="badge">NPC</span>
    </div>

    <p class="ruler">
      君主：{{ faction.ruler_name || faction.ruler_character_key }}
    </p>

    <div class="stats">
      <span>金钱 {{ faction.gold }}</span>
      <span>粮草 {{ faction.food }}</span>
      <span>兵力 {{ faction.troops }}</span>
      <span>民心 {{ faction.public_support }}</span>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { FactionRow } from '@/types/supabase';

defineProps<{
  faction: FactionRow;
}>();
</script>

<style scoped>
.faction-card {
  padding: 16px;
  background: #fffaf1;
  border: 1px solid #dbcbb2;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(80, 51, 27, 0.06);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.card-top h3 {
  margin: 0;
  color: #5b3427;
}

.badge {
  padding: 4px 8px;
  border-radius: 999px;
  background: #ead5b6;
  color: #7a4b27;
  font-size: 12px;
}

.ruler {
  margin: 10px 0 14px;
  color: #6e5a48;
}

.stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  color: #4f4032;
  font-size: 14px;
}
</style>
