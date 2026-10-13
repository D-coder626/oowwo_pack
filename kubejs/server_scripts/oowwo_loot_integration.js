// oowwo_loot_integration.js — oowwo's shared chest-loot injection layer.
// Build doc: claude/oowwo-availability-audit-build.md (G6). Reference: claude/oowwo-loot-integration.md.
//
// HOW IT WORKS
//   1. OLI_POOLS defines reusable loot tables (oowwo:loot/<name>). Each one is a single weighted roll.
//   2. OLI_INJECT adds ONE extra pool to an existing chest table. That pool references an oowwo:loot table
//      and fires with the given per-chest chance. NOTHING is removed or replaced. The table's own loot,
//      oowwo_copper_loot.js modifiers, LootIntegrations sub-tables and Lootr all keep working.
//   3. A missing table is logged (warn) and skipped, never an error.
//
// TO ADD A MOD'S LOOT LATER: add a pool to OLI_POOLS (or reuse one) and append rows to OLI_INJECT
// under a new section header. Check every table id against the live registry first
// (/oowwo_avail all -> kubejs/oowwo_avail_loot.json).
//
// RHINO: no const/let inside callbacks (seed_pots hit "redeclaration of var"). Top-level names use OLI_.
// ARCHAEOLOGY tables (brushable blocks) are NOT handled here: a brushed block keeps only the FIRST stack,
// so an extra pool would be ignored. They need an entry added to the table's first pool instead.

// ---------- entry helper ----------
// [item, weight, count?, damage?, structures?]
//   count     [min, max] or null
//   damage    [min, max] fraction of durability, or null
//   structures  structure id or list: entry only rolls inside it (other entries split the weight elsewhere)
var OLI_D = [0.2, 0.8]

var OLI_POOLS = {
  // ===== G6 — Wayfarer ring pools (templates_and_injections.js, 2026-10-04), copied unchanged =====
  medium_rings: [
    ['wayfarer_core:rusted_iron_ring', 25, null, OLI_D],
    ['wayfarer_core:dull_iron_ring', 25, null, OLI_D],
    ['wayfarer_core:bulwark_ring', 10, null, OLI_D],
    ['wayfarer_core:fireward_ring', 10, null, OLI_D],
    ['wayfarer_core:spellward_ring', 10, null, OLI_D],
    ['wayfarer_core:ailward_ring', 10, null, OLI_D],
    ['wayfarer_core:ring_of_the_afflicted', 10, null, OLI_D],
    ['wayfarer_core:ring_of_warmth', 5, null, OLI_D],
    ['wayfarer_core:ring_of_the_rat', 5, null, OLI_D],
    ['wayfarer_core:silvercat_ring', 5, null, OLI_D]
  ],
  high_rings: [
    ['wayfarer_core:rusted_iron_ring', 5, null, OLI_D],
    ['wayfarer_core:dull_iron_ring', 5, null, OLI_D],
    ['wayfarer_core:bulwark_ring', 15, null, OLI_D],
    ['wayfarer_core:fireward_ring', 15, null, OLI_D],
    ['wayfarer_core:spellward_ring', 15, null, OLI_D],
    ['wayfarer_core:ailward_ring', 15, null, OLI_D],
    ['wayfarer_core:ring_of_the_afflicted', 15, null, OLI_D],
    ['wayfarer_core:ring_of_warmth', 15, null, OLI_D],
    ['wayfarer_core:ring_of_the_rat', 15, null, OLI_D],
    ['wayfarer_core:silvercat_ring', 15, null, OLI_D],
    ['wayfarer_core:ring_of_silence', 85, null, OLI_D, 'minecraft:ancient_city']
  ],
  nether_rings: [
    ['wayfarer_core:bulwark_ring', 15, null, OLI_D],
    ['wayfarer_core:fireward_ring', 15, null, OLI_D],
    ['wayfarer_core:spellward_ring', 15, null, OLI_D],
    ['wayfarer_core:ailward_ring', 15, null, OLI_D],
    ['wayfarer_core:ring_of_the_afflicted', 15, null, OLI_D],
    ['wayfarer_core:mercury_gemstone_ring', 35, null, OLI_D, ['minecraft:fortress', 'nova_structures:nether_keep']]
  ],

  // ===== G6 — ruined tools / stormtuning fork / horseshoe (Wayfarer weights) =====
  // upgrade_count is a real wayfarer_core data component in oowwo's jar (WayfarerDataComponents, checked 2026-10-04).
  ruined_weapons: [
    ['wayfarer_core:ruined_sword', 6, null, [0.1, 0.6]],
    ['wayfarer_core:ruined_axe', 6, null, [0.1, 0.6]],
    ['wayfarer_core:ruined_knife', 3, null, [0.1, 0.6]],
    ['wayfarer_core:ruined_sword[wayfarer_core:upgrade_count=1]', 4, null, [0.1, 0.4]],
    ['wayfarer_core:ruined_axe[wayfarer_core:upgrade_count=1]', 4, null, [0.1, 0.4]],
    ['wayfarer_core:ruined_knife[wayfarer_core:upgrade_count=1]', 2, null, [0.1, 0.4]]
  ],
  ruined_mining: [
    ['wayfarer_core:ruined_pickaxe', 12, null, [0.1, 0.6]],
    ['wayfarer_core:ruined_shovel', 12, null, [0.1, 0.6]],
    ['wayfarer_core:ruined_pickaxe[wayfarer_core:upgrade_count=1]', 8, null, [0.1, 0.4]],
    ['wayfarer_core:ruined_shovel[wayfarer_core:upgrade_count=1]', 8, null, [0.1, 0.4]]
  ],
  stormtuning_fork: [
    ['wayfarer_core:stormtuning_fork', 1, null, OLI_D]
  ],
  stormtuning_fork_ominous: [
    ['wayfarer_core:stormtuning_fork[wayfarer_core:upgrade_count=1]', 10, null, [0.1, 0.6]],
    ['wayfarer_core:stormtuning_fork[wayfarer_core:upgrade_count=2]', 5, null, [0.1, 0.4]]
  ],
  tiny_horseshoe: [
    ['wayfarer_core:tiny_horseshoe', 1, null, OLI_D]
  ],

  // ===== G6 — NML bandages (Wayfarer's materials/reward pools, simplified) =====
  bandages: [
    ['nomansland:bandage', 15, [2, 6]],
    ['nomansland:antidote_bandage', 5, [1, 3]],
    ['nomansland:medicinal_bandage', 5, [1, 3]]
  ],
  bandages_high: [
    ['nomansland:bandage', 15, [2, 6]],
    ['nomansland:antidote_bandage', 5, [1, 3]],
    ['nomansland:medicinal_bandage', 5, [1, 3]],
    ['nomansland:warding_bandage', 2, [1, 2]]
  ]
}

