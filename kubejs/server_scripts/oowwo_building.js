// oowwo: building recipes — ported from Wayfarer kubejs/server_scripts/building/building.js.
//
// WHAT THIS DOES (same as Wayfarer)
//   - Copper: vanilla copper block becomes a cheap BUILDING block (4 copper ingots -> 10). Wayfarer's
//     copper block is the 9-ingot STORAGE block (vanilla's 9-ingot recipe now makes it, and only it
//     turns back into 9 ingots). Caverns & Chasms copper tools/armour still take vanilla copper blocks,
//     so they become cheap (Derek chose "port exactly as Wayfarer", 2026-09-27).
//   - Iron door / iron trapdoor need steel ingots. Iron bars, chains and C&C metal chains/bars are
//     made from nuggets. Lanterns, sconces, candle holders, light bulbs, fluorescent tubes and
//     braziers take any generic metal nugget/ingot (iron, lead, tin).
//   - Many "chiseled" blocks move from stonecutter/2-slab recipes to a 4-block diamond recipe.
//   - Metal bricks (C&C iron/gold/copper/tin/silver) from No Man's Land cobble bricks + a nugget.
//   - Industrial iron from Blocks Abound tar + reinforced iron; windows, girders, pipes, hatches from
//     it / iron sheets. Mud from dirt + water. Create seats from wool + planks.
//
// DEVIATIONS from Wayfarer:
//   - Skipped (already in wayfarer_port.js): bronze/lead/titanium/steel/mercury bricks and their
//     chiseled forms, sconce cupric torch, rift lantern, sconce rift torch, rift light bulb.
//   - Nirvana hemp burlap skipped (Nirvana not installed).
//   - Wayfarer removes 'blockbox:rough_glass_from_stonecutting', which does not exist; the real id is
//     'blockbox:rough_glass_from_glass_stonecutting'.
//   - ALMOST UNIFIED GUARD: vanilla copper block is removed from #c:storage_blocks/copper (item and
//     block), otherwise AU (minecraft priority) converts Wayfarer's storage block back to vanilla and
//     4 ingots -> 10 blocks -> 90 ingots duplicates copper. Any other recipe turning a vanilla copper
//     block into copper ingots/nuggets is removed for the same reason.
//   - Copper and silver nuggets are asked for by TAG (#c:nuggets/copper, #c:nuggets/silver), not by
//     wayfarer_core id: Almost Unified hides wayfarer's copper/silver nuggets and players get Create's /
//     C&C's instead, and AU does not unify KubeJS-added recipes (fixed 2026-09-27 after copper bars
//     showed no recipe).
//   - Recipe ids added (oowwo:building/...). global.dyes inlined.
//
// To revert: delete this file.

ServerEvents.tags('item', event => {
  event.remove('c:storage_blocks/copper', 'minecraft:copper_block');
});
ServerEvents.tags('block', event => {
  event.remove('c:storage_blocks/copper', 'minecraft:copper_block');
});

