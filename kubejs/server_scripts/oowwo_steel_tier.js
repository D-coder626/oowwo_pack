// oowwo: the steel tier, ported from the Wayfarer modpack.
//
// SOURCE: Wayfarer kubejs/server_scripts/metallurgy_and_progression/{steel,armor_rebalance,chainmail}.js
//         plus the leftover clinker recipes from building/blast_furnace.js.
//         Patterns come from Wayfarer's startup_scripts/_globals.js, inlined below because oowwo has
//         no _globals.js of its own.
//
// WHAT WAS ALREADY DONE (do NOT duplicate here): wayfarer_port.js already carries the bloomery, the
// blast furnace, clinker tiles, the steel nugget/block and coke block recipes, and the furnace-bypass
// removals from metallurgy.js. This file is the gap: the REMOVALS and the recipes whose output is a
// vanilla or third-party item, which the original port's wayfarer_core-only audit missed.
//
// DELIBERATE DEVIATIONS from Wayfarer, each flagged inline:
//   1. Diamond tools are removed by OUTPUT, not by recipe id. Same lesson as primitive_tools.js:
//      id-based removal leaves any mod-added recipe for the same item alive.
//   2. Simply Swords diamond weapons are converted to steel (Epic Fight's were too, until it was
//      removed 2026-09-26). Wayfarer has neither mod,
//      so this is an extrapolation of its rule, chosen so the recipes match the retextures.
//   3. backpacks: and piglinproliferation: recipes are OMITTED, since oowwo has neither mod
//      (oowwo uses yyzsbackpack). See the note in section 7 for why they cannot merely be wrapped.
//
// NOT INCLUDED, and worth knowing:
//   - The DIAMOND HOE is removed and never re-added. That is Wayfarer's design, not an oversight:
//     its smithing system upgrades an iron hoe instead, via the "wayfarer:upgradeable" tag in
//     smithing.js. That tag is NOT ported yet, so until it is, there is no way to get a diamond hoe.
//   - Wayfarer's steel.js also has no steel hoe. There is no such item.
//
// To revert: delete this file. Nothing here is destructive to world data.

// ---------------------------------------------------------------------------
// Patterns, inlined from Wayfarer's _globals.js
// ---------------------------------------------------------------------------
const TOOL_PATTERNS = {
  sword:   [' C ', ' C ', ' S '],
  shovel:  [' C ', ' S ', ' S '],
  pickaxe: ['CCC', ' S ', ' S '],
  // DEVIATION: Wayfarer's _globals.js has the axe MIRRORED - [' CC', ' SC', ' S '], head on the
  // right. Vanilla and every other axe in oowwo put the head on the left, so the Wayfarer form looks
  // wrong sitting next to them in EMI. Vanilla shaped recipes match their own horizontal mirror, so
  // both forms were always craftable either way round; this only changes what EMI draws.
  axe:     ['CC ', 'CS ', ' S '],
  knife:   ['   ', ' C ', ' S ']
};

// H = the leather piece at the core, M = the metal
const ARMOR_PATTERNS = {
  helmet:     ['MMM', 'MHM', '   '],
  chestplate: ['MHM', 'MMM', 'MMM'],
  leggings:   ['MMM', 'MHM', 'M M'],
  boots:      ['M M', 'MHM', '   ']
};

// C = chain
const PLAIN_ARMOR_PATTERNS = {
  helmet:     ['CCC', 'C C', '   '],
  chestplate: ['C C', 'CCC', 'CCC'],
  leggings:   ['CCC', 'C C', 'C C'],
  boots:      ['C C', 'C C', '   ']
};

const STEEL = 'wayfarer_core:steel_ingot';

