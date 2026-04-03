import { computed, onMounted } from 'vue';
import ReportList from '@/components/ReportList.vue';
import { useFactionStore } from '@/stores/faction';
import { useGameStore } from '@/stores/game';
import { useReportStore } from '@/stores/report';
const gameStore = useGameStore();
const factionStore = useFactionStore();
const reportStore = useReportStore();
async function loadPageData() {
    if (!gameStore.activeSeason) {
        await gameStore.loadActiveSeason();
    }
    if (!gameStore.activeSeason)
        return;
    await Promise.all([
        factionStore.loadFactions(gameStore.activeSeason.id),
        reportStore.loadReports(gameStore.activeSeason.id)
    ]);
}
onMounted(async () => {
    await loadPageData();
});
const factionNameMap = computed(() => {
    return new Map(factionStore.factions.map((faction) => [faction.id, faction.name]));
});
const reportViewList = computed(() => {
    return reportStore.reports.map((report) => ({
        id: report.id,
        attackerName: factionNameMap.value.get(report.attacker_faction_id) ?? '未知进攻方',
        defenderName: factionNameMap.value.get(report.defender_faction_id) ?? '未知防守方',
        weather: report.weather,
        summary: report.summary,
        created_at: report.created_at
    }));
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
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
if (!__VLS_ctx.gameStore.activeSeason) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty-box" },
    });
}
else if (__VLS_ctx.reportStore.loadingReports) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty-box" },
    });
}
else if (__VLS_ctx.reportViewList.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty-box" },
    });
}
else {
    /** @type {[typeof ReportList, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(ReportList, new ReportList({
        reports: (__VLS_ctx.reportViewList),
    }));
    const __VLS_1 = __VLS_0({
        reports: (__VLS_ctx.reportViewList),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
}
/** @type {__VLS_StyleScopedClasses['page']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-box']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-box']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-box']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ReportList: ReportList,
            gameStore: gameStore,
            reportStore: reportStore,
            reportViewList: reportViewList,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
