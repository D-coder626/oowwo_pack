// oowwo: Wayfarer kubejs/server_scripts/metallurgy_and_progression/smithing.js — the tag half.
// (The anvil recipe itself was already ported in wayfarer_port.js.)
//
// WHAT THIS DOES
//   wayfarer_core's anvil (AnvilMenu, read from the installed jar 2026-09-26) can UPGRADE an item
//   that is in the upgradeable tag: put the item in with its own repair material (e.g. an iron
//   hoe + iron ingots). Cost is 4 + upgrades-so-far materials; max 3 upgrades. Each upgrade
//   raises the item's attack/mining attributes and max durability. Items tagged
//   cannot_upgrade_with can't be used as the upgrade material.
//   Until now that tag was empty in oowwo, so nothing could be upgraded. This is Wayfarer's
//   replacement for the diamond hoe (removed in oowwo_steel_tier.js): upgrade an iron hoe instead.
//
// DEVIATION: Wayfarer writes `wayfarer:upgradeable` / `wayfarer:cannot_upgrade_with` for its newer
// wayfarer_core build; oowwo's installed jar reads the `wayfarer_core:` namespace
// (WayfarerTags -> Wayfarer.location). Rename these if wayfarer_core is ever updated.
// All ids verified present in oowwo's jars 2026-09-26.
// To revert: delete this file.

ServerEvents.tags('item', event => {
  event.add('wayfarer:cannot_upgrade_with', 'caverns_and_chasms:zirconia');

  event.add('wayfarer:upgradeable', [
    'wayfarer_core:bronze_nugget',
    'wayfarer_core:bronze_axe',
    'wayfarer_core:bronze_shovel',
    'wayfarer_core:bronze_pickaxe',
    'wayfarer_core:bronze_knife',
    'minecraft:turtle_shell',
    'wayfarer_core:mining_helmet',
    'goated:barbaric_helmet',
    'minecraft:iron_sword',
    'minecraft:iron_axe',
    'minecraft:iron_shovel',
    'minecraft:iron_pickaxe',
    'farmersdelight:iron_knife',
    'minecraft:iron_helmet',
    'minecraft:iron_chestplate',
    'minecraft:iron_leggings',
    'minecraft:iron_boots',
    'minecraft:golden_sword',
    'minecraft:golden_axe',
    'minecraft:golden_shovel',
    'minecraft:golden_pickaxe',
    'farmersdelight:golden_knife',
    'minecraft:golden_helmet',
    'minecraft:golden_chestplate',
    'minecraft:golden_leggings',
    'minecraft:golden_boots',
    'minecraft:diamond_sword',
    'minecraft:diamond_axe',
    'minecraft:diamond_shovel',
    'minecraft:diamond_pickaxe',
    'farmersdelight:diamond_knife',
    'minecraft:diamond_helmet',
    'minecraft:diamond_chestplate',
    'minecraft:diamond_leggings',
    'minecraft:diamond_boots',
    'minecraft:leather_helmet',
    'minecraft:leather_chestplate',
    'minecraft:leather_leggings',
    'minecraft:leather_boots',
    'minecraft:chainmail_helmet',
    'minecraft:chainmail_chestplate',
    'minecraft:chainmail_leggings',
    'minecraft:chainmail_boots',
    'minecraft:iron_hoe',
    'wayfarer_core:hammer',
    'wayfarer_core:sledgehammer',
    'farmersdelight:skillet',
    'minecraft:mace',
    'minecraft:trident',
    'wayfarer_core:stormtuning_fork',
    'nomansland:tortoise_shell',
    'newworld:ancient_mattock',
    'wayfarer_core:bronze_mattock',
    'wayfarer_core:silver_sword',
    'wayfarer_core:silver_axe',
    'wayfarer_core:silver_knife',
    'wayfarer_core:silver_mallet',
    'caverns_and_chasms:silver_sword',
    'caverns_and_chasms:silver_axe',
    'caverns_and_chasms:silver_shovel',
    'caverns_and_chasms:silver_pickaxe'
  ]);
});
