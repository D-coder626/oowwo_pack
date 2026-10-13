// oowwo: titanium — Wayfarer metallurgy_and_progression/titanium.js (Derek, 2026-09-27).
//
// In Wayfarer the Caverns & Chasms TIN line is its titanium line: the retexture pack already
// renames C&C tin ore -> "Titanium Ore", cassiterite tin ore -> "Rich Titanium Ore", C&C raw tin
// -> "Raw Titanium". oowwo had turned C&C tin ore OFF (tin comes from wayfarer_core) and made its
// ores drop wayfarer raw tin (bridge datapack), which left oowwo with no titanium source.
//
// THIS FILE + kubejs/data/oowwo/neoforge/biome_modifier/titanium_ore.json
//   - C&C tin ore generates again (new biome modifier; the bridge datapack's "none" override of
//     C&C's own modifier stays in place). New chunks only.
//   - Titanium Ore / Deepslate Titanium Ore drop 1-3 titanium shards, Cylindrite Titanium Ore 2-8
//     (Wayfarer's numbers). Rich Titanium Ore (cassiterite) drops Raw Titanium (C&C raw tin).
//     Silk touch still gives the ore block.
//   - 9 titanium shards <-> 1 Raw Titanium (the shards-from-raw half was already in wayfarer_port.js).
//   - Raw Titanium melts in the blast furnace into molten titanium (wayfarer_core's own recipe),
//     cast into titanium ingots / plates.
//   - C&C's tin items are taken OUT of the c:ores/tin, c:raw_materials/tin and
//     c:storage_blocks/raw_tin tags. Otherwise Almost Unified (tin pinned to wayfarer_core) would
//     treat Raw Titanium as tin: melt it into molten tin, and rewrite recipe outputs into
//     wayfarer raw tin.
// Note: bone_pick_copper_tin.js still lets the bone pick mine these ores (they were tin then).
// To revert: delete this file and the biome modifier.

ServerEvents.tags('item', event => {
  event.remove('c:ores/tin', ['caverns_and_chasms:tin_ore', 'caverns_and_chasms:deepslate_tin_ore',
    'caverns_and_chasms:cassiterite_tin_ore', 'caverns_and_chasms:cylindrite_tin_ore']);
  event.remove('c:raw_materials/tin', 'caverns_and_chasms:raw_tin');
  event.remove('c:storage_blocks/raw_tin', 'caverns_and_chasms:raw_tin_block');
});

ServerEvents.tags('block', event => {
  event.remove('c:ores/tin', ['caverns_and_chasms:tin_ore', 'caverns_and_chasms:deepslate_tin_ore',
    'caverns_and_chasms:cassiterite_tin_ore', 'caverns_and_chasms:cylindrite_tin_ore']);
  event.remove('c:storage_blocks/raw_tin', 'caverns_and_chasms:raw_tin_block');
});

ServerEvents.recipes(event => {
  const R = fn => { try { fn(); } catch (e) { console.warn('[titanium] skipped: ' + e); } };
  R(() => event.shapeless('caverns_and_chasms:raw_tin', ['9x wayfarer_core:titanium_shard']).id('oowwo:raw_titanium_from_shards'));
});

LootJS.modifiers(event => {
  // The bridge datapack makes these drop wayfarer raw tin; C&C's own tables drop C&C raw tin.
  // Replace either, so this works whether or not the bridge datapack is in the world.
  ['caverns_and_chasms:tin_ore', 'caverns_and_chasms:deepslate_tin_ore'].forEach(ore => {
    event.addBlockModifier(ore).replaceLoot('wayfarer_core:raw_tin', LootEntry.of('wayfarer_core:titanium_shard', [1, 3]));
    event.addBlockModifier(ore).replaceLoot('caverns_and_chasms:raw_tin', LootEntry.of('wayfarer_core:titanium_shard', [1, 3]));
  });
  event.addBlockModifier('caverns_and_chasms:cylindrite_tin_ore').replaceLoot('wayfarer_core:raw_tin', LootEntry.of('wayfarer_core:titanium_shard', [2, 8]));
  event.addBlockModifier('caverns_and_chasms:cylindrite_tin_ore').replaceLoot('caverns_and_chasms:raw_tin', LootEntry.of('wayfarer_core:titanium_shard', [2, 8]));
  event.addBlockModifier('caverns_and_chasms:cassiterite_tin_ore').replaceLoot('wayfarer_core:raw_tin', LootEntry.of('caverns_and_chasms:raw_tin', [1]));
});