// [chest table, pool name, per-chest chance]
var OLI_INJECT = [
  // ===== G6 rings =====
  ['minecraft:chests/simple_dungeon', 'medium_rings', 0.08],
  ['minecraft:chests/abandoned_mineshaft', 'medium_rings', 0.08],
  ['minecraft:chests/pillager_outpost', 'medium_rings', 0.08],
  ['nova_structures:chests/pillager_outpost_treasure', 'medium_rings', 0.15],
  ['nomansland:chests/small_dungeon_core', 'medium_rings', 0.08],
  ['nomansland:chests/underground_shelter', 'medium_rings', 0.08],
  ['nova_structures:chests/stray_fort_tresure', 'medium_rings', 0.08],
  ['nova_structures:chests/lone_citadel/c_library', 'medium_rings', 0.08],
  ['nova_structures:chests/lone_citadel/c_banner', 'medium_rings', 0.08],
  ['nova_structures:chests/creeping_crypt/crypt_grave', 'medium_rings', 0.08],
  ['nova_structures:chests/creeping_crypt/crypt_hallway', 'medium_rings', 0.08],
  ['nova_structures:chests/undead_crypts_grave', 'medium_rings', 0.08],
  ['minecraft:chests/trial_chambers/reward', 'medium_rings', 0.10],

  ['minecraft:chests/ancient_city', 'high_rings', 0.15],
  ['minecraft:chests/stronghold_library', 'high_rings', 0.15],
  ['minecraft:chests/stronghold_corridor', 'high_rings', 0.15],
  ['minecraft:chests/stronghold_crossing', 'high_rings', 0.15],
  ['minecraft:chests/trial_chambers/reward_ominous', 'high_rings', 0.15],
  ['nova_structures:chests/creeping_crypt/vault_creeping', 'high_rings', 0.15],

  ['minecraft:chests/nether_bridge', 'nether_rings', 0.10],
  ['minecraft:chests/bastion_bridge', 'nether_rings', 0.10],
  ['minecraft:chests/bastion_hoglin_stable', 'nether_rings', 0.10],
  ['minecraft:chests/bastion_other', 'nether_rings', 0.10],
  ['minecraft:chests/bastion_treasure', 'nether_rings', 0.10],
  ['nova_structures:chests/nether_keep/vault_keep', 'nether_rings', 0.10],
  ['nova_structures:chests/nether_keep/vault_keep_generic', 'nether_rings', 0.10],
  ['nova_structures:chests/hamlet/hamlet', 'nether_rings', 0.10],
  ['nova_structures:chests/hamlet/hamlet_tresure', 'nether_rings', 0.10],

  // ===== G6 ruined tools =====
  ['minecraft:chests/desert_pyramid', 'ruined_weapons', 0.10],
  ['minecraft:chests/jungle_temple', 'ruined_weapons', 0.10],
  ['minecraft:chests/simple_dungeon', 'ruined_weapons', 0.10],
  ['nova_structures:chests/desert_ruins/desert_ruin_lesser_treasure', 'ruined_weapons', 0.10],
  ['nova_structures:chests/desert_ruins/desert_ruin_grave', 'ruined_weapons', 0.10],
  ['nova_structures:chests/creeping_crypt/crypt_grave', 'ruined_weapons', 0.10],
  ['nova_structures:chests/undead_crypts_grave', 'ruined_weapons', 0.10],
  ['nova_structures:chests/lone_citadel/c_grave', 'ruined_weapons', 0.10],

  ['minecraft:chests/abandoned_mineshaft', 'ruined_mining', 0.12],
  ['nova_structures:chests/mining_supply', 'ruined_mining', 0.12],
  ['nova_structures:chests/badland_miner_outpost', 'ruined_mining', 0.12],

  // ===== G6 stormtuning fork / tiny horseshoe =====
  ['minecraft:chests/trial_chambers/reward', 'stormtuning_fork', 0.05],
  ['minecraft:chests/trial_chambers/reward_ominous', 'stormtuning_fork_ominous', 0.08],

  ['nova_structures:chests/dungeon_1', 'tiny_horseshoe', 0.05],
  ['nova_structures:chests/dungeon_2', 'tiny_horseshoe', 0.05],
  ['nova_structures:chests/dungeon_3', 'tiny_horseshoe', 0.05],
  ['nova_structures:chests/dungeon_4', 'tiny_horseshoe', 0.05],
  ['nova_structures:chests/dungeon_5', 'tiny_horseshoe', 0.05],
  ['nova_structures:chests/dungeon_6', 'tiny_horseshoe', 0.05],
  ['nova_structures:chests/dungeon_7', 'tiny_horseshoe', 0.05],

  // ===== G6 bandages =====
  ['minecraft:chests/shipwreck_supply', 'bandages', 0.25],
  ['minecraft:chests/underwater_ruin_small', 'bandages', 0.25],
  ['minecraft:chests/underwater_ruin_big', 'bandages', 0.25],
  ['minecraft:chests/desert_pyramid', 'bandages', 0.25],
  ['minecraft:chests/jungle_temple', 'bandages', 0.25],
  ['minecraft:chests/igloo_chest', 'bandages', 0.25],
  ['minecraft:chests/simple_dungeon', 'bandages', 0.25],
  ['minecraft:chests/abandoned_mineshaft', 'bandages', 0.25],
  ['minecraft:chests/pillager_outpost', 'bandages', 0.25],
  ['minecraft:chests/trial_chambers/corridor', 'bandages', 0.25],
  ['nova_structures:chests/illager_camp', 'bandages', 0.25],
  ['nova_structures:chests/water_supply', 'bandages', 0.25],
  ['nova_structures:chests/desert_ruins/desert_ruin_house', 'bandages', 0.25],
  ['nova_structures:chests/jungle_ruins/jungle_ruins_house', 'bandages', 0.25],

  ['minecraft:chests/stronghold_library', 'bandages_high', 0.25],
  ['minecraft:chests/stronghold_corridor', 'bandages_high', 0.25],
  ['minecraft:chests/stronghold_crossing', 'bandages_high', 0.25],
  ['minecraft:chests/ancient_city', 'bandages_high', 0.25]
]

