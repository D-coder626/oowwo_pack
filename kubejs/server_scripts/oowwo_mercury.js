// oowwo: mercury — last parts of Wayfarer kubejs/server_scripts/metallurgy_and_progression/mercury.js.
// Already ported: zirconia/cinnabar -> mercury droplet smelting, droplet <-> ingot, cinnabar block
// (wayfarer_port.js); cinnabar drop from redstone ore, 15% (oowwo_misc.js).
//
// THIS FILE ADDS
//   - Mercury block <-> 9 mercury ingots.
//   - Simulated gyroscopic mechanism: 4 iron ingots around 1 mercury ingot. This is an EXTRA
//     recipe, as in Wayfarer; Simulated's own sequenced-assembly recipe is kept.
// DEVIATION: recipe ids added. To revert: delete this file.

ServerEvents.recipes(event => {
  const R = fn => { try { fn(); } catch (e) { console.warn('[mercury] skipped: ' + e); } };

  R(() => event.shapeless('wayfarer_core:mercury_block', ['9x wayfarer_core:mercury_ingot']).id('oowwo:mercury_block'));
  R(() => event.shapeless('9x wayfarer_core:mercury_ingot', ['wayfarer_core:mercury_block']).id('oowwo:mercury_ingot_from_block'));

  R(() => event.shaped('simulated:gyroscopic_mechanism', [' I ', 'IMI', ' I '], {
    M: 'wayfarer_core:mercury_ingot', I: 'minecraft:iron_ingot'
  }).id('oowwo:gyroscopic_mechanism'));
});