ServerEvents.recipes(event => {
  // Same guard wayfarer_port.js uses: a recipe naming an item that does not exist is logged and
  // skipped rather than aborting the whole script.
  const R = fn => { try { fn(); } catch (e) { console.warn('[steel_tier] skipped: ' + e); } };

  // =========================================================================
  // 1. REMOVALS - netherite (Derek: full parity, steel becomes the top tier)
  // =========================================================================
  [
    'minecraft:netherite_ingot',
    'minecraft:netherite_helmet_smithing',
    'minecraft:netherite_chestplate_smithing',
    'minecraft:netherite_leggings_smithing',
    'minecraft:netherite_boots_smithing',
    'minecraft:netherite_sword_smithing',
    'minecraft:netherite_shovel_smithing',
    'minecraft:netherite_axe_smithing',
    'minecraft:netherite_pickaxe_smithing',
    'minecraft:netherite_hoe_smithing',
    'farmersdelight:netherite_knife_smithing'
  ].forEach(id => event.remove({ id: id }));

  // =========================================================================
  // 2. REMOVALS - diamond gear, so it can only be made from steel
  // DEVIATION: by output, not id (see header note 1).
  // =========================================================================
  [
    'minecraft:diamond_sword',
    'minecraft:diamond_shovel',
    'minecraft:diamond_axe',
    'minecraft:diamond_pickaxe',
    'minecraft:diamond_hoe',      // removed and NOT re-added - see header
    'farmersdelight:diamond_knife'
  ].forEach(out => event.remove({ output: out }));

  // =========================================================================
  // 3. Steel conversions missing from wayfarer_port.js
  // The port shipped nugget-from-ingot and block-from-ingot but not the reverses.
  // =========================================================================
  R(() => event.shapeless(STEEL, ['9x wayfarer_core:steel_nugget']).id('oowwo:steel_ingot_from_nuggets'));
  R(() => event.shapeless('9x ' + STEEL, ['wayfarer_core:steel_block']).id('oowwo:steel_ingots_from_block'));

  // =========================================================================
  // 4. Steel tools (Wayfarer keeps the vanilla diamond item ids)
  // =========================================================================
  [
    ['minecraft:diamond_sword',     'sword'],
    ['minecraft:diamond_shovel',    'shovel'],
    ['minecraft:diamond_pickaxe',   'pickaxe'],
    ['minecraft:diamond_axe',       'axe'],
    ['farmersdelight:diamond_knife', 'knife']
  ].forEach(pair => {
    R(() => event.shaped(pair[0], TOOL_PATTERNS[pair[1]], {
      C: STEEL,
      S: 'minecraft:stick'
    }).id('oowwo:steel_' + pair[1]));
  });

  // =========================================================================
  // 5. Armour rebalance - iron, gold and diamond all become leather-core
  // (Derek: include all three sets)
  // =========================================================================
  [
    ['iron',    'minecraft:iron_ingot'],
    ['golden',  'minecraft:gold_ingot'],
    ['diamond', STEEL]
  ].forEach(set => {
    const armor = set[0];
    const material = set[1];
    ['helmet', 'chestplate', 'leggings', 'boots'].forEach(piece => {
      event.remove({ id: 'minecraft:' + armor + '_' + piece });
      R(() => event.shaped('minecraft:' + armor + '_' + piece, ARMOR_PATTERNS[piece], {
        H: 'minecraft:leather_' + piece,
        M: material
      }).id('oowwo:armor_' + armor + '_' + piece));
    });
  });

  // =========================================================================
  // 6. Chainmail becomes craftable from chains (pure add - vanilla has no recipe)
  // =========================================================================
  ['helmet', 'chestplate', 'leggings', 'boots'].forEach(piece => {
    R(() => event.shaped('minecraft:chainmail_' + piece, PLAIN_ARMOR_PATTERNS[piece], {
      C: 'minecraft:chain'
    }).id('oowwo:chainmail_' + piece));
  });

  // =========================================================================
  // 7. Steel odds and ends from steel.js
  // =========================================================================
  R(() => event.shaped('minecraft:saddle', ['LLL', 'LIL', ' L '], {
    I: STEEL,
    L: 'minecraft:leather'
  }).id('oowwo:saddle'));

  // The Greatshield. Matches the shieldexp reskin already in the resource pack.
  event.remove({ id: 'shieldexp:diamond_shield' });
  R(() => event.shaped('shieldexp:diamond_shield', ['SLS', 'LIL', 'SLS'], {
    S: 'wayfarer_core:steel_nugget',
    L: STEEL,
    I: STEEL
  }).id('oowwo:greatshield'));

  // Wayfarer's steel.js also re-crafts backpacks:backpack and piglinproliferation:buckler from
  // steel. Both mods are absent from oowwo (oowwo uses yyzsbackpack instead), and those two recipes
  // are deliberately NOT reproduced here.
  //
  // They were included in the first version of this file, wrapped in R(), on the assumption that a
  // missing item would throw and be caught. It does not: event.shaped() reports the failure through
  // KubeJS's own error log and returns normally, so try/catch never sees it and the reload ends with
  // "2 failed recipes". The only way to keep the log clean is to not write the recipe at all.
  //
  // If either mod is ever added, the recipes are:
  //   backpacks:backpack            ['LLL','RCR','LLL']  C=steel ingot, L=leather, R=farmersdelight:rope
  //                                 (and remove id backpacks:backpack_from_rope first)
  //   piglinproliferation:buckler   ['SLS','LLL','SLS']  S=steel ingot, L=leather

  // =========================================================================
  // 8. Clinker recipes still missing from the blast_furnace.js port
  // wayfarer_port.js carried the glazed-terracotta route to clinker TILES, but not the
  // terracotta-bricks route to clinker BRICKS, which is what the blast furnace actually needs.
  // =========================================================================
  R(() => event.smelting('wayfarer_core:clinker_bricks', 'clayworks:terracotta_bricks')
    .id('oowwo:clinker_bricks_smelting'));
  R(() => event.custom({
    type: 'clayworks:baking',
    category: 'blocks',
    cookingtime: 100,
    experience: 0,
    ingredient: { item: 'clayworks:terracotta_bricks' },
    result: { count: 1, id: 'wayfarer_core:clinker_bricks' }
  }).id('oowwo:clinker_bricks_baking'));

  R(() => event.shaped('4x wayfarer_core:clinker_bricks', ['CC ', 'CC '], {
    C: 'wayfarer_core:clinker_tile'
  }).id('oowwo:clinker_bricks_from_tiles'));

  R(() => event.shaped('2x wayfarer_core:clinker_pillar', ['B', 'C'], {
    C: 'wayfarer_core:clinker_tile',
    B: 'wayfarer_core:mosaic_clinker_tile'
  }).id('oowwo:clinker_pillar'));

  R(() => event.shaped('4x wayfarer_core:chiseled_clinker_tile', [' C ', 'C C', ' C '], {
    C: 'wayfarer_core:clinker_tile'
  }).id('oowwo:chiseled_clinker_tile'));

  // =========================================================================
  // 9. DEVIATION: modded diamond weapons pay steel instead of diamonds
  // (Derek: convert them, so the recipes match the retextures we shipped)
  // replaceInput rewrites the existing recipe in place rather than removing and rebuilding it,
  // so each weapon keeps its own shape and its other ingredients.
  // =========================================================================
  [
    'katana', 'claymore', 'cutlass', 'glaive', 'greataxe', 'greathammer', 'halberd',
    'longsword', 'rapier', 'sai', 'scythe', 'spear', 'twinblade', 'warglaive', 'chakram'
  ].forEach(w => {
    R(() => event.replaceInput(
      { output: 'simplyswords:diamond_' + w },
      'minecraft:diamond',
      STEEL
    ));
  });

  // Epic Fight's five diamond weapons were converted here too; removed 2026-09-26 with the
  // Epic Fight -> Better Combat swap (those items no longer exist).
});

ServerEvents.tags('item', event => {
  // Lets coke coal be used anywhere a coal is expected - fuel, campfires, and mod recipes that
  // accept #minecraft:coals. Without this, coke is only usable in the recipes that name it directly.
  event.add('minecraft:coals', 'wayfarer_core:coke_coal');
});