LootJS.lootTables(function (event) {
  var W = function (msg) { console.warn('[oowwo_loot_integration] ' + msg) }

  // 1. build the reusable pools
  Object.keys(OLI_POOLS).forEach(function (name) {
    try {
      event.create('oowwo:loot/' + name).createPool(function (pool) {
        OLI_POOLS[name].forEach(function (e) {
          var entry = LootEntry.of(e[0]).withWeight(e[1])
          if (e[2]) entry = entry.setCount(e[2])
          if (e[3]) entry = entry.damage(e[3])
          if (e[4]) entry = entry.when(function (c) { c.matchStructure(e[4]) })
          pool.addEntry(entry)
        })
      })
    } catch (err) { W('pool ' + name + ': ' + err) }
  })

  // 2. inject one extra pool per row
  var added = 0
  OLI_INJECT.forEach(function (row) {
    try {
      if (!OLI_POOLS[row[1]]) { W('unknown pool ' + row[1] + ' for ' + row[0]); return }
      if (!event.hasLootTable(row[0])) { W('missing table ' + row[0]); return }
      event.getLootTable(row[0]).createPool(function (pool) {
        pool.addEntry(LootEntry.reference('oowwo:loot/' + row[1]).when(function (c) { c.randomChance(row[2]) }))
      })
      added++
    } catch (err) { W(row[0] + ' / ' + row[1] + ': ' + err) }
  })
  console.info('[oowwo_loot_integration] ' + Object.keys(OLI_POOLS).length + ' pools, ' + added + '/' + OLI_INJECT.length + ' injections')
})
