<template>
  <section class="resource-panel">
    <div class="resource-item">
      <span class="label">金钱</span>
      <strong>{{ gold }}</strong>
    </div>
    <div class="resource-item">
      <span class="label">粮草</span>
      <strong>{{ food }}</strong>
    </div>
    <div class="resource-item">
      <span class="label">人口</span>
      <strong>{{ population }}</strong>
    </div>
    <div class="resource-item">
      <span class="label">士气</span>
      <strong>{{ morale }}</strong>
    </div>
    <div class="resource-item">
      <span class="label">民心</span>
      <strong>{{ publicSupport }}</strong>
    </div>
    <div class="resource-item">
      <span class="label">兵力</span>
      <strong>{{ troops }}</strong>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  gold: number;
  food: number;
  population: number;
  morale: number;
  publicSupport: number;
  troops: number;
}>();
</script>

<style scoped>
.resource-panel {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.resource-item {
  background: #fffaf1;
  border: 1px solid #dbcbb2;
  border-radius: 12px;
  padding: 14px;
}

.label {
  display: block;
  font-size: 13px;
  color: #8b6d56;
  margin-bottom: 8px;
}

strong {
  color: #5b3427;
  font-size: 18px;
}

@media (max-width: 768px) {
  .resource-panel {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
