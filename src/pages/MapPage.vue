<template>
  <section class="page">
    <div class="page-header">
      <div>
        <h2>山河版图</h2>
        <p>查看赛季内各城池归属与驻防状态。</p>
      </div>
    </div>

    <div v-if="!gameStore.activeSeason" class="empty-box">
      当前没有可用赛季。
    </div>

    <div v-else-if="mapStore.loading" class="empty-box">
      地图加载中...
    </div>

    <div v-else-if="mappedCities.length === 0" class="empty-box">
      暂无地图数据。
    </div>

    <div v-else class="city-grid">
      <CityCard
        v-for="city in mappedCities"
        :key="city.id"
        :name="city.name"
        :terrain="city.terrain"
        :owner-name="city.ownerName"
        :troops="city.troops"
        :defense="city.defense"
        :prosperity="city.prosperity"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import CityCard from '@/components/CityCard.vue';
import { useFactionStore } from '@/stores/faction';
import { useGameStore } from '@/stores/game';
import { useMapStore } from '@/stores/map';

const gameStore = useGameStore();
const factionStore = useFactionStore();
const mapStore = useMapStore();

async function loadPageData() {
  if (!gameStore.activeSeason) {
    await gameStore.loadActiveSeason();
  }

  if (!gameStore.activeSeason) return;

  await Promise.all([
    factionStore.loadFactions(gameStore.activeSeason.id),
    mapStore.loadMap(gameStore.activeSeason.id)
  ]);
}

onMounted(async () => {
  await loadPageData();
});

const factionNameMap = computed(() => {
  return new Map(factionStore.factions.map((faction) => [faction.id, faction.name]));
});

const mappedCities = computed(() => {
  return mapStore.cities.map((city) => ({
    ...city,
    ownerName: city.owner_faction_id
      ? factionNameMap.value.get(city.owner_faction_id) ?? '未知势力'
      : '中立'
  }));
});
</script>

<style scoped>
.page {
  display: grid;
  gap: 20px;
}

.page-header h2 {
  margin: 0;
  color: #5b3427;
}

.page-header p {
  margin: 8px 0 0;
  color: #8b6d56;
}

.city-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.empty-box {
  background: #fffaf1;
  border: 1px solid #dbcbb2;
  border-radius: 16px;
  padding: 20px;
  color: #6e5a48;
}
</style>