ServerEvents.recipes(event => {
  const R = fn => { try { fn(); } catch (e) { console.warn('[building] skipped: ' + e); } };
  const RM = id => R(() => event.remove({ id: id }));
  const ID = name => 'oowwo:building/' + name;
  const DYES = ['white', 'light_gray', 'gray', 'black', 'brown', 'yellow', 'lime', 'green', 'cyan',
    'blue', 'light_blue', 'magenta', 'pink', 'purple', 'red', 'orange'];
  const NUG = '#wayfarer:generic_metal_nugget';
  const ING = '#wayfarer:generic_metal_ingot';
  const DIAMOND = [' B ', 'B B', ' B '];
  const chisel = (out, input, name) => R(() => event.shaped('4x ' + out, DIAMOND, { B: input }).id(ID(name)));
  const swap = (id, from, to) => R(() => event.replaceInput({ id: id }, from, to));

  // ---------- misc
  R(() => event.shaped('8x minecraft:mud', ['CCC', 'CWC', 'CCC'], { W: '#wayfarer:water_crafting', C: 'minecraft:dirt' }).id(ID('mud')));
  RM('blockbox:rough_glass_from_glass_stonecutting');
  R(() => event.smelting('blockbox:rough_glass', 'minecraft:glass').xp(0.0).id(ID('rough_glass_smelting')));
  R(() => event.smelting('supplementaries:ash', '#minecraft:saplings').xp(0.0).id(ID('ash_from_saplings')));
  swap('supplementaries:fine_wood', 'minecraft:honeycomb', 'wayfarer_core:wax');
  swap('blocksabound:tawny_plate', 'minecraft:gold_nugget', 'wayfarer_core:bronze_nugget');
  swap('blocksabound:pyrite_plate', 'minecraft:iron_nugget', 'wayfarer_core:tin_nugget');
  swap('supplementaries:wicker_fence', 'minecraft:sugar_cane', 'farmersdelight:canvas');
  swap('nomansland:building/lunar_tiles', 'minecraft:iron_nugget', '#c:nuggets/silver');
  swap('nomansland:building/large_lunar_tile', 'minecraft:iron_nugget', '#c:nuggets/silver');
  R(() => event.shaped('3x supplementaries:ash_bricks', [' BA', ' AB'], { B: 'minecraft:brick', A: 'supplementaries:ash' }).id(ID('ash_bricks')));
  swap('supplementaries:awnings/awning', 'supplementaries:flax', 'farmersdelight:canvas');

  // ---------- copper: vanilla block = building block, wayfarer block = storage block
  swap('minecraft:copper_ingot', 'minecraft:copper_block', 'wayfarer_core:copper_block');
  R(() => event.replaceOutput({ id: 'minecraft:copper_block' }, 'minecraft:copper_block', 'wayfarer_core:copper_block'));
  RM('minecraft:copper_ingot_from_waxed_copper_block');
  R(() => event.shaped('10x minecraft:copper_block', [' CC', ' CC'], { C: 'minecraft:copper_ingot' }).id(ID('copper_block')));
  // guard: nothing else may turn a vanilla copper block back into ingots/nuggets
  R(() => event.remove({ input: 'minecraft:copper_block', output: 'minecraft:copper_ingot' }));
  R(() => event.remove({ input: 'minecraft:copper_block', output: '#c:nuggets/copper' }));

  // ---------- stone
  swap('abundant_atmosphere:mossy_polished_deepslate_from_cobbled', 'abundant_atmosphere:mossy_cobbled_deepslate', 'abundant_atmosphere:mossy_deepslate');
  swap('abundant_atmosphere:calcite_tiles', 'abundant_atmosphere:polished_calcite', 'caverns_and_chasms:calcite_bricks');
  R(() => event.shaped('4x caverns_and_chasms:calcite_bricks', [' BB', ' BB'], { B: 'abundant_atmosphere:polished_calcite' }).id(ID('calcite_bricks')));
  swap('abundant_atmosphere:dripstone_tiles', 'abundant_atmosphere:polished_dripstone', 'caverns_and_chasms:dripstone_bricks');
  R(() => event.shaped('4x caverns_and_chasms:dripstone_bricks', [' BB', ' BB'], { B: 'abundant_atmosphere:polished_dripstone' }).id(ID('dripstone_bricks')));
  swap('caverns_and_chasms:tuff_pillar', 'caverns_and_chasms:tuff_bricks', 'caverns_and_chasms:polished_tuff');
  swap('caverns_and_chasms:schist_pillar', 'minecraft:tuff_bricks', 'minecraft:polished_tuff');
  swap('caverns_and_chasms:cylindrite_pillar', 'caverns_and_chasms:cylindrite_bricks', 'caverns_and_chasms:polished_cylindrite');
  swap('caverns_and_chasms:cassiterite_pillar', 'caverns_and_chasms:cassiterite_bricks', 'caverns_and_chasms:polished_cassiterite');
  R(() => event.shaped('2x caverns_and_chasms:calcite_pillar', [' B ', ' B '], { B: 'abundant_atmosphere:polished_calcite' }).id(ID('calcite_pillar')));

  RM('caverns_and_chasms:schist');
  R(() => event.shaped('4x caverns_and_chasms:schist', [' ST', ' TS'], { S: 'minecraft:stone', T: 'minecraft:tuff' }).id(ID('schist')));
  RM('caverns_and_chasms:cylindrite');
  R(() => event.shaped('4x caverns_and_chasms:cylindrite', [' DB', ' BD'], { D: 'minecraft:deepslate', B: 'minecraft:blackstone' }).id(ID('cylindrite')));
  RM('caverns_and_chasms:cassiterite');
  R(() => event.shaped('4x caverns_and_chasms:cassiterite', [' CB', ' BC'], { C: 'caverns_and_chasms:cylindrite', B: 'minecraft:blackstone' }).id(ID('cassiterite')));
  RM('caverns_and_chasms:calcite');
  RM('caverns_and_chasms:tuff');

  // ---------- industrial iron (Create + Blocks Abound)
  RM('blocksabound:pipe');
  R(() => event.shaped('8x blocksabound:pipe', [' S ', 'S S', ' S '], { S: 'create:iron_sheet' }).id(ID('pipe')));
  RM('blocksabound:hatch');
  R(() => event.shaped('blocksabound:hatch', [' S ', '   ', ' S '], { S: 'create:iron_sheet' }).id(ID('hatch')));
  RM('create:industrial_iron_block_from_ingots_iron_stonecutting');
  R(() => event.shaped('2x create:industrial_iron_block', ['IA ', 'AI '], { A: 'blocksabound:reinforced_iron', I: 'blocksabound:tar' }).id(ID('industrial_iron_block')));
  RM('create:industrial_iron_window');
  R(() => event.shaped('3x create:industrial_iron_window', ['AGA'], { G: '#c:glass_blocks/colorless', A: 'create:industrial_iron_block' }).id(ID('industrial_iron_window')));
  RM('create:weathered_iron_block_from_ingots_iron_stonecutting');
  R(() => event.shaped('2x create:weathered_iron_block', ['IA ', 'AI '], { A: 'supplementaries:ash', I: 'create:industrial_iron_block' }).id(ID('weathered_iron_block')));
  RM('create:weathered_iron_window');
  R(() => event.shaped('3x create:weathered_iron_window', ['AGA'], { G: '#c:glass_blocks/colorless', A: 'create:weathered_iron_block' }).id(ID('weathered_iron_window')));
  RM('create:crafting/kinetics/metal_girder');
  R(() => event.shaped('8x create:metal_girder', [' A ', 'AAA', ' A '], { A: 'create:industrial_iron_block' }).id(ID('metal_girder')));

  // ---------- metal bricks (C&C); wayfarer_core metal bricks are in wayfarer_port.js
  ['iron', 'gold', 'copper', 'tin', 'silver'].forEach(m => {
    RM('caverns_and_chasms:' + m + '_bricks');
    RM('caverns_and_chasms:chiseled_' + m + '_bricks');
  });
  ['exposed_', 'weathered_', 'oxidized_', 'waxed_', 'waxed_exposed_', 'waxed_weathered_', 'waxed_oxidized_'].forEach(s =>
    RM('caverns_and_chasms:' + s + 'chiseled_copper_bricks'));
  [['iron', 'minecraft:iron_nugget'], ['gold', 'minecraft:gold_nugget'], ['copper', '#c:nuggets/copper'],
   ['tin', 'wayfarer_core:tin_nugget'], ['silver', '#c:nuggets/silver']].forEach(p => {
    R(() => event.shaped('8x caverns_and_chasms:' + p[0] + '_bricks', ['BBB', 'BNB', 'BBB'], {
      B: ['nomansland:cobblestone_bricks', 'nomansland:cobbled_deepslate_bricks'], N: p[1]
    }).id(ID(p[0] + '_bricks')));
    chisel('caverns_and_chasms:chiseled_' + p[0] + '_bricks', 'caverns_and_chasms:' + p[0] + '_bricks', 'chiseled_' + p[0] + '_bricks');
  });
  ['exposed_', 'weathered_', 'oxidized_', 'waxed_', 'waxed_exposed_', 'waxed_weathered_', 'waxed_oxidized_'].forEach(s =>
    chisel('caverns_and_chasms:' + s + 'chiseled_copper_bricks', 'caverns_and_chasms:' + s + 'copper_bricks', s + 'chiseled_copper_bricks'));
  chisel('wayfarer_core:chiseled_mercury_bricks', 'wayfarer_core:mercury_bricks', 'chiseled_mercury_bricks');
  R(() => event.shaped('2x wayfarer_core:aged_bronze_bricks', ['PB ', 'BP ', '   '], { B: 'wayfarer_core:bronze_bricks', P: 'wayfarer_core:patina' }).id(ID('aged_bronze_bricks')));
  chisel('wayfarer_core:chiseled_aged_bronze_bricks', 'wayfarer_core:aged_bronze_bricks', 'chiseled_aged_bronze_bricks');

  // ---------- chiseled blocks: 4 in a diamond
  [
    ['caverns_and_chasms:chiseled_polished_granite', 'minecraft:polished_granite'],
    ['caverns_and_chasms:chiseled_polished_diorite', 'minecraft:polished_diorite'],
    ['caverns_and_chasms:chiseled_polished_andesite', 'minecraft:polished_andesite'],
    ['caverns_and_chasms:chiseled_calcite_bricks', 'caverns_and_chasms:calcite_bricks'],
    ['caverns_and_chasms:chiseled_tuff_bricks', 'caverns_and_chasms:tuff_bricks'],
    ['minecraft:chiseled_tuff', 'minecraft:polished_tuff'],
    ['caverns_and_chasms:chiseled_dripstone_bricks', 'caverns_and_chasms:dripstone_bricks'],
    ['caverns_and_chasms:chiseled_cylindrite_bricks', 'caverns_and_chasms:cylindrite_bricks'],
    ['caverns_and_chasms:chiseled_cassiterite_bricks', 'caverns_and_chasms:cassiterite_bricks'],
    ['caverns_and_chasms:chiseled_rhyolite_bricks', 'caverns_and_chasms:rhyolite_bricks'],
    ['caverns_and_chasms:chiseled_magmatic_rhyolite_bricks', 'caverns_and_chasms:magmatic_rhyolite_bricks'],
    ['minecraft:chiseled_deepslate', 'minecraft:deepslate_bricks'],
    ['abundant_atmosphere:chiseled_mud_bricks', 'minecraft:mud_bricks'],
    ['upgrade_aquatic:chiseled_tooth_bricks', 'upgrade_aquatic:tooth_bricks'],
    ['caverns_and_chasms:chiseled_basalt_bricks', 'caverns_and_chasms:basalt_bricks'],
    ['blocksabound:chiseled_tawny_plate', 'blocksabound:cut_tawny_plate'],
    ['blocksabound:chiseled_pyrite_plate', 'blocksabound:cut_pyrite_plate'],
    ['blocksabound:chiseled_reinforced_iron', 'blocksabound:reinforced_iron'],
    ['clayworks:chiseled_terracotta_bricks', 'clayworks:terracotta_bricks']
  ].forEach(p => { RM(p[0]); chisel(p[0], p[1], p[0].split(':')[1]); });
  ['', 'tube_', 'brain_', 'bubble_', 'fire_', 'horn_', 'acan_', 'finger_', 'star_', 'moss_', 'petal_', 'branch_',
   'rock_', 'pillow_', 'silk_', 'chrome_', 'prismarine_', 'dead_', 'elder_prismarine_'].forEach(c => {
    RM('upgrade_aquatic:chiseled_' + c + 'coralstone');
    chisel('upgrade_aquatic:chiseled_' + c + 'coralstone', 'upgrade_aquatic:' + c + 'coralstone', 'chiseled_' + c + 'coralstone');
  });
  chisel('caverns_and_chasms:chiseled_calcite', 'abundant_atmosphere:polished_calcite', 'chiseled_calcite');
  RM('minecraft:bamboo_mosaic');
  chisel('minecraft:bamboo_mosaic', 'minecraft:bamboo_planks', 'bamboo_mosaic');
  RM('abundant_atmosphere:wood/red_bamboo/red_bamboo_mosaic');
  chisel('abundant_atmosphere:red_bamboo_mosaic', 'abundant_atmosphere:red_bamboo_planks', 'red_bamboo_mosaic');

  // ---------- chains and bars from nuggets
  RM('minecraft:chain');
  RM('create:crafting/appliances/chain_from_zinc');
  const CHAIN = [' N ', 'N N', ' N '];
  R(() => event.shaped('minecraft:chain', CHAIN, { N: NUG }).id(ID('chain')));
  [['copper', '#c:nuggets/copper'], ['golden', 'minecraft:gold_nugget'],
   ['tin', 'wayfarer_core:tin_nugget'], ['silver', '#c:nuggets/silver']].forEach(p => {
    RM('caverns_and_chasms:' + p[0] + '_chain');
    R(() => event.shaped('caverns_and_chasms:' + p[0] + '_chain', CHAIN, { N: p[1] }).id(ID(p[0] + '_chain')));
  });
  const BARS = ['CCC', 'CCC'];
  [['minecraft:iron_bars', 'minecraft:iron_nugget'], ['blockbox:copper_bars', '#c:nuggets/copper'],
   ['blockbox:golden_bars', 'minecraft:gold_nugget'], ['caverns_and_chasms:silver_bars', '#c:nuggets/silver'],
   ['caverns_and_chasms:tin_bars', 'wayfarer_core:tin_nugget']].forEach(p => {
    RM(p[0]);
    R(() => event.shaped('2x ' + p[0], BARS, { C: p[1] }).id(ID(p[0].split(':')[1])));
  });

  // ---------- doors and trapdoors
  swap('minecraft:iron_door', 'minecraft:iron_ingot', 'wayfarer_core:steel_ingot');
  RM('minecraft:iron_trapdoor');
  R(() => event.shaped('6x minecraft:iron_trapdoor', BARS, { C: 'wayfarer_core:steel_ingot' }).id(ID('iron_trapdoor')));
  RM('minecraft:copper_trapdoor');
  R(() => event.shaped('6x minecraft:copper_trapdoor', BARS, { C: 'create:copper_sheet' }).id(ID('copper_trapdoor')));
  RM('blockbox:iron_plate');
  R(() => event.shaped('10x blockbox:iron_plate', [' CC', ' CC'], { C: 'minecraft:iron_ingot' }).id(ID('iron_plate')));
  swap('blockbox:iron_plate_door', 'blockbox:iron_plate', 'minecraft:iron_ingot');
  RM('blockbox:iron_plate_trapdoor');
  R(() => event.shaped('6x blockbox:iron_plate_trapdoor', BARS, { C: 'create:iron_sheet' }).id(ID('iron_plate_trapdoor')));
  RM('blockbox:golden_trapdoor');
  R(() => event.shaped('6x blockbox:golden_trapdoor', BARS, { C: 'create:golden_sheet' }).id(ID('golden_trapdoor')));

  // ---------- lights: any generic metal nugget / ingot
  swap('supplementaries:candle_holders/candle_holder', 'minecraft:iron_ingot', NUG);
  DYES.forEach(d => swap('supplementaries:candle_holders/candle_holder_' + d, 'minecraft:iron_ingot', NUG));
  swap('blocksabound:aberrant_fluorescent_tube', 'minecraft:emerald', 'wayfarer_core:patina');
  swap('blocksabound:hot_fluorescent_tube', 'minecraft:amethyst_shard', 'wayfarer_core:rift_sediment');
  swap('blocksabound:warm_fluorescent_tube', 'minecraft:lapis_lazuli', 'wayfarer_core:bone_ash');
  swap('blocksabound:cool_fluorescent_tube', 'minecraft:glowstone', 'minecraft:glowstone_dust');
  ['fluorescent_tube', 'aberrant_fluorescent_tube', 'hot_fluorescent_tube', 'warm_fluorescent_tube',
   'cool_fluorescent_tube', 'cold_fluorescent_tube', 'light_bulb', 'soul_light_bulb', 'redstone_light_bulb']
    .forEach(n => swap('blocksabound:' + n, 'minecraft:iron_nugget', NUG));
  ['abundant_atmosphere:stone_brazier', 'abundant_atmosphere:soul_stone_brazier', 'blockbox:brazier', 'blockbox:soul_brazier']
    .forEach(id => swap(id, 'minecraft:iron_ingot', ING));

  const LANTERN = [' N ', 'NTN', ' N '];
  const SCONCE = ['   ', ' T ', ' N '];
  RM('minecraft:lantern');
  R(() => event.shaped('minecraft:lantern', LANTERN, { T: 'minecraft:torch', N: NUG }).id(ID('lantern')));
  RM('minecraft:soul_lantern');
  R(() => event.shaped('minecraft:soul_lantern', LANTERN, { T: 'minecraft:soul_torch', N: NUG }).id(ID('soul_lantern')));
  RM('caverns_and_chasms:cupric_lantern');
  R(() => event.shaped('caverns_and_chasms:cupric_lantern', LANTERN, { T: 'caverns_and_chasms:cupric_torch', N: NUG }).id(ID('cupric_lantern')));
  RM('nomansland:building/sconce_torch');
  R(() => event.shaped('nomansland:sconce_torch', SCONCE, { T: 'minecraft:torch', N: NUG }).id(ID('sconce_torch')));
  RM('nomansland:building/sconce_soul_torch');
  R(() => event.shaped('nomansland:sconce_soul_torch', SCONCE, { T: 'minecraft:soul_torch', N: NUG }).id(ID('sconce_soul_torch')));
  R(() => event.shaped('blocksabound:copper_light_bulb', [' G ', 'NTN'], { G: 'minecraft:glass', N: NUG, T: 'caverns_and_chasms:cupric_torch' }).id(ID('copper_light_bulb')));

  // ---------- Create seats: wool + planks
  DYES.forEach(d => {
    RM('create:crafting/kinetics/' + d + '_seat');
    R(() => event.shaped('create:' + d + '_seat', ['   ', 'WW ', 'PP '], { W: 'minecraft:' + d + '_wool', P: '#minecraft:planks' }).id(ID(d + '_seat')));
  });
});
