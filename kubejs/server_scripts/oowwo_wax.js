// oowwo: wax — rest of Wayfarer kubejs/server_scripts/materials/wax.js.
// Already ported elsewhere: wax block, beekeeper armour, porkchop/honeycomb -> wax (cooking pot),
// bee smoker (wayfarer_port.js); candle honeycomb -> wax (oowwo_recipe_tweaks.js).
//
// THIS FILE ADDS
//   - Honeycomb -> wax when waxing copper blocks in the crafting grid (vanilla, C&C, Create items
//     in #wayfarer:waxable_in_crafting), and in C&C's waxed copper golem recipe.
//   - Soap: cooking pot, wax + 2 ash (Supplementaries' crafting recipe removed).
//   - Resin oil: cooking pot, 2 resin + wax + bottle (NML's FD-integration recipe removed).
//   - Leather: rotten flesh + wax + ash (vanilla rabbit-hide leather recipe removed).
//   - Brewin' and Chewin' keg, aging cask and bottle rack rebuilt to need wax.
//   - Pigs and hoglins drop 0-1 wax, polar bears 1-2.
// DEVIATIONS: envelope:paper_box and blockbox:* entries skipped (mods not installed); recipe ids added.
// To revert: delete this file.

ServerEvents.tags('item', event => {
  ['', 'exposed_', 'weathered_', 'oxidized_'].forEach(stage => event.add('wayfarer:waxable_in_crafting', [
    stage ? 'minecraft:' + stage + 'copper' : 'minecraft:copper_block',
    'minecraft:' + stage + 'cut_copper',
    'minecraft:' + stage + 'cut_copper_stairs',
    'minecraft:' + stage + 'cut_copper_slab',
    'minecraft:' + stage + 'copper_door',
    'minecraft:' + stage + 'copper_trapdoor',
    'minecraft:' + stage + 'copper_bulb',
    'minecraft:' + stage + 'copper_grate',
    'minecraft:' + stage + 'chiseled_copper',
    'caverns_and_chasms:' + stage + 'copper_bricks',
    'caverns_and_chasms:' + stage + 'chiseled_copper_bricks',
    'caverns_and_chasms:' + stage + 'lift_pressure_plate',
    'caverns_and_chasms:' + stage + 'lift_button',
    'caverns_and_chasms:' + stage + 'copper_chain',
    'caverns_and_chasms:' + stage + 'copper_lantern',
    'caverns_and_chasms:' + stage + 'floodlight',
    'create:' + stage + 'copper_shingles',
    'create:' + stage + 'copper_tiles'
  ]));
});

ServerEvents.recipes(event => {
  const R = fn => { try { fn(); } catch (e) { console.warn('[wax] skipped: ' + e); } };
  // Rhino: no const/let inside helpers that run more than once ("redeclaration of var").
  R(() => event.replaceInput({ id: 'caverns_and_chasms:waxed_oxidized_copper_golem_from_honeycomb' },
    'minecraft:honeycomb', 'wayfarer_core:wax'));
  R(() => event.replaceInput({ input: '#wayfarer:waxable_in_crafting' },
    'minecraft:honeycomb', 'wayfarer_core:wax'));

  event.remove({ id: 'supplementaries:soap' });
  event.remove({ id: 'minecraft:leather' });
  event.remove({ id: 'nomansland:integration/farmersdelight/resin_oil_bottle' });

  R(() => event.custom({
    type: 'farmersdelight:cooking', cookingtime: 100, experience: 0.3, recipe_book_tab: 'misc',
    ingredients: [{ item: 'wayfarer_core:wax' }, { item: 'supplementaries:ash' }, { item: 'supplementaries:ash' }],
    result: { id: 'supplementaries:soap' }
  }).id('oowwo:cooking/soap'));
  R(() => event.custom({
    type: 'farmersdelight:cooking', cookingtime: 100, experience: 0.7, recipe_book_tab: 'misc',
    ingredients: [{ item: 'nomansland:resin' }, { item: 'nomansland:resin' }, { item: 'wayfarer_core:wax' }],
    result: { id: 'nomansland:resin_oil_bottle' }, container: { id: 'minecraft:glass_bottle' }
  }).id('oowwo:cooking/resin_oil_bottle'));

  R(() => event.shapeless('minecraft:leather',
    ['wayfarer_core:wax', 'minecraft:rotten_flesh', 'supplementaries:ash']).id('oowwo:leather_from_flesh'));

  event.remove({ id: 'brewinandchewin:keg' });
  R(() => event.shaped('brewinandchewin:keg', ['PIP', 'TBW', 'PIP'], {
    P: '#minecraft:planks', B: 'minecraft:barrel', I: 'minecraft:iron_ingot',
    W: 'wayfarer_core:wax', T: 'nomansland:tap'
  }).id('oowwo:keg'));

  event.remove({ id: 'brewinandchewin:aging_cask' });
  R(() => event.shaped('brewinandchewin:aging_cask', ['IPI', 'WBW', 'IPI'], {
    P: '#minecraft:planks', B: 'minecraft:barrel', I: 'minecraft:iron_ingot', W: 'wayfarer_core:wax'
  }).id('oowwo:aging_cask'));

  event.remove({ id: 'brewinandchewin:bottle_rack' });
  R(() => event.shaped('brewinandchewin:bottle_rack', ['PPP', ' W ', 'PPP'], {
    P: '#minecraft:planks', W: 'wayfarer_core:wax'
  }).id('oowwo:bottle_rack'));
});

LootJS.modifiers(event => {
  event.addEntityModifier(['minecraft:pig', 'minecraft:hoglin']).addLoot(LootEntry.of('wayfarer_core:wax').setCount([0, 1]));
  event.addEntityModifier(['minecraft:polar_bear']).addLoot(LootEntry.of('wayfarer_core:wax').setCount([1, 2]));
});
