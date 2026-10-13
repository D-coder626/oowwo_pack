// oowwo: Wayfarer kubejs/server_scripts/miscellaneous.js — the parts Derek picked 2026-09-26
// (checklist items 1-45, all accepted; #13 eye of ender accepted after the End Remastered check).
//
// Not ported: anything for mods oowwo lacks (Exposure, Mannequins, Incubation, Nirvana, Chalk,
// Horseman, Piglin Proliferation, BlockBox, Envelope, Connectible Chains, Vista, Portable Hole,
// Field Guide); Wayfarer's terracotta crucible (conflicts with oowwo's own); the cloudy-solution
// dragon's breath (needs a startup-registered fluid). Things already in wayfarer_port.js
// (bone ash, bone ash block, rift campfire/torch, spoon, workbench, mining helmet, shears, heart
// crystal, aqua regia, ingot mould) are not repeated.
//
// DEVIATIONS from Wayfarer:
//   - Wayfarer's tags live in the `wayfarer:` namespace for its NEWER wayfarer_core build. oowwo's
//     installed jar reads `wayfarer_core:` (WayfarerTags uses Wayfarer.location), so
//     will_despawn / fire_immune / durability_crafting are written as wayfarer_core:*.
//   - #13 eye of ender needs mercury: End Remastered in oowwo has USE_EYE_OF_ENDER=false and
//     THROW_EYE_OF_ENDER=false, so the vanilla eye only matters as an ingredient of endrem's
//     exotic eye and witch eye. To keep mercury reachable, Wayfarer's cinnabar drop (mercury.js:
//     15% of redstone ore drops cinnabar, smelts to mercury) is ported here too.
//   - #14 blaze powder: Wayfarer's replacement (mortar_and_pestle.js: 1 rod -> 2 powder,
//     30% +1) is ported here, since removing the crafting recipe alone would leave no source.
//   - Soul fire: Wayfarer's "remove soul sand/soil" edit is on an ITEM tag, so it does nothing;
//     only the block-tag addition (bone block, bone ash block) has an effect. Ported that way.
//   - Tags and tag entries only list ids verified present in oowwo's jars on 2026-09-26.
//   - Recipe ids added (oowwo:misc/...). No const/let inside repeated callbacks (Rhino).
//
// To revert: delete this file.

