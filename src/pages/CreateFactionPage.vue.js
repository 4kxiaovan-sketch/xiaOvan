import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFactionStore } from '@/stores/faction';
import { useGameStore } from '@/stores/game';
const router = useRouter();
const factionStore = useFactionStore();
const gameStore = useGameStore();
const factionName = ref('');
const selectedCharacterKey = ref('cao_cao');
const errorMessage = ref('');
const redirecting = ref(false);
const characterOptions = [
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
    }
    catch (error) {
        errorMessage.value =
            error instanceof Error ? error.message : '创建政权失败，请稍后重试。';
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['character-card']} */ ;
/** @type {__VLS_StyleScopedClasses['character-card']} */ ;
/** @type {__VLS_StyleScopedClasses['character-card']} */ ;
/** @type {__VLS_StyleScopedClasses['character-card']} */ ;
/** @type {__VLS_StyleScopedClasses['character-card']} */ ;
/** @type {__VLS_StyleScopedClasses['character-card']} */ ;
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
if (__VLS_ctx.redirecting) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty-box" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
        ...{ onSubmit: (__VLS_ctx.handleCreateFaction) },
        ...{ class: "create-form" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        value: (__VLS_ctx.factionName),
        type: "text",
        placeholder: "如：大楚、大魏、大唐",
        required: true,
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "character-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "character-grid" },
    });
    for (const [character] of __VLS_getVForSourceType((__VLS_ctx.characterOptions))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.redirecting))
                        return;
                    __VLS_ctx.selectedCharacterKey = character.key;
                } },
            key: (character.key),
            type: "button",
            ...{ class: "character-card" },
            ...{ class: ({ selected: __VLS_ctx.selectedCharacterKey === character.key }) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (character.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (character.title);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({});
        (character.era);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        (character.description);
    }
    if (__VLS_ctx.errorMessage) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "message error" },
        });
        (__VLS_ctx.errorMessage);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ class: "submit-btn" },
        type: "submit",
        disabled: (__VLS_ctx.factionStore.loading),
    });
    (__VLS_ctx.factionStore.loading ? '创建中...' : '创建政权');
}
/** @type {__VLS_StyleScopedClasses['page']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-box']} */ ;
/** @type {__VLS_StyleScopedClasses['create-form']} */ ;
/** @type {__VLS_StyleScopedClasses['character-section']} */ ;
/** @type {__VLS_StyleScopedClasses['character-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['character-card']} */ ;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
/** @type {__VLS_StyleScopedClasses['error']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            factionStore: factionStore,
            factionName: factionName,
            selectedCharacterKey: selectedCharacterKey,
            errorMessage: errorMessage,
            redirecting: redirecting,
            characterOptions: characterOptions,
            handleCreateFaction: handleCreateFaction,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
