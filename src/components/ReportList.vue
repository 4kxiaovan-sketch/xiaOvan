<template>
  <div class="report-list">
    <article v-for="report in reports" :key="report.id" class="report-item">
      <div class="report-head">
        <h3>{{ report.attackerName }} vs {{ report.defenderName }}</h3>
        <span>{{ formatTime(report.created_at) }}</span>
      </div>

      <p class="meta">天气：{{ report.weather || '未知' }}</p>

      <p class="summary">{{ report.summary }}</p>
    </article>

    <p v-if="reports.length === 0" class="empty-text">暂无战报。</p>
  </div>
</template>

<script setup lang="ts">
interface ReportViewItem {
  id: string;
  attackerName: string;
  defenderName: string;
  weather: string | null;
  summary: string;
  created_at: string;
}

defineProps<{
  reports: ReportViewItem[];
}>();

function formatTime(value: string) {
  return new Date(value).toLocaleString();
}
</script>

<style scoped>
.report-list {
  display: grid;
  gap: 16px;
}

.report-item {
  padding: 16px;
  background: #fffaf1;
  border: 1px solid #dbcbb2;
  border-radius: 12px;
}

.report-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.report-head h3 {
  margin: 0;
  color: #5b3427;
  font-size: 18px;
}

.report-head span {
  color: #8b6d56;
  font-size: 13px;
}

.meta {
  margin: 10px 0 8px;
  color: #7a4b27;
}

.summary {
  margin: 0;
  color: #4f4032;
  line-height: 1.6;
}

.empty-text {
  color: #8b6d56;
}
</style>
