// oowwo: silver and pewter blend only melt in Wayfarer's blast furnace (Derek, 2026-10-17).
// Silver: every furnace/blasting recipe that makes a silver ingot is removed (Eidolon adds four smelting + three
//   blasting ones; wayfarer's own route is blast_furnace_melting -> molten silver -> ingot mould, already present).
//   Added: Create crushed raw silver also melts (Eidolon's furnace recipe for it is gone).
// Pewter blend (lead + iron): furnace + blasting removed. New route: blast_furnace_melting -> oowwo:molten_pewter
//   (startup_scripts/oowwo_molten_pewter.js) -> ingot mould -> eidolon_repraised:pewter_ingot. Nuggets -> ingot stays.
// To revert: delete this file and the startup file.
ServerEvents.recipes(event => {
  const R = (n, fn) => { try { fn(); } catch (e) { console.error('[furnace_limits] ' + n + ': ' + e); } };

  ['eidolon_repraised:silver_ingot', 'wayfarer_core:silver_ingot', 'caverns_and_chasms:silver_ingot', '#c:ingots/silver'].forEach(o => {
    ['minecraft:smelting', 'minecraft:blasting', 'minecraft:smoking', 'minecraft:campfire_cooking'].forEach(t => {
      R('rm ' + o + ' ' + t, () => event.remove({ type: t, output: o }));
    });
  });
  ['smelt_silver_ore', 'smelt_raw_silver', 'smelt_silver_dust', 'smelt_silver_dust_create',
   'blast_silver_ore', 'blast_raw_silver', 'blast_silver_dust', 'smelt_pewter_blend', 'blast_pewter_blend'
  ].forEach(n => event.remove({ id: 'eidolon_repraised:' + n }));
  ['minecraft:smelting', 'minecraft:blasting'].forEach(t => {
    R('rm pewter ' + t, () => event.remove({ type: t, input: 'eidolon_repraised:pewter_blend' }));
  });

  R('silver_crushed', () => event.custom({
    type: 'wayfarer_core:blast_furnace_melting',
    ingredient: { item: 'create:crushed_raw_silver' },
    duration: 1600,
    result: { id: 'wayfarer_core:molten_silver', amount: 250 }
  }).id('oowwo:furnace/molten_silver_from_crushed'));

  R('pewter_blend', () => event.custom({
    type: 'wayfarer_core:blast_furnace_melting',
    ingredient: { item: 'eidolon_repraised:pewter_blend' },
    duration: 1600,
    result: { id: 'oowwo:molten_pewter', amount: 250 }
  }).id('oowwo:furnace/molten_pewter_from_blend'));
  R('pewter_ingot_melt', () => event.custom({
    type: 'wayfarer_core:blast_furnace_melting',
    ingredient: { item: 'eidolon_repraised:pewter_ingot' },
    duration: 1600,
    result: { id: 'oowwo:molten_pewter', amount: 250 }
  }).id('oowwo:furnace/molten_pewter_from_ingot'));
  R('pewter_cast', () => event.custom({
    type: 'wayfarer_core:casting',
    fluid: { id: 'oowwo:molten_pewter', amount: 250 },
    ingredient: { item: 'wayfarer_core:ingot_mould' },
    result: { id: 'eidolon_repraised:pewter_ingot' }
  }).id('oowwo:furnace/cast_pewter_ingot'));
});
