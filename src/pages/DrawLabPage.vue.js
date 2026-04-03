import { computed, onMounted, ref, watch } from 'vue';
import poolConfig from '@/data/draw/poolConfig.sample.json';
import { getFactionDrawState, upsertFactionDrawState } from '@/api/drawState';
import { useFactionStore } from '@/stores/faction';
import { useGameStore } from '@/stores/game';
import { createInitialDrawState, getDailyDrawSummary, simulateSingleDraw, simulateTenDraw } from '@/utils/drawSimulator';
const STORAGE_KEY = 'zhulu-jiuzhou-draw-lab-state';
const RESULTS_KEY = 'zhulu-jiuzhou-draw-lab-results';
const gameStore = useGameStore();
const factionStore = useFactionStore();
const availablePools = poolConfig.filter((item) => item.open);
const selectedPoolId = ref(availablePools[0]?.id ?? 'pool_all_basic');
const drawState = ref(createInitialDrawState());
const results = ref([]);
const errorMessage = ref('');
const successMessage = ref('');
const storageMode = ref('local');
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
        }
        catch (error) {
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
        drawState.value = JSON.parse(savedState);
    }
    if (savedResults) {
        results.value = JSON.parse(savedResults);
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
        }
        catch (error) {
            console.warn('Failed to load draw state from Supabase, fallback to localStorage.', error);
            storageMode.value = 'local';
        }
    }
    loadLocalState();
}
function prependResults(newResults) {
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
    }
    catch (error) {
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
    }
    catch (error) {
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
function getPoolName(poolId) {
    return availablePools.find((item) => item.id === poolId)?.name ?? poolId;
}
onMounted(() => {
    void loadState();
});
watch(selectedPoolId, () => {
    clearMessages();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['ghost-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['primary-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['result-card']} */ ;
/** @type {__VLS_StyleScopedClasses['result-top']} */ ;
/** @type {__VLS_StyleScopedClasses['result-card']} */ ;
/** @type {__VLS_StyleScopedClasses['result-card']} */ ;
/** @type {__VLS_StyleScopedClasses['result-card']} */ ;
/** @type {__VLS_StyleScopedClasses['result-card']} */ ;
/** @type {__VLS_StyleScopedClasses['result-card']} */ ;
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.resetState) },
    ...{ class: "ghost-btn" },
    type: "button",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "control-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "control-grid" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
    value: (__VLS_ctx.selectedPoolId),
});
for (const [pool] of __VLS_getVForSourceType((__VLS_ctx.availablePools))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (pool.id),
        value: (pool.id),
    });
    (pool.name);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "summary-box" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.summary.freeDrawUsed);
(__VLS_ctx.summary.freeDrawLimit);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.summary.freeDrawRemaining);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.summary.soul);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.summary.ownedCount);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.summary.pitySProgress);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.summary.pitySSSProgress);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "button-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.handleSingleDraw) },
    ...{ class: "primary-btn" },
    type: "button",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.handleTenDraw) },
    ...{ class: "primary-btn" },
    type: "button",
});
if (__VLS_ctx.errorMessage) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "message error" },
    });
    (__VLS_ctx.errorMessage);
}
if (__VLS_ctx.successMessage) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "message success" },
    });
    (__VLS_ctx.successMessage);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "result-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.results.length);
if (__VLS_ctx.results.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "result-grid" },
    });
    for (const [result] of __VLS_getVForSourceType((__VLS_ctx.results))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
            key: (result.entryId + '-' + result.characterId + '-' + result.skillName + '-' + result.isDuplicate + '-' + result.soulGained),
            ...{ class: "result-card" },
            ...{ class: (result.rarity.toLowerCase()) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "result-top" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (result.characterName);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (result.rarity);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        (result.skillName);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        (__VLS_ctx.getPoolName(result.poolId));
        if (result.isDuplicate) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
            (result.soulGained);
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        }
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "empty-text" },
    });
}
/** @type {__VLS_StyleScopedClasses['page']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['ghost-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['control-card']} */ ;
/** @type {__VLS_StyleScopedClasses['control-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-box']} */ ;
/** @type {__VLS_StyleScopedClasses['button-row']} */ ;
/** @type {__VLS_StyleScopedClasses['primary-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['primary-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
/** @type {__VLS_StyleScopedClasses['error']} */ ;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
/** @type {__VLS_StyleScopedClasses['success']} */ ;
/** @type {__VLS_StyleScopedClasses['result-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['result-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['result-card']} */ ;
/** @type {__VLS_StyleScopedClasses['result-top']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-text']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            availablePools: availablePools,
            selectedPoolId: selectedPoolId,
            results: results,
            errorMessage: errorMessage,
            successMessage: successMessage,
            summary: summary,
            handleSingleDraw: handleSingleDraw,
            handleTenDraw: handleTenDraw,
            resetState: resetState,
            getPoolName: getPoolName,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
