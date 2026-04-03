<template>
  <section class="page">
    <div class="page-header">
      <div>
        <h2>抽卡测试台</h2>
        <p>验证每日 10 抽、保底、重复转将魂和职位定向池规则。</p>
      </div>
      <button class="ghost-btn" type="button" @click="resetState">重置记录</button>
    </div>

    <section class="control-card">
      <div class="control-grid">
        <label>
          <span>选择卡池</span>
          <select v-model="selectedPoolId">
            <option v-for="pool in availablePools" :key="pool.id" :value="pool.id">
              {{ pool.name }}
            </option>
          </select>
        </label>

        <div class="summary-box">
          <span>今日已用：{{ summary.freeDrawUsed }}/{{ summary.freeDrawLimit }}</span>
          <span>剩余免费：{{ summary.freeDrawRemaining }}</span>
          <span>将魂：{{ summary.soul }}</span>
          <span>已收录角色：{{ summary.ownedCount }}</span>
          <span>S 保底进度：{{ summary.pitySProgress }}</span>
          <span>SSS 强化进度：{{ summary.pitySSSProgress }}</span>
        </div>
      </div>

      <div class="button-row">
        <button class="primary-btn" type="button" @click="handleSingleDraw">
          单抽
        </button>
        <button class="primary-btn" type="button" @click="handleTenDraw">
          十连
        </button>
      </div>

      <p v-if="errorMessage" class="message error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="message success">{{ successMessage }}</p>
    </section>

    <section class="result-section">
      <div class="section-title">
        <h3>最近抽卡结果</h3>
        <span>{{ results.length }} 条</span>
      </div>

      <div v-if="results.length > 0" class="result-grid">
        <article v-for="result in results" :key="result.entryId + '-' + result.characterId + '-' + result.skillName + '-' + result.isDuplicate + '-' + result.soulGained" class="result-card" :class="result.rarity.toLowerCase()">
          <div class="result-top">
            <strong>{{ result.characterName }}</strong>
            <span>{{ result.rarity }}</span>
          </div>
          <p>技能：{{ result.skillName }}</p>
          <p>所属池：{{ getPoolName(result.poolId) }}</p>
          <p v-if="result.isDuplicate">重复角色，获得将魂 {{ result.soulGained }}</p>
          <p v-else>首次获得</p>
        </article>
      </div>

      <p v-else class="empty-text">还没有抽卡记录，先试一次单抽或十连。</p>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import poolConfig from '@/data/draw/poolConfig.sample.json';
import { getFactionDrawState, upsertFactionDrawState } from '@/api/drawState';
import { useFactionStore } from '@/stores/faction';
import { useGameStore } from '@/stores/game';
import {
  createInitialDrawState,
  getDailyDrawSummary,
  simulateSingleDraw,
  simulateTenDraw,
  type DrawPool,
  type DrawResult,
  type DrawState
} from '@/utils/drawSimulator';

const STORAGE_KEY = 'zhulu-jiuzhou-draw-lab-state';
const RESULTS_KEY = 'zhulu-jiuzhou-draw-lab-results';

const gameStore = useGameStore();
const factionStore = useFactionStore();
const availablePools = (poolConfig as DrawPool[]).filter((item) => item.open);
const selectedPoolId = ref(availablePools[0]?.id ?? 'pool_all_basic');
const drawState = ref<DrawState>(createInitialDrawState());
const results = ref<DrawResult[]>([]);
const errorMessage = ref('');
const successMessage = ref('');
const storageMode = ref<'supabase' | 'local'>('local');

const summary = computed(() => getDailyDrawSummary(selectedPoolId.value, drawState.value));

function persistLocalState() {
  localStorage.setItem(getStateStorageKey(), JSON.stringify(drawState.value));
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results.value));
}

function getStateStorageKey() {
  return factionStore.myFaction
    ? `${STORAGE_KEY}:${factionStore.myFaction.id}`
    : STORAGE_KEY;
}

async function persistState() {
  if (storageMode.value === 'supabase' && factionStore.myFaction) {
    try {
      drawState.value = await upsertFactionDrawState(factionStore.myFaction.id, drawState.value);
      persistLocalState();
      return;
    } catch (error) {
      console.warn('Failed to persist draw state to Supabase, fallback to localStorage.', error);
      storageMode.value = 'local';
    }
  }

  persistLocalState();
}

