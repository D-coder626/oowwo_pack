// oowwo: top-tier ladder, recipes and tags (Derek, 2026-10-31).
//   Steel (vanilla diamond ids) < Adamantite (Dwarfs Tyranny mythril) < Necromium (Caverns & Chasms) < Echo (Create: Deep Dark)
// Stats + molten adamantite fluid: startup_scripts/oowwo_top_tiers.js. Names: client_scripts/oowwo_adamantite_lang.js.
// To revert: delete all three files (the fluid needs a full restart to go away).
//
// 1. Adamantite ore / raw block need a steel (= diamond-tier) pickaxe instead of iron.
// 2. Raw adamantite no longer smelts (furnace, blasting, Dwarfs gas furnace). Route: Wayfarer blast furnace alloying,
//    3 raw adamantite + 3 coke coal -> 500 mB molten adamantite (2 ingots) -> ingot mould -> adamantite ingot. Ingots melt back.
// 2b. Adamantite gear: smithing upgrade on steel gear (netherite upgrade template + 1 adamantite ingot); the template
//    can also be made by Create heated compacting (2 adamantite ingots + steel ingot + deepslate).
// 3. Necromium ingot: C&C's crafting recipe (4 netherite scrap + 4 silver) is replaced by an Eidolon crucible recipe
//    using Sons of Sins soul steel instead of silver.
// 4. Necromium gear is made by an Eidolon brazier ritual on ADAMANTITE gear (was smithing on diamond/steel gear).
// 5. Echo gear is a smithing upgrade on NECROMIUM gear (was netherite, which oowwo cannot make).
//    Echo ingot (sequenced assembly on a netherite ingot) and the echo template recipes are unchanged.

ServerEvents.tags('block', event => {
  const ottOre = ['dwarfs_tyranny:mythril_ore', 'dwarfs_tyranny:mythril_raw_block'];
  event.remove('minecraft:needs_iron_tool', ottOre);
  event.add('minecraft:needs_diamond_tool', ottOre);
});

