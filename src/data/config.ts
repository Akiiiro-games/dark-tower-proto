import type { GameConfig } from "./types";

// Single source of truth for all tunable prototype data. Mirrors the "Configuration Catalog"
// role described in DarkTowerGameDesign.md §9 — static rules/values live here, runtime state
// lives in GameState. Values are placeholder balancing, not final numbers (per §10).

export const CONFIG: GameConfig = {
    ranks: [
        { rank: 1, name: "Rookie", attack: 5, defense: 5, salaryGoldPerWeek: 50, carryCapacity: 1.0 },
        { rank: 2, name: "Grunt", attack: 8, defense: 7, salaryGoldPerWeek: 80, carryCapacity: 2 },
        { rank: 3, name: "Raider", attack: 12, defense: 10, salaryGoldPerWeek: 100, carryCapacity: 3 },
        { rank: 4, name: "Veteran", attack: 17, defense: 14, salaryGoldPerWeek: 150, carryCapacity: 4 },
        { rank: 5, name: "Captain", attack: 23, defense: 19, salaryGoldPerWeek: 250, carryCapacity: 5 },
    ],

    items: [
        { id: "golden_cup", name: "Golden Cup", tags: ["treasure"], maxStackSize: 5, baseValueGold: 40 },
        { id: "ancient_crown", name: "Ancient Crown", tags: ["treasure"], maxStackSize: 1, baseValueGold: 150 },
        { id: "silver_necklace", name: "Silver Necklace", tags: ["treasure"], maxStackSize: 5, baseValueGold: 25 },
        { id: "enchanted_gem", name: "Enchanted Gem", tags: ["treasure"], maxStackSize: 3, baseValueGold: 80 },
        { id: "cow", name: "Cow", tags: ["ingridients"], maxStackSize: 1, baseValueGold: 15 },
        { id: "cobblestone", name: "Cobblestone", tags: ["materials"], maxStackSize: 30, baseValueGold: 1 },
        { id: "iron_ore", name: "Iron Ore", tags: ["materials"], maxStackSize: 20, baseValueGold: 3 },
        { id: "wheat_sack", name: "Wheat Sack", tags: ["weapons"], maxStackSize: 15, baseValueGold: 2 },
        { id: "leather_hide", name: "Leather Hide", tags: ["ingridients"], maxStackSize: 10, baseValueGold: 4 },
        { id: "ruby_amulet", name: "Ruby Amulet", tags: ["treasure"], maxStackSize: 3, baseValueGold: 95 },
        { id: "jeweled_scepter", name: "Jeweled Scepter", tags: ["treasure"], maxStackSize: 1, baseValueGold: 200 },
        { id: "silver_chalice", name: "Silver Chalice", tags: ["treasure"], maxStackSize: 4, baseValueGold: 55 },
        { id: "obsidian_shard", name: "Obsidian Shard", tags: ["materials"], maxStackSize: 25, baseValueGold: 5 },
        { id: "mithril_ingot", name: "Mithril Ingot", tags: ["materials"], maxStackSize: 10, baseValueGold: 14 },
        { id: "goat", name: "Goat", tags: ["ingridients"], maxStackSize: 1, baseValueGold: 18 },
        { id: "honey_jar", name: "Honey Jar", tags: ["ingridients"], maxStackSize: 12, baseValueGold: 3 },
        { id: "steel_sword", name: "Steel Sword", tags: ["weapons"], maxStackSize: 5, baseValueGold: 9 },
        { id: "war_banner", name: "War Banner", tags: ["weapons"], maxStackSize: 3, baseValueGold: 14 },
    ],

    worldTiers: [
        { tier: 1, name: "Outer Villages" },
        { tier: 2, name: "Borderlands" },
        { tier: 3, name: "The Shattered Reaches" },
    ],

    missions: [
        {
            id: "t1_millbrook", tier: 1, name: "Millbrook Village",
            requiredPower: 18, baseDurationHours: 6, baseInjuryChance: 0.05,
            rewardGoldRange: [20, 50], rewardCrystalsRange: [0, 2],
            loot: [
                { itemId: "golden_cup", chance: 0.5, min: 1, max: 2 },
                { itemId: "cobblestone", chance: 0.9, min: 3, max: 8 },
                { itemId: "cow", chance: 0.3, min: 1, max: 1 },
            ],
            prisonerChance: 0.5, prisonerCountRange: [1, 2], prisonerRankRange: [1, 1],
        },
        {
            id: "t1_stonebridge", tier: 1, name: "Stonebridge Hamlet",
            requiredPower: 25, baseDurationHours: 8, baseInjuryChance: 0.07,
            rewardGoldRange: [30, 70], rewardCrystalsRange: [0, 3],
            loot: [
                { itemId: "iron_ore", chance: 0.8, min: 2, max: 6 },
                { itemId: "silver_necklace", chance: 0.4, min: 1, max: 2 },
                { itemId: "wheat_sack", chance: 0.6, min: 2, max: 5 },
            ],
            prisonerChance: 0.55, prisonerCountRange: [1, 2], prisonerRankRange: [1, 2],
        },
        {
            id: "t1_fallowcreek", tier: 1, name: "Fallow Creek Farms",
            requiredPower: 22, baseDurationHours: 7, baseInjuryChance: 0.06,
            rewardGoldRange: [25, 60], rewardCrystalsRange: [0, 2],
            loot: [
                { itemId: "wheat_sack", chance: 0.9, min: 3, max: 8 },
                { itemId: "cow", chance: 0.5, min: 1, max: 2 },
                { itemId: "leather_hide", chance: 0.5, min: 1, max: 3 },
            ],
            prisonerChance: 0.5, prisonerCountRange: [1, 1], prisonerRankRange: [1, 1],
        },
        {
            id: "t1_oakhollow", tier: 1, name: "Oakhollow Outpost",
            requiredPower: 32, baseDurationHours: 10, baseInjuryChance: 0.09,
            rewardGoldRange: [40, 90], rewardCrystalsRange: [1, 4],
            loot: [
                { itemId: "enchanted_gem", chance: 0.15, min: 1, max: 1 },
                { itemId: "golden_cup", chance: 0.4, min: 1, max: 2 },
                { itemId: "leather_hide", chance: 0.6, min: 2, max: 4 },
            ],
            prisonerChance: 0.6, prisonerCountRange: [1, 2], prisonerRankRange: [1, 2],
        },
        {
            id: "t1_duskhollow", tier: 1, name: "Duskhollow Mill",
            requiredPower: 20, baseDurationHours: 6, baseInjuryChance: 0.055,
            rewardGoldRange: [22, 55], rewardCrystalsRange: [0, 2],
            loot: [
                { itemId: "wheat_sack", chance: 0.8, min: 2, max: 6 },
                { itemId: "cobblestone", chance: 0.7, min: 2, max: 5 },
                { itemId: "leather_hide", chance: 0.3, min: 1, max: 2 },
            ],
            prisonerChance: 0.5, prisonerCountRange: [1, 2], prisonerRankRange: [1, 1],
        },
        {
            id: "t1_cinderford", tier: 1, name: "Cinderford Crossing",
            requiredPower: 27, baseDurationHours: 8, baseInjuryChance: 0.075,
            rewardGoldRange: [32, 68], rewardCrystalsRange: [0, 3],
            loot: [
                { itemId: "iron_ore", chance: 0.7, min: 2, max: 5 },
                { itemId: "golden_cup", chance: 0.3, min: 1, max: 1 },
                { itemId: "cow", chance: 0.4, min: 1, max: 1 },
            ],
            prisonerChance: 0.5, prisonerCountRange: [1, 2], prisonerRankRange: [1, 2],
        },
        {
            id: "t1_wrenhaven", tier: 1, name: "Wrenhaven Watch",
            requiredPower: 29, baseDurationHours: 9, baseInjuryChance: 0.08,
            rewardGoldRange: [35, 75], rewardCrystalsRange: [1, 3],
            loot: [
                { itemId: "silver_necklace", chance: 0.45, min: 1, max: 2 },
                { itemId: "leather_hide", chance: 0.55, min: 2, max: 4 },
                { itemId: "enchanted_gem", chance: 0.12, min: 1, max: 1 },
            ],
            prisonerChance: 0.55, prisonerCountRange: [1, 2], prisonerRankRange: [1, 2],
        },
        {
            id: "t1_greyshore", tier: 1, name: "Greyshore Landing",
            requiredPower: 34, baseDurationHours: 10, baseInjuryChance: 0.095,
            rewardGoldRange: [42, 95], rewardCrystalsRange: [1, 4],
            loot: [
                { itemId: "golden_cup", chance: 0.45, min: 1, max: 2 },
                { itemId: "iron_ore", chance: 0.85, min: 3, max: 7 },
                { itemId: "enchanted_gem", chance: 0.18, min: 1, max: 1 },
            ],
            prisonerChance: 0.55, prisonerCountRange: [1, 3], prisonerRankRange: [1, 2],
        },
        {
            id: "t1_ashford", tier: 1, name: "Ashford Crossroads",
            requiredPower: 24, baseDurationHours: 7, baseInjuryChance: 0.065,
            rewardGoldRange: [28, 62], rewardCrystalsRange: [0, 2],
            loot: [
                { itemId: "cow", chance: 0.5, min: 1, max: 1 },
                { itemId: "cobblestone", chance: 0.8, min: 2, max: 6 },
                { itemId: "honey_jar", chance: 0.4, min: 1, max: 3 },
            ],
            prisonerChance: 0.5, prisonerCountRange: [1, 2], prisonerRankRange: [1, 1],
        },
        {
            id: "t1_foxglen", tier: 1, name: "Foxglen Thicket",
            requiredPower: 31, baseDurationHours: 9, baseInjuryChance: 0.085,
            rewardGoldRange: [38, 80], rewardCrystalsRange: [1, 3],
            loot: [
                { itemId: "golden_cup", chance: 0.35, min: 1, max: 1 },
                { itemId: "iron_ore", chance: 0.7, min: 2, max: 5 },
                { itemId: "silver_chalice", chance: 0.25, min: 1, max: 1 },
            ],
            prisonerChance: 0.55, prisonerCountRange: [1, 2], prisonerRankRange: [1, 2],
        },
        {
            id: "t2_ravenswood", tier: 2, name: "Ravenswood Keep",
            requiredPower: 55, baseDurationHours: 16, baseInjuryChance: 0.12,
            rewardGoldRange: [80, 160], rewardCrystalsRange: [3, 8],
            loot: [
                { itemId: "ancient_crown", chance: 0.2, min: 1, max: 1 },
                { itemId: "enchanted_gem", chance: 0.3, min: 1, max: 2 },
                { itemId: "silver_necklace", chance: 0.6, min: 2, max: 4 },
            ],
            prisonerChance: 0.55, prisonerCountRange: [1, 3], prisonerRankRange: [2, 3],
        },
        {
            id: "t2_thornwall", tier: 2, name: "Thornwall Garrison",
            requiredPower: 68, baseDurationHours: 10, baseInjuryChance: 0.15,
            rewardGoldRange: [100, 200], rewardCrystalsRange: [4, 10],
            loot: [
                { itemId: "iron_ore", chance: 0.9, min: 4, max: 10 },
                { itemId: "golden_cup", chance: 0.5, min: 1, max: 3 },
                { itemId: "enchanted_gem", chance: 0.25, min: 1, max: 1 },
            ],
            prisonerChance: 0.6, prisonerCountRange: [1, 3], prisonerRankRange: [2, 4],
        },
        {
            id: "t2_blackmire", tier: 2, name: "Blackmire Citadel",
            requiredPower: 85, baseDurationHours: 14, baseInjuryChance: 0.18,
            rewardGoldRange: [150, 300], rewardCrystalsRange: [6, 15],
            loot: [
                { itemId: "ancient_crown", chance: 0.3, min: 1, max: 2 },
                { itemId: "enchanted_gem", chance: 0.4, min: 2, max: 3 },
                { itemId: "cobblestone", chance: 0.9, min: 5, max: 15 },
            ],
            prisonerChance: 0.65, prisonerCountRange: [1, 4], prisonerRankRange: [3, 5],
        },
        {
            id: "t2_hollowfen", tier: 2, name: "Hollowfen Marsh",
            requiredPower: 60, baseDurationHours: 9, baseInjuryChance: 0.13,
            rewardGoldRange: [90, 180], rewardCrystalsRange: [3, 9],
            loot: [
                { itemId: "silver_necklace", chance: 0.6, min: 2, max: 4 },
                { itemId: "enchanted_gem", chance: 0.3, min: 1, max: 2 },
                { itemId: "iron_ore", chance: 0.85, min: 4, max: 9 },
            ],
            prisonerChance: 0.55, prisonerCountRange: [1, 3], prisonerRankRange: [2, 4],
        },
        {
            id: "t2_ironspire", tier: 2, name: "Ironspire Bastion",
            requiredPower: 75, baseDurationHours: 12, baseInjuryChance: 0.16,
            rewardGoldRange: [120, 230], rewardCrystalsRange: [5, 12],
            loot: [
                { itemId: "golden_cup", chance: 0.55, min: 1, max: 3 },
                { itemId: "ancient_crown", chance: 0.22, min: 1, max: 1 },
                { itemId: "enchanted_gem", chance: 0.35, min: 1, max: 2 },
            ],
            prisonerChance: 0.6, prisonerCountRange: [1, 3], prisonerRankRange: [3, 4],
        },
        {
            id: "t2_wyrmscar", tier: 2, name: "Wyrmscar Hold",
            requiredPower: 90, baseDurationHours: 15, baseInjuryChance: 0.19,
            rewardGoldRange: [160, 320], rewardCrystalsRange: [7, 16],
            loot: [
                { itemId: "ancient_crown", chance: 0.32, min: 1, max: 2 },
                { itemId: "enchanted_gem", chance: 0.42, min: 2, max: 3 },
                { itemId: "cobblestone", chance: 0.9, min: 6, max: 16 },
            ],
            prisonerChance: 0.65, prisonerCountRange: [1, 4], prisonerRankRange: [3, 5],
        },
        {
            id: "t2_stormgate", tier: 2, name: "Stormgate Watch",
            requiredPower: 62, baseDurationHours: 11, baseInjuryChance: 0.14,
            rewardGoldRange: [95, 190], rewardCrystalsRange: [4, 9],
            loot: [
                { itemId: "ruby_amulet", chance: 0.3, min: 1, max: 1 },
                { itemId: "enchanted_gem", chance: 0.3, min: 1, max: 2 },
                { itemId: "iron_ore", chance: 0.85, min: 4, max: 8 },
            ],
            prisonerChance: 0.6, prisonerCountRange: [1, 3], prisonerRankRange: [2, 4],
        },
        {
            id: "t2_direwood", tier: 2, name: "Direwood Thicket",
            requiredPower: 70, baseDurationHours: 13, baseInjuryChance: 0.155,
            rewardGoldRange: [105, 210], rewardCrystalsRange: [4, 10],
            loot: [
                { itemId: "mithril_ingot", chance: 0.4, min: 1, max: 2 },
                { itemId: "golden_cup", chance: 0.5, min: 1, max: 2 },
                { itemId: "silver_necklace", chance: 0.5, min: 1, max: 3 },
            ],
            prisonerChance: 0.6, prisonerCountRange: [1, 3], prisonerRankRange: [2, 4],
        },
        {
            id: "t2_cragmoor", tier: 2, name: "Cragmoor Reach",
            requiredPower: 80, baseDurationHours: 13, baseInjuryChance: 0.17,
            rewardGoldRange: [130, 260], rewardCrystalsRange: [5, 13],
            loot: [
                { itemId: "ancient_crown", chance: 0.25, min: 1, max: 1 },
                { itemId: "obsidian_shard", chance: 0.8, min: 4, max: 10 },
                { itemId: "enchanted_gem", chance: 0.35, min: 1, max: 2 },
            ],
            prisonerChance: 0.62, prisonerCountRange: [1, 4], prisonerRankRange: [3, 5],
        },
        {
            id: "t2_saltmere", tier: 2, name: "Saltmere Shoals",
            requiredPower: 92, baseDurationHours: 16, baseInjuryChance: 0.195,
            rewardGoldRange: [165, 330], rewardCrystalsRange: [7, 17],
            loot: [
                { itemId: "jeweled_scepter", chance: 0.15, min: 1, max: 1 },
                { itemId: "ancient_crown", chance: 0.3, min: 1, max: 2 },
                { itemId: "cobblestone", chance: 0.9, min: 6, max: 16 },
            ],
            prisonerChance: 0.65, prisonerCountRange: [1, 4], prisonerRankRange: [3, 5],
        },
        {
            id: "t3_duskfall_spire", tier: 3, name: "Duskfall Spire",
            requiredPower: 100, baseDurationHours: 14, baseInjuryChance: 0.18,
            rewardGoldRange: [200, 380], rewardCrystalsRange: [8, 16],
            loot: [
                { itemId: "jeweled_scepter", chance: 0.15, min: 1, max: 1 },
                { itemId: "ruby_amulet", chance: 0.35, min: 1, max: 2 },
                { itemId: "mithril_ingot", chance: 0.5, min: 2, max: 4 },
            ],
            prisonerChance: 0.55, prisonerCountRange: [1, 3], prisonerRankRange: [3, 4],
        },
        {
            id: "t3_ironvault_depths", tier: 3, name: "Ironvault Depths",
            requiredPower: 108, baseDurationHours: 15, baseInjuryChance: 0.2,
            rewardGoldRange: [215, 400], rewardCrystalsRange: [9, 17],
            loot: [
                { itemId: "ancient_crown", chance: 0.25, min: 1, max: 1 },
                { itemId: "obsidian_shard", chance: 0.8, min: 5, max: 12 },
                { itemId: "steel_sword", chance: 0.4, min: 1, max: 2 },
            ],
            prisonerChance: 0.6, prisonerCountRange: [1, 3], prisonerRankRange: [3, 5],
        },
        {
            id: "t3_crimson_hollow", tier: 3, name: "Crimson Hollow",
            requiredPower: 115, baseDurationHours: 16, baseInjuryChance: 0.21,
            rewardGoldRange: [230, 420], rewardCrystalsRange: [10, 18],
            loot: [
                { itemId: "silver_chalice", chance: 0.5, min: 1, max: 3 },
                { itemId: "war_banner", chance: 0.3, min: 1, max: 1 },
                { itemId: "honey_jar", chance: 0.5, min: 2, max: 5 },
            ],
            prisonerChance: 0.58, prisonerCountRange: [1, 3], prisonerRankRange: [3, 4],
        },
        {
            id: "t3_wraithmoor", tier: 3, name: "Wraithmoor",
            requiredPower: 122, baseDurationHours: 17, baseInjuryChance: 0.23,
            rewardGoldRange: [245, 440], rewardCrystalsRange: [10, 19],
            loot: [
                { itemId: "jeweled_scepter", chance: 0.2, min: 1, max: 1 },
                { itemId: "goat", chance: 0.4, min: 1, max: 1 },
                { itemId: "obsidian_shard", chance: 0.7, min: 4, max: 10 },
            ],
            prisonerChance: 0.6, prisonerCountRange: [1, 4], prisonerRankRange: [3, 5],
        },
        {
            id: "t3_cindermaw_pit", tier: 3, name: "Cindermaw Pit",
            requiredPower: 129, baseDurationHours: 18, baseInjuryChance: 0.24,
            rewardGoldRange: [260, 460], rewardCrystalsRange: [11, 20],
            loot: [
                { itemId: "ruby_amulet", chance: 0.45, min: 1, max: 2 },
                { itemId: "steel_sword", chance: 0.5, min: 1, max: 3 },
                { itemId: "mithril_ingot", chance: 0.6, min: 2, max: 5 },
            ],
            prisonerChance: 0.62, prisonerCountRange: [1, 4], prisonerRankRange: [3, 5],
        },
        {
            id: "t3_thornspire_keep", tier: 3, name: "Thornspire Keep",
            requiredPower: 136, baseDurationHours: 19, baseInjuryChance: 0.26,
            rewardGoldRange: [275, 480], rewardCrystalsRange: [12, 21],
            loot: [
                { itemId: "ancient_crown", chance: 0.3, min: 1, max: 1 },
                { itemId: "war_banner", chance: 0.45, min: 1, max: 2 },
                { itemId: "silver_chalice", chance: 0.4, min: 1, max: 2 },
            ],
            prisonerChance: 0.63, prisonerCountRange: [1, 4], prisonerRankRange: [4, 5],
        },
        {
            id: "t3_frostfang_citadel", tier: 3, name: "Frostfang Citadel",
            requiredPower: 143, baseDurationHours: 20, baseInjuryChance: 0.27,
            rewardGoldRange: [290, 500], rewardCrystalsRange: [13, 22],
            loot: [
                { itemId: "jeweled_scepter", chance: 0.25, min: 1, max: 1 },
                { itemId: "obsidian_shard", chance: 0.85, min: 5, max: 12 },
                { itemId: "honey_jar", chance: 0.5, min: 2, max: 5 },
            ],
            prisonerChance: 0.64, prisonerCountRange: [2, 4], prisonerRankRange: [4, 5],
        },
        {
            id: "t3_blightwater_sanctum", tier: 3, name: "Blightwater Sanctum",
            requiredPower: 150, baseDurationHours: 21, baseInjuryChance: 0.29,
            rewardGoldRange: [305, 520], rewardCrystalsRange: [14, 23],
            loot: [
                { itemId: "ruby_amulet", chance: 0.5, min: 1, max: 2 },
                { itemId: "mithril_ingot", chance: 0.65, min: 2, max: 5 },
                { itemId: "goat", chance: 0.4, min: 1, max: 1 },
            ],
            prisonerChance: 0.65, prisonerCountRange: [2, 4], prisonerRankRange: [4, 5],
        },
        {
            id: "t3_voidscar_abyss", tier: 3, name: "Voidscar Abyss",
            requiredPower: 157, baseDurationHours: 22, baseInjuryChance: 0.3,
            rewardGoldRange: [320, 540], rewardCrystalsRange: [15, 24],
            loot: [
                { itemId: "ancient_crown", chance: 0.35, min: 1, max: 2 },
                { itemId: "war_banner", chance: 0.5, min: 1, max: 2 },
                { itemId: "steel_sword", chance: 0.55, min: 1, max: 3 },
            ],
            prisonerChance: 0.66, prisonerCountRange: [2, 5], prisonerRankRange: [4, 5],
        },
        {
            id: "t3_the_shattered_throne", tier: 3, name: "The Shattered Throne",
            requiredPower: 164, baseDurationHours: 23, baseInjuryChance: 0.32,
            rewardGoldRange: [340, 570], rewardCrystalsRange: [16, 26],
            loot: [
                { itemId: "jeweled_scepter", chance: 0.35, min: 1, max: 1 },
                { itemId: "silver_chalice", chance: 0.55, min: 1, max: 3 },
                { itemId: "obsidian_shard", chance: 0.9, min: 6, max: 14 },
            ],
            prisonerChance: 0.68, prisonerCountRange: [2, 5], prisonerRankRange: [4, 5],
        },
    ],

    upgrades: [
        // Storehouse
        { id: "sh_storage_1", room: "storehouse", name: "Storage Shelves I", description: "Add 10 storage slots.", costGold: 100, durationHours: 1, requires: [], effect: { type: "storageSlots", amount: 10 }, towerXp: 5 },
        { id: "sh_storage_2", room: "storehouse", name: "Storage Shelves II", description: "Add 20 more storage slots.", costGold: 200, durationHours: 3, requires: ["sh_storage_1"], effect: { type: "storageSlots", amount: 20 }, towerXp: 8 },
        { id: "sh_storage_3", room: "storehouse", name: "Storage Shelves III", description: "Add 80 more storage slots.", costGold: 500, durationHours: 6, requires: ["sh_storage_2"], effect: { type: "storageSlots", amount: 80 }, towerXp: 12 },
        { id: "sh_sale_eff_1", room: "storehouse", name: "Sale Efficiency I", description: "Normal sales take 25% less time.", costGold: 200, durationHours: 2, requires: [], effect: { type: "saleEfficiency", multiplier: 0.75 }, towerXp: 5 },
        { id: "sh_sale_eff_2", room: "storehouse", name: "Sale Efficiency II", description: "Normal sales take another 25% less time.", costGold: 500, durationHours: 4, requires: ["sh_sale_eff_1"], effect: { type: "saleEfficiency", multiplier: 0.75 }, towerXp: 8 },

        // Infirmary
        { id: "inf_eff_1", room: "infirmary", name: "Treatment Efficiency I", description: "Treatment takes 25% less time.", costGold: 100, durationHours: 3, requires: [], effect: { type: "treatmentEfficiency", multiplier: 0.75 }, towerXp: 6 },
        { id: "inf_eff_2", room: "infirmary", name: "Treatment Efficiency II", description: "Treatment takes another 27% less time.", costGold: 220, durationHours: 5, requires: ["inf_eff_1"], effect: { type: "treatmentEfficiency", multiplier: 0.73 }, towerXp: 9 },

        // Training Hall
        { id: "th_unlock_2_3", room: "trainingHall", name: "Advanced Training: Grunt→Raider", description: "Unlocks training Rank 2 to Rank 3.", costGold: 200, durationHours: 4, requires: [], effect: { type: "trainingUnlock", fromRank: 2 }, towerXp: 9 },
        { id: "th_unlock_3_4", room: "trainingHall", name: "Advanced Training: Raider→Veteran", description: "Unlocks training Rank 3 to Rank 4.", costGold: 450, durationHours: 7, requires: ["th_unlock_2_3"], effect: { type: "trainingUnlock", fromRank: 3 }, towerXp: 12 },
        { id: "th_unlock_4_5", room: "trainingHall", name: "Advanced Training: Veteran→Captain", description: "Unlocks training Rank 4 to Rank 5.", costGold: 900, durationHours: 12, requires: ["th_unlock_3_4"], effect: { type: "trainingUnlock", fromRank: 4 }, towerXp: 16 },

        // Laboratory
        { id: "lab_tier_1", room: "laboratory", name: "Research Tier Unlock I", description: "Unlocks Tier 2 research projects.", costGold: 200, durationHours: 5, requires: [], effect: { type: "researchTier", tier: 2 }, towerXp: 10 },
        { id: "lab_tier_2", room: "laboratory", name: "Research Tier Unlock II", description: "Unlocks Tier 3 research projects.", costGold: 500, durationHours: 9, requires: ["lab_tier_1"], effect: { type: "researchTier", tier: 3 }, towerXp: 14 },
        { id: "lab_eff_1", room: "laboratory", name: "Research Efficiency I", description: "Research takes 20% less time.", costGold: 150, durationHours: 4, requires: [], effect: { type: "researchEfficiency", multiplier: 0.8 }, towerXp: 8 },
        { id: "lab_eff_2", room: "laboratory", name: "Research Efficiency II", description: "Research takes another 25% less time.", costGold: 350, durationHours: 7, requires: ["lab_eff_1"], effect: { type: "researchEfficiency", multiplier: 0.75 }, towerXp: 12 },

        // Dungeon
        { id: "dg_cell_1", room: "dungeon", name: "Extra Cell I", description: "Add one prisoner cell.", costGold: 50, durationHours: 1, requires: [], effect: { type: "dungeonCell" }, towerXp: 4 },
        { id: "dg_cell_2", room: "dungeon", name: "Extra Cell II", description: "Add one more prisoner cell.", costGold: 120, durationHours: 3, requires: ["dg_cell_1"], effect: { type: "dungeonCell" }, towerXp: 6 },
        { id: "dg_torture_eff_1", room: "dungeon", name: "Torture Efficiency I", description: "Processing takes 20% less time.", costGold: 100, durationHours: 3, requires: [], effect: { type: "tortureEfficiency", multiplier: 0.8 }, towerXp: 6 },
        { id: "dg_torture_eff_2", room: "dungeon", name: "Torture Efficiency II", description: "Processing takes another 25% less time.", costGold: 250, durationHours: 6, requires: ["dg_torture_eff_1"], effect: { type: "tortureEfficiency", multiplier: 0.75 }, towerXp: 9 },
        { id: "dg_recruit_eff_1", room: "dungeon", name: "Recruitment Efficiency I", description: "Increases recruitment chance.", costGold: 120, durationHours: 3, requires: [], effect: { type: "recruitmentEfficiency", bonus: 0.1 }, towerXp: 7 },
        { id: "dg_recruit_eff_2", room: "dungeon", name: "Recruitment Efficiency II", description: "Increases recruitment chance further.", costGold: 300, durationHours: 6, requires: ["dg_recruit_eff_1"], effect: { type: "recruitmentEfficiency", bonus: 0.15 }, towerXp: 10 },

        // War Room
        { id: "wr_enemy_intel_1", room: "warRoom", name: "Enemy Intelligence I", description: "Narrower estimated enemy-strength range.", costGold: 100, durationHours: 3, requires: [], effect: { type: "enemyIntel", level: 1 }, towerXp: 6 },
        { id: "wr_enemy_intel_2", room: "warRoom", name: "Enemy Intelligence II", description: "Even narrower estimated enemy-strength range.", costGold: 250, durationHours: 6, requires: ["wr_enemy_intel_1"], effect: { type: "enemyIntel", level: 2 }, towerXp: 9 },
        { id: "wr_loot_intel_1", room: "warRoom", name: "Loot Intelligence I", description: "Reveals possible loot types.", costGold: 100, durationHours: 3, requires: [], effect: { type: "lootIntel", level: 1 }, towerXp: 6 },
        { id: "wr_loot_intel_2", room: "warRoom", name: "Loot Intelligence II", description: "Reveals estimated drop chances.", costGold: 250, durationHours: 6, requires: ["wr_loot_intel_1"], effect: { type: "lootIntel", level: 2 }, towerXp: 9 },
    ],

    incrementalUpgrades: [
        { id: "qt_bed", room: "quarters", name: "Add Bed", description: "Add one Quarters bed. Cost and build time rise with each bed added.", baseCostGold: 100, costStepGold: 20, baseDurationHours: 1, durationStepHours: 0.5, effect: { type: "bed" }, towerXp: 3 },
        { id: "inf_bed", room: "infirmary", name: "Add Treatment Bed", description: "Add one treatment bed. Cost and build time rise with each bed added.", baseCostGold: 120, costStepGold: 25, baseDurationHours: 1, durationStepHours: 0.5, effect: { type: "treatmentBed" }, towerXp: 3 },
        { id: "th_station", room: "trainingHall", name: "Add Training Station", description: "Add one training station. Cost and build time rise with each station added.", baseCostGold: 50, costStepGold: 40, baseDurationHours: 1, durationStepHours: 0.5, effect: { type: "trainingStation" }, towerXp: 4 },
    ],

    research: [
        { id: "res_improved_weapons", name: "Improved Weapons", description: "+3 Attack for all minions.", tier: 1, costGold: 150, durationHours: 6, requires: [], effects: [{ stat: "attack", mode: "add", value: 3 }], towerXp: 10 },
        { id: "res_improved_armor", name: "Improved Armor", description: "+3 Defense for all minions.", tier: 1, costGold: 150, durationHours: 6, requires: [], effects: [{ stat: "defense", mode: "add", value: 3 }], towerXp: 10 },
        { id: "res_fury_spell", name: "Fury Spell", description: "+15% Attack for all minions.", tier: 2, costGold: 400, durationHours: 10, requires: ["res_improved_weapons"], effects: [{ stat: "attack", mode: "mult", value: 1.15 }], towerXp: 16 },
    ],

    trainingTransitions: [
        { fromRank: 1, toRank: 2, costGold: 50, durationHours: 4 },
        { fromRank: 2, toRank: 3, costGold: 120, durationHours: 8 },
        { fromRank: 3, toRank: 4, costGold: 260, durationHours: 14 },
        { fromRank: 4, toRank: 5, costGold: 500, durationHours: 22 },
    ],

    towerXpThresholds: [0, 30, 70, 120, 190, 280, 400, 550, 750, 1000, 1300],

    startingBalance: {
        gold: 100,
        crystals: 5,
        minionRanks: [1, 1, 1],
        storageSlots: 20,
        beds: 3,
        treatmentBeds: 2,
        trainingStations: 1,
        dungeonCells: 2,
    },

    // Small starting stock so the Storehouse/Inventory/sell flow is immediately exercisable
    // without waiting on a raid. Mixes treasures and ordinary items at different stack fills
    // (including one full max-size-1 stack) and stays well under startingBalance.storageSlots.
    startingItems: [
        { itemId: "golden_cup", count: 3 },
        { itemId: "silver_necklace", count: 2 },
        { itemId: "ancient_crown", count: 1 },
        { itemId: "iron_ore", count: 8 },
        { itemId: "cobblestone", count: 12 },
    ],

    constants: {
        dayLengthRealSeconds: 60,
        weekDays: 7,
        restDurationHours: 6,
        treatmentDurationHours: 72,
        bedEvictionHours: 48,
        paydayWindowHours: 24,
        instantSaleFraction: 0.5,
        saleBaseHours: 1,
        saleHoursPerCopy: 0.5,
        dungeonBaseDurationHours: 24,
        dungeonOutcomeBase: { recruit: 0.6, interrogate: 0.15, death: 0.25 },
        recruitedInjuredChance: 0.5,
    },
};
