<template>
  <header class="app-header">
    <div class="brand">
      <h1>逐鹿九州</h1>
      <p>群雄并起，问鼎天下</p>
    </div>

    <nav class="nav-links">
      <RouterLink to="/">首页</RouterLink>
      <RouterLink to="/faction">政权</RouterLink>
      <RouterLink to="/map">地图</RouterLink>
      <RouterLink to="/reports">战报</RouterLink>
    </nav>

    <div class="user-area">
      <span class="nickname">{{ displayName }}</span>
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const displayName = computed(() => {
  return authStore.profile?.nickname ?? authStore.user?.email ?? '未登录';
});

async function handleLogout() {
  await authStore.logout();
  await router.push('/login');
}
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #dbcbb2;
  background: #f8f1e3;
}

.brand h1 {
  margin: 0;
  font-size: 24px;
  color: #5b3427;
}

.brand p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #8b6d56;
}

.nav-links {
  display: flex;
  gap: 16px;
}

.nav-links a {
  color: #6b4633;
  text-decoration: none;
  font-weight: 600;
}

.nav-links a.router-link-active {
  color: #a33d2b;
}

.user-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nickname {
  color: #4f4032;
  font-weight: 600;
}

.logout-btn {
  border: 1px solid #b78b5f;
  background: #fffaf1;
  color: #7a2f24;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.logout-btn:hover {
  background: #f5e8d1;
}

@media (max-width: 860px) {
  .app-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
