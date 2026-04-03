<template>
  <section class="page">
    <div class="page-header">
      <div>
        <h2>建立政权</h2>
        <p>选择一位历史人物，开创你的王朝。</p>
      </div>
    </div>

    <div v-if="redirecting" class="empty-box">
      你已拥有政权，正在返回首页...
    </div>

    <template v-else>
      <form class="create-form" @submit.prevent="handleCreateFaction">
        <label>
          <span>国号</span>
          <input v-model.trim="factionName" type="text" placeholder="如：大楚、大魏、大唐" required />
        </label>

        <div class="character-section">
          <h3>选择君主</h3>
          <div class="character-grid">
            <button
              v-for="character in characterOptions"
              :key="character.key"
              type="button"
              class="character-card"
              :class="{ selected: selectedCharacterKey === character.key }"
              @click="selectedCharacterKey = character.key"
            >
              <strong>{{ character.name }}</strong>
              <span>{{ character.title }}</span>
              <small>{{ character.era }}</small>
              <p>{{ character.description }}</p>
            </button>
          </div>
        </div>

        <p v-if="errorMessage" class="message error">{{ errorMessage }}</p>

        <button class="submit-btn" type="submit" :disabled="factionStore.loading">
          {{ factionStore.loading ? '创建中...' : '创建政权' }}
        </button>
      </form>
    </template>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFactionStore } from '@/stores/faction';
import { useGameStore } from '@/stores/game';
import type { CharacterOption } from '@/types/game';

const router = useRouter();
const factionStore = useFactionStore();
const gameStore = useGameStore();

const factionName = ref('');
const selectedCharacterKey = ref('cao_cao');
const errorMessage = ref('');
const redirecting = ref(false);

const characterOptions: CharacterOption[] = [
  {
    key: 'cao_cao',
    name: '曹操',
    era: '东汉末',
    title: '魏武雄主',
    description: '善用权谋，兼具内政与军事才能。'
  },
  {
    key: 'liu_bei',
    name: '刘备',
    era: '三国',
    title: '蜀汉昭烈',
    description: '仁德立国，擅长凝聚人心与号召群雄。'
  },
  {
    key: 'sun_quan',
    name: '孙权',
    era: '三国',
    title: '江东之主',
    description: '据守江东，稳健经营，善于平衡文武。'
  },
  {
    key: 'li_shi_min',
    name: '李世民',
    era: '唐',
    title: '天策上将',
    description: '文治武功兼备，适合全能型政权开局。'
  },
  {
    key: 'zhu_yuan_zhang',
    name: '朱元璋',
    era: '明',
    title: '洪武开国',
    description: '重视集权与资源整合，擅长快速立国。'
  }
];

onMounted(async () => {
  if (!gameStore.activeSeason) {
    await gameStore.loadActiveSeason();
  }

  if (gameStore.activeSeason) {
    await factionStore.loadMyFaction(gameStore.activeSeason.id);
  }

  if (factionStore.myFaction) {
    redirecting.value = true;
    setTimeout(() => {
      router.push('/');
    }, 800);
  }
});

async function handleCreateFaction() {
  errorMessage.value = '';

  if (!gameStore.activeSeason) {
    errorMessage.value = '当前没有可用赛季，无法建立政权。';
    return;
  }

  if (!selectedCharacterKey.value) {
    errorMessage.value = '请选择一位历史人物。';
    return;
  }

  try {
    await factionStore.createNewFaction({
      season_id: gameStore.activeSeason.id,
      name: factionName.value,
      ruler_character_key: selectedCharacterKey.value,
      capital_city_id: null,
      policy: null
    });

    await router.push('/faction');
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : '创建政权失败，请稍后重试。';
  }
}
</script>

<style scoped>
.page {
  display: grid;
  gap: 24px;
}

.page-header h2 {
  margin: 0;
  color: #5b3427;
}

.page-header p {
  margin: 8px 0 0;
  color: #8b6d56;
}

.create-form {
  display: grid;
  gap: 20px;
  background: #fffaf1;
  border: 1px solid #dbcbb2;
  border-radius: 16px;
  padding: 20px;
}

label {
  display: grid;
  gap: 8px;
}

label span,
.character-section h3 {
  color: #6b4633;
  font-weight: 600;
}

input {
  border: 1px solid #d6c4a7;
  border-radius: 10px;
  padding: 12px;
  font-size: 14px;
  background: #fffdf8;
}

.character-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  margin-top: 12px;
}

.character-card {
  text-align: left;
  border: 1px solid #d7c4a6;
  background: #fcf6eb;
  border-radius: 12px;
  padding: 14px;
  cursor: pointer;
  display: grid;
  gap: 6px;
}

.character-card.selected {
  border-color: #9a4a35;
  box-shadow: 0 0 0 2px rgba(154, 74, 53, 0.12);
  background: #fff7ef;
}

.character-card strong {
  color: #5b3427;
}

.character-card span,
.character-card small,
.character-card p {
  color: #6e5a48;
  margin: 0;
}

.character-card p {
  line-height: 1.5;
  font-size: 14px;
}

.submit-btn {
  border: none;
  background: #8c3d2e;
  color: #fffaf1;
  padding: 12px 18px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  justify-self: start;
}

.message.error {
  margin: 0;
  color: #a33d2b;
}

.empty-box {
  padding: 20px;
  background: #fffaf1;
  border: 1px solid #dbcbb2;
  border-radius: 12px;
  color: #6e5a48;
}
</style>
