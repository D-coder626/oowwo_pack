// oowwo: zinc and brass (Derek, 2026-10-23). Brass is more expensive than bronze because zinc ore is common.
// Brass Blend (oowwo:brass_blend) = 3 raw copper + 3 raw zinc -> 1 blend = 1 brass ingot (250 mB). 6 raw per ingot.
//   Blend -> blast furnace (wayfarer_core:blast_furnace_melting -> oowwo:molten_brass) -> ingot mould -> create:brass_ingot,
//   OR Create heated mixing -> create:brass_ingot. No furnace/blasting recipe for the blend. Create's own
//   copper ingot + zinc ingot heated mixing (2 brass) is KEPT on purpose (Derek: more set-up, rewarded).
// Zinc: Create's plain-furnace smelting is removed; zinc melts in the blast furnace (oowwo:molten_zinc) and casts to zinc ingot,
//   same treatment as silver/pewter (oowwo_furnace_limits.js). Needs startup_scripts/oowwo_molten_alloys.js (full restart).
// To revert: delete this file and the startup file.
ServerEvents.recipes(event => {
  const R = (n, fn) => { try { fn(); } catch (e) { console.error('[brass] ' + n + ': ' + e); } };
  const blast = (id, input, fluid) => R(id, () => event.custom({
    type: 'wayfarer_core:blast_furnace_melting',
    ingredient: input,
    duration: 1600,
    result: { id: fluid, amount: 250 }
  }).id('oowwo:brass/' + id));
  const cast = (id, fluid, out) => R(id, () => event.custom({
    type: 'wayfarer_core:casting',
    fluid: { id: fluid, amount: 250 },
    ingredient: { item: 'wayfarer_core:ingot_mould' },
    result: { id: out }
  }).id('oowwo:brass/' + id));

  // --- zinc: remove plain furnace routes (blasting already wiped globally by wayfarer_port.js)
  ['create:smelting/zinc_ingot_from_ore', 'create:smelting/zinc_ingot_from_crushed', 'create:smelting/zinc_ingot_from_raw_ore',
   'create:blasting/zinc_ingot_from_ore', 'create:blasting/zinc_ingot_from_crushed', 'create:blasting/zinc_ingot_from_raw_ore'
  ].forEach(i => R('rm ' + i, () => event.remove({ id: i })));
  R('rm zinc furnace by output', () => {
    ['minecraft:smelting', 'minecraft:blasting', 'minecraft:smoking', 'minecraft:campfire_cooking'].forEach(t =>
      event.remove({ type: t, output: 'create:zinc_ingot' }));
  });

  blast('molten_zinc_from_raw', { item: 'create:raw_zinc' }, 'oowwo:molten_zinc');
  blast('molten_zinc_from_crushed', { item: 'create:crushed_raw_zinc' }, 'oowwo:molten_zinc');
  blast('molten_zinc_from_ingot', { item: 'create:zinc_ingot' }, 'oowwo:molten_zinc');
  cast('zinc_ingot_cast', 'oowwo:molten_zinc', 'create:zinc_ingot');

  // --- brass blend
  R('blend_craft', () => event.shapeless('oowwo:brass_blend', [
    'minecraft:raw_copper', 'minecraft:raw_copper', 'minecraft:raw_copper',
    'create:raw_zinc', 'create:raw_zinc', 'create:raw_zinc'
  ]).id('oowwo:brass/brass_blend'));
  blast('molten_brass_from_blend', { item: 'oowwo:brass_blend' }, 'oowwo:molten_brass');
  blast('molten_brass_from_ingot', { item: 'create:brass_ingot' }, 'oowwo:molten_brass');
  cast('brass_ingot_cast', 'oowwo:molten_brass', 'create:brass_ingot');

  R('blend_mixing', () => event.custom({
    type: 'create:mixing',
    heat_requirement: 'heated',
    ingredients: [{ item: 'oowwo:brass_blend' }],
    results: [{ id: 'create:brass_ingot', count: 1 }]
  }).id('oowwo:brass/brass_blend_mixing'));
  R('blend_crushing', () => event.custom({
    type: 'create:crushing',
    ingredients: [{ item: 'oowwo:brass_blend' }],
    processing_time: 400,
    results: [{ id: 'minecraft:raw_copper', count: 3 }, { id: 'create:raw_zinc', count: 3 }]
  }).id('oowwo:brass/brass_blend_crushing'));
});
