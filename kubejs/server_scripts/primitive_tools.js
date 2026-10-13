// oowwo primitive tier: flint/bone tools replace wood+stone pickaxe/axe/shovel/hoe,
// matching the Wayfarer pack's progression. Swords are deliberately kept (weapons stay).
// The wooden shovel is also kept: it is an ingredient of Farmer's Delight's cooking pot.
//
// Removal is by OUTPUT, not by recipe id. The earlier version removed only the vanilla recipe
// ids (minecraft:stone_shovel etc), which leaves any mod-added recipe for the same item alive —
// that is the likely reason a flint shovel attempt was still producing a stone shovel.
// Removing by output kills every recipe that yields these items, whichever mod supplied it.
//
// HOES: wayfarer_core:bone_pick already tills soil in code — BonePickItem extends PickaxeItem but
// overrides useOn with ItemAbilities.HOE_TILL and returns DEFAULT_HOE_ACTIONS from
// canPerformAction (verified by decompiling BonePickItem.class). The #minecraft:hoes tag below is
// not what makes tilling work; it is added for parity with Wayfarer, which tags it the same way,
// so enchantments and other mods' hoe checks treat it consistently.
//
// To revert: delete this file (that also removes the flint/bone tool recipes).

ServerEvents.tags('item', event => {
  // Parity with Wayfarer's miscellaneous.js: the bone pick counts as a hoe.
  event.add('minecraft:hoes', 'wayfarer_core:bone_pick');
});

ServerEvents.recipes(event => {
  // --- flint/bone starter tools ---
  event.shaped('wayfarer_core:flint_axe', [
    'CC',
    'CS',
    ' S'
  ], {
    C: 'minecraft:flint',
    S: 'minecraft:stick'
  }).id('oowwo:flint_axe');

  event.shaped('wayfarer_core:flint_shovel', [
    'C',
    'S',
    'S'
  ], {
    C: 'minecraft:flint',
    S: 'minecraft:stick'
  }).id('oowwo:flint_shovel');

  event.shaped('wayfarer_core:bone_pick', [
    'CCC',
    ' S ',
    ' S '
  ], {
    C: 'minecraft:bone',
    S: 'minecraft:stick'
  }).id('oowwo:bone_pick');

  // --- retire wood/stone tools (every recipe producing them, any mod) ---
  // Swords are NOT in this list on purpose.
  [
    'minecraft:wooden_pickaxe',
    'minecraft:wooden_axe',
    // wooden_shovel deliberately NOT retired (2026-09-26): Farmer's Delight's cooking pot needs one.
    'minecraft:wooden_hoe',
    'minecraft:stone_pickaxe',
    'minecraft:stone_axe',
    'minecraft:stone_shovel',
    'minecraft:stone_hoe'
  ].forEach(retired => {
    event.remove({ output: retired });
  });
});
