// oowwo_stonecutting.js — port of Wayfarer's building/stonecutting.js (Wayfarer copy dated 2026-09-23,
// md5 1fdca33d).
//
// What Wayfarer's script does: lets stairs and walls go back to their full block in the stonecutter,
// and 2 slabs back to 1 block in the crafting grid.
//
// Ported here: the stonecutter recipes, stairs -> block and wall -> block, 1:1, for the same 15 blocks.
// (The stonecutter already makes block -> 1 stair / 1 wall, so this adds no duplication loop.)
//
// NOT ported, on purpose:
//   - Wayfarer's shapeless "2 slabs -> 1 block". oowwo has Quark's "Slabs To Blocks" tweak ON
//     (quark-common.toml), which already turns any 2 matching slabs back into their block — read from the
//     jar: SlabToBlockRecipe matches 2 identical slabs anywhere in the grid, but ONLY when no other crafting
//     recipe matches. That deference matters: 2 sandstone / red sandstone / stone brick / polished
//     blackstone / tuff brick slabs stacked vertically are the vanilla CHISELED recipes. Wayfarer's
//     shapeless recipe would compete with those; Quark's does not.
//   - Stone pillar recipes: already in wayfarer_port.js (oowwo_port:stone_pillar, _2, _3).
//
// Recipe ids: oowwo:stonecutting/<block>_from_<stairs|wall>. To revert: delete this file.

ServerEvents.recipes(event => {
  const R = fn => { try { fn(); } catch (e) { console.warn('[oowwo_stonecutting] skipped: ' + e); } };
  const ns = id => (id.indexOf(':') < 0 ? 'minecraft:' + id : id);
  const path = id => ns(id).split(':')[1];

  // back(full block, stairs, wall or null)
  const back = (block, stairs, wall) => {
    R(() => event.stonecutting(ns(block), ns(stairs)).id('oowwo:stonecutting/' + path(block) + '_from_stairs'));
    if (wall) R(() => event.stonecutting(ns(block), ns(wall)).id('oowwo:stonecutting/' + path(block) + '_from_wall'));
  };

  // Plain stones: <stone>_stairs / <stone>_wall
  [['sandstone', true], ['smooth_sandstone', false], ['red_sandstone', true], ['smooth_red_sandstone', false],
   ['nomansland:polished_stone', false], ['polished_blackstone', true], ['polished_tuff', true]
  ].forEach(p => back(p[0], p[0] + '_stairs', p[1] ? p[0] + '_wall' : null));

  // Bricks: <brick>s is the block, <brick>_stairs / <brick>_wall
  ['stone_brick', 'polished_blackstone_brick', 'mud_brick', 'mossy_stone_brick',
   'nomansland:cobblestone_brick', 'nomansland:mossy_cobblestone_brick', 'tuff_brick', 'brick'
  ].forEach(b => back(b + 's', b + '_stairs', b + '_wall'));
});
