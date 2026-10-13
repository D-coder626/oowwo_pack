// oowwo: treated wood — Create's entry tier from planks + wax, ported from the Wayfarer modpack.
//
// SOURCE: Wayfarer kubejs/server_scripts/technology/treated_wood_and_leaden_alloy.js (1012 bytes,
//         unchanged by Wayfarer's 2026-09-22 update). Companion to oowwo_lead_tier.js.
//
// WHAT THIS DOES
//   - 8 planks around 1 wayfarer_core:wax -> 8 create:andesite_casing.
//     Create's own casing route (andesite alloy applied to stripped wood) is NOT removed, same as
//     Wayfarer; since oowwo_lead_tier.js moved andesite alloy behind the blast furnace, wax + planks
//     becomes the early way to get casing.
//   - Cogwheel:        shaft + 1 casing                   -> 1 cogwheel
//   - Large cogwheel:  casing + shaft + casing            -> 1 large cogwheel
//                      cogwheel + casing                  -> 1 large cogwheel
//   - Andesite door:   6 casing (2 wide x 3 tall)         -> 3 doors
//   Create's crafting-table recipes for those four are removed BY ID, exactly as Wayfarer does.
//   Create's DEPLOYING recipes (planks onto a shaft) are left alone, as in Wayfarer.
//
// DEVIATION from Wayfarer: recipe ids are added (oowwo:...) so these can be found and removed cleanly.
//
// To revert: delete this file.

ServerEvents.recipes(event => {
  const R = fn => { try { fn(); } catch (e) { console.warn('[treated_wood] skipped: ' + e); } };
  const CASING = 'create:andesite_casing';

  R(() => event.shaped('8x ' + CASING, [
    'PPP',
    'PWP',
    'PPP'
  ], { P: '#minecraft:planks', W: 'wayfarer_core:wax' }).id('oowwo:andesite_casing_from_wax'));

  event.remove({ id: 'create:crafting/kinetics/andesite_door' });
  R(() => event.shaped('3x create:andesite_door', [
    'PP',
    'PP',
    'PP'
  ], { P: CASING }).id('oowwo:andesite_door_from_casing'));

  event.remove({ id: 'create:crafting/kinetics/large_cogwheel' });
  event.remove({ id: 'create:crafting/kinetics/large_cogwheel_from_little' });
  R(() => event.shaped('create:large_cogwheel', [
    'PSP'
  ], { P: CASING, S: 'create:shaft' }).id('oowwo:large_cogwheel_from_casing'));
  R(() => event.shaped('create:large_cogwheel', [
    'SP'
  ], { P: CASING, S: 'create:cogwheel' }).id('oowwo:large_cogwheel_from_cogwheel'));

  event.remove({ id: 'create:crafting/kinetics/cogwheel' });
  R(() => event.shaped('create:cogwheel', [
    'SP'
  ], { P: CASING, S: 'create:shaft' }).id('oowwo:cogwheel_from_casing'));
});
