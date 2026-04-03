import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { getMyProfile } from '@/api/profile';
import { getCurrentUser, signIn, signOut, signUp } from '@/api/auth';
import type { ProfileRow } from '@/types/supabase';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const profile = ref<ProfileRow | null>(null);
  const loading = ref(false);

  const isAuthenticated = computed(() => Boolean(user.value));

  async function loadProfile() {
    if (!user.value) {
      profile.value = null;
      return;
    }

    profile.value = await getMyProfile();

    if (!profile.value) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      profile.value = await getMyProfile();
    }
  }

  async function init() {
    loading.value = true;
    try {
      user.value = await getCurrentUser();
      await loadProfile();
    } finally {
      loading.value = false;
    }
  }

  async function login(email: string, password: string) {
    loading.value = true;
    try {
      await signIn(email, password);
      user.value = await getCurrentUser();
      await loadProfile();
    } finally {
      loading.value = false;
    }
  }

  async function register(email: string, password: string, nickname: string) {
    loading.value = true;
    try {
      await signUp(email, password, nickname);
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    loading.value = true;
    try {
      await signOut();
      user.value = null;
      profile.value = null;
    } finally {
      loading.value = false;
    }
  }

  supabase.auth.onAuthStateChange(async (_event, session) => {
    user.value = session?.user ?? null;
    if (user.value) {
      await loadProfile();
    } else {
      profile.value = null;
    }
  });

  return {
    user,
    profile,
    loading,
    isAuthenticated,
    init,
    login,
    register,
    logout
  };
});
