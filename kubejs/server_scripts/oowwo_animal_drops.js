// oowwo_animal_drops.js — animal bones and hides (oowwo design, Wayfarer-inspired). 2026-09-30.
//
// Replaces: bone_from_knife.js (DELETE THAT FILE — it and section 7 of oowwo_small_ports.js were both
// adding knife bones, so knife kills gave double bones) and sections 6 + 7 of oowwo_small_ports.js.
//
// Rules (Derek, 2026-09-30):
//   - BASE drops (any weapon) are Wayfarer's hide drops, kept; a KNIFE (#c:tools/knife — Farmer's
//     Delight + wayfarer_core knives) adds more on top.
//   - Hide = minecraft:rabbit_hide (Wayfarer's hide; 4 hide + 1 wax -> 4 leather).
//     Deer, elk, caribou, moose give Critters n' Crawlers BUCKSKIN instead.
//     2026-10-29: Fangs & Claws removed — wolves give rabbit hide again (was F&C fur); owlbear dropped.
//   - Size tiers for the knife bonus:
//       LARGE   bones 2-3 (always), hide 2-3 (always)
//       MEDIUM  bones 1-2 (80%),    hide 1-2 (60%)
//       SMALL   bone 1 (30%),       hide 1 (30%, furred animals only; birds none)
//   - Leather stays removed from cow, mooshroom, horse, mule, donkey, llamas (Wayfarer).
//
// Fixes a bug in the old code: `.addLoot(x).setCount([a,b])` in LootJS 3.7 applies setCount to EVERY item
// in the drop list (read from GroupedLootAction.apply -> LootBucket.modifyItems), so it also reset beef,
// porkchops etc. Counts here are set on the entry itself: LootEntry.of(x).setCount([a,b]).
//
// Only animals that HAVE an entity loot table are listed (read from each mod's jar); animals with no
// loot table (e.g. C'n'C mouse/skunk/marmot, Reanimal penguin/red panda) may not run loot modifiers.
// To revert: delete this file and restore sections 6-7 of oowwo_small_ports.js.

LootJS.modifiers(event => {
  const KNIFE = '#c:tools/knife'
  const HIDE = 'minecraft:rabbit_hide', BUCKSKIN = 'cnc:buckskin', BONE = 'minecraft:bone'
  const E = (id, min, max) => LootEntry.of(id).setCount([min, max])

  // ------------------------------------------------------------------ BASE (no knife needed)
  event.addEntityModifier(['minecraft:polar_bear', 'minecraft:horse', 'minecraft:mule', 'minecraft:donkey',
    'minecraft:hoglin', 'minecraft:llama', 'minecraft:trader_llama'])
    .randomChance(0.5).addLoot(E(HIDE, 1, 2))
  event.addEntityModifier(['minecraft:fox', 'minecraft:panda']).randomChance(0.2).addLoot(E(HIDE, 1, 1))
  event.addEntityModifier(['minecraft:cow', 'minecraft:camel']).addLoot(E(HIDE, 1, 4))
  event.addEntityModifier('nomansland:deer').randomChance(0.5).addLoot(E(BUCKSKIN, 1, 2))   // was rabbit hide
  event.addEntityModifier('minecraft:wolf').randomChance(0.5).addLoot(E(HIDE, 1, 2))
  event.addEntityModifier(['minecraft:cow', 'minecraft:horse', 'minecraft:mule', 'minecraft:donkey',
    'minecraft:mooshroom', 'minecraft:llama', 'minecraft:trader_llama']).removeLoot('minecraft:leather')

  // ------------------------------------------------------------------ KNIFE BONUS
  const LARGE_HIDE = ['minecraft:cow', 'minecraft:mooshroom', 'minecraft:horse', 'minecraft:donkey', 'minecraft:mule',
    'minecraft:camel', 'minecraft:llama', 'minecraft:trader_llama', 'minecraft:polar_bear', 'minecraft:hoglin',
    'cnc:black_bear', 'cnc:giant_boar', 'reanimal:giraffe', 'reanimal:hippopotamus', 'reanimal:crocodile',
    'aether:flying_cow', 'spawn:sea_cow']
  const LARGE_BUCKSKIN = ['nomansland:moose', 'cnc:elk', 'cnc:caribou']

  const MEDIUM_HIDE = ['minecraft:sheep', 'minecraft:goat', 'minecraft:pig', 'minecraft:panda',
    'cnc:cougar', 'cnc:coyote', 'cnc:wolverine', 'reanimal:capybara', 'reanimal:seal',
    'aether:phyg', 'aether:sheepuff']
  const MEDIUM_BUCKSKIN = ['nomansland:deer', 'cnc:mule_deer', 'cnc:white_tailed_deer']
  const MEDIUM_FUR = ['minecraft:wolf', 'cnc:timber_wolf']   // hide since 2026-10-29 (F&C fur removed)
  const MEDIUM_BONES_ONLY = ['reanimal:ostrich']

  const SMALL_FURRED = ['minecraft:fox', 'minecraft:rabbit', 'cnc:beaver']
  const SMALL_BIRDS = ['minecraft:chicken', 'nomansland:goose', 'cnc:goose', 'cnc:turkey', 'reanimal:kiwi',
    'reanimal:pigeon', 'reanimal:hedgehog', 'reanimal:vulture', 'spawn:dodo']

  // large
  event.addEntityModifier(LARGE_HIDE.concat(LARGE_BUCKSKIN)).matchMainHand(KNIFE).addLoot(E(BONE, 2, 3))
  event.addEntityModifier(LARGE_HIDE).matchMainHand(KNIFE).addLoot(E(HIDE, 2, 3))
  event.addEntityModifier(LARGE_BUCKSKIN).matchMainHand(KNIFE).addLoot(E(BUCKSKIN, 2, 3))

  // medium
  event.addEntityModifier(MEDIUM_HIDE.concat(MEDIUM_BUCKSKIN, MEDIUM_FUR, MEDIUM_BONES_ONLY))
    .matchMainHand(KNIFE).randomChance(0.8).addLoot(E(BONE, 1, 2))
  event.addEntityModifier(MEDIUM_HIDE).matchMainHand(KNIFE).randomChance(0.6).addLoot(E(HIDE, 1, 2))
  event.addEntityModifier(MEDIUM_BUCKSKIN).matchMainHand(KNIFE).randomChance(0.6).addLoot(E(BUCKSKIN, 1, 2))
  event.addEntityModifier(MEDIUM_FUR).matchMainHand(KNIFE).randomChance(0.6).addLoot(E(HIDE, 1, 2))

  // small
  event.addEntityModifier(SMALL_FURRED.concat(SMALL_BIRDS)).matchMainHand(KNIFE).randomChance(0.3).addLoot(E(BONE, 1, 1))
  event.addEntityModifier(SMALL_FURRED).matchMainHand(KNIFE).randomChance(0.3).addLoot(E(HIDE, 1, 1))
})
