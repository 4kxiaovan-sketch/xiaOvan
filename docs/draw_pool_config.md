# 《逐鹿九州》抽将系统开发配置表

## 一、用途

这份文档用于把 [draw_pool_design.md](/Users/xiaovan/Documents/Playground/docs/draw_pool_design.md) 中的策划内容收敛成可开发配置结构。

适用场景：
- 前端本地 JSON 配置
- 后端数据库种子数据
- 抽卡概率逻辑
- 卡池展示页
- 国家共享抽卡次数逻辑

---

## 二、推荐拆分的数据表/配置文件

建议拆成 6 类：

1. `rarity_config`
2. `position_config`
3. `character_config`
4. `pool_config`
5. `pool_entries`
6. `draw_rule_config`

---

## 三、字段定义

## 1. rarity_config

定义稀有度基础规则。

| 字段 | 类型 | 示例 | 说明 |
|---|---|---|---|
| code | string | `SSS` | 稀有度编码 |
| weight | number | `1` | 基础权重 |
| soul_value | number | `100` | 重复卡分解将魂 |
| color | string | `#d4af37` | 展示色 |
| min_guarantee_rank | boolean | `true` | 是否可触发高阶保底 |

推荐配置：

```json
[
  { "code": "SSS", "weight": 1, "soul_value": 100, "color": "#d4af37", "min_guarantee_rank": true },
  { "code": "S",   "weight": 6, "soul_value": 40,  "color": "#c93f3f", "min_guarantee_rank": true },
  { "code": "A",   "weight": 18, "soul_value": 15, "color": "#3f7ac9", "min_guarantee_rank": true },
  { "code": "B",   "weight": 30, "soul_value": 5,  "color": "#4e8a56", "min_guarantee_rank": false },
  { "code": "C",   "weight": 45, "soul_value": 2,  "color": "#8b7f70", "min_guarantee_rank": false }
]
```

---

## 2. position_config

定义职位池。

| 字段 | 类型 | 示例 | 说明 |
|---|---|---|---|
| code | string | `ruler` | 职位编码 |
| name | string | `君主` | 职位名称 |
| description | string | `国家领袖卡池` | 文案说明 |
| open_in_mvp | boolean | `true` | 首版是否开放 |

推荐配置：

```json
[
  { "code": "ruler", "name": "君主", "description": "国家领袖卡池", "open_in_mvp": true },
  { "code": "chancellor", "name": "丞相", "description": "治国统筹卡池", "open_in_mvp": true },
  { "code": "domestic", "name": "内政", "description": "财政民生卡池", "open_in_mvp": true },
  { "code": "rite", "name": "礼部", "description": "文化民心卡池", "open_in_mvp": false },
  { "code": "military_office", "name": "兵部", "description": "军事制度卡池", "open_in_mvp": true },
  { "code": "justice", "name": "刑部", "description": "法治监察卡池", "open_in_mvp": false },
  { "code": "works", "name": "工部", "description": "工程建设卡池", "open_in_mvp": false },
  { "code": "diplomat", "name": "外交", "description": "外交纵横卡池", "open_in_mvp": true },
  { "code": "strategist", "name": "军师", "description": "谋略军师卡池", "open_in_mvp": true },
  { "code": "general", "name": "将军", "description": "战场统帅卡池", "open_in_mvp": true }
]
```

---

## 3. character_config

这是核心人物表。  
每个人物只保留一条基础档案，不同职位里的评级放在 `pool_entries`。

| 字段 | 类型 | 示例 | 说明 |
|---|---|---|---|
| id | string | `cao_cao` | 角色唯一 ID |
| name | string | `曹操` | 姓名 |
| era | string | `东汉末` | 所处时代 |
| dynasty | string | `东汉末/曹魏` | 朝代标签 |
| base_title | string | `魏武帝` | 基础称号 |
| avatar | string | `/avatars/cao_cao.png` | 头像资源 |
| bio | string | `善用权谋...` | 简介 |
| tags | string[] | `["君主","军事","权谋"]` | 标签 |
| nation_hint | string | `魏` | 推荐阵营 |

示例：