ServerEvents.recipes(event => {
  const R = fn => { try { fn(); } catch (e) { console.warn('[misc] skipped: ' + e); } };
  const RM = id => event.remove({ id: id });

  // ---------- A. metals and materials ----------
  R(() => event.replaceInput({ id: 'minecraft:bucket' }, 'minecraft:iron_ingot', '#wayfarer:generic_metal_ingot'));
  R(() => event.replaceInput({ id: 'supplementaries:cage' }, 'minecraft:iron_ingot', '#wayfarer:generic_metal_ingot'));
  R(() => event.replaceInput({ id: 'brewinandchewin:tankard' }, 'minecraft:iron_nugget', '#wayfarer:generic_metal_nugget'));
  R(() => event.replaceInput({ id: 'minecraft:tinted_glass' }, 'minecraft:amethyst_shard', 'minecraft:quartz'));

  RM('caverns_and_chasms:copper_ingot_from_nuggets');
  RM('create:crafting/materials/copper_ingot');
  RM('create:crafting/materials/copper_nugget');
  RM('caverns_and_chasms:copper_nugget');

  R(() => event.replaceInput({ id: 'caverns_and_chasms:toolbox' }, 'minecraft:copper_block', 'minecraft:copper_ingot'));
  ['exposed_toolbox', 'weathered_toolbox', 'oxidized_toolbox', 'waxed_toolbox',
   'waxed_exposed_toolbox', 'waxed_weathered_toolbox', 'waxed_oxidized_toolbox'].forEach(v => {
    RM('caverns_and_chasms:' + v);
    RM('caverns_and_chasms:' + v + '_from_honeycomb');
  });

  // Moulds in the Clayworks kiln: 50 ticks (furnace 200; kiln default for other items 100). Derek 2026-10-02.
  ['plate', 'ingot'].forEach(m => R(() => event.custom({
    type: 'clayworks:baking', category: 'blocks', cookingtime: 50, experience: 0.1,
    ingredient: { item: 'wayfarer_core:unfired_' + m + '_mould' }, result: { count: 1, id: 'wayfarer_core:' + m + '_mould' }
  }).id('oowwo:misc/' + m + '_mould')));

  // ---------- B. fire and light ----------
  RM('minecraft:soul_torch');
  R(() => event.shaped('minecraft:soul_torch', [' S ', ' A ', '   '], { S: 'wayfarer_core:bone_ash', A: 'minecraft:torch' }).id('oowwo:misc/soul_torch'));
  RM('minecraft:soul_campfire');
  R(() => event.shaped('minecraft:soul_campfire', [' S ', ' A ', '   '], { S: 'wayfarer_core:bone_ash', A: 'minecraft:campfire' }).id('oowwo:misc/soul_campfire'));
  RM('caverns_and_chasms:cupric_torch');
  R(() => event.shaped('caverns_and_chasms:cupric_torch', [' S ', ' A ', '   '], { S: 'wayfarer_core:patina', A: 'minecraft:torch' }).id('oowwo:misc/cupric_torch'));
  RM('caverns_and_chasms:cupric_campfire');
  R(() => event.shaped('caverns_and_chasms:cupric_campfire', [' S ', ' A ', '   '], { S: 'wayfarer_core:patina', A: 'minecraft:campfire' }).id('oowwo:misc/cupric_campfire'));
  RM('minecraft:glow_item_frame');
  R(() => event.shapeless('minecraft:glow_item_frame', ['minecraft:item_frame', 'minecraft:glowstone_dust']).id('oowwo:misc/glow_item_frame'));
  RM('supplementaries:lumisene_bucket');
  R(() => event.shaped('supplementaries:lumisene_bucket', [' R ', 'RBR', ' R '], { R: 'nomansland:resin_oil_bottle', B: 'minecraft:bucket' }).id('oowwo:misc/lumisene_bucket'));

  // ---------- C. rift, Nether, End ----------
  R(() => event.shaped('minecraft:crying_obsidian', [' E ', 'EME', ' E '], { E: 'wayfarer_core:rift_sediment', M: 'minecraft:obsidian' }).id('oowwo:misc/crying_obsidian'));
  R(() => event.shapeless('wayfarer_core:rift_sediment_block', ['9x wayfarer_core:rift_sediment']).id('oowwo:misc/rift_sediment_block'));
  R(() => event.shapeless('9x wayfarer_core:rift_sediment', ['wayfarer_core:rift_sediment_block']).id('oowwo:misc/rift_sediment_from_block'));
  RM('minecraft:ender_eye');
  R(() => event.shapeless('minecraft:ender_eye', ['minecraft:ender_pearl', 'minecraft:blaze_powder', 'wayfarer_core:mercury_droplet']).id('oowwo:misc/ender_eye'));
  RM('minecraft:blaze_powder');
  // Toxony's mortar since 2026-09-27 (was Wayfarer grinding 2 +30% 1 -> fixed 2)
  R(() => event.custom({
    type: 'toxony:mortar_pestle', ingredients: [{ item: 'minecraft:blaze_rod' }],
    result: { id: 'minecraft:blaze_powder', count: 2 }
  }).id('oowwo:misc/grinding/blaze_powder'));
  R(() => event.replaceInput({ id: 'amendments:dragon_charge' }, 'minecraft:obsidian', 'wayfarer_core:rift_sediment'));

  // ---------- D. farming and food ----------
  RM('minecraft:sugar_from_sugar_cane');
  R(() => event.custom({
    type: 'farmersdelight:cutting', ingredients: [{ item: 'minecraft:sugar_cane' }],
    result: [{ item: { count: 1, id: 'minecraft:sugar' } }], tool: { tag: 'c:tools/knife' }
  }).id('oowwo:misc/cutting/sugar_cane'));
  RM('minecraft:bone_meal');
  R(() => event.custom({
    type: 'farmersdelight:cutting', ingredients: [{ item: 'minecraft:bone' }],
    result: [{ item: { count: 2, id: 'minecraft:bone_meal' } }, { item: { count: 1, id: 'minecraft:bone_meal' }, chance: 0.5 }],
    tool: { tag: 'minecraft:axes' }
  }).id('oowwo:misc/cutting/bone'));
  R(() => event.custom({
    type: 'farmersdelight:cutting', ingredients: [{ item: 'supplementaries:flax' }],
    result: [
      { item: { count: 1, id: 'farmersdelight:straw' } },
      { item: { count: 1, id: 'farmersdelight:straw' }, chance: 0.5 },
      { item: { count: 1, id: 'minecraft:string' }, chance: 0.5 }
    ],
    tool: { tag: 'c:tools/knife' }
  }).id('oowwo:misc/cutting/flax'));
  R(() => event.replaceInput({ id: 'supplementaries:sack' }, 'supplementaries:flax', 'farmersdelight:canvas'));
  RM('supplementaries:sack_3');
  RM('supplementaries:strings');
  RM('farmersdelight:canvas');
  RM('farmersdelight:canvas_from_canvas_rug');
  R(() => event.shapeless('farmersdelight:canvas', ['farmersdelight:straw', 'farmersdelight:straw']).id('oowwo:misc/canvas'));
  RM('farmersdelight:rope');
  R(() => event.shaped('3x farmersdelight:rope', [' S ', ' S ', ' S '], { S: 'farmersdelight:straw' }).id('oowwo:misc/rope'));
  // No Man's Land thatch: 4 straw -> 4 thatch, 4 dried grass -> 4 thatch (was 2 and 3)
  RM('nomansland:building/thatch');
  RM('nomansland:building/thatch_from_dried_grass');
  R(() => event.shapeless('4x nomansland:thatch', ['farmersdelight:straw', 'farmersdelight:straw', 'farmersdelight:straw', 'farmersdelight:straw']).id('oowwo:misc/thatch'));
  R(() => event.shapeless('4x nomansland:thatch', ['nomansland:dried_grass', 'nomansland:dried_grass', 'nomansland:dried_grass', 'nomansland:dried_grass']).id('oowwo:misc/thatch_from_dried_grass'));
  // Goated thatch (2x2 short grass) and Windswept lavender thatch (2x2 lavender): 4 instead of 1
  RM('goated:thatch');
  R(() => event.shaped('4x goated:thatch', ['GG', 'GG'], { G: 'minecraft:short_grass' }).id('oowwo:misc/goated_thatch'));
  RM('windswept:lavender_thatch');
  R(() => event.shaped('4x windswept:lavender_thatch', ['LL', 'LL'], { L: 'windswept:lavender' }).id('oowwo:misc/lavender_thatch'));
  R(() => event.shaped('farmersdelight:cooking_pot', ['BSB', 'IWI', 'III'], {
    I: 'minecraft:iron_ingot', B: 'minecraft:brick', W: 'minecraft:water_bucket', S: 'wayfarer_core:spoon'
  }).id('oowwo:misc/cooking_pot_spoon'));

  RM('minecraft:fermented_spider_eye');
  R(() => event.custom({
    type: 'brewinandchewin:fermenting', experience: 1.0, fermentingtime: 9600, temperature: 4,
    ingredients: [{ item: 'minecraft:spider_eye' }, { item: 'minecraft:sugar' }, { item: 'minecraft:brown_mushroom' }],
    result: { count: 1, id: 'minecraft:fermented_spider_eye' }
  }).id('oowwo:misc/fermenting/fermented_spider_eye'));
  RM('brewinandchewin:fermenting/glittering_grenadine_from_water');
  R(() => event.custom({
    type: 'brewinandchewin:fermenting', experience: 1.0, temperature: 2,
    ingredients: [{ item: 'minecraft:glow_berries' }, { item: 'minecraft:glowstone_dust' }, { item: 'minecraft:sugar' }, { item: 'minecraft:glow_berries' }],
    base_fluid: { amount: 1000, ingredient: { tag: 'c:water' }, unit: 'millibuckets' }, unit: 'millibuckets',
    result: { amount: 1000, id: 'brewinandchewin:glittering_grenadine' }
  }).id('oowwo:misc/fermenting/glittering_grenadine'));

  // ---------- E. tools, gear, blocks ----------
  RM('minecraft:mace');
  RM('minecraft:tnt');
  R(() => event.shaped('minecraft:tnt', ['SS ', 'SS ', '   '], { S: 'nomansland:explosive' }).id('oowwo:misc/tnt'));
  R(() => event.shaped('minecraft:bell', [' S ', 'BBB', 'BNB'], { S: 'minecraft:stick', B: 'minecraft:gold_ingot', N: 'minecraft:gold_nugget' }).id('oowwo:misc/bell'));
  RM('create:crafting/kinetics/goggles');
  R(() => event.shaped('create:goggles', ['LLL', 'GIG', '   '], { L: 'minecraft:leather', G: '#c:glass_blocks', I: 'create:golden_sheet' }).id('oowwo:misc/goggles'));
  RM('aeronautics:aviators_goggles');
  R(() => event.shaped('aeronautics:aviators_goggles', ['LLL', 'GIG', '   '], { L: 'minecraft:leather', G: '#c:glass_blocks', I: 'wayfarer_core:titanium_plate' }).id('oowwo:misc/aviators_goggles'));
  RM('create:crafting/logistics/desk_bell');
  R(() => event.shaped('create:desk_bell', ['GBG', 'GSG', ' P '], { S: 'minecraft:stick', P: '#minecraft:planks', B: 'minecraft:stone_button', G: 'minecraft:gold_ingot' }).id('oowwo:misc/desk_bell'));
  RM('create:crafting/curiosities/minecart_coupling');
  R(() => event.shaped('create:minecart_coupling', ['N N', 'CCC', 'N N'], { C: 'minecraft:chain', N: 'minecraft:iron_nugget' }).id('oowwo:misc/minecart_coupling'));
  RM('shieldexp:iron_shield');
  R(() => event.shaped('shieldexp:iron_shield', ['SLS', 'LIL', 'SLS'], { S: 'minecraft:iron_nugget', L: 'create:iron_sheet', I: 'minecraft:iron_ingot' }).id('oowwo:misc/iron_shield'));
  RM('shieldexp:golden_shield');
  R(() => event.shaped('shieldexp:golden_shield', ['SLS', 'LLL', 'SLS'], { S: 'minecraft:iron_ingot', L: 'minecraft:leather' }).id('oowwo:misc/golden_shield'));
  RM('minecraft:brush');
  R(() => event.shaped('minecraft:brush', ['FFF', ' L ', ' A '], { F: 'minecraft:feather', L: 'minecraft:leather', A: 'minecraft:stick' }).id('oowwo:misc/brush'));
  R(() => event.shaped('supplementaries:quiver', ['L L', 'LAL', 'ILI'], { I: 'minecraft:iron_ingot', L: 'minecraft:leather', A: 'minecraft:arrow' }).id('oowwo:misc/quiver'));
  RM('supplementaries:wrench');
  R(() => event.shaped('supplementaries:wrench', ['II ', ' I ', ' I '], { I: 'minecraft:iron_ingot' }).id('oowwo:misc/wrench'));
  RM('supplementaries:statue');
  R(() => event.shaped('supplementaries:statue', [' S ', ' S ', ' A '], { S: 'minecraft:stone', A: 'minecraft:smooth_stone' }).id('oowwo:misc/statue'));
  RM('supplementaries:confetti_popper');
  R(() => event.shaped('6x supplementaries:confetti_popper', ['DDD', 'PGP', ' P '], { D: '#c:dyes', P: 'minecraft:paper', G: 'minecraft:gunpowder' }).id('oowwo:misc/confetti_popper'));
  RM('brewinandchewin:ice_crate');
  R(() => event.shaped('brewinandchewin:ice_crate', ['PMP', 'MCM', 'PMP'], { P: '#minecraft:planks', C: 'minecraft:wind_charge', M: 'minecraft:packed_ice' }).id('oowwo:misc/ice_crate'));
  RM('brewinandchewin:heating_cask');
  R(() => event.shaped('brewinandchewin:heating_cask', ['PMP', 'MCM', 'PMP'], { P: '#minecraft:planks', C: 'minecraft:fire_charge', M: 'minecraft:magma_block' }).id('oowwo:misc/heating_cask'));
  RM('brewinandchewin:item_coaster');
  R(() => event.shaped('brewinandchewin:coaster', ['   ', 'SCS', '   '], { C: 'farmersdelight:canvas', S: 'minecraft:stick' }).id('oowwo:misc/item_coaster'));
  R(() => event.shaped('caverns_and_chasms:cowl', ['LLL', 'L L', 'SLS'], { L: 'minecraft:leather', S: 'minecraft:string' }).id('oowwo:misc/cowl'));
  RM('minecraft:shield_decoration');
  RM('caverns_and_chasms:bundle');
  RM('farmersdelight:scaffolding_from_canvas');
  RM('caverns_and_chasms:music_disc_copying');
});

