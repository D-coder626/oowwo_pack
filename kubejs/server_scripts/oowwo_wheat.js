// oowwo: flour & dough chain — ported from Wayfarer kubejs/server_scripts/food/wheat.js.
//
// WHAT THIS DOES (same as Wayfarer)
//   Wheat is no longer baked or crafted straight into food. The chain is:
//     wheat --(knife on cutting board / mortar & pestle / Create millstone)--> wheat flour
//     4 flour + egg (or water) + 4 flour -> 8 wheat dough --(furnace/smoker, FD)--> bread
//     bread --(Create press)--> hardtack
//   Vanilla bread and FD's 1-wheat dough recipes are removed. Cookies, pies, cakes, tarts, pizza,
//   brownies etc. take wheat dough where they used to take raw wheat. Pie crust is rebuilt from
//   dough + milk + egg + sugar; pumpkin pie and pear cobbler are rebuilt around pie crust + dough.
//   Also: sack takes FD canvas instead of wheat; packed mud recipe removed (FD's straw one stays);
//   snowyspirit gingerbread recipes removed.
//
// DEVIATIONS from Wayfarer:
//   - '#wayfarer:water_crafting' is defined here (water bucket). Nothing in Wayfarer defines that
//     tag, so Wayfarer's "dough from water" recipe can never be crafted there.
//   - '#c:milk' -> '#c:drinks/milk' (the tag Farmer's Delight actually ships and uses).
//   - Helper functions inlined (Wayfarer keeps them in startup_scripts/_globals.js).
//   - Recipe ids added (oowwo:...). nirvana:weed_brownie dropped (Nirvana not installed).
//
// To revert: delete this file.

ServerEvents.tags('item', event => {
  event.add('wayfarer:water_crafting', 'minecraft:water_bucket');
});

ServerEvents.recipes(event => {
  const R = fn => { try { fn(); } catch (e) { console.warn('[wheat] skipped: ' + e); } };
  const ing = id => id.charAt(0) === '#' ? { tag: id.substring(1) } : { item: id };

  // wheat -> 50% flour + 50% straw on the cutting board (knife)
  R(() => event.custom({
    type: 'farmersdelight:cutting',
    ingredients: [ing('minecraft:wheat')],
    result: [
      { item: { count: 1, id: 'create:wheat_flour' }, chance: 0.5 },
      { item: { count: 1, id: 'farmersdelight:straw' }, chance: 0.5 }
    ],
    tool: { tag: 'c:tools/knife' }
  }).id('oowwo:cutting/wheat'));

  // bread -> hardtack in a Create press
  R(() => event.custom({
    type: 'create:pressing',
    ingredients: [ing('minecraft:bread')],
    results: [{ id: 'nomansland:hardtack' }]
  }).id('oowwo:pressing/hardtack'));

  // mortar & pestle — Toxony's mortar since 2026-09-27 (was Wayfarer grinding 1 +66% 1 -> fixed 2)
  R(() => event.custom({
    type: 'toxony:mortar_pestle', ingredients: [ing('minecraft:wheat')],
    result: { id: 'create:wheat_flour', count: 2 }
  }).id('oowwo:grinding/wheat_flour'));
  R(() => event.custom({
    type: 'toxony:mortar_pestle', ingredients: [ing('brewinandchewin:corn_kernels')],
    result: { id: 'brewinandchewin:cornmeal', count: 2 }
  }).id('oowwo:grinding/cornmeal'));

  // dough
  event.remove({ id: 'farmersdelight:wheat_dough_from_egg' });
  event.remove({ id: 'farmersdelight:wheat_dough_from_water' });
  event.remove({ id: 'farmersdelight:wheat_dough' });
  event.remove({ id: 'minecraft:farmersdelight.dough' });
  R(() => event.shapeless('8x farmersdelight:wheat_dough',
    ['4x create:wheat_flour', 'minecraft:egg', '4x create:wheat_flour']).id('oowwo:wheat_dough_from_egg'));
  R(() => event.shapeless('8x farmersdelight:wheat_dough',
    ['4x create:wheat_flour', '#wayfarer:water_crafting', '4x create:wheat_flour']).id('oowwo:wheat_dough_from_water'));

  R(() => event.replaceInput({ id: 'supplementaries:sack_2' }, 'minecraft:wheat', 'farmersdelight:canvas'));

  [
    'farmersdelight:honey_cookie',
    'farmersdelight:sweet_berry_cookie',
    'farmersdelight:apple_pie',
    'farmersdelight:pie_crust',
    'nomansland:food/pear_cobbler',
    'farmersdelight:cake_from_milk_bottle',
    'minecraft:cake',
    'minecraft:cookie',
    'nomansland:food/fruit_cake',
    'nomansland:food/sweet_tart',
    'nomansland:food/maple_tart',
    'brewinandchewin:pizza',
    'brewinandchewin:rich_chocolate_cake',
    'abundant_atmosphere:squashberry_bread',
    'abundant_atmosphere:integration/farmersdelight/squashberry_cookie'
  ].forEach(id => R(() => event.replaceInput({ id: id }, 'minecraft:wheat', 'farmersdelight:wheat_dough')));

  event.remove({ id: 'minecraft:bread' });
  // Some other mod also crafts bread from 3 wheat ('W W' / ' W ' shape, found by Derek 2026-09-26).
  // Remove EVERY crafting-table bread recipe by output; FD's dough smelting/smoking stays.
  // The ids are logged first so the source mod shows up in logs/kubejs/server.log.
  R(() => event.forEachRecipe({ output: 'minecraft:bread' },
    r => console.info('[wheat] bread recipe found: ' + r.getId() + ' (' + r.getType() + ')')));
  event.remove({ output: 'minecraft:bread', type: 'minecraft:crafting_shaped' });
  event.remove({ output: 'minecraft:bread', type: 'minecraft:crafting_shapeless' });
  event.remove({ id: 'abundant_atmosphere:squashberry_bread' });
  event.remove({ id: 'minecraft:packed_mud' });
  event.remove({ id: 'snowyspirit:gingerbread' });
  event.remove({ id: 'snowyspirit:gingerbread_compressed' });
  event.remove({ id: 'snowyspirit:gingerbread_cookie' });
  event.remove({ id: 'farmersdelight:cake_from_milk_bottle' });
  event.remove({ id: 'create:crafting/curiosities/cake' });
  event.remove({ id: 'farmersdelight:pumpkin_pie_from_pie_crust' });

  event.remove({ id: 'nomansland:food/pear_cobbler' });
  R(() => event.shaped('nomansland:pear_cobbler', ['NNN', 'PSP', 'DCD'], {
    N: 'nomansland:walnuts', P: 'nomansland:pear', S: 'minecraft:sugar',
    C: 'farmersdelight:pie_crust', D: 'farmersdelight:wheat_dough'
  }).id('oowwo:pear_cobbler'));

  event.remove({ id: 'minecraft:pumpkin_pie' });
  R(() => event.shaped('minecraft:pumpkin_pie', ['PSP', 'PPP', 'DCD'], {
    P: 'farmersdelight:pumpkin_slice', S: 'minecraft:sugar',
    C: 'farmersdelight:pie_crust', D: 'farmersdelight:wheat_dough'
  }).id('oowwo:pumpkin_pie'));

  event.remove({ id: 'farmersdelight:pie_crust' });
  R(() => event.shapeless('farmersdelight:pie_crust', [
    'farmersdelight:wheat_dough', '#c:drinks/milk', 'minecraft:egg', 'minecraft:sugar'
  ]).id('oowwo:pie_crust'));
});
