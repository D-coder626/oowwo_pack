// oowwo: the wayfarer_core bone pick (wood tier) must be able to mine copper and tin.
// Copper/tin ores are removed from every needs_*_tool gate so the wood-tier bone pick
// (incorrect_for_wooden_tool = needs_stone + needs_iron + needs_diamond) is no longer blocked.
// Ids are explicit because wayfarer_core's dense ores are not in #c:ores/copper or #c:ores/tin.
// To revert, delete this file.

ServerEvents.tags('block', event => {
  const copper = [
    'minecraft:copper_ore',
    'minecraft:deepslate_copper_ore',
    'minecraft:raw_copper_block',
    'spelunkery:andesite_copper_ore',
    'spelunkery:diorite_copper_ore',
    'spelunkery:granite_copper_ore',
    'spelunkery:tuff_copper_ore',
    'wayfarer_core:dense_copper_ore',
    'wayfarer_core:dense_deepslate_copper_ore'
  ];
  const tin = [
    'wayfarer_core:tin_ore',
    'wayfarer_core:deepslate_tin_ore',
    'wayfarer_core:dense_tin_ore',
    'wayfarer_core:dense_deepslate_tin_ore',
    'bronze:tin_ore_block',
    'bronze:deepslate_tin_ore_block',
    'bronze:raw_tin_block',
    'caverns_and_chasms:tin_ore',
    'caverns_and_chasms:deepslate_tin_ore',
    'caverns_and_chasms:cassiterite_tin_ore',
    'caverns_and_chasms:cylindrite_tin_ore',
    'caverns_and_chasms:raw_tin_block'
  ];
  const ids = copper.concat(tin);
  ['minecraft:needs_stone_tool', 'minecraft:needs_iron_tool', 'minecraft:needs_diamond_tool'].forEach(t => {
    event.remove(t, ids);
  });
});
