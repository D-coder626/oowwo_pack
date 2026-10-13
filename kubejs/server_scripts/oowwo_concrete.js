// oowwo_concrete.js — port of Wayfarer's building/concrete.js (Wayfarer copy dated 2026-09-23).
//
// Already in wayfarer_port.js (NOT repeated here): wayfarer_core concrete powder (gravel/sand/clay),
// concrete from powder + water, powder from 8 any concrete powder + soap, Create splashing
// powder -> concrete, concrete slab and stairs.
//
// This file adds the rest:
//   - Vanilla dyed concrete powder (4 sand + 4 gravel + dye) removed, all 16 colours.
//   - 8 wayfarer_core concrete powder + dye -> 8 dyed concrete powder.
//   - 8 wayfarer_core concrete + dye       -> 8 dyed concrete.
//   - 8 dyed concrete powder + water       -> 8 dyed concrete.
//   - Supplementaries' two soap-clean display recipes for vanilla concrete removed (as in Wayfarer),
//     so soap on concrete powder goes through the 8 + soap recipe above.
//
// Water ingredient: '#wayfarer:water_crafting' (water bucket, defined in oowwo_wheat.js), not
// '#kubejs:water_crafting' (wayfarer_port.js; also includes water potions, which do not return
// their bottle in oowwo because Wayfarer's startup item_modification.js is not ported yet).
// Recipe ids: oowwo:concrete/<colour>_<route>. To revert: delete this file.

ServerEvents.recipes(event => {
  const R = fn => { try { fn(); } catch (e) { console.warn('[oowwo_concrete] skipped: ' + e); } };
  const DYES = ['white', 'light_gray', 'gray', 'black', 'brown', 'yellow', 'lime', 'green',
    'cyan', 'blue', 'light_blue', 'magenta', 'pink', 'purple', 'red', 'orange'];
  const RING = ['CCC', 'CDC', 'CCC'];

  DYES.forEach(dye => {
    event.remove({ id: `minecraft:${dye}_concrete_powder` });
    R(() => event.shaped(`8x minecraft:${dye}_concrete_powder`, RING, {
      D: `minecraft:${dye}_dye`, C: 'wayfarer_core:concrete_powder'
    }).id(`oowwo:concrete/${dye}_powder_from_dye`));
    R(() => event.shaped(`8x minecraft:${dye}_concrete`, RING, {
      D: `minecraft:${dye}_dye`, C: 'wayfarer_core:concrete'
    }).id(`oowwo:concrete/${dye}_from_dye`));
    R(() => event.shaped(`8x minecraft:${dye}_concrete`, RING, {
      C: `minecraft:${dye}_concrete_powder`, D: '#wayfarer:water_crafting'
    }).id(`oowwo:concrete/${dye}_from_powder_water`));
  });

  event.remove({ id: 'supplementaries:soap_clean_minecraft_concrete' });
  event.remove({ id: 'supplementaries:soap_clean_minecraft_concrete_powder' });
});
