// oowwo: Wayfarer's tier_rebalance.js durabilities (ported 2026-10-04, Task 4 F).
// Startup script: needs a full game restart to change.
// Source: Wayfarer kubejs/startup_scripts/tier_rebalance.js (2026-10-04 version).
// Not ported: piglinproliferation:buckler (mod not in oowwo).
// Steel = vanilla diamond ids in oowwo, so the diamond values are the steel tier.

ItemEvents.modification(function (event) {
  var OTR_LIST = [
    // tools: gold 125 (vanilla 32), iron 540 (250), diamond/steel 2750 (1561)
    ['minecraft:golden_sword', 125], ['minecraft:golden_pickaxe', 125], ['minecraft:golden_hoe', 125],
    ['minecraft:golden_shovel', 125], ['minecraft:golden_axe', 125], ['farmersdelight:golden_knife', 125],
    ['minecraft:iron_sword', 540], ['minecraft:iron_pickaxe', 540], ['minecraft:iron_hoe', 540],
    ['minecraft:iron_shovel', 540], ['minecraft:iron_axe', 540], ['farmersdelight:iron_knife', 540],
    ['minecraft:diamond_sword', 2750], ['minecraft:diamond_pickaxe', 2750], ['minecraft:diamond_hoe', 2750],
    ['minecraft:diamond_shovel', 2750], ['minecraft:diamond_axe', 2750], ['farmersdelight:diamond_knife', 2750],

    // armour
    ['minecraft:leather_helmet', 165], ['minecraft:leather_chestplate', 240],
    ['minecraft:leather_leggings', 205], ['minecraft:leather_boots', 195],
    ['minecraft:iron_helmet', 265], ['minecraft:iron_chestplate', 340],
    ['minecraft:iron_leggings', 305], ['minecraft:iron_boots', 295],
    ['minecraft:diamond_helmet', 663], ['minecraft:diamond_chestplate', 828],
    ['minecraft:diamond_leggings', 795], ['minecraft:diamond_boots', 729],

    // misc
    ['minecraft:mace', 637], ['minecraft:trident', 800], ['minecraft:shears', 576],
    ['caverns_and_chasms:cowl', 165],

    // C&C silver tools (base 157)
    ['caverns_and_chasms:silver_pickaxe', 1000], ['caverns_and_chasms:silver_axe', 1000],
    ['caverns_and_chasms:silver_shovel', 1000], ['caverns_and_chasms:silver_sword', 1000],

    // shields
    ['shieldexp:wooden_shield', 156], ['minecraft:shield', 256], ['shieldexp:golden_shield', 376],
    ['shieldexp:iron_shield', 376], ['shieldexp:diamond_shield', 476], ['shieldexp:netherite_shield', 376]
  ]

  OTR_LIST.forEach(function (pair) {
    try {
      event.modify(pair[0], function (item) { item.setMaxDamage(pair[1]) })
    } catch (err) {
      console.error('[oowwo_tier_rebalance] ' + pair[0] + ': ' + err)
    }
  })
  console.info('[oowwo_tier_rebalance] applied ' + OTR_LIST.length + ' durability overrides')
})