ServerEvents.tags('item', event => {
  event.add('wayfarer:generic_metal_nugget', ['minecraft:iron_nugget', 'wayfarer_core:lead_nugget', 'wayfarer_core:tin_nugget']);
  event.add('wayfarer:generic_metal_ingot', ['minecraft:iron_ingot', 'wayfarer_core:lead_ingot', 'wayfarer_core:tin_ingot']);

  // wayfarer_core's ItemEntityCap: items in this tag despawn after the normal 5 minutes;
  // every OTHER dropped item gets a ~1-year lifespan (effectively never despawns).
  event.add('wayfarer:will_despawn', [
    'minecraft:egg', 'minecraft:feather', 'minecraft:ink_sac', 'minecraft:glowstone_dust',
    'minecraft:rotten_flesh', 'minecraft:bone', 'minecraft:gunpowder', 'minecraft:arrow',
    'minecraft:sweet_berries', 'minecraft:cobblestone', 'minecraft:gravel', 'minecraft:flint',
    'minecraft:stick'
  ]);
  event.add('wayfarer:fire_immune', [
    'minecraft:blaze_rod', 'minecraft:blaze_powder', 'minecraft:ancient_debris',
    'minecraft:netherite_scrap', 'minecraft:fire_charge', 'minecraft:nether_star',
    'wayfarer_core:chthonic_calculus'
  ]);
  event.add('wayfarer:durability_crafting', ['newworld:ancient_mattock', 'create:super_glue', 'simulated:honey_glue']);
  event.add('c:tools/hammers', ['minecraft:mace', 'create:cardboard_sword']);

  event.remove('ragdoll:embalms_corpses', 'minecraft:honeycomb');
  event.add('ragdoll:embalms_corpses', 'wayfarer_core:wax');

  event.add('amendments:sets_on_fire', ['nomansland:sconce_torch', 'nomansland:sconce_soul_torch']);

  event.add('caverns_and_chasms:additional_toolbox_tools', [/.*boat.*/, /.*sled.*/]);
  event.add('caverns_and_chasms:additional_toolbox_tools', ['nomansland:ancient_bronze_mask', 'nomansland:ancient_bronze_chisel', 'nomansland:ritual_pick', 'nomansland:ancestral_oath_sword', 'wayfarer_core:ancient_blessing', 'wayfarer_core:mark_of_friendship', 'minecraft:bucket', 'minecraft:water_bucket', 'minecraft:cod_bucket', 'minecraft:salmon_bucket', 'nomansland:billhook_bass_bucket', 'upgrade_aquatic:pike_bucket', 'upgrade_aquatic:perch_bucket', 'upgrade_aquatic:lionfish_bucket', 'caverns_and_chasms:cavefish_bucket', 'minecraft:tropical_fish_bucket', 'minecraft:pufferfish_bucket', 'minecraft:axolotl_bucket', 'upgrade_aquatic:nautilus_bucket', 'upgrade_aquatic:squid_bucket', 'upgrade_aquatic:glow_squid_bucket', 'minecraft:tadpole_bucket', 'minecraft:lava_bucket', 'minecraft:powder_snow_bucket', 'minecraft:milk_bucket', 'aeronautics:levitite_blend_bucket', 'create:honey_bucket', 'create:chocolate_bucket', 'nomansland:cave_carp_bucket', 'minecraft:compass', 'minecraft:recovery_compass', 'minecraft:clock', 'supplementaries:altimeter', 'minecraft:goat_horn', 'caverns_and_chasms:copper_horn', 'create:goggles', 'wayfarer_core:spoon', 'aeronautics:aviators_goggles', 'minecraft:map', 'minecraft:filled_map', 'supplementaries:slice_map', 'map_atlases:atlas', 'create:clipboard', 'minecraft:writable_book', 'minecraft:written_book', 'wayfarer_core:discharged_matrix', 'minecraft:saddle', 'wayfarer_core:allay_calling_bell', 'wayfarer_core:vex_calling_bell', 'supplementaries:bubble_blower', 'supplementaries:quiver', 'nomansland:gas_mask', 'minecraft:minecart']);
});

