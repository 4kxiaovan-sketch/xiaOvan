<template>
  <section class="login-page">
    <div class="panel">
      <header class="hero">
        <h1>逐鹿九州</h1>
        <p>择主建国，逐鹿问鼎</p>
      </header>

      <div class="tabs">
        <button
          :class="{ active: mode === 'login' }"
          @click="mode = 'login'"
          type="button"
        >
          登录
        </button>
        <button
          :class="{ active: mode === 'register' }"
          @click="mode = 'register'"
          type="button"
        >
          注册
        </button>
      </div>

      <form class="form" @submit.prevent="handleSubmit">
        <label>
          <span>邮箱</span>
          <input v-model.trim="email" type="email" placeholder="请输入邮箱" required />
        </label>

        <label>
          <span>密码</span>
          <input v-model="password" type="password" placeholder="请输入密码" required />
        </label>

        <label v-if="mode === 'register'">
          <span>昵称</span>
          <input v-model.trim="nickname" type="text" placeholder="请输入昵称" required />
        </label>

        <p v-if="message" class="message success">{{ message }}</p>
        <p v-if="errorMessage" class="message error">{{ errorMessage }}</p>

        <button class="submit-btn" type="submit" :disabled="authStore.loading">
          {{ authStore.loading ? '处理中...' : mode === 'login' ? '登录' : '注册' }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const mode = ref<'login' | 'register'>('login');
const email = ref('');
const password = ref('');
const nickname = ref('');
const message = ref('');
const errorMessage = ref('');

async function handleSubmit() {
  message.value = '';
  errorMessage.value = '';

  try {
    if (mode.value === 'login') {
      await authStore.login(email.value, password.value);
      await router.push('/');
      return;
    }

    await authStore.register(email.value, password.value, nickname.value);
    message.value = '注册成功，请检查邮箱确认后再登录。';
    mode.value = 'login';
    password.value = '';
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : '操作失败，请稍后重试。';
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at top, rgba(181, 130, 77, 0.15), transparent 35%),
    #f5efe2;
  padding: 24px;
}

.panel {
  width: 100%;
  max-width: 420px;
  background: #fffaf1;
  border: 1px solid #dbcbb2;
  border-radius: 18px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(86, 58, 35, 0.08);
}

.hero {
  text-align: center;
  margin-bottom: 20px;
}

.hero h1 {
  margin: 0;
  color: #5b3427;
  font-size: 32px;
}

.hero p {
  margin: 8px 0 0;
  color: #8b6d56;
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.tabs button {
  flex: 1;
  border: 1px solid #d8c6aa;
  background: #f7efdf;
  color: #6b4633;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
}

.tabs button.active {
  background: #a44733;
  color: #fff7ee;
  border-color: #a44733;
}

.form {
  display: grid;
  gap: 14px;
}

label {
  display: grid;
  gap: 6px;
}

label span {
  color: #6b4633;
  font-size: 14px;
}

input {
  border: 1px solid #d6c4a7;
  border-radius: 10px;
  padding: 12px;
  font-size: 14px;
  background: #fffdf8;
}

.message {
  margin: 0;
  font-size: 14px;
}

.message.success {
  color: #2f6a47;
}

.message.error {
  color: #a33d2b;
}

.submit-btn {
  border: none;
  background: #8c3d2e;
  color: #fffaf1;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
