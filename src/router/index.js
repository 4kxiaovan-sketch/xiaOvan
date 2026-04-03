import { createRouter, createWebHashHistory } from 'vue-router';
import { supabase } from '@/lib/supabase';
const LoginPage = () => import('@/pages/LoginPage.vue');
const HomePage = () => import('@/pages/HomePage.vue');
const CreateFactionPage = () => import('@/pages/CreateFactionPage.vue');
const FactionPage = () => import('@/pages/FactionPage.vue');
const MapPage = () => import('@/pages/MapPage.vue');
const ReportsPage = () => import('@/pages/ReportsPage.vue');
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: LoginPage,
            meta: { requiresAuth: false }
        },
        {
            path: '/',
            name: 'home',
            component: HomePage,
            meta: { requiresAuth: true }
        },
        {
            path: '/create-faction',
            name: 'create-faction',
            component: CreateFactionPage,
            meta: { requiresAuth: true }
        },
        {
            path: '/faction',
            name: 'faction',
            component: FactionPage,
            meta: { requiresAuth: true }
        },
        {
            path: '/map',
            name: 'map',
            component: MapPage,
            meta: { requiresAuth: true }
        },
        {
            path: '/reports',
            name: 'reports',
            component: ReportsPage,
            meta: { requiresAuth: true }
        }
    ]
});
router.beforeEach(async (to) => {
    const { data: { session } } = await supabase.auth.getSession();
    const isAuthenticated = Boolean(session?.user);
    const requiresAuth = to.meta.requiresAuth !== false;
    if (requiresAuth && !isAuthenticated) {
        return { name: 'login' };
    }
    if (to.name === 'login' && isAuthenticated) {
        return { name: 'home' };
    }
    return true;
});
export default router;
