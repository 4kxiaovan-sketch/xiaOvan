import { computed, onMounted } from 'vue';
import CityCard from '@/components/CityCard.vue';
import { useFactionStore } from '@/stores/faction';
import { useGameStore } from '@/stores/game';
import { useMapStore } from '@/stores/map';
const gameStore = useGameStore();
const factionStore = useFactionStore();
const mapStore = useMapStore();
async function loadPageData() {
    if (!gameStore.activeSeason) {
        await gameStore.loadActiveSeason();
    }
    if (!gameStore.activeSeason)
        return;
    await Promise.all([
        factionStore.loadFactions(gameStore.activeSeason.id),
        mapStore.loadMap(gameStore.activeSeason.id)
    ]);
}
onMounted(async () => {
    await loadPageData();
});
const factionNameMap = computed(() => {
    return new Map(factionStore.factions.map((faction) => [faction.id, faction.name]));
});
const mappedCities = computed(() => {
    return mapStore.cities.map((city) => ({
        ...city,
        ownerName: city.owner_faction_id
            ? factionNameMap.value.get(city.owner_faction_id) ?? '未知势力'
            : '中立'
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
else if (__VLS_ctx.mapStore.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty-box" },
    });
}
else if (__VLS_ctx.mappedCities.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty-box" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "city-grid" },
    });
    for (const [city] of __VLS_getVForSourceType((__VLS_ctx.mappedCities))) {
        /** @type {[typeof CityCard, ]} */ ;
        // @ts-ignore
        const __VLS_0 = __VLS_asFunctionalComponent(CityCard, new CityCard({
            key: (city.id),
            name: (city.name),
            terrain: (city.terrain),
            ownerName: (city.ownerName),
            troops: (city.troops),
            defense: (city.defense),
            prosperity: (city.prosperity),
        }));
        const __VLS_1 = __VLS_0({
            key: (city.id),
            name: (city.name),
            terrain: (city.terrain),
            ownerName: (city.ownerName),
            troops: (city.troops),
            defense: (city.defense),
            prosperity: (city.prosperity),
        }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    }
}
/** @type {__VLS_StyleScopedClasses['page']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-box']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-box']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-box']} */ ;
/** @type {__VLS_StyleScopedClasses['city-grid']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            CityCard: CityCard,
            gameStore: gameStore,
            mapStore: mapStore,
            mappedCities: mappedCities,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