ServerEvents.tags('block', event => {
  event.removeAll('minecraft:fall_damage_resetting');
  event.removeAll('minecraft:enderman_holdable');
  event.add('minecraft:soul_fire_base_blocks', ['minecraft:bone_block', 'wayfarer_core:bone_ash_block']);
  event.add('supplementaries:map_tint_grass_color', ['nomansland:grass_sprouts', 'nomansland:oat_grass', '#minecraft:small_flowers', '#c:mushrooms']);
  event.add('minecraft:mineable/axe', ['wayfarer_core:wax_block']);
  event.add('minecraft:mineable/pickaxe', ['wayfarer_core:concrete', 'wayfarer_core:concrete_slab', 'wayfarer_core:concrete_stairs', 'wayfarer_core:coke_coal_block', 'wayfarer_core:bronze_block', 'wayfarer_core:copper_block', 'wayfarer_core:steel_block', 'wayfarer_core:tin_block', 'wayfarer_core:tin_ore', 'wayfarer_core:deepslate_tin_ore', 'wayfarer_core:raw_silver_block', 'wayfarer_core:raw_tin_block', 'wayfarer_core:silver_block', 'wayfarer_core:silver_ore', 'wayfarer_core:deepslate_silver_ore']);
  event.add('minecraft:mineable/pickaxe', /caverns_and_chasms:tuff_tile.*/);
  event.add('minecraft:mineable/shovel', ['wayfarer_core:wax_block', 'wayfarer_core:concrete_powder', 'wayfarer_core:bone_ash_block']);
  event.add('minecraft:infiniburn_end', 'wayfarer_core:wax_block');
  event.add('minecraft:infiniburn_nether', 'wayfarer_core:wax_block');
  event.add('minecraft:infiniburn_overworld', 'wayfarer_core:wax_block');
  event.add('minecraft:nether_carver_replaceables', 'caverns_and_chasms:cylindrite');
  event.add('minecraft:dirt', 'minecraft:farmland');
  event.add('upgrade_aquatic:pike_spawnable_in', ['nomansland:reeds', 'nomansland:cattail']);
});

