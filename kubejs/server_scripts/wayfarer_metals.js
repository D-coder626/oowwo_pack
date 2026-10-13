// =====================================================================================
// PARKED as .js.off 2026-09-21 - rename to .js after wayfarer_port.js is confirmed in game.  Bronze / tin / copper: make wayfarer_core the canonical source.
//
// Direction (Derek, 2026-09-21): use wayfarer_core's bronze, tin and copper - ores, ingots, tools.
// Keep the Bronze mod's Bronze Blend as the required ingredient for bronze, usable in the crucible.
// Keep the Bronze mod's bronze ARMOR.
//
// This file only covers the KubeJS half (tags + recipes). The other halves are, in order:
//   1. Almost Unified config      -> snippet at the bottom of this file (priority_overrides)
//   2. Bridge datapack flip       -> two files to overwrite, listed at the bottom
//   3. Worldgen                   -> datapack_oowwo_wayfarer_bridge_ADDITIONS/ (3 tiny files)
// Decisions 1-5 answered yes; final answers on 2026-09-21: bronze = blend or copper+tin ingot, furnace and blasting removed for tin, blend, iron, copper and gold (Create fans need not keep working). Nothing is applied until you say so. To revert the KubeJS half, delete this file.
// =====================================================================================

// ---------- 1. Tags: tell Almost Unified and the Bronze armor recipes that wayfarer_core's metals
// are "the same material". Same technique as silver_unification.js (wayfarer_core ships no c: tags
// for bronze/tin/copper - checked in the jar).
ServerEvents.tags('item', event => {
  // bronze (Bronze mod armor recipes are keyed on #c:ingots/bronze, so this is what lets the armor
  // accept wayfarer's ingot)
  event.add('c:ingots/bronze', 'wayfarer_core:bronze_ingot');
  event.add('c:nuggets/bronze', 'wayfarer_core:bronze_nugget');
  event.add('c:storage_blocks/bronze', 'wayfarer_core:bronze_block');
  // tin
  event.add('c:ingots/tin', 'wayfarer_core:tin_ingot');
  event.add('c:nuggets/tin', 'wayfarer_core:tin_nugget');
  event.add('c:raw_materials/tin', 'wayfarer_core:raw_tin');
  event.add('c:storage_blocks/tin', 'wayfarer_core:tin_block');
  event.add('c:storage_blocks/raw_tin', 'wayfarer_core:raw_tin_block');
  event.add('c:ores/tin', ['wayfarer_core:tin_ore', 'wayfarer_core:deepslate_tin_ore',
    'wayfarer_core:dense_tin_ore', 'wayfarer_core:dense_deepslate_tin_ore']);
  // copper (wayfarer has no copper ingot or tools of its own: its crucible casts minecraft:copper_ingot,
  // and its dense veins drop minecraft:raw_copper)
  event.add('c:ores/copper', ['wayfarer_core:dense_copper_ore', 'wayfarer_core:dense_deepslate_copper_ore']);
  event.add('c:nuggets/copper', 'wayfarer_core:copper_nugget');
  event.add('c:storage_blocks/copper', 'wayfarer_core:copper_block');
  // from Wayfarer's bronze.js: the bronze knife counts as a knife for Farmer's Delight etc.
  event.add('c:tools', 'wayfarer_core:bronze_knife');
  event.add('c:tools/knife', 'wayfarer_core:bronze_knife');
  event.add('farmersdelight:straw_harvesters', 'wayfarer_core:bronze_knife');
  event.add('farmersdelight:tools/knives', 'wayfarer_core:bronze_knife');
});

ServerEvents.tags('block', event => {
  event.add('c:ores/tin', ['wayfarer_core:tin_ore', 'wayfarer_core:deepslate_tin_ore',
    'wayfarer_core:dense_tin_ore', 'wayfarer_core:dense_deepslate_tin_ore']);
  event.add('c:ores/copper', ['wayfarer_core:dense_copper_ore', 'wayfarer_core:dense_deepslate_copper_ore']);
  event.add('c:storage_blocks/bronze', 'wayfarer_core:bronze_block');
  event.add('c:storage_blocks/tin', 'wayfarer_core:tin_block');
  event.add('c:storage_blocks/raw_tin', 'wayfarer_core:raw_tin_block');
  event.add('c:storage_blocks/copper', 'wayfarer_core:copper_block');
});

