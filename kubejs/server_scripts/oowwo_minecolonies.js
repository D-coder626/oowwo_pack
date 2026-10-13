// oowwo: MineColonies alignment with the primitive-tool and chainmail tiering (2026-10-12).
//
// 1) HUTS THAT NEED RETIRED TOOLS. primitive_tools.js retires wooden/stone pickaxe, axe and hoe by
//    removing every recipe that OUTPUTS them. MineColonies hut recipes take those tools as an
//    INGREDIENT, so farmer, lumberjack, sawmill and miner huts became uncraftable. Same swap as the
//    chest-loot tiers (oowwo_loot_tiers.js): wooden axe -> flint axe, wooden pickaxe -> bone pick.
//    The bone pick tills (it is tagged #minecraft:hoes), so it replaces the wooden hoe too.
//    The "stone" variants (which gave 2 huts per craft) are removed: stone tools are retired.
//
// 2) CHAINMAIL BYPASS. MineColonies adds its own chainmail recipes (chain + iron nuggets). The
//    canonical chainmail recipes live in oowwo_steel_tier.js; these four are removed so there is
//    exactly one route.
//
// To revert: delete this file.

ServerEvents.recipes(event => {
  const R = fn => { try { fn(); } catch (e) { console.warn('[minecolonies] skipped: ' + e); } };

  const swap = (hutId, oldTool, newTool) =>
    R(() => event.replaceInput({ id: hutId }, oldTool, newTool));

  swap('minecolonies:blockhutfarmer', 'minecraft:wooden_hoe', 'wayfarer_core:bone_pick');
  swap('minecolonies:blockhutlumberjack', 'minecraft:wooden_axe', 'wayfarer_core:flint_axe');
  swap('minecolonies:blockhutsawmill', 'minecraft:wooden_axe', 'wayfarer_core:flint_axe');
  swap('minecolonies:blockhutminer', 'minecraft:wooden_pickaxe', 'wayfarer_core:bone_pick');

  [
    'minecolonies:blockhutfarmerstone',
    'minecolonies:blockhutlumberjackstone',
    'minecolonies:blockhutminerstone',
    'minecolonies:chainmailhelmet',
    'minecolonies:chainmailchestplate',
    'minecolonies:chainmailleggings',
    'minecolonies:chainmailboots'
  ].forEach(id => R(() => event.remove({ id: id })));
});