function loadLocalState() {
  const savedState = localStorage.getItem(getStateStorageKey());
  const savedResults = localStorage.getItem(RESULTS_KEY);

  if (savedState) {
    drawState.value = JSON.parse(savedState) as DrawState;
  }

  if (savedResults) {
    results.value = JSON.parse(savedResults) as DrawResult[];
  }
}

async function loadState() {
  if (!gameStore.activeSeason) {
    await gameStore.loadActiveSeason();
  }

  if (gameStore.activeSeason) {
    await factionStore.loadMyFaction(gameStore.activeSeason.id);
  }

  if (factionStore.myFaction) {
    try {
      const remoteState = await getFactionDrawState(factionStore.myFaction.id);
      if (remoteState) {
        drawState.value = remoteState;
      }
      storageMode.value = 'supabase';
      loadLocalState();
      return;
    } catch (error) {
      console.warn('Failed to load draw state from Supabase, fallback to localStorage.', error);
      storageMode.value = 'local';
    }
  }

  loadLocalState();
}

function prependResults(newResults: DrawResult[]) {
  results.value = [...newResults, ...results.value].slice(0, 30);
}

function clearMessages() {
  errorMessage.value = '';
  successMessage.value = '';
}

function handleSingleDraw() {
  clearMessages();

  try {
    const draw = simulateSingleDraw(selectedPoolId.value, drawState.value);
    drawState.value = draw.updatedState;
    prependResults([draw.result]);
    successMessage.value = `成功抽到 ${draw.result.characterName}（${draw.result.rarity}）`;
    void persistState();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '抽卡失败，请稍后重试。';
  }
}

function handleTenDraw() {
  clearMessages();

  try {
    const draw = simulateTenDraw(selectedPoolId.value, drawState.value);
    drawState.value = draw.updatedState;
    prependResults(draw.results);
    const highRarityCount = draw.results.filter((item) => ['SSS', 'S', 'A'].includes(item.rarity)).length;
    successMessage.value = `十连完成，共获得 ${draw.results.length} 名角色，其中高品质 ${highRarityCount} 名。`;
    void persistState();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '十连失败，请稍后重试。';
  }
}

function resetState() {
  drawState.value = createInitialDrawState();
  results.value = [];
  clearMessages();
  localStorage.removeItem(getStateStorageKey());
  localStorage.removeItem(RESULTS_KEY);
  void persistState();
}

function getPoolName(poolId: string) {
  return availablePools.find((item) => item.id === poolId)?.name ?? poolId;
}

onMounted(() => {
  void loadState();
});

watch(selectedPoolId, () => {
  clearMessages();
});
</script>

<style scoped>
.page {
  display: grid;
  gap: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
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

.ghost-btn,
.primary-btn {
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 600;
}

.ghost-btn {
  border: 1px solid #b78b5f;
  background: #fffaf1;
  color: #7a2f24;
}

.primary-btn {
  border: none;
  background: #8c3d2e;
  color: #fffaf1;
}

.control-card,
.result-section {
  background: #fffaf1;
  border: 1px solid #dbcbb2;
  border-radius: 16px;
  padding: 20px;
}

.control-grid {
  display: grid;
  gap: 16px;
}

label {
  display: grid;
  gap: 8px;
}

label span {
  color: #6b4633;
  font-weight: 600;
}

select {
  border: 1px solid #d6c4a7;
  border-radius: 10px;
  padding: 12px;
  background: #fffdf8;
}

.summary-box {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
  color: #4f4032;
  font-size: 14px;
}

.button-row {
  display: flex;
  gap: 12px;
  margin-top: 18px;
}

.message {
  margin: 14px 0 0;
}

.message.success {
  color: #2f6a47;
}

.message.error {
  color: #a33d2b;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title h3 {
  margin: 0;
  color: #5b3427;
}

.section-title span {
  color: #8b6d56;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.result-card {
  border: 1px solid #e0d3be;
  border-radius: 12px;
  padding: 14px;
  background: #fcf7ee;
}

.result-card p {
  margin: 8px 0 0;
  color: #5c4b3d;
  line-height: 1.5;
}

.result-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.result-top strong {
  color: #5b3427;
}

.result-card.sss {
  border-color: #d4af37;
  background: #fff7df;
}

.result-card.s {
  border-color: #c93f3f;
}

.result-card.a {
  border-color: #3f7ac9;
}

.result-card.b {
  border-color: #4e8a56;
}

.result-card.c {
  border-color: #8b7f70;
}

.empty-text {
  color: #8b6d56;
}
</style>
