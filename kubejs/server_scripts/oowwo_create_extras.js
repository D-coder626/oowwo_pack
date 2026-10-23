// oowwo: recipe rebuilds for the 2026-10 Create/ocean batch, in the same style as oowwo_create.js
// (Wayfarer's machine-rebuild approach, Derek 2026-10-21 "A"): Deep Seas (create_submarine / create_high_seas),
// Create Crafts & Additions (createaddition), Via Romana. Materials: lead, steel, titanium, brass casing,
// the redstone / radio circuit, wax, scribing tools.
//
// Derek's rule: diving armor = the ORIGINAL diving shapes with the copper ingots swapped for waxed copper BLOCKS
// (C&C copper armor is copper blocks; this is the waxed variant). Chestplate, leggings and boots KEEP their andesite
// alloy so they cannot be confused with C&C copper armor; the helmet keeps its glass visor.
//
// NOT touched: Deep Seas floaters / pressurizers / ballast vent (wool, glass, copper blocks - already late enough),
// Myths of the Sea recipes (drop-material gated: Kujira bone, Bunyip fang, Abaia fin), Create Additions wires,
// rods, electrum and biomass processing. All Create processing keeps working.
// To revert: delete this file.

ServerEvents.recipes(event => {
  const R = fn => { try { fn(); } catch (e) { console.warn('[create_extras] skipped: ' + e); } };
  const RM = id => R(() => event.remove({ id: id }));
  // Pad rows to equal width (vanilla requires it).
  const pad = rows => { const w = Math.max.apply(null, rows.map(r => r.length)); return rows.map(r => r + ' '.repeat(w - r.length)); };
  const S = (id, out, pattern, keys) => R(() => event.shaped(out, pad(pattern), keys).id('oowwo:create_extras/' + id));
  const MC = (id, out, pattern, key) => R(() => event.custom({
    type: 'create:mechanical_crafting', accept_mirrored: true, pattern: pattern, key: key, result: { id: out, count: 1 }
  }).id('oowwo:create_extras/' + id));
  const TI = 'wayfarer_core:titanium_ingot', TP = 'wayfarer_core:titanium_plate', ST = 'wayfarer_core:steel_ingot';
  const LEAD = 'wayfarer_core:lead_ingot', CIRC = 'wayfarer_core:redstone_circuit', RADIO = 'wayfarer_core:radio_circuit';
  const BC = 'create:brass_casing', SH = 'create:shaft', WAXED = 'minecraft:waxed_copper_block';

  // ---------------- Deep Seas: diving armor (waxed copper blocks, C&C shapes) ----------------
  RM('create_submarine:diving_chestplate');
  S('diving_chestplate', 'create_submarine:diving_chestplate', ['X X', 'XGX', 'XXX'], { X: WAXED, G: 'create:andesite_alloy' });
  RM('create_submarine:diving_leggings');
  S('diving_leggings', 'create_submarine:diving_leggings', ['XGX', 'X X', 'X X'], { X: WAXED, G: 'create:andesite_alloy' });

  // Create's copper diving helmet and boots (same set): waxed copper blocks too. Helmet keeps its glass visor;
  // boots keep their andesite alloy (what keeps them distinct from C&C copper boots).
  RM('create:crafting/appliances/copper_diving_helmet');
  S('copper_diving_helmet', 'create:copper_diving_helmet', ['XXX', 'XGX'], { X: WAXED, G: '#c:glass_blocks' });
  RM('create:crafting/appliances/copper_diving_boots');
  S('copper_diving_boots', 'create:copper_diving_boots', ['X X', 'X X', 'G G'], { X: WAXED, G: 'create:andesite_alloy' });

  // ---------------- Deep Seas: submarine parts ----------------
  RM('create_submarine:sonar');
  S('sonar', 'create_submarine:sonar', ['ATA', 'SMS', 'PPP'], { A: 'minecraft:amethyst_shard', T: RADIO, S: 'create:brass_sheet', M: CIRC, P: TP });
  RM('create_submarine:command_sub');
  S('command_sub', 'create_submarine:command_sub', ['SPS', 'PTP', 'SPS'], { S: 'create:crafter_slot_cover', P: '#minecraft:planks', T: RADIO });
  RM('create_submarine:submarine_propeller');
  S('submarine_propeller', 'create_submarine:submarine_propeller', [' P ', ' I ', ' S '], { P: 'create:propeller', I: TP, S: SH });
  RM('create_submarine:water_thruster');
  S('water_thruster', 'create_submarine:water_thruster', [' P ', 'CWC', 'TTT'], { P: 'create:mechanical_pump', C: 'minecraft:copper_block', W: 'create:propeller', T: TP });
  RM('create_submarine:pump_controller');
  S('pump_controller', 'create_submarine:pump_controller', [' C ', 'CMC', 'CTC'], { C: 'minecraft:copper_block', M: 'create:mechanical_pump', T: RADIO });
  RM('create_submarine:electrolyzer');
  S('electrolyzer', 'create_submarine:electrolyzer', ['GSG', 'CEC', 'CCC'], { G: 'minecraft:glass', S: 'simulated:spring', C: 'minecraft:copper_block', E: CIRC });
  RM('create_submarine:pulley');
  S('pulley', 'create_submarine:pulley', [' P ', 'IGI', 'III'], { P: 'create:iron_sheet', I: ST, G: 'simulated:gyroscopic_mechanism' });
  RM('create_submarine:steel_cable');
  S('steel_cable', 'create_submarine:steel_cable', ['   ', 'IRI', 'ISI'], { R: 'simulated:rope_coupling', I: ST, S: 'simulated:spring' });
  RM('create_submarine:oxygen_diffuser');
  S('oxygen_diffuser', 'create_submarine:oxygene_diffuser', [' P ', 'LNL', 'EDE'], { P: 'create:propeller', N: 'create:nozzle', L: 'create:redstone_link', D: 'create:item_drain', E: CIRC });
  RM('create_submarine:industrial_alarm');
  S('industrial_alarm', 'create_submarine:industrial_alarm', [' T ', 'GLG', 'INI'], { T: CIRC, G: 'minecraft:red_stained_glass_pane', L: 'minecraft:redstone_lamp', I: 'create:iron_sheet', N: 'minecraft:note_block' });
  RM('create_submarine:pressure_goggles');
  S('pressure_goggles', 'create_submarine:pressure_goggles', [' E ', 'RGR'], { E: CIRC, R: 'minecraft:red_stained_glass_pane', G: 'create:goggles' });
  RM('create_submarine:arresting_hook');
  S('arresting_hook', 'create_submarine:arresting_hook', ['ICI', ' N ', ' H '], { I: 'create:iron_sheet', C: BC, N: 'minecraft:chain', H: 'minecraft:tripwire_hook' });
  RM('create_submarine:ballast_tank');
  S('ballast_tank', 'create_submarine:ballast_tank', ['AIA', 'ITI', 'AIA'], { A: LEAD, I: 'create:iron_sheet', T: 'create:fluid_tank' });

  // ---------------- Deep Seas: high seas (sails, rudder, anchor, engine) ----------------
  RM('create_high_seas:white_sail');
  R(() => event.shapeless('2x create_high_seas:white_sail', ['create:white_sail', 'create:white_sail', 'wayfarer_core:wax']).id('oowwo:create_extras/high_seas_white_sail'));
  RM('create_high_seas:boat_engine');
  S('boat_engine', 'create_high_seas:boat_engine', [' L ', ' B ', ' P '], { L: 'minecraft:lever', B: 'minecraft:blast_furnace', P: 'create:propeller' });
  RM('create_high_seas:anchor');
  S('anchor', 'create_high_seas:anchor', ['SCS', ' B ', 'SIS'], { S: 'create:iron_sheet', C: 'minecraft:chain', B: 'create:industrial_iron_block', I: ST });

  // ---------------- Create Crafts & Additions ----------------
  RM('createaddition:mechanical_crafting/electric_motor');
  MC('electric_motor', 'createaddition:electric_motor', ['  A  ', ' BSB ', 'BSRSB', ' BCB '],
    { A: { item: 'create:brass_casing' }, B: { item: TP }, C: { item: 'createaddition:capacitor' }, R: { tag: 'c:rods/iron' }, S: { item: 'createaddition:copper_spool' } });
  RM('createaddition:mechanical_crafting/alternator');
  MC('alternator', 'createaddition:alternator', ['  A  ', ' ISI ', 'ISRSI', ' ISI ', '  A  '],
    { A: { item: 'create:brass_casing' }, I: { item: ST }, R: { tag: 'c:rods/iron' }, S: { item: 'createaddition:copper_spool' } });
  RM('createaddition:mechanical_crafting/tesla_coil');
  MC('tesla_coil', 'createaddition:tesla_coil', ['SSS', ' A ', 'CBC', 'PEP'],
    { S: { item: 'createaddition:copper_spool' }, A: { item: CIRC }, C: { item: 'createaddition:capacitor' }, B: { item: 'create:brass_casing' }, P: { item: TP }, E: { item: 'create:electron_tube' } });
  RM('createaddition:crafting/capacitor_1'); RM('createaddition:crafting/capacitor_2');
  S('capacitor_1', 'createaddition:capacitor', ['Z', 'C', 'T'], { Z: '#c:plates/zinc', C: '#c:plates/copper', T: CIRC });
  S('capacitor_2', 'createaddition:capacitor', ['C', 'Z', 'T'], { Z: '#c:plates/zinc', C: '#c:plates/copper', T: CIRC });
  RM('createaddition:crafting/rolling_mill');
  S('rolling_mill', 'createaddition:rolling_mill', ['PSP', 'ASA', 'ACA'], { P: ST, S: SH, A: LEAD, C: BC });

  // ---------------- Via Romana ----------------
  RM('via_romana:charting_map');
  R(() => event.shapeless('via_romana:charting_map', ['minecraft:map', 'wayfarer_core:scribing_tools', 'minecraft:string']).id('oowwo:create_extras/charting_map'));
});
