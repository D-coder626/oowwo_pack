// oowwo: Nirvana integration — ported from Wayfarer's kubejs (2026-10-12).
//
// Wayfarer's Nirvana touch-points, all ported here except the Exposure photograph frame
// (Exposure is not in oowwo):
//   - hemp grinds to create:pulp (adds nirvana:hemp to #wayfarer:makes_pulp, defined in oowwo_small_ports.js)
//   - nirvana:weed_brownie takes farmersdelight:wheat_dough instead of wheat (matches oowwo_wheat.js)
//   - nirvana:hemp_cloth: 4 flax or hemp + a stick (plus shape) instead of Nirvana's 2x2 hemp
//   - nirvana:hemp_burlap: 4 hemp cloth (2x2) -> 3 burlap
//   - nirvana:leather_from_hemp removed (free leather from hemp cloth bypasses oowwo's hide/leather work)
//   - burlap blocks (both kinds, all 16 dyes + undyed) added to aeronautics:airtight and sable:super_light
//   - nirvana:thc added to supplementaries:bomb_breakable and supplementaries:cannon_tnts
//
// To revert: delete this file.

ServerEvents.tags('item', event => {
  event.add('wayfarer:makes_pulp', 'nirvana:hemp');
});

ServerEvents.tags('block', event => {
  const dyes = ['white', 'orange', 'magenta', 'light_blue', 'yellow', 'lime', 'pink', 'gray',
    'light_gray', 'cyan', 'purple', 'blue', 'brown', 'green', 'red', 'black'];
  const burlap = ['nirvana:hemp_burlap', 'nirvana:woven_burlap'];
  dyes.forEach(dye => {
    burlap.push('nirvana:' + dye + '_hemp_burlap');
    burlap.push('nirvana:' + dye + '_woven_burlap');
  });
  event.add('aeronautics:airtight', burlap);
  event.add('sable:super_light', burlap);
  event.add('supplementaries:bomb_breakable', 'nirvana:thc');
  event.add('supplementaries:cannon_tnts', 'nirvana:thc');
});

ServerEvents.recipes(event => {
  const R = fn => { try { fn(); } catch (e) { console.warn('[nirvana] skipped: ' + e); } };

  R(() => event.replaceInput({ id: 'nirvana:weed_brownie' }, 'minecraft:wheat', 'farmersdelight:wheat_dough'));

  R(() => event.remove({ id: 'nirvana:leather_from_hemp' }));

  R(() => event.remove({ id: 'nirvana:hemp_cloth' }));
  ['supplementaries:flax', 'nirvana:hemp'].forEach(fiber => {
    const name = fiber.split(':')[1];
    R(() => event.shaped('nirvana:hemp_cloth', [' F ', 'FSF', ' F '], { F: fiber, S: 'minecraft:stick' })
      .id('oowwo:nirvana/hemp_cloth_from_' + name));
  });

  R(() => event.remove({ id: 'nirvana:hemp_burlap' }));
  R(() => event.shaped('3x nirvana:hemp_burlap', ['SS', 'SS'], { S: 'nirvana:hemp_cloth' })
    .id('oowwo:nirvana/hemp_burlap'));
});