LootJS.modifiers(event => {
  event.addEntityModifier(['minecraft:blaze']).addLoot(LootEntry.of('minecraft:blaze_rod').setCount([0, 1]));
  event.addEntityModifier(['minecraft:chicken']).addLoot(LootEntry.of('minecraft:feather').setCount([1, 2]));
  event.addEntityModifier(['minecraft:skeleton', 'minecraft:pillager']).addLoot(LootEntry.of('minecraft:arrow').setCount([0, 3]));
  event.addEntityModifier(['minecraft:pillager']).addLoot(LootEntry.of('minecraft:emerald').setCount([0, 1]));
  event.addEntityModifier(['minecraft:pig']).addLoot(LootEntry.of('minecraft:porkchop').setCount([1, 1]));
  event.addEntityModifier(['minecraft:silverfish']).addLoot(LootEntry.of('wayfarer_core:silverfish_eggs').setCount([0, 1]));
  event.addEntityModifier(['minecraft:skeleton']).addLoot(LootEntry.of('minecraft:bone').setCount([1, 1]));
  event.addEntityModifier(['minecraft:zombie']).removeLoot('minecraft:iron_ingot');
  event.addEntityModifier(['minecraft:drowned']).removeLoot('minecraft:copper_ingot');
  event.addEntityModifier(['minecraft:silverfish']).removeLoot('wayfarer_core:silver_nugget');
  event.addBlockModifier('snowyspirit:ginger').addLoot(LootEntry.of('wayfarer_core:weird_ginger', [1])).randomChance(0.05);

  // cinnabar (mercury.js) — Wayfarer's cinnabar (renamed "Flawless Cinnabar" in kubejs/assets/wayfarer_core/lang)
  // is the mercury source; it keeps the eye of ender and first spellcasting reachable.
  // Wayfarer: 15% of redstone ore breaks give 1 cinnabar instead of the redstone. oowwo runs Spelunkery, whose
  // loot tables make redstone ore drop spelunkery:rough_cinnabar instead (so Wayfarer's ore rule never fired).
  // 2026-10-03 (Derek, "keep Wayfarer's rarity"): the 15% roll moved to the GRINDSTONE. Polishing rough cinnabar
  // reads loot table spelunkery:gameplay/grindstone_polishing/rough_cinnabar (and the diamond_ variant; read from
  // Spelunkery 0.4.3 ModEvents.useGrindstone): 1 spelunkery:cinnabar + 1-3 redstone + XP. 15% of the time the
  // Spelunkery cinnabar becomes 1 Flawless Cinnabar; redstone and XP are untouched. Spelunkery's cinnabar keeps
  // its own uses (item magnet, nephrite siphon/fountain/diode). Create sandpaper/sanding is NOT changed.
  ['spelunkery:gameplay/grindstone_polishing/rough_cinnabar',
   'spelunkery:gameplay/diamond_grindstone_polishing/rough_cinnabar'].forEach(table => {
    event.addTableModifier(table).randomChance(0.15)
      .replaceLoot('spelunkery:cinnabar', LootEntry.of('wayfarer_core:cinnabar', [1]));
  });
});
