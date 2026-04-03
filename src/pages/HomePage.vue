<template>
  <section class="page">
    <div class="page-header">
      <div>
        <h2>天下总览</h2>
        <p v-if="gameStore.activeSeason">
          当前赛季：{{ gameStore.activeSeason.name }}
        </p>
        <p v-else>暂无进行中的赛季</p>
      </div>

      <div class="user-box">
        <strong>{{ authStore.profile?.nickname || authStore.user?.email }}</strong>
        <span v-if="factionStore.myFaction">已建立政权：{{ factionStore.myFaction.name }}</span>
        <span v-else>尚未建立政权</span>
      </div>
    </div>

    <section class="action-panel">
      <RouterLink
        v-if="!factionStore.myFaction"
        class="action-btn"
        to="/create-faction"
      >
        创建政权
      </RouterLink>

      <RouterLink
        v-else
        class="action-btn"
        to="/faction"
      >
        进入政权
      </RouterLink>
    </section>

    <section class="list-section">
      <div class="section-title">
        <h3>本赛季政权</h3>
        <span v-if="factionStore.loading">加载中...</span>
      </div>

      <div v-if="factionStore.factions.length > 0" class="faction-grid">
        <FactionCard
          v-for="faction in factionStore.factions"
          :key="faction.id"
          :faction="faction"
        />
      </div>

      <p v-else class="empty-text">当前暂无政权数据。</p>
    </section>
  </section>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { RouterLink } from 'vue-router';
import FactionCard from '@/components/FactionCard.vue';
import { useAuthStore } from '@/stores/auth';
import { useGameStore } from '@/stores/game';
import { useFactionStore } from '@/stores/faction';

const authStore = useAuthStore();
const gameStore = useGameStore();
const factionStore = useFactionStore();

async function loadPageData() {
  if (!authStore.isAuthenticated) return;

  if (!gameStore.activeSeason) {
    await gameStore.loadActiveSeason();
  }

  if (!gameStore.activeSeason) return;

  await Promise.all([
    factionStore.loadFactions(gameStore.activeSeason.id),
    factionStore.loadMyFaction(gameStore.activeSeason.id)
  ]);
}

onMounted(async () => {
  await loadPageData();
});

watch(
  () => authStore.isAuthenticated,
  async (isAuthenticated) => {
    if (isAuthenticated) {
      await loadPageData();
    }
  }
);
</script>

<style scoped>
.page {
  display: grid;
  gap: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.page-header h2 {
  margin: 0;
  color: #5b3427;
}

.page-header p {
  margin: 8px 0 0;
  color: #8b6d56;
}

.user-box {
  display: grid;
  gap: 6px;
  padding: 14px 16px;
  border: 1px solid #dbcbb2;
  border-radius: 12px;
  background: #fffaf1;
  min-width: 220px;
}

.user-box strong {
  color: #5b3427;
}

.user-box span {
  color: #6e5a48;
  font-size: 14px;
}

.action-panel {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #8c3d2e;
  color: #fffaf1;
  text-decoration: none;
  padding: 12px 18px;
  border-radius: 10px;
  font-weight: 600;
}

.list-section {
  display: grid;
  gap: 16px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title h3 {
  margin: 0;
  color: #5b3427;
}

.section-title span {
  color: #8b6d56;
}

.faction-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.empty-text {
  color: #8b6d56;
}
</style>
