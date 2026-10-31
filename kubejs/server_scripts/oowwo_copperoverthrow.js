// oowwo: Copper Overthrow 1.0.0 compatibility (2026-10-30).
//
// Copper Overthrow ships data/minecraft/recipe/copper_ingot.json, which REPLACES the vanilla recipe id
// minecraft:copper_ingot with "9 copperoverthrow:copper_nugget -> 1 copper ingot". oowwo_building.js
// relies on that id being "copper block -> 9 ingots" (it swaps the input to wayfarer_core:copper_block,
// the 9-ingot storage block), so with Copper Overthrow installed that swap silently hits nothing and the
// storage block can no longer be turned back into ingots. This script:
//   1. removes Copper Overthrow's version of minecraft:copper_ingot and re-adds
//      wayfarer_core:copper_block -> 9 copper ingots under an oowwo id;
//   2. removes copperoverthrow:copper_nugget (ingot -> 9 nuggets): Wayfarer already has ingot <-> nugget
//      recipes, and Copper Overthrow's own recipes take #c:nuggets/copper, so they accept Wayfarer's nugget.
// Copper Overthrow recipes that take a vanilla copper block (hammer, tam-tam, rain drums, log stripper)
// are left as shipped: in oowwo the vanilla copper block is the cheap building block, same as for C&C gear.
ServerEvents.recipes(event => {
  const coSafe = fn => { try { fn(); } catch (e) { console.warn('[oowwo_copperoverthrow] skipped: ' + e); } };

  coSafe(() => event.remove({ id: 'minecraft:copper_ingot' }));
  coSafe(() => event.remove({ id: 'copperoverthrow:copper_nugget' }));

  coSafe(() => event.shapeless('9x minecraft:copper_ingot', ['wayfarer_core:copper_block'])
    .id('oowwo:copperoverthrow/copper_ingot_from_storage_block'));
});
