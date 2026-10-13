// oowwo: magnetite — rest of Wayfarer kubejs/server_scripts/metallurgy_and_progression/magnetite.js.
// Already ported: magnetite block (wayfarer_port.js); recovery compass + 5% magnetite from iron ore
// (oowwo_recipe_tweaks.js — its "compass/lodestone not ported" note is superseded by this file).
//
// THIS FILE ADDS
//   - Compass: magnetite on top, iron + redstone + iron, iron below (vanilla recipe removed).
//   - Lodestone: vanilla recipe removed; No Man's Land's lodestone recipe uses magnetite instead
//     of a compass (NML config lodestone = true in oowwo, same as Wayfarer).
//   - Create redstone contact: iron sheet -> magnetite.
//   - Simulated redstone magnet: rebuilt around magnetite + wayfarer redstone circuit.
// DEVIATION: recipe ids added. To revert: delete this file.

ServerEvents.recipes(event => {
  const R = fn => { try { fn(); } catch (e) { console.warn('[magnetite] skipped: ' + e); } };

  event.remove({ id: 'minecraft:lodestone' });
  R(() => event.replaceInput({ id: 'nomansland:lodestone' }, 'minecraft:compass', 'wayfarer_core:magnetite'));

  R(() => event.replaceInput({ id: 'create:crafting/logistics/redstone_contact' },
    'create:iron_sheet', 'wayfarer_core:magnetite'));

  event.remove({ id: 'minecraft:compass' });
  R(() => event.shaped('minecraft:compass', [' S ', 'IRI', ' I '], {
    I: 'minecraft:iron_ingot', R: 'minecraft:redstone', S: 'wayfarer_core:magnetite'
  }).id('oowwo:compass'));

  event.remove({ id: 'simulated:redstone_magnet' });
  R(() => event.shaped('simulated:redstone_magnet', ['IMI', 'CKC', 'IMI'], {
    I: 'create:iron_sheet', C: 'create:copper_sheet', M: 'wayfarer_core:magnetite',
    K: 'wayfarer_core:redstone_circuit'
  }).id('oowwo:redstone_magnet'));
});
