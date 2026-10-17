// oowwo: small Wayfarer ports, batch of 2026-09-26 (Derek picked items 1-9).
// Sources (Wayfarer kubejs/server_scripts): materials/rubber.js, materials/pulp.js,
// materials/mortar_and_pestle.js, materials/scribing_tools.js, technology/rails.js,
// metallurgy_and_progression/raw_hide.js, metallurgy_and_progression/extra_bones_with_knife.js,
// food/food.js, loot_and_combat/{bells,cthonic,levitite,consumables,stormtuning_fork}.js,
// technology/wrench.js.
//
// Already in oowwo, not repeated: rubber smelting, scribing tools + table, pestle, mortar,
// ender pearl/lifegem/blaze rod grinding, the three wayfarer cooking-pot meals, rings,
// crossbows, mattock mould + bronze mattock, raw hide armour.
//
// SKIPPED (mod not in oowwo): Etched music label, Envelope letter, Tolerable Creepers mischief
// arrow, Incubation scrambled eggs, Nirvana hemp, Portable Hole (rift_matrix.js).
// Also skipped: newworld:ancient_mattock_crafting removal (that recipe id does not exist in
// newworld 1.7.3 — it uses smithing), ruined_tools.js (tag nothing reads).
//
// DEVIATIONS:
//   - wrench tag written as wayfarer_core:wrenchable (the installed jar's namespace); the two
//     C&C redstone refractor/resistor ids are dropped (not in oowwo's C&C); Wayfarer's
//     'minecraft:redstone_repeater'/'redstone_comparator' corrected to minecraft:repeater/comparator.
//   - chthonic "subject_of_evil" drops #minecraft:illager_friends (not a tag oowwo defines).
//   - Recipe ids added (oowwo:small/...). No const/let inside repeated callbacks (Rhino).
// To revert: delete this file.