```json
[
  {
    "id": "cao_cao",
    "name": "曹操",
    "era": "东汉末",
    "dynasty": "东汉末/曹魏",
    "base_title": "魏武帝",
    "avatar": "/avatars/cao_cao.png",
    "bio": "乱世雄主，兼擅军政与权谋。",
    "tags": ["君主", "军事", "权谋"],
    "nation_hint": "魏"
  },
  {
    "id": "liu_bei",
    "name": "刘备",
    "era": "三国",
    "dynasty": "蜀汉",
    "base_title": "昭烈帝",
    "avatar": "/avatars/liu_bei.png",
    "bio": "以仁德聚众，擅长凝聚人心。",
    "tags": ["君主", "仁政", "结盟"],
    "nation_hint": "蜀"
  }
]
```

---

## 4. pool_config

定义卡池本体。

| 字段 | 类型 | 示例 | 说明 |
|---|---|---|---|
| id | string | `pool_all_basic` | 卡池 ID |
| name | string | `天下群英池` | 卡池名称 |
| pool_type | string | `all` / `position` | 综合池或职位池 |
| position_code | string/null | `ruler` | 职位池编码 |
| open | boolean | `true` | 是否开放 |
| daily_free_limit | number | `10` | 每国每日免费次数 |
| pity_s_count | number | `20` | S 保底阈值 |
| pity_sss_count | number | `60` | SSS 概率提升阈值 |
| ten_draw_a_guarantee | boolean | `true` | 十连保底 A |

示例：

```json
[
  {
    "id": "pool_all_basic",
    "name": "天下群英池",
    "pool_type": "all",
    "position_code": null,
    "open": true,
    "daily_free_limit": 10,
    "pity_s_count": 20,
    "pity_sss_count": 60,
    "ten_draw_a_guarantee": true
  },
  {
    "id": "pool_ruler_basic",
    "name": "君主招募池",
    "pool_type": "position",
    "position_code": "ruler",
    "open": true,
    "daily_free_limit": 10,
    "pity_s_count": 20,
    "pity_sss_count": 60,
    "ten_draw_a_guarantee": true
  }
]
```

---

## 5. pool_entries

这是最关键的“卡池角色映射表”。  
同一人物可以在多个池出现，只要多配几条。

| 字段 | 类型 | 示例 | 说明 |
|---|---|---|---|
| id | string | `pool_ruler_basic_cao_cao` | 唯一 entry id |
| pool_id | string | `pool_ruler_basic` | 所属卡池 |
| character_id | string | `cao_cao` | 对应人物 |
| rarity | string | `SSS` | 稀有度 |
| weight | number | `1` | 在该池中的附加权重 |
| is_limited | boolean | `false` | 是否限定 |
| skill_name | string | `挟天子令诸侯` | 该职位版本技能 |
| skill_desc | string | `提高外交压制与征服效率` | 技能描述 |
| mvp_open | boolean | `true` | 首版是否开放 |

---

## 6. draw_rule_config

定义每日次数与保底逻辑。

| 字段 | 类型 | 示例 | 说明 |
|---|---|---|---|
| id | string | `nation_daily_draw_rule` | 规则 ID |
| free_draw_per_day | number | `10` | 每国每日免费次数 |
| targeted_draw_cost | number | `2` | 定向抽取消耗 |
| ten_draw_cost | number | `10` | 十连消耗 |
| pity_s_threshold | number | `20` | S 保底 |
| pity_sss_threshold | number | `60` | SSS 概率提升 |
| pity_sss_boost_rate | number | `0.15` | SSS 提升概率 |

示例：

```json
{
  "id": "nation_daily_draw_rule",
  "free_draw_per_day": 10,
  "targeted_draw_cost": 2,
  "ten_draw_cost": 10,
  "pity_s_threshold": 20,
  "pity_sss_threshold": 60,
  "pity_sss_boost_rate": 0.15
}
```

---

## 四、首版推荐 JSON 目录结构

```text
src/data/draw/
  rarityConfig.json
  positionConfig.json
  characterConfig.json
  poolConfig.json
  poolEntries.json
  drawRuleConfig.json
```

---

## 五、首版 pool_entries 示例（可直接开发）

