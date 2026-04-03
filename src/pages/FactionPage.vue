<template>
  <section class="page">
    <div class="page-header">
      <div>
        <h2>政权详情</h2>
        <p>查看你的政权现状与关键记录。</p>
      </div>
    </div>

    <div v-if="!gameStore.activeSeason" class="empty-box">
      当前没有可用赛季。
    </div>

    <div v-else-if="factionStore.loading" class="empty-box">
      正在加载政权信息...
    </div>

    <div v-else-if="!factionStore.myFaction" class="empty-box">
      你尚未建立政权，请先前往创建。
    </div>

    <template v-else>
      <section class="info-card">
        <div class="title-row">
          <h3>{{ factionStore.myFaction.name }}</h3>
          <span v-if="factionStore.myFaction.is_npc" class="badge">NPC</span>
          <span v-else class="badge player">玩家政权</span>
        </div>

        <div class="info-grid">
          <div><strong>君主标识：</strong>{{ factionStore.myFaction.ruler_character_key }}</div>
          <div><strong>君主名称：</strong>{{ factionStore.myFaction.ruler_name || '未设置' }}</div>
          <div><strong>都城：</strong>{{ factionStore.myFaction.capital_city_id || '未指定' }}</div>
          <div><strong>国策：</strong>{{ factionStore.myFaction.policy || '暂无' }}</div>
          <div><strong>赛季积分：</strong>{{ factionStore.myFaction.season_score }}</div>
          <div><strong>状态：</strong>{{ factionStore.myFaction.is_eliminated ? '已灭亡' : '存续中' }}</div>
        </div>
      </section>

      <ResourcePanel
        :gold="factionStore.myFaction.gold"
        :food="factionStore.myFaction.food"
        :population="factionStore.myFaction.population"
        :morale="factionStore.myFaction.morale"
        :public-support="factionStore.myFaction.public_support"
        :troops="factionStore.myFaction.troops"
      />

      <section class="log-section">
        <div class="section-title">
          <h3>政权日志</h3>
          <span v-if="reportStore.loadingLogs">加载中...</span>
        </div>

        <ul v-if="reportStore.logs.length > 0" class="log-list">
          <li v-for="log in reportStore.logs" :key="log.id">
            <div class="log-top">
              <strong>{{ log.action_type }}</strong>
              <span>{{ formatTime(log.created_at) }}</span>
            </div>
            <p>{{ renderDetail(log.detail) }}</p>
          </li>
        </ul>

        <p v-else class="empty-text">暂无相关日志。</p>
      </section>
    </template>
  </section>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import ResourcePanel from '@/components/ResourcePanel.vue';
import { useFactionStore } from '@/stores/faction';
import { useGameStore } from '@/stores/game';
import { useReportStore } from '@/stores/report';

const factionStore = useFactionStore();
const gameStore = useGameStore();
const reportStore = useReportStore();

async function loadPageData() {
  if (!gameStore.activeSeason) {
    await gameStore.loadActiveSeason();
  }

  if (!gameStore.activeSeason) return;

  await factionStore.loadMyFaction(gameStore.activeSeason.id);

  if (factionStore.myFaction) {
    await reportStore.loadLogs(gameStore.activeSeason.id, factionStore.myFaction.id);
  }
}

onMounted(async () => {
  await loadPageData();
});

watch(
  () => gameStore.activeSeason?.id,
  async () => {
    await loadPageData();
  }
);

function formatTime(value: string) {
  return new Date(value).toLocaleString();
}

function renderDetail(detail: Record<string, unknown>) {
  const entries = Object.entries(detail ?? {});
  if (entries.length === 0) return '无详细记录';

  return entries.map(([key, value]) => `${key}: ${String(value)}`).join(' | ');
}
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

.info-card,
.log-section,
.empty-box {
  background: #fffaf1;
  border: 1px solid #dbcbb2;
  border-radius: 16px;
  padding: 20px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.title-row h3 {
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

.badge.player {
  background: #efd8c6;
  color: #8c3d2e;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  color: #4f4032;
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

.log-list {
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
  display: grid;
  gap: 12px;
}

.log-list li {
  border: 1px solid #e0d3be;
  border-radius: 12px;
  padding: 14px;
  background: #fcf7ee;
}

.log-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.log-top strong {
  color: #5b3427;
  text-transform: capitalize;
}

.log-top span {
  color: #8b6d56;
  font-size: 13px;
}

.log-list p,
.empty-text,
.empty-box {
  color: #6e5a48;
  margin: 8px 0 0;
}
</style>
