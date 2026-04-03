import drawRuleConfig from '@/data/draw/drawRuleConfig.sample.json';
import poolConfig from '@/data/draw/poolConfig.sample.json';
import poolEntries from '@/data/draw/poolEntries.sample.json';
import characterConfig from '@/data/draw/characterConfig.sample.json';
const rarityWeightMap = {
    SSS: 1,
    S: 6,
    A: 18,
    B: 30,
    C: 45
};
const raritySoulMap = {
    SSS: 100,
    S: 40,
    A: 15,
    B: 5,
    C: 2
};
const rarityOrder = ['SSS', 'S', 'A', 'B', 'C'];
const pools = poolConfig;
const entries = poolEntries;
const characters = characterConfig;
function getTodayKey(date = new Date()) {
    return date.toISOString().slice(0, 10);
}
export function createInitialDrawState(date = new Date()) {
    return {
        currentDate: getTodayKey(date),
        freeDrawUsed: 0,
        pitySProgress: 0,
        pitySSSProgress: 0,
        soul: 0,
        ownedCharacterIds: []
    };
}
export function resetDailyStateIfNeeded(state, date = new Date()) {
    const todayKey = getTodayKey(date);
    if (state.currentDate === todayKey) {
        return state;
    }
    return {
        ...state,
        currentDate: todayKey,
        freeDrawUsed: 0
    };
}
export function getPoolById(poolId) {
    const pool = pools.find((item) => item.id === poolId && item.open);
    if (!pool) {
        throw new Error(`Pool not found or closed: ${poolId}`);
    }
    return pool;
}
export function getEntriesByPoolId(poolId) {
    return entries.filter((item) => item.pool_id === poolId && item.mvp_open);
}
export function getCharacterById(characterId) {
    const character = characters.find((item) => item.id === characterId);
    if (!character) {
        throw new Error(`Character not found: ${characterId}`);
    }
    return character;
}
function weightedPick(items) {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    if (totalWeight <= 0) {
        throw new Error('Invalid weighted items.');
    }
    let roll = Math.random() * totalWeight;
    for (const item of items) {
        roll -= item.weight;
        if (roll <= 0) {
            return item;
        }
    }
    return items[items.length - 1];
}
function pickRarity(state, pool, forceAtLeastA = false) {
    if (state.pitySProgress >= pool.pity_s_count) {
        return Math.random() < 0.15 ? 'SSS' : 'S';
    }
    if (state.pitySSSProgress >= pool.pity_sss_count && Math.random() < drawRuleConfig.pity_sss_boost_rate) {
        return 'SSS';
    }
    const rarityCandidates = rarityOrder
        .filter((rarity) => !forceAtLeastA || rarity === 'SSS' || rarity === 'S' || rarity === 'A')
        .map((rarity) => ({
        rarity,
        weight: rarityWeightMap[rarity]
    }));
    return weightedPick(rarityCandidates).rarity;
}
function updatePityState(state, rarity) {
    return {
        ...state,
        pitySProgress: rarity === 'SSS' || rarity === 'S' ? 0 : state.pitySProgress + 1,
        pitySSSProgress: rarity === 'SSS' ? 0 : state.pitySSSProgress + 1
    };
}
function resolveDuplicate(state, rarity, characterId) {
    const isDuplicate = state.ownedCharacterIds.includes(characterId);
    const soulGained = isDuplicate ? raritySoulMap[rarity] : 0;
    const ownedCharacterIds = isDuplicate
        ? state.ownedCharacterIds
        : [...state.ownedCharacterIds, characterId];
    return {
        isDuplicate,
        soulGained,
        ownedCharacterIds
    };
}
function doSingleDraw(poolId, state, options) {
    const pool = getPoolById(poolId);
    const poolEntries = getEntriesByPoolId(poolId);
    const consumeFreeDraw = options?.consumeFreeDraw ?? true;
    const forceAtLeastA = options?.forceAtLeastA ?? false;
    if (consumeFreeDraw && state.freeDrawUsed >= pool.daily_free_limit) {
        throw new Error('No free draws remaining today.');
    }
    const pickedRarity = pickRarity(state, pool, forceAtLeastA);
    const rarityEntries = poolEntries.filter((item) => item.rarity === pickedRarity);
    if (rarityEntries.length === 0) {
        throw new Error(`No entries configured for rarity ${pickedRarity} in pool ${poolId}.`);
    }
    const winner = weightedPick(rarityEntries);
    const character = getCharacterById(winner.character_id);
    const duplicateInfo = resolveDuplicate(state, winner.rarity, winner.character_id);
    let nextState = {
        ...state,
        freeDrawUsed: consumeFreeDraw ? state.freeDrawUsed + 1 : state.freeDrawUsed,
        soul: state.soul + duplicateInfo.soulGained,
        ownedCharacterIds: duplicateInfo.ownedCharacterIds
    };
    nextState = updatePityState(nextState, winner.rarity);
    const result = {
        entryId: winner.id,
        characterId: winner.character_id,
        characterName: character.name,
        rarity: winner.rarity,
        poolId,
        skillName: winner.skill_name,
        isDuplicate: duplicateInfo.isDuplicate,
        soulGained: duplicateInfo.soulGained
    };
    return {
        result,
        updatedState: nextState
    };
}
export function simulateSingleDraw(poolId, state) {
    const normalizedState = resetDailyStateIfNeeded(state);
    return doSingleDraw(poolId, normalizedState, { consumeFreeDraw: true });
}
export function simulateTenDraw(poolId, state) {
    const normalizedState = resetDailyStateIfNeeded(state);
    const pool = getPoolById(poolId);
    if (normalizedState.freeDrawUsed + drawRuleConfig.ten_draw_cost > pool.daily_free_limit) {
        throw new Error('Not enough free draws remaining for a ten-draw.');
    }
    let nextState = normalizedState;
    const results = [];
    for (let i = 0; i < drawRuleConfig.ten_draw_cost; i += 1) {
        const forceAtLeastA = pool.ten_draw_a_guarantee &&
            i === drawRuleConfig.ten_draw_cost - 1 &&
            !results.some((item) => item.rarity === 'SSS' || item.rarity === 'S' || item.rarity === 'A');
        const draw = doSingleDraw(poolId, nextState, {
            consumeFreeDraw: true,
            forceAtLeastA
        });
        results.push(draw.result);
        nextState = draw.updatedState;
    }
    return {
        results,
        updatedState: nextState
    };
}
export function getRemainingFreeDraws(poolId, state) {
    const pool = getPoolById(poolId);
    const normalizedState = resetDailyStateIfNeeded(state);
    return Math.max(pool.daily_free_limit - normalizedState.freeDrawUsed, 0);
}
export function getDailyDrawSummary(poolId, state) {
    const pool = getPoolById(poolId);
    const normalizedState = resetDailyStateIfNeeded(state);
    return {
        poolId,
        poolName: pool.name,
        freeDrawLimit: pool.daily_free_limit,
        freeDrawUsed: normalizedState.freeDrawUsed,
        freeDrawRemaining: getRemainingFreeDraws(poolId, normalizedState),
        pitySProgress: normalizedState.pitySProgress,
        pitySSSProgress: normalizedState.pitySSSProgress,
        soul: normalizedState.soul,
        ownedCount: normalizedState.ownedCharacterIds.length
    };
}