ServerEvents.recipes(event => {
  const R = fn => { try { fn(); } catch (e) { console.warn('[small_ports] skipped: ' + e); } };
  // Wayfarer-mortar twin of a Toxony grind (Derek 2026-10-17): same output + 25% chance of 1 extra, one input item, 60 ticks. Helper inlined (global cannot be assigned in server scripts).
  const WF = (ing, result, key) => event.custom({ type: 'wayfarer_core:grinding', ingredient: ing, input_count: 1, result: { id: result.id || result.item, count: result.count || 1 }, duration: 60, bonus_chance: 0.25, bonus_count: 1 }).id('oowwo:wf_grinding/' + String(key).toLowerCase().replace(/[^a-z0-9_.\/-]/g, '/'));
  const RM = id => event.remove({ id: id });
  // Grinding runs on Toxony's mortar since 2026-09-27 (Derek). Toxony has no bonus roll, so the
  // output is Wayfarer's expected value rounded: count + chance*bonus (e.g. bone 3 +60% -> 4).
  const GRIND = (input, out, count, chance, bonus, id) => { R(() => WF(input.charAt(0) === '#' ? { tag: input.substring(1) } : { item: input }, { id: out, count: Math.round(count + chance * bonus) }, 'small/' + id)); return R(() => event.custom({
    type: 'toxony:mortar_pestle',
    ingredients: [input.charAt(0) === '#' ? { tag: input.substring(1) } : { item: input }],
    result: { id: out, count: Math.round(count + chance * bonus) }
  }).id('oowwo:small/grinding/' + id)); };

  // ---------- 1. rubber ----------
  R(() => event.shaped('create:cardboard_sword', ['RRR', ' S ', ' S '], { S: 'minecraft:stick', R: 'wayfarer_core:rubber' }).id('oowwo:small/cardboard_sword'));
  RM('create:crafting/kinetics/belt_connector');
  R(() => event.shaped('create:belt_connector', ['RRR', '   ', '   '], { R: 'wayfarer_core:rubber' }).id('oowwo:small/belt_connector'));
  RM('offroad:small_tire'); RM('offroad:tire'); RM('offroad:large_tire'); RM('offroad:monstrous_tire');
  R(() => event.shaped('offroad:small_tire', [' R ', 'RSR', ' R '], { S: 'create:shaft', R: 'wayfarer_core:rubber' }).id('oowwo:small/small_tire'));
  R(() => event.shaped('offroad:tire', ['RRR', 'RSR', 'RRR'], { S: 'create:shaft', R: 'wayfarer_core:rubber' }).id('oowwo:small/tire'));
  R(() => event.shaped('offroad:large_tire', [' R ', 'RSR', ' R '], { S: 'create:shaft', R: 'create:belt_connector' }).id('oowwo:small/large_tire'));
  R(() => event.shaped('offroad:monstrous_tire', ['RRR', 'RSR', 'RRR'], { S: 'create:shaft', R: 'create:belt_connector' }).id('oowwo:small/monstrous_tire'));
  RM('caverns_and_chasms:blunt_arrow');
  R(() => event.shaped('4x caverns_and_chasms:blunt_arrow', [' R ', ' S ', ' F '], { R: 'wayfarer_core:rubber', S: 'minecraft:stick', F: 'minecraft:feather' }).id('oowwo:small/blunt_arrow'));
  RM('caverns_and_chasms:bouncer');
  R(() => event.shaped('caverns_and_chasms:bouncer', ['RRR', 'RCR', 'RRR'], { R: 'wayfarer_core:rubber', C: 'create:brass_casing' }).id('oowwo:small/bouncer'));

  // ---------- 2. paper from pulp ----------
  RM('minecraft:paper');
  RM('farmersdelight:paper_from_tree_bark');
  GRIND('farmersdelight:tree_bark', 'create:pulp', 2, 0.6, 1, 'pulp_from_bark');
  GRIND('#wayfarer:makes_pulp', 'create:pulp', 1, 0.5, 1, 'pulp');
  R(() => event.shaped('minecraft:paper', ['   ', 'HMM', '   '], { M: 'create:pulp', H: '#c:tools/hammers' }).id('oowwo:small/paper_hammer'));
  R(() => event.custom({ type: 'create:pressing', ingredients: [{ item: 'create:pulp' }], results: [{ id: 'minecraft:paper' }] }).id('oowwo:small/pressing/paper'));

  // ---------- 3. mortar grinding ----------
  RM('caverns_and_chasms:bone_meal_from_bone_flute');
  RM('nomansland:bone_meal_from_seashells');
  RM('upgrade_aquatic:bone_meal_from_thrasher_tooth');
  RM('minecraft:wind_charge');
  GRIND('minecraft:bone', 'minecraft:bone_meal', 3, 0.6, 1, 'bone_meal');
  GRIND('caverns_and_chasms:bone_flute', 'minecraft:bone_meal', 3, 0.6, 1, 'bone_meal_from_flute');
  GRIND('nomansland:seashells', 'minecraft:bone_meal', 1, 0.3, 1, 'bone_meal_from_seashells');
  GRIND('upgrade_aquatic:thrasher_tooth', 'minecraft:bone_meal', 5, 0.6, 1, 'bone_meal_from_thrasher_tooth');
  GRIND('minecraft:glow_berries', 'minecraft:glowstone_dust', 1, 0.33, 1, 'glowstone_dust');
  GRIND('minecraft:breeze_rod', 'minecraft:wind_charge', 3, 0.3, 1, 'wind_charge');
  GRIND('minecraft:sugar_cane', 'minecraft:sugar', 2, 0.3, 1, 'sugar_from_cane');
  GRIND('minecraft:beetroot', 'minecraft:sugar', 1, 0.6, 1, 'sugar_from_beetroot');
  GRIND('minecraft:charcoal', 'supplementaries:ash', 2, 0.6, 1, 'ash_from_charcoal');
  GRIND('minecraft:coal', 'supplementaries:ash', 4, 0.6, 1, 'ash_from_coal');
  GRIND('minecraft:cobblestone', 'minecraft:gravel', 1, 0.0, 0, 'gravel');
  GRIND('minecraft:gravel', 'minecraft:sand', 1, 0.0, 0, 'sand');
  GRIND('wayfarer_core:patina', 'minecraft:cyan_dye', 1, 0.0, 0, 'cyan_dye');

  // ---------- 4. scribing tools ----------
  RM('minecraft:writable_book');
  RM('minecraft:cartography_table');
  RM('farmersdelight:hanging_canvas_sign');
  RM('farmersdelight:canvas_sign');
  RM('supplementaries:doormat_2');
  RM('create:crafting/appliances/name_tag');
  RM('create:crafting/appliances/clipboard');
  RM('brewinandchewin:label');
  R(() => event.shapeless('minecraft:writable_book', ['wayfarer_core:scribing_tools', 'minecraft:book']).id('oowwo:small/writable_book'));
  R(() => event.shaped('minecraft:name_tag', [' S ', 'CXC', 'CCC'], { X: 'wayfarer_core:scribing_tools', S: 'minecraft:string', C: 'farmersdelight:tree_bark' }).id('oowwo:small/name_tag'));
  R(() => event.shaped('supplementaries:doormat', [' S ', 'HHH', '   '], { S: 'wayfarer_core:scribing_tools', H: 'minecraft:rabbit_hide' }).id('oowwo:small/doormat'));
  R(() => event.shaped('create:clipboard', [' T ', 'PSP', 'LLL'], { S: 'wayfarer_core:scribing_tools', L: '#minecraft:planks', P: 'minecraft:paper', T: 'wayfarer_core:tin_ingot' }).id('oowwo:small/clipboard'));
  R(() => event.shaped('3x farmersdelight:canvas_sign', [' AA', ' XS', '   '], { X: 'wayfarer_core:scribing_tools', S: 'minecraft:stick', A: 'farmersdelight:canvas' }).id('oowwo:small/canvas_sign'));
  R(() => event.shaped('3x farmersdelight:hanging_canvas_sign', [' XC', ' AA', '   '], { X: 'wayfarer_core:scribing_tools', C: 'minecraft:chain', A: 'farmersdelight:canvas' }).id('oowwo:small/hanging_canvas_sign'));
  R(() => event.shaped('minecraft:cartography_table', ['MS ', 'PP ', 'PP '], { S: 'wayfarer_core:scribing_tools', M: 'minecraft:map', P: '#minecraft:planks' }).id('oowwo:small/cartography_table'));
  R(() => event.replaceInput({ id: 'minecraft:map' }, 'minecraft:compass', 'wayfarer_core:scribing_tools'));
  R(() => event.shaped('4x brewinandchewin:label', [' P ', 'PSP', ' P '], { P: 'minecraft:paper', S: 'wayfarer_core:scribing_tools' }).id('oowwo:small/label'));

  // ---------- 5. rails ----------
  RM('minecraft:rail'); RM('minecraft:powered_rail'); RM('minecraft:activator_rail'); RM('minecraft:detector_rail');
  R(() => event.shaped('8x minecraft:rail', ['R R', 'RSR', 'R R'], { R: 'minecraft:iron_nugget', S: 'minecraft:stick' }).id('oowwo:small/rail'));
  R(() => event.shaped('8x minecraft:powered_rail', ['RXR', 'RSR', 'RIR'], { R: 'minecraft:iron_nugget', S: 'minecraft:stick', X: 'wayfarer_core:redstone_circuit', I: 'minecraft:redstone' }).id('oowwo:small/powered_rail'));
  R(() => event.shaped('8x minecraft:activator_rail', ['RXR', 'RSR', 'RIR'], { R: 'minecraft:iron_nugget', S: 'minecraft:stick', X: 'wayfarer_core:redstone_circuit', I: 'minecraft:redstone_torch' }).id('oowwo:small/activator_rail'));
  R(() => event.shaped('8x minecraft:detector_rail', ['RXR', 'RSR', 'RIR'], { R: 'minecraft:iron_nugget', S: 'minecraft:stick', X: 'wayfarer_core:redstone_circuit', I: 'minecraft:stone_pressure_plate' }).id('oowwo:small/detector_rail'));

  // ---------- 6. hides ----------
  R(() => event.shaped('4x minecraft:leather', [' H ', 'HWH', ' H '], { H: 'minecraft:rabbit_hide', W: 'wayfarer_core:wax' }).id('oowwo:small/leather_from_hide'));
  R(() => event.replaceInput({ id: 'nomansland:building/straw_bed' }, 'minecraft:leather', 'minecraft:rabbit_hide'));

  // ---------- 8. food ----------
  RM('nomansland:mushroom_stew');
  RM('minecraft:beetroot_soup');
  RM('minecraft:rabbit_stew_from_brown_mushroom');
  RM('nomansland:rabbit_stew_from_red_mushroom');
  RM('nomansland:food/mashed_potatoes_with_mushroom');
  RM('brewinandchewin:corn_dough_from_egg');
  RM('brewinandchewin:corn_dough_from_water');
  R(() => event.shapeless('8x brewinandchewin:corn_dough', ['4x brewinandchewin:cornmeal', 'minecraft:egg', '4x brewinandchewin:cornmeal']).id('oowwo:small/corn_dough_egg'));
  R(() => event.shapeless('8x brewinandchewin:corn_dough', ['4x brewinandchewin:cornmeal', '#wayfarer:water_crafting', '4x brewinandchewin:cornmeal']).id('oowwo:small/corn_dough_water'));

  // ---------- 9. consumables ----------
  RM('caverns_and_chasms:kunai');
  R(() => event.shaped('2x caverns_and_chasms:kunai', [' N ', 'NSN', '   '], { S: 'minecraft:stick', N: '#wayfarer:generic_metal_nugget' }).id('oowwo:small/kunai'));
  RM('caverns_and_chasms:large_arrow');
  R(() => event.shaped('2x caverns_and_chasms:large_arrow', [' I ', ' S ', ' F '], { S: 'minecraft:stick', F: 'minecraft:feather', I: '#wayfarer:generic_metal_ingot' }).id('oowwo:small/large_arrow'));
});