ServerEvents.recipes(event => {
  const ottR = (n, fn) => { try { fn(); } catch (e) { console.error('[oowwo_top_tiers] ' + n + ': ' + e); } };

  // ---------- 2. adamantite smelting -> blast furnace only
  ['dwarfs_tyranny:mythril_ingot_furnace', 'dwarfs_tyranny:mythril_ingot_blast'].forEach(id => ottR('rm ' + id, () => event.remove({ id: id })));
  ['minecraft:smelting', 'minecraft:blasting', 'minecraft:smoking', 'minecraft:campfire_cooking'].forEach(t =>
    ottR('rm adamantite ' + t, () => event.remove({ type: t, output: 'dwarfs_tyranny:mythril_ingot' })));

  ottR('alloy molten adamantite', () => event.custom({
    type: 'wayfarer_core:blast_furnace_alloying',
    ingredients: [
      { item: 'dwarfs_tyranny:raw_mythril' }, { item: 'dwarfs_tyranny:raw_mythril' }, { item: 'dwarfs_tyranny:raw_mythril' },
      { item: 'wayfarer_core:coke_coal' }, { item: 'wayfarer_core:coke_coal' }, { item: 'wayfarer_core:coke_coal' }
    ],
    duration: 1200,
    result: { id: 'oowwo:molten_adamantite', amount: 500 }   // 2 ingots (Derek 2026-10-31)
  }).id('oowwo:top_tiers/molten_adamantite_alloying'));
  ottR('melt adamantite ingot', () => event.custom({
    type: 'wayfarer_core:blast_furnace_melting',
    ingredient: { item: 'dwarfs_tyranny:mythril_ingot' },
    duration: 1600,
    result: { id: 'oowwo:molten_adamantite', amount: 250 }
  }).id('oowwo:top_tiers/molten_adamantite_from_ingot'));
  ottR('cast adamantite ingot', () => event.custom({
    type: 'wayfarer_core:casting',
    fluid: { id: 'oowwo:molten_adamantite', amount: 250 },
    ingredient: { item: 'wayfarer_core:ingot_mould' },
    result: { id: 'dwarfs_tyranny:mythril_ingot' }
  }).id('oowwo:top_tiers/cast_adamantite_ingot'));

  // ---------- 2b. adamantite gear = smithing upgrade on steel gear (Derek 2026-10-31: options B + C)
  // Steel piece (vanilla diamond id) + netherite upgrade template + 1 adamantite ingot. Enchantments carry over.
  // Dwarfs Tyranny's crafting-table recipes for the 9 tools/armour pieces are removed (by output, so no other route survives).
  // Template: still found in bastions, now also made with Create heated compacting (below), so it is not Nether-only.
  [
    ['sword', 'minecraft:diamond_sword'], ['pickaxe', 'minecraft:diamond_pickaxe'], ['axe', 'minecraft:diamond_axe'],
    ['shovel', 'minecraft:diamond_shovel'], ['hoe', 'minecraft:iron_hoe'],   // oowwo has no steel/diamond hoe recipe
    ['armor_helmet', 'minecraft:diamond_helmet'], ['armor_chestplate', 'minecraft:diamond_chestplate'],
    ['armor_leggings', 'minecraft:diamond_leggings'], ['armor_boots', 'minecraft:diamond_boots']
  ].forEach(p => {
    const ottOut = 'dwarfs_tyranny:mythril_' + p[0];
    ottR('adamantite ' + p[0], () => {
      event.remove({ output: ottOut });
      event.recipes.minecraft.smithing_transform(ottOut, 'minecraft:netherite_upgrade_smithing_template', p[1], 'dwarfs_tyranny:mythril_ingot')
        .id('oowwo:top_tiers/adamantite_' + p[0] + '_smithing');
    });
  });
  // Vanilla duplication recipe (7 diamonds + netherrack + template -> 2) keeps the diamonds; netherrack -> steel ingot (Derek 2026-10-31).
  ottR('template duplication', () => event.replaceInput({ id: 'minecraft:netherite_upgrade_smithing_template' },
    'minecraft:netherrack', 'wayfarer_core:steel_ingot'));
  ottR('template compacting', () => event.custom({
    type: 'create:compacting',
    heat_requirement: 'heated',
    ingredients: [{ item: 'dwarfs_tyranny:mythril_ingot' }, { item: 'dwarfs_tyranny:mythril_ingot' },
                  { item: 'wayfarer_core:steel_ingot' }, { item: 'minecraft:deepslate' }],
    results: [{ id: 'minecraft:netherite_upgrade_smithing_template', count: 1 }]
  }).id('oowwo:top_tiers/netherite_template_compacting'));

  // ---------- 3. necromium ingot: Eidolon crucible, soul steel instead of silver
  ottR('rm necromium_ingot', () => event.remove({ id: 'caverns_and_chasms:necromium_ingot' }));
  ottR('crucible necromium', () => event.custom({
    type: 'eidolon_repraised:crucible',
    steps: [
      { items: [{ item: 'minecraft:netherite_scrap' }, { item: 'minecraft:netherite_scrap' },
                { item: 'sons_of_sins:soul_steel' }, { item: 'sons_of_sins:soul_steel' }] },
      { stirs: 1, items: [{ item: 'minecraft:netherite_scrap' }, { item: 'minecraft:netherite_scrap' },
                          { item: 'sons_of_sins:soul_steel' }, { item: 'sons_of_sins:soul_steel' }] },
      { stirs: 2, items: [{ item: 'eidolon_repraised:death_essence' }] }
    ],
    result: { id: 'caverns_and_chasms:necromium_ingot', count: 1 }
  }).id('oowwo:top_tiers/necromium_ingot_crucible'));

  // ---------- 4. necromium gear <- adamantite gear, Eidolon brazier ritual (Derek 2026-10-31, option B)
  // Reagent (in the brazier) = the adamantite piece; enchantments/components are kept (keep_nbt_of_reagent).
  // Pedestals (stone hands / necrotic foci): necromium ingot(s) + crystallized ether + lesser soul gem + death essence.
  // health_requirement = total health of living creatures near the brazier that the ritual devours (40 = 20 hearts).
  // Chestplate and leggings take 2 ingots and more life, like their bigger crafting cost.
  // The C&C smithing recipes (diamond base + netherite template) are removed: no smithing route to necromium.
  [
    ['sword', 'dwarfs_tyranny:mythril_sword', 1, 20], ['pickaxe', 'dwarfs_tyranny:mythril_pickaxe', 1, 20],
    ['axe', 'dwarfs_tyranny:mythril_axe', 1, 20], ['shovel', 'dwarfs_tyranny:mythril_shovel', 1, 20],
    ['hoe', 'dwarfs_tyranny:mythril_hoe', 1, 20],
    ['helmet', 'dwarfs_tyranny:mythril_armor_helmet', 1, 30], ['chestplate', 'dwarfs_tyranny:mythril_armor_chestplate', 2, 40],
    ['leggings', 'dwarfs_tyranny:mythril_armor_leggings', 2, 40], ['boots', 'dwarfs_tyranny:mythril_armor_boots', 1, 30]
  ].forEach(p => {
    ottR('necromium ' + p[0], () => {
      event.remove({ id: 'caverns_and_chasms:necromium_' + p[0] + '_smithing' });
      const ottPed = [];
      for (let i = 0; i < p[2]; i++) ottPed.push({ tag: 'c:ingots/necromium' });
      ottPed.push({ item: 'sons_of_sins:crystallized_ether' });
      ottPed.push({ item: 'eidolon_repraised:lesser_soul_gem' });
      ottPed.push({ item: 'eidolon_repraised:death_essence' });
      event.custom({
        type: 'eidolon_repraised:ritual_brazier_crafting',
        reagent: { item: p[1] },
        pedestal_items: ottPed,
        focus_items: [],
        health_requirement: p[3],
        keep_nbt_of_reagent: true,
        result: { id: 'caverns_and_chasms:necromium_' + p[0], count: 1 }
      }).id('oowwo:top_tiers/necromium_' + p[0] + '_ritual');
    });
  });

  // ---------- 5. echo gear <- necromium gear
  [
    ['echo_sword', 'echo_sword_smithing', 'caverns_and_chasms:necromium_sword'],
    ['echo_armor_helmet', 'echo_helmet_smithing', 'caverns_and_chasms:necromium_helmet'],
    ['echo_armor_chestplate', 'echo_chestplate_smithing', 'caverns_and_chasms:necromium_chestplate'],
    ['echo_armor_leggings', 'echo_leggings_smithing', 'caverns_and_chasms:necromium_leggings'],
    ['echo_armor_boots', 'echo_boots_smithing', 'caverns_and_chasms:necromium_boots']
  ].forEach(p => {
    ottR('echo ' + p[0], () => {
      event.remove({ id: 'create_deep_dark:' + p[1] });
      event.recipes.minecraft.smithing_transform('create_deep_dark:' + p[0], 'create_deep_dark:echo_upgrade_smithing_template', p[2], 'create_deep_dark:echo_ingot')
        .id('oowwo:top_tiers/' + p[1]);
    });
  });
});
