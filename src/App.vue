<template>
  <div class="app-shell">
    <AppHeader v-if="showHeader" />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const authStore = useAuthStore();

const showHeader = computed(() => route.path !== '/login');

onMounted(async () => {
  await authStore.init();
});
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  background:
    linear-gradient(to bottom, rgba(190, 156, 113, 0.08), transparent 120px),
    #f5efe2;
  color: #3f3126;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
</style>
