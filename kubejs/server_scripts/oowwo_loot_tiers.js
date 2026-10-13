// oowwo_loot_tiers.js — tier rules for loot (Task 6 row B, Derek 2026-10-05). Top-level prefix OLT_.
// Reference: claude/oowwo-task6-plan.md (B) and claude/oowwo-task6-build.md.
//
// STEP 1 (B1): no stone or wooden tools/weapons in chests or archaeology loot, any dimension.
//   Matched by LOOT TYPE (LootJS addTableModifier with LootType; addTypeModifier is deprecated in 3.7.0), not by table id, so every mod's chests are covered,
//   including gear other mods inject (e.g. Rogues' stone double axe in ~15 tables).
//   stone sword/axe/shovel, rogues stone double axe -> Caverns & Chasms copper sword/axe/shovel (plain copper)
//   stone pickaxe, wooden pickaxe                   -> wayfarer_core bone pick (the copper pickaxe is removed)
//   wooden axe / shovel / sword                     -> wayfarer_core flint axe / flint shovel / FD flint knife
//   stone hoe, wooden hoe                           -> removed (the iron Plow is the only hoe)
//   Aether skyroot gear is left alone. Enchantments on the old item are not carried over.
//
// STEP 2 (B2): chests opened IN THE NETHER (any table; matched by loot type + matchDimension) never give gear below
//   iron: wood, stone, flint, copper, bronze, bone, leather and chainmail tools/weapons/armour are REMOVED (not replaced).
//   Leather = vanilla leather armour, Archers archer armour, Rogues rogue armour, wayfarer raw hide armour.
//   GOLD STAYS (Derek). Kept on purpose: utility/magic sets that repair with leather (Iron's wandering magician,
//   Toxony hunter, wayfarer beekeeper, C&C cowl/toolbelt, Enderman Overhaul hoods), Create copper diving gear,
//   unique items (Fangs & Claws fang dagger, Mowzie's spear). List built from oowwo_gear_census.json (tier by repair
//   material). Test: /loot give only while standing IN the Nether (the dimension check uses where the loot rolls).
//
// STEP 4: wither skeletons keep their stone sword (vanilla) or stone axe (Caverns & Chasms WitherSkeletonMixin) so they
//   hit the same, but that weapon never drops. On spawn (EntityEvents.spawned = EntityJoinLevelEvent, server side,
//   after finalizeSpawn has equipped them) the MAINHAND drop chance is set to 0, only when the held item is a stone
//   sword or stone axe, so any other weapon (e.g. Apotheosis elite gear) keeps its normal drop chance.
//   The drop chance is saved with the mob, so it also applies to wither skeletons spawned before this file existed
//   once their chunk reloads. Born in Chaos barrel zombie wooden shovel is left alone (Derek).
//
// Additive to oowwo_copper_loot.js and oowwo_loot_integration.js; neither is changed.
// To revert: delete this file.