ServerEvents.recipes(event => {
  // ---------- 2. Bronze mod tools that duplicate wayfarer's. The Bronze mod's pickaxe is hardcoded
  // IRON tier; wayfarer's bronze pickaxe is STONE tier. Leaving both would bypass the ladder.
  // Bronze hoe and sickle have no wayfarer equivalent, so they are left alone. (DECISION 3)
  ['pickaxe', 'axe', 'shovel', 'sword'].forEach(t => event.remove({ id: `bronze:crafting/bronze_${t}` }));
  event.remove({ id: 'bronze:crafting/bronze_knife' });
  event.remove({ id: 'bronze:compat/crafting/bronze_knife' });

  // ---------- 3. Bronze routes (Derek): Bronze Blend, and copper ingot + tin ingot. Nothing is removed here.
  // Copper ingot + tin ingot = wayfarer's crucible alloy (250 mB copper + 250 mB tin -> 250 mB bronze),
  // which stays. The Bronze mod's own ingot-based routes (4 copper + 1 tin shapeless, Create heated
  // mixing) also use ingots and are left alone. Blend is the other route and also melts in the crucible.

  // Blend goes in the crucible. 1 blend = 1 ingot's worth (250 mB), matching what the furnace gives
  // (Bronze's own blend smelt yields 1 ingot) and wayfarer's melting/molten_bronze_from_ingot.
  event.custom({
    type: 'wayfarer_core:crucible_melting',
    ingredient: { item: 'bronze:bronze_blend' },
    duration: 600,
    result: { id: 'wayfarer_core:molten_bronze', amount: 250 }
  }).id('oowwo:melting/molten_bronze_from_blend');

  // ---------- 4. Tin is crucible-only (Derek: remove furnace AND blasting, Create fans need not keep working).
  // Removes every furnace and blasting recipe that makes tin, including the two Create-compat recipes
  // for crushed raw tin. Create can still crush ore and wash crushed tin into tin nuggets (splashing),
  // which craft into ingots. Blasting is also wiped globally by wayfarer_port_REVIEW.js; these
  // explicit ids make this file work on its own.
  ['raw_tin', 'tin_ore', 'deepslate_tin_ore'].forEach(n => {
    ['smelting', 'blasting'].forEach(k => {
      event.remove({ id: `bronze:smelting/tin_ingot_from_${k}_${n}` });
      event.remove({ id: `caverns_and_chasms:tin_ingot_from_${k}_${n}` });
    });
  });
  ['cassiterite_tin_ore', 'cylindrite_tin_ore', 'saddled_egg'].forEach(n =>
    ['smelting', 'blasting'].forEach(k => event.remove({ id: `caverns_and_chasms:tin_ingot_from_${k}_${n}` })));
  event.remove({ id: 'bronze:compat/smelting/tin_ingot_from_crushed' });
  event.remove({ id: 'bronze:compat/blasting/tin_ingot_from_crushed' });

  // ---------- 5. Bronze Blend: crucible-only, same treatment. Blend still crafts from raw copper + raw
  // tin and still crushes back into them in Create.
  event.remove({ id: 'bronze:smelting/bronze_ingot_from_smelting_bronze_blend' });
  event.remove({ id: 'bronze:smelting/bronze_ingot_from_blasting_bronze_blend' });
});

// =====================================================================================
// ALMOST UNIFIED - config/almostunified/unification/materials.json  (edit, NOT KubeJS)
// Current: mod_priorities = minecraft, create, bronze, caverns_and_chasms, antiquelegacy, ...
//          priority_overrides = {}
// Proposed: leave mod_priorities alone and pin only tin and bronze to wayfarer_core, so silver /
// lead / steel / titanium winners do not change as a side effect:
//
//   "priority_overrides": {
//     "c:ingots/bronze": "wayfarer_core",     "c:nuggets/bronze": "wayfarer_core",
//     "c:storage_blocks/bronze": "wayfarer_core",
//     "c:ingots/tin": "wayfarer_core",        "c:nuggets/tin": "wayfarer_core",
//     "c:raw_materials/tin": "wayfarer_core", "c:storage_blocks/tin": "wayfarer_core",
//     "c:storage_blocks/raw_tin": "wayfarer_core", "c:ores/tin": "wayfarer_core"
//   }
//
// Copper needs no override: 'minecraft' is already first, so vanilla copper ingot stays the winner.
// After a launch, check logs/almostunified/almostunified.log: the wayfarer_core items must NOT be
// in the [AutoHiding] lists, and there must be no '[WorldGen] Mark ... for removal' lines.
//
// BRIDGE DATAPACK FLIP (custom_datapacks/ and saves/wayfarer_test/datapacks/ copies):
//   datapack_oowwo_wayfarer_bridge/data/wayfarer_core/recipe/casting/bronze_ingot.json
//        currently disables wayfarer's own bronze casting -> overwrite with the jar's original
//        {"type":"wayfarer_core:casting","fluid":{"id":"wayfarer_core:molten_bronze","amount":250},
//         "ingredient":{"item":"wayfarer_core:ingot_mould"},"result":{"id":"wayfarer_core:bronze_ingot"}}
//   datapack_oowwo_wayfarer_bridge/data/oowwo/recipe/casting/bronze_ingot_from_crucible.json
//        currently casts the Bronze mod's ingot -> overwrite with the disable stub
//        {"neoforge:conditions":[{"type":"neoforge:false"}]}
//   Keep molten_bronze_from_bronze_mod_ingot and molten_tin_from_bronze_raw_tin: they let any Bronze
//   mod ingot / raw tin already in a world be melted down instead of stranded.
// =====================================================================================
