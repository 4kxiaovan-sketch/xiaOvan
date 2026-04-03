<template>
  <section class="page">
    <div class="page-header">
      <div>
        <h2>天下战报</h2>
        <p>记录诸侯攻伐与战局变化。</p>
      </div>
    </div>

    <div v-if="!gameStore.activeSeason" class="empty-box">
      当前没有可用赛季。
    </div>

    <div v-else-if="reportStore.loadingReports" class="empty-box">
      战报加载中...
    </div>

    <div v-else-if="reportViewList.length === 0" class="empty-box">
      暂无战报。
    </div>

    <ReportList v-else :reports="reportViewList" />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import ReportList from '@/components/ReportList.vue';
import { useFactionStore } from '@/stores/faction';
import { useGameStore } from '@/stores/game';
import { useReportStore } from '@/stores/report';

const gameStore = useGameStore();
const factionStore = useFactionStore();
const reportStore = useReportStore();

async function loadPageData() {
  if (!gameStore.activeSeason) {
    await gameStore.loadActiveSeason();
  }

  if (!gameStore.activeSeason) return;

  await Promise.all([
    factionStore.loadFactions(gameStore.activeSeason.id),
    reportStore.loadReports(gameStore.activeSeason.id)
  ]);
}

onMounted(async () => {
  await loadPageData();
});

const factionNameMap = computed(() => {
  return new Map(factionStore.factions.map((faction) => [faction.id, faction.name]));
});

const reportViewList = computed(() => {
  return reportStore.reports.map((report) => ({
    id: report.id,
    attackerName:
      factionNameMap.value.get(report.attacker_faction_id) ?? '未知进攻方',
    defenderName:
      factionNameMap.value.get(report.defender_faction_id) ?? '未知防守方',
    weather: report.weather,
    summary: report.summary,
    created_at: report.created_at
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

.empty-box {
  background: #fffaf1;
  border: 1px solid #dbcbb2;
  border-radius: 16px;
  padding: 20px;
  color: #6e5a48;
}
</style>