LootJS.modifiers(event => {
  var OLT_REPLACE = [
    ['minecraft:stone_sword', 'caverns_and_chasms:copper_sword'],
    ['minecraft:stone_axe', 'caverns_and_chasms:copper_axe'],
    ['minecraft:stone_shovel', 'caverns_and_chasms:copper_shovel'],
    ['rogues:stone_double_axe', 'caverns_and_chasms:copper_axe'],
    ['minecraft:stone_pickaxe', 'wayfarer_core:bone_pick'],
    ['minecraft:wooden_pickaxe', 'wayfarer_core:bone_pick'],
    ['minecraft:wooden_axe', 'wayfarer_core:flint_axe'],
    ['minecraft:wooden_shovel', 'wayfarer_core:flint_shovel'],
    ['minecraft:wooden_sword', 'farmersdelight:flint_knife']
  ]
  var OLT_REMOVE = ['minecraft:stone_hoe', 'minecraft:wooden_hoe']

  var OLT_b1 = event.addTableModifier(LootType.CHEST, LootType.ARCHAEOLOGY).name('oowwo_loot_tiers/b1_no_stone_wood')
  OLT_REPLACE.forEach(function (r) {
    OLT_b1.replaceLoot(r[0], LootEntry.of(r[1]), true)
  })
  OLT_REMOVE.forEach(function (id) {
    OLT_b1.removeLoot(id)
  })

  // ---------------- STEP 2 (B2): nothing below iron in Nether chests ----------------
  var OLT_NETHER_LOW = [
    'archers:archer_armor_chest', 'archers:archer_armor_feet', 'archers:archer_armor_head', 'archers:archer_armor_legs',
    'archers:flint_spear', 'born_in_chaos_v1:wood_splitter_axe', 'bronze:bronze_axe', 'bronze:bronze_boots',
    'bronze:bronze_chestplate', 'bronze:bronze_helmet', 'bronze:bronze_hoe', 'bronze:bronze_knife', 'bronze:bronze_leggings',
    'bronze:bronze_pickaxe', 'bronze:bronze_shovel', 'bronze:bronze_sickle', 'bronze:bronze_sword', 'create_sa:copper_axe',
    'create_sa:copper_boots', 'create_sa:copper_chestplate', 'create_sa:copper_helmet', 'create_sa:copper_hoe',
    'create_sa:copper_leggings', 'create_sa:copper_pickaxe', 'create_sa:copper_shovel', 'create_sa:copper_sword',
    'dungeonsdelight:flint_cleaver', 'farmersdelight:flint_knife', 'minecraft:chainmail_boots', 'minecraft:chainmail_chestplate',
    'minecraft:chainmail_helmet', 'minecraft:chainmail_leggings', 'minecraft:leather_boots', 'minecraft:leather_chestplate',
    'minecraft:leather_helmet', 'minecraft:leather_leggings', 'minecraft:stone_axe', 'minecraft:stone_hoe',
    'minecraft:stone_pickaxe', 'minecraft:stone_shovel', 'minecraft:stone_sword', 'minecraft:wooden_axe', 'minecraft:wooden_hoe',
    'minecraft:wooden_pickaxe', 'minecraft:wooden_shovel', 'minecraft:wooden_sword', 'netherdescent:bone_shiv',
    'newworld:ancient_mattock', 'rogues:flint_dagger', 'rogues:rogue_armor_chest', 'rogues:rogue_armor_feet',
    'rogues:rogue_armor_head', 'rogues:rogue_armor_legs', 'rogues:stone_double_axe', 'sons_of_sins:flesh_hoe',
    'sons_of_sins:osseous_axe', 'sons_of_sins:osseous_hoe', 'sons_of_sins:osseous_pickaxe', 'sons_of_sins:osseous_shovel',
    'sons_of_sins:osseous_sword', 'toxony:copper_scalpel', 'wayfarer_core:bone_pick', 'wayfarer_core:bronze_axe',
    'wayfarer_core:bronze_knife', 'wayfarer_core:bronze_mattock', 'wayfarer_core:bronze_pickaxe', 'wayfarer_core:bronze_shovel',
    'wayfarer_core:bronze_sword', 'wayfarer_core:flint_axe', 'wayfarer_core:flint_shovel', 'wayfarer_core:raw_hide_chestplate',
    'wayfarer_core:raw_hide_helmet', 'wayfarer_core:raw_hide_leggings', 'windswept:antler_helmet', 'wooden_armorpluse10:wooden_boots',
    'wooden_armorpluse10:wooden_chestplate', 'wooden_armorpluse10:wooden_helmet', 'wooden_armorpluse10:wooden_leggings'
  ]
  // Caverns & Chasms copper gear, every oxidation and waxed state
  var OLT_CC_AGES = ['', 'exposed_', 'weathered_', 'oxidized_', 'waxed_', 'waxed_exposed_', 'waxed_weathered_', 'waxed_oxidized_']
  var OLT_CC_PIECES = ['axe', 'boots', 'chestplate', 'helmet', 'hoe', 'leggings', 'pickaxe', 'shovel', 'sword']
  OLT_CC_AGES.forEach(function (a) {
    OLT_CC_PIECES.forEach(function (p) {
      OLT_NETHER_LOW.push('caverns_and_chasms:' + a + 'copper_' + p)
    })
  })

  var OLT_b2 = event.addTableModifier(LootType.CHEST).matchDimension('minecraft:the_nether').name('oowwo_loot_tiers/b2_nether_iron_floor')
  OLT_NETHER_LOW.forEach(function (id) {
    OLT_b2.removeLoot(id)
  })
})

// ---------------- STEP 4: wither skeletons never drop their stone weapon ----------------
var OLT_EquipmentSlot = Java.loadClass('net.minecraft.world.entity.EquipmentSlot')
var OLT_WS_STONE = ['minecraft:stone_sword', 'minecraft:stone_axe']

EntityEvents.spawned('minecraft:wither_skeleton', event => {
  var mob = event.entity
  var held = String(mob.getMainHandItem().getId())
  if (OLT_WS_STONE.indexOf(held) >= 0) {
    mob.setDropChance(OLT_EquipmentSlot.MAINHAND, 0.0)
  }
})
