import { onMounted, watch } from 'vue';
import { RouterLink } from 'vue-router';
import FactionCard from '@/components/FactionCard.vue';
import { useAuthStore } from '@/stores/auth';
import { useGameStore } from '@/stores/game';
import { useFactionStore } from '@/stores/faction';
const authStore = useAuthStore();
const gameStore = useGameStore();
const factionStore = useFactionStore();
async function loadPageData() {
    if (!authStore.isAuthenticated)
        return;
    if (!gameStore.activeSeason) {
        await gameStore.loadActiveSeason();
    }
    if (!gameStore.activeSeason)
        return;
    await Promise.all([
        factionStore.loadFactions(gameStore.activeSeason.id),
        factionStore.loadMyFaction(gameStore.activeSeason.id)
    ]);
}
onMounted(async () => {
    await loadPageData();
});
watch(() => authStore.isAuthenticated, async (isAuthenticated) => {
    if (isAuthenticated) {
        await loadPageData();
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['user-box']} */ ;
/** @type {__VLS_StyleScopedClasses['user-box']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
if (__VLS_ctx.gameStore.activeSeason) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.gameStore.activeSeason.name);
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "user-box" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
(__VLS_ctx.authStore.profile?.nickname || __VLS_ctx.authStore.user?.email);
if (__VLS_ctx.factionStore.myFaction) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.factionStore.myFaction.name);
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "action-panel" },
});
if (!__VLS_ctx.factionStore.myFaction) {
    const __VLS_0 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ class: "action-btn" },
        to: "/create-faction",
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: "action-btn" },
        to: "/create-faction",
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_3.slots.default;
    var __VLS_3;
}
else {
    const __VLS_4 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        ...{ class: "action-btn" },
        to: "/faction",
    }));
    const __VLS_6 = __VLS_5({
        ...{ class: "action-btn" },
        to: "/faction",
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    var __VLS_7;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "list-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
if (__VLS_ctx.factionStore.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
if (__VLS_ctx.factionStore.factions.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "faction-grid" },
    });
    for (const [faction] of __VLS_getVForSourceType((__VLS_ctx.factionStore.factions))) {
        /** @type {[typeof FactionCard, ]} */ ;
        // @ts-ignore
        const __VLS_8 = __VLS_asFunctionalComponent(FactionCard, new FactionCard({
            key: (faction.id),
            faction: (faction),
        }));
        const __VLS_9 = __VLS_8({
            key: (faction.id),
            faction: (faction),
        }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "empty-text" },
    });
}
/** @type {__VLS_StyleScopedClasses['page']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['user-box']} */ ;
/** @type {__VLS_StyleScopedClasses['action-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['list-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['faction-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-text']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            RouterLink: RouterLink,
            FactionCard: FactionCard,
            authStore: authStore,
            gameStore: gameStore,
            factionStore: factionStore,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
