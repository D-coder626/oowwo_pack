// oowwo Task 6: quick recipe fixes (A1-A4). One section per row. Top-level names prefixed T6_.
//
// --- A1 SUPPLEMENTARIES ITEM SHELF vs HANDCRAFTED WOOD PLATE (2026-10-04) ---
// Both mods used a row of 3 #minecraft:wooden_slabs (shelf -> 2, handcrafted:wood_plate -> 3), so
// they collided. The shelf is now stick / wooden slab / stick in a row -> 2 shelves; the plate is
// untouched. Census check: the only other crafting recipe with a stick + wooden slab is
// hexerei:herb_drying_rack (4 ingredients incl. string), so no overlap.
// Vanilla shaped recipes trim empty rows, so this works in any row of the grid, not only the top.
// To revert: delete this section.

ServerEvents.recipes(event => {
  event.remove({ id: 'supplementaries:item_shelf' });
  event.shaped('2x supplementaries:item_shelf', [
    'S#S'
  ], {
    S: 'minecraft:stick',
    '#': '#minecraft:wooden_slabs'
  }).id('oowwo:t6/item_shelf');
});

// --- A2 SUGAR CANE NO LONGER MAKES PAPER (2026-10-05) ---
// Census: only 4 recipes output minecraft:paper (vanilla's already removed in oowwo_small_ports.js).
// Two sugar-cane routes remained:
//  1. quark:tweaks/crafting/utility/bent/paper (3 sugar cane, L shape -> 3 paper) -> removed.
//  2. create:mixing/cardboard_pulp takes 4x #create:pulpifiable, and Create's tag lists
//     minecraft:sugar_cane (jar: bamboo, sugar_cane, #saplings) -> sugar cane removed from the tag.
// The Toxony mortar pulp route (#wayfarer:makes_pulp) never had sugar cane.
// To revert: delete this section.

ServerEvents.recipes(event => {
  event.remove({ id: 'quark:tweaks/crafting/utility/bent/paper' });
});

ServerEvents.tags('item', event => {
  event.remove('create:pulpifiable', 'minecraft:sugar_cane');
});

// --- A3 SHIELD: IRON -> BRONZE (2026-10-05) ---
// shieldexp:wooden_shield (8 planks + stick) never used iron. The iron one is minecraft:shield, which
// Shield Expansion overrides (jar data/minecraft/recipe/shield.json) to I P I / P S P / I P I
// (I = iron ingot, P = #planks, S = stick). Iron -> #c:ingots/bronze, shape kept (AU shows wayfarer bronze).
// aether:skyroot_iron_vanilla_shield (skyroot planks + iron -> shield) is REMOVED (Derek). The Aether
// zanite shield recipes are untouched.
// To revert: delete this section.

ServerEvents.recipes(event => {
  event.replaceInput({ id: 'minecraft:shield' }, 'minecraft:iron_ingot', '#c:ingots/bronze');
  event.remove({ id: 'aether:skyroot_iron_vanilla_shield' });
});

// --- C1 RPG SERIES + DUNGEONS DELIGHT: DIAMOND -> STEEL (2026-10-05) ---
// Same rule as oowwo_steel_tier.js section 9 (Simply Swords): diamond gear is paid for in steel. Only the material
// changes; each recipe keeps its own shape and other ingredients (replaceInput, by OUTPUT so any duplicate recipe
// for the same item is caught too). Recipes read from the jars (archers 3.1.3, rogues 3.1.3, dungeonsdelight 1.5.0):
//   rogues diamond_dagger / sickle / glaive / double_axe, archers diamond_spear,
//   archers royal_longbow (1 diamond + 2 gold + string), archers heavy_crossbow (1 diamond + 3 iron + string + hook),
//   dungeonsdelight diamond_cleaver (3 diamond + stick).
// Item names/textures are unchanged ("Diamond Dagger" etc.), like oowwo's other steel-crafted diamond tools.
// Iron, gold and flint RPG weapons, all RPG armour, and every netherite smithing upgrade are untouched (Derek).
// Steel = wayfarer_core:steel_ingot (not an Almost Unified metal; same id oowwo_steel_tier.js uses).
// To revert: delete this section.

ServerEvents.recipes(event => {
  [
    'rogues:diamond_dagger', 'rogues:diamond_sickle', 'rogues:diamond_glaive', 'rogues:diamond_double_axe',
    'archers:diamond_spear', 'archers:royal_longbow', 'archers:heavy_crossbow',
    'dungeonsdelight:diamond_cleaver'
  ].forEach(id => {
    event.replaceInput({ output: id }, 'minecraft:diamond', 'wayfarer_core:steel_ingot');
  });
});

// --- C3 ROGUES STONE DOUBLE AXE: STONE -> FLINT (2026-10-05) ---
// Jar recipe rogues:stone_double_axe = MSM / MSM / _S_, M = #minecraft:stone_tool_materials, S = stick.
// Flint is oowwo's stone-tier material (primitive_tools.js), and the item's stats are stone tier, so M -> flint.
// Rebuilt (remove by output + same shape) rather than replaceInput, because the original ingredient is a tag.
// The item keeps its name ("Stone Double Axe") and texture. Loot already swaps it for a copper axe (oowwo_loot_tiers.js).
// To revert: delete this section.

ServerEvents.recipes(event => {
  event.remove({ output: 'rogues:stone_double_axe' });
  event.shaped('rogues:stone_double_axe', [
    'MSM',
    'MSM',
    ' S '
  ], {
    M: 'minecraft:flint',
    S: 'minecraft:stick'
  }).id('oowwo:t6/stone_double_axe_flint');
});