ServerEvents.tags('item', event => {
  event.add('wayfarer:makes_pulp', ['#minecraft:saplings', 'minecraft:bamboo', 'abundant_atmosphere:red_bamboo', 'nomansland:reeds', 'supplementaries:flax']);
  event.add('c:tools', 'wayfarer_core:stormtuning_fork');
  event.add('c:melee_weapon', 'wayfarer_core:stormtuning_fork');
  event.add('c:melee_weapons', 'wayfarer_core:stormtuning_fork');
  event.add('c:tools/spear', 'wayfarer_core:stormtuning_fork');
  event.add('c:tools/spears', 'wayfarer_core:stormtuning_fork');
});

ServerEvents.tags('block', event => {
  event.add('wayfarer:wrenchable', [
    'create:shaft', 'create:cogwheel', 'create:large_cogwheel',
    'wayfarer_core:fluid_pipe', 'wayfarer_core:item_pipe',
    'minecraft:hopper', 'minecraft:repeater', 'minecraft:comparator',
    'wayfarer_core:redstone_breaker', 'wayfarer_core:redstone_gauge',
    'wayfarer_core:item_gauge', 'wayfarer_core:fluid_gauge',
    '#create:windmill_sails'
  ]);
});

ServerEvents.tags('entity_type', event => {
  event.add('wayfarer:subject_of_evil', [
    '#minecraft:illager', '#minecraft:raiders',
    'minecraft:vex', 'minecraft:wither_skeleton', 'minecraft:phantom'
  ]);
});

