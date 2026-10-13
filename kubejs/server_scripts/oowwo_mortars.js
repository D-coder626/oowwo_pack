// oowwo: mortar consolidation (Derek, 2026-09-27).
//
// ONE general mortar: Toxony's (toxony:mortar_pestle) — up to 4 ingredients, can consume a
// container (bowl / empty pot), and has the Redstone Mortar for automation. Its crafting recipe now
// uses Wayfarer's mortar materials (Derek: "same material tier as wayfarer's").
// Hexerei's pestle and mortar is kept ONLY for its 5-ingredient recipes (seed mixture, mindful
// trance blend) and belladonna -> black dye (5 berries, more than Toxony's 4 slots).
// RETIRED: Wayfarer's mortar block (recipe removed in wayfarer_port.js) and Hexalia's mortar.
// Wayfarer's pestle is kept as an ingredient of Toxony's mortar.
//
// Every former wayfarer_core:grinding recipe was rewritten as toxony:mortar_pestle in its own
// script (wayfarer_port.js, oowwo_wheat.js, oowwo_misc.js, oowwo_small_ports.js). Toxony has no
// bonus roll, so outputs are Wayfarer's expected value rounded.
//
// THIS FILE
//   - Toxony mortar recipe -> 'MPM' / 'MMM' / 'S S': M = Supplementaries slidy block,
//     P = Wayfarer's pestle (leather + 2 diorite, recipe re-added here), S = stick.
//   - Hexalia mortar: crafting recipe removed; all 13 of its recipes moved/removed:
//       singles -> Toxony 1:1 (ghost powder, spirit powder, siren paste, dream paste, salt);
//       blends -> Toxony, same ingredients (mender's salve, brambleguard salve, mutavis,
//         fragrant nectar — honeycomb -> wax, matching the pack-wide swap);
//       bone meal / blaze powder / sugar duplicates removed (Toxony already grinds those).
//   - Hexerei wax blend (2 ingredients) -> Toxony.
//   - Toxony's own green-dye recipes are left as they are (on its own mortar already).
// To revert: delete this file AND restore the four scripts above from before 2026-09-27.

ServerEvents.recipes(event => {
  const R = fn => { try { fn(); } catch (e) { console.warn('[mortars] skipped: ' + e); } };
  const RM = id => event.remove({ id: id });
  const TOX = (ings, out, count, id) => R(() => event.custom({
    type: 'toxony:mortar_pestle',
    ingredients: ings.map(i => i.charAt(0) === '#' ? { tag: i.substring(1) } : { item: i }),
    result: { id: out, count: count }
  }).id('oowwo:mortars/' + id));

  // Toxony mortar at Wayfarer's material tier
  RM('toxony:mortar_pestle');
  // Derek 2026-09-27: Wayfarer's pestle goes in the top-middle slot.
  R(() => event.shaped('toxony:mortar_pestle', ['MPM', 'MMM', 'S S'], {
    M: 'supplementaries:slidy_block', P: 'wayfarer_core:pestle', S: 'minecraft:stick'
  }).id('oowwo:mortars/toxony_mortar'));
  // Wayfarer's pestle stays craftable (its recipe from Wayfarer's mortar_and_pestle.js) as the
  // mortar ingredient; only Wayfarer's mortar block is retired.
  R(() => event.shaped('wayfarer_core:pestle', [' L ', ' D ', ' D '], {
    L: 'minecraft:leather', D: 'minecraft:diorite'
  }).id('oowwo:mortars/pestle'));

  // Hexalia mortar retired
  RM('hexalia:mortar_and_pestle');
  ['ghost_powder', 'spirit_powder', 'siren_paste', 'dream_paste', 'salt', 'bone_meal', 'blaze_powder',
   'sugar', 'menders_salve', 'brambleguard_salve', 'mutavis', 'fragrant_nectar'].forEach(n => RM('hexalia:' + n + '_from_mortar'));
  TOX(['hexalia:ghost_fern'], 'hexalia:ghost_powder', 1, 'ghost_powder');
  TOX(['hexalia:spirit_bloom'], 'hexalia:spirit_powder', 1, 'spirit_powder');
  TOX(['hexalia:siren_kelp'], 'hexalia:siren_paste', 1, 'siren_paste');
  TOX(['hexalia:dreamshroom'], 'hexalia:dream_paste', 1, 'dream_paste');
  TOX(['hexalia:saltsprout'], 'hexalia:salt', 1, 'salt');
  TOX(['minecraft:cornflower', 'hexalia:tree_resin', 'minecraft:oxeye_daisy'], 'hexalia:menders_salve', 1, 'menders_salve');
  TOX(['minecraft:poppy', 'hexalia:rabbage', 'minecraft:azure_bluet'], 'hexalia:brambleguard_salve', 1, 'brambleguard_salve');
  TOX(['hexalia:tree_resin', 'minecraft:slime_ball', '#hexalia:crushed_herbs'], 'hexalia:mutavis', 1, 'mutavis');
  TOX(['#minecraft:small_flowers', 'wayfarer_core:wax', '#hexalia:herbs'], 'hexalia:fragrant_nectar', 1, 'fragrant_nectar');

  // Hexerei: wax blend moves; seed mixture, mindful trance blend, black dye stay on Hexerei's mortar
  RM('hexerei:wax_blend_from_pestle_and_mortar');
  TOX(['minecraft:glow_berries', '#hexerei:flower_biproduct'], 'hexerei:wax_blend', 2, 'wax_blend');
});