```json
[
  {
    "id": "pool_ruler_basic_qin_shi_huang",
    "pool_id": "pool_ruler_basic",
    "character_id": "qin_shi_huang",
    "rarity": "SSS",
    "weight": 1,
    "is_limited": false,
    "skill_name": "一统六合",
    "skill_desc": "提高国家扩张速度与征服收益。",
    "mvp_open": true
  },
  {
    "id": "pool_ruler_basic_liu_bang",
    "pool_id": "pool_ruler_basic",
    "character_id": "liu_bang",
    "rarity": "SSS",
    "weight": 1,
    "is_limited": false,
    "skill_name": "汉初开国",
    "skill_desc": "提升建国期民心与人才归附概率。",
    "mvp_open": true
  },
  {
    "id": "pool_ruler_basic_cao_cao",
    "pool_id": "pool_ruler_basic",
    "character_id": "cao_cao",
    "rarity": "S",
    "weight": 6,
    "is_limited": false,
    "skill_name": "挟天子令诸侯",
    "skill_desc": "提高外交压制和正统收益。",
    "mvp_open": true
  },
  {
    "id": "pool_ruler_basic_liu_bei",
    "pool_id": "pool_ruler_basic",
    "character_id": "liu_bei",
    "rarity": "A",
    "weight": 18,
    "is_limited": false,
    "skill_name": "仁德聚众",
    "skill_desc": "提高民心恢复与人才招募成功率。",
    "mvp_open": true
  },
  {
    "id": "pool_strategist_basic_zhu_ge_liang",
    "pool_id": "pool_strategist_basic",
    "character_id": "zhu_ge_liang",
    "rarity": "SSS",
    "weight": 1,
    "is_limited": false,
    "skill_name": "运筹帷幄",
    "skill_desc": "大幅提高战术成功率与远征稳定性。",
    "mvp_open": true
  },
  {
    "id": "pool_general_basic_yue_fei",
    "pool_id": "pool_general_basic",
    "character_id": "yue_fei",
    "rarity": "SSS",
    "weight": 1,
    "is_limited": false,
    "skill_name": "精忠岳家军",
    "skill_desc": "提高主力军作战力与士气保持能力。",
    "mvp_open": true
  }
]
```

---

## 六、抽卡逻辑伪代码

```ts
function drawCharacter(poolId, state) {
  const pool = getPool(poolId);
  const entries = getPoolEntries(poolId).filter(item => item.mvp_open);

  const rarityBucket = pickRarityWithPity(state, pool);
  const candidates = entries.filter(entry => entry.rarity === rarityBucket);

  const winner = weightedPick(candidates, 'weight');

  updatePityState(state, winner.rarity);
  return winner;
}
```

---

## 七、国家级抽卡状态字段建议

建议给 `factions` 或单独的 `faction_draw_state` 表增加：

| 字段 | 类型 | 说明 |
|---|---|---|
| faction_id | uuid/string | 政权 ID |
| current_date | string | 当前刷新日期 |
| free_draw_used | number | 今日已用免费次数 |
| pity_s_progress | number | 距离 S 保底累计 |
| pity_sss_progress | number | 距离 SSS 提升累计 |

推荐单独建表：

```text
faction_draw_state
```

---

## 八、首版推荐开放的职位池

首版建议只开放 6 个池：

1. `pool_all_basic`
2. `pool_ruler_basic`
3. `pool_domestic_basic`
4. `pool_diplomat_basic`
5. `pool_strategist_basic`
6. `pool_general_basic`

原因：
- 功能闭环足够
- 卡池结构更容易验证
- 后续再扩展到兵部/礼部/工部/刑部

---

## 九、首版推荐角色量

不要一开始就做 1000 人配置。  
建议首版：

- 君主池：30 人
- 内政池：30 人
- 外交池：20 人
- 军师池：30 人
- 将军池：30 人
- 综合池：从以上池混入 60-80 人

后续再把 [draw_pool_design.md](/Users/xiaovan/Documents/Playground/docs/draw_pool_design.md) 中的完整名单逐步补全。

---

## 十、后续可继续扩展

下一步如果继续做配置落地，建议追加：

1. `character_config.json` 初版 60 人
2. `pool_entries.json` 初版完整示例
3. `skills.json` 技能单独拆表
4. `bond_config.json` 羁绊配置
5. `draw_simulator.ts` 抽卡模拟器