LootJS.lootTables(event => {
  const W = msg => console.warn('[small_ports] ' + msg);
  const addFirst = (id, item, weight) => {
    try {
      event.getLootTable(id).firstPool().addEntry(LootEntry.of(item).withWeight(weight));
    } catch (e) { W(id + ': ' + e); }
  };
  addFirst('nova_structures:chests/pillager_outpost_treasure', 'wayfarer_core:allay_calling_bell', 8);
  addFirst('nova_structures:chests/illager_camp', 'wayfarer_core:allay_calling_bell', 2);
});

LootJS.modifiers(event => {
  // 6. hides and 7. bones with a knife: MOVED 2026-09-30 to oowwo_animal_drops.js.

  // 9. bells, chthonic calculus, rift sediment
  event.addEntityModifier('minecraft:evoker').addLoot('wayfarer_core:vex_calling_bell').randomChance(0.2);
  event.addEntityModifier('#wayfarer:subject_of_evil').addLoot('wayfarer_core:chthonic_calculus').randomChance(0.05);
  event.addTableModifier('minecraft:blocks/spawner').addLoot(LootEntry.of('wayfarer_core:chthonic_calculus').setCount([1, 2]));
  event.addTableModifier('minecraft:blocks/trial_spawner').addLoot(LootEntry.of('wayfarer_core:chthonic_calculus').setCount([0, 1]));
  event.addTableModifier('nomansland:blocks/monster_anchor').addLoot(LootEntry.of('wayfarer_core:chthonic_calculus').setCount([0, 1]));
  event.addEntityModifier(['minecraft:endermite']).addLoot(LootEntry.of('wayfarer_core:rift_sediment').setCount([1, 3]));
  event.addEntityModifier(['minecraft:enderman']).addLoot(LootEntry.of('wayfarer_core:rift_sediment').setCount([1, 3]));
  event.addEntityModifier(['minecraft:shulker']).addLoot(LootEntry.of('wayfarer_core:rift_sediment').setCount([1, 2]));
  event.addEntityModifier(['minecraft:shulker']).addLoot(LootEntry.of('aeronautics:end_stone_powder').setCount([1, 6]));
});
