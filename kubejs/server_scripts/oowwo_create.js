// oowwo: Wayfarer technology/create.js — the machine recipe rebuilds (Derek, 2026-09-27).
// Create, Simulated, Aeronautics and Offroad machines move onto Wayfarer's materials: lead, steel,
// titanium (now obtainable, oowwo_titanium.js), brass casing, the redstone circuit, the turn table.
//
// NOT PORTED (Derek: skip for now, revisit after playtesting — noted in the gap map):
//   Wayfarer's removal of 9 whole Create recipe types (crushing, milling, mixing, deploying,
//   cutting, splashing, haunting, item application, potion mixing) and its list of Create ore /
//   raw-ore crushing removals. All Create processing keeps working.
// Already in oowwo: titanium nugget from ingot, wayfarer portable engine.
// Also: simulated:docking_connector's own recipe is a mechanical-crafting one with a different id;
// Wayfarer's removal missed it, so (as in Wayfarer) both recipes exist.
// DEVIATIONS: recipe ids added (oowwo:create/...). To revert: delete this file.

ServerEvents.recipes(event => {
  const R = fn => { try { fn(); } catch (e) { console.warn('[create] skipped: ' + e); } };
  const RM = id => event.remove({ id: id });
  const S = (id, out, pattern, keys) => R(() => event.shaped(out, pattern, keys).id('oowwo:create/' + id));
  const TI = 'wayfarer_core:titanium_ingot', TP = 'wayfarer_core:titanium_plate', ST = 'wayfarer_core:steel_ingot';
  const LEAD = 'wayfarer_core:lead_ingot', CIRC = 'wayfarer_core:redstone_circuit', TT = 'supplementaries:turn_table';
  const BC = 'create:brass_casing', SH = 'create:shaft', PL = '#minecraft:planks';

  R(() => event.shapeless('wayfarer_core:titanium_ingot', ['9x wayfarer_core:titanium_nugget']).id('oowwo:create/titanium_ingot'));

  RM('create:pressing/sugar_cane');
  R(() => event.replaceInput({ id: 'create:crafting/kinetics/white_sail' }, 'create:andesite_alloy', 'wayfarer_core:wax'));

  RM('simulated:auger_shaft'); RM('simulated:auger_shaft_from_auger_cogwheel');
  S('auger_shaft', '5x simulated:auger_shaft', ['LSL', 'LPL', ' R '], { L: LEAD, P: 'create:propeller', R: CIRC, S: SH });
  RM('simulated:auger_cog_from_auger_shaft');
  S('auger_cog', '5x simulated:auger_cog', ['LSL', 'LPL', ' R '], { L: LEAD, P: 'create:propeller', R: CIRC, S: 'create:cogwheel' });

  RM('simulated:analog_transmission');
  S('analog_transmission', 'simulated:analog_transmission', ['PIP', 'SCS', 'PRP'], { I: 'minecraft:iron_ingot', P: BC, R: CIRC, S: SH, C: 'create:cogwheel' });
  RM('create:crafting/kinetics/sticker');
  S('sticker', 'create:sticker', ['NSN', 'CPC', 'CRC'], { N: 'minecraft:iron_nugget', P: 'create:piston_extension_pole', R: CIRC, S: 'minecraft:slime_block', C: 'minecraft:cobblestone' });
  RM('create:crafting/kinetics/mechanical_piston');
  S('mechanical_piston', 'create:mechanical_piston', ['PPP', 'IEI', 'SRS'], { S: SH, I: 'minecraft:iron_ingot', R: CIRC, E: 'create:piston_extension_pole', P: PL });
  RM('offroad:rockcutting_wheel');
  S('rockcutting_wheel', 'offroad:rockcutting_wheel', ['IMI', 'MCM', 'NSN'], { C: 'create:industrial_iron_block', I: ST, M: 'supplementaries:slidy_block', S: SH, N: 'minecraft:iron_nugget' });
  RM('simulated:contraption_diagram');
  S('contraption_diagram', 'simulated:contraption_diagram', ['CCC', 'NSN', 'CCC'], { S: 'wayfarer_core:scribing_tools', N: 'wayfarer_core:titanium_nugget', C: 'farmersdelight:canvas' });

  RM('create:crafting/kinetics/propeller');
  S('propeller', '3x create:propeller', [' I ', 'ISI', ' I '], { S: SH, I: 'create:iron_sheet' });
  RM('aeronautics:wooden_propeller_from_andesite'); RM('aeronautics:andesite_propeller_from_andesite'); RM('aeronautics:andesite_propeller');
  S('wooden_propeller', 'aeronautics:wooden_propeller', [' I ', 'TST', ' I '], { T: PL, S: 'create:propeller', I: 'farmersdelight:rope' });
  S('andesite_propeller', 'aeronautics:andesite_propeller', [' T ', 'TST', ' T '], { T: TP, S: 'create:propeller' });
  RM('aeronautics:adjustable_burner');
  S('adjustable_burner', 'aeronautics:adjustable_burner', ['BBB', 'PFP', 'IRI'], { F: 'minecraft:furnace', R: CIRC, I: 'minecraft:iron_ingot', P: 'create:iron_sheet', B: 'minecraft:iron_bars' });
  RM('simulated:white_nameplate');
  S('white_nameplate', '4x simulated:white_nameplate', ['PPP', 'CSC', 'PPP'], { C: 'farmersdelight:canvas', S: 'wayfarer_core:scribing_tools', P: 'create:iron_sheet' });
  RM('create:crafting/kinetics/depot');
  S('depot', 'create:depot', ['III', 'PPP', '   '], { P: PL, I: LEAD });
  RM('create:crafting/kinetics/mechanical_drill');
  S('mechanical_drill', 'create:mechanical_drill', [' D ', 'SSS', 'IHI'], { S: ST, I: BC, H: SH, D: 'minecraft:diamond' });
  RM('simulated:rope_connector');
  S('rope_connector', 'simulated:rope_connector', ['   ', 'IBI', '   '], { B: 'create:industrial_iron_block', I: 'minecraft:iron_ingot' });
  RM('simulated:rope_winch');
  S('rope_winch', 'simulated:rope_winch', ['I I', 'SRS', 'B B'], { B: 'create:industrial_iron_block', I: 'minecraft:iron_ingot', S: SH, R: 'farmersdelight:rope' });
  RM('create:crafting/appliances/crafting_blueprint');
  S('crafting_blueprint', 'create:crafting_blueprint', ['STS', 'SCS', 'SSS'], { T: 'minecraft:crafting_table', C: 'farmersdelight:canvas', S: 'minecraft:stick' });
  RM('create:crafting/schematics/empty_schematic');
  S('empty_schematic', 'create:empty_schematic', ['SBS', 'PPP', 'SBS'], { P: 'minecraft:paper', B: 'minecraft:lapis_lazuli', S: 'minecraft:string' });
  R(() => event.replaceInput({ id: 'create:crafting/schematics/schematic_and_quill' }, 'minecraft:feather', 'wayfarer_core:scribing_tools'));
  RM('create:crafting/kinetics/filter');
  S('filter', 'create:filter', ['SCS', 'SCS', 'SCS'], { C: 'farmersdelight:canvas', S: '#wayfarer:generic_metal_nugget' });
  RM('simulated:physics_assembler');
  S('physics_assembler', 'simulated:physics_assembler', ['IRI', 'PSP', 'IGI'], { P: PL, I: 'minecraft:iron_ingot', S: 'minecraft:stick', R: 'wayfarer_core:rubber', G: ['create:super_glue', 'simulated:honey_glue'] });

  RM('create:crafting/kinetics/super_glue');
  R(() => event.custom({
    type: 'farmersdelight:cooking', cookingtime: 100, experience: 0.3, recipe_book_tab: 'misc',
    ingredients: [{ item: 'minecraft:slime_ball' }, { item: 'minecraft:slime_ball' }, { item: 'wayfarer_core:bone_ash' }, { item: 'wayfarer_core:bone_ash' }, { item: 'wayfarer_core:wax' }],
    result: { id: 'create:super_glue' }
  }).id('oowwo:create/cooking/super_glue'));
  R(() => event.custom({
    type: 'farmersdelight:cooking', cookingtime: 100, experience: 0.3, recipe_book_tab: 'misc',
    ingredients: [{ item: 'wayfarer_core:grume' }, { item: 'wayfarer_core:grume' }, { item: 'wayfarer_core:bone_ash' }, { item: 'wayfarer_core:bone_ash' }, { item: 'wayfarer_core:wax' }],
    result: { id: 'simulated:honey_glue' }
  }).id('oowwo:create/cooking/honey_glue'));

  S('brass_casing', '4x create:brass_casing', ['TTT', 'TWT', 'TTT'], { T: 'blocksabound:reinforced_iron', W: 'wayfarer_core:wax' });

  RM('simulated:red_portable_engine');
  R(() => event.shapeless('simulated:red_portable_engine', ['wayfarer_core:portable_engine', '#c:dyes/red']).id('oowwo:create/red_portable_engine'));
  S('docking_connector', 'simulated:docking_connector', ['ITI', 'TRC', 'ITI'], { R: CIRC, C: 'wayfarer_core:magnetite', T: TI, I: BC });
  RM('simulated:steering_wheel');
  S('steering_wheel', 'simulated:steering_wheel', ['SSS', 'STS', 'SPS'], { T: 'create:large_cogwheel', S: 'minecraft:stick', P: PL });
  RM('simulated:torsion_spring');
  S('torsion_spring', 'simulated:torsion_spring', ['GSG', 'GSG', 'PSP'], { G: 'simulated:spring', S: SH, P: PL });
  RM('simulated:navigation_table');
  S('navigation_table', 'simulated:navigation_table', ['IDI', 'TRT', 'PPP'], { I: TP, T: TI, P: BC, R: 'wayfarer_core:radio_circuit', D: 'create:depot' });
  RM('simulated:gimbal_sensor');
  S('gimbal_sensor', 'simulated:gimbal_sensor', ['ICI', 'IGI', 'PPP'], { C: 'minecraft:compass', G: 'simulated:gyroscopic_mechanism', I: TI, P: PL });

  RM('create:crafting/kinetics/mechanical_press');
  S('mechanical_press', 'create:mechanical_press', ['SIS', 'NLN', ' L '], { L: 'wayfarer_core:lead_block', N: BC, S: SH, I: ST });
  RM('create:crafting/kinetics/mechanical_bearing');
  S('mechanical_bearing', 'create:mechanical_bearing', ['III', 'PTP', 'PSP'], { T: TT, P: BC, S: SH, I: 'create:iron_sheet' });
  RM('create:crafting/kinetics/windmill_bearing');
  S('windmill_bearing', 'create:windmill_bearing', ['III', 'PTP', 'PSP'], { T: TT, P: PL, S: SH, I: 'create:iron_sheet' });
  RM('simulated:swivel_bearing');
  S('swivel_bearing', 'simulated:swivel_bearing', ['PSP', 'ITI', 'PSP'], { T: TT, P: BC, S: SH, I: 'minecraft:iron_ingot' });
  RM('offroad:borehead_bearing');
  S('borehead_bearing', 'offroad:borehead_bearing', ['PSP', 'ITI', 'PSP'], { T: TT, P: BC, S: ST, I: SH });
  RM('aeronautics:propeller_bearing');
  S('propeller_bearing', 'aeronautics:propeller_bearing', ['III', 'PTP', 'BSB'], { T: TT, P: PL, B: ST, S: SH, I: TP });
  RM('aeronautics:gyroscopic_propeller_bearing');
  S('gyroscopic_propeller_bearing', 'aeronautics:gyroscopic_propeller_bearing', ['III', 'BTB', 'HSH'], { T: TT, B: BC, H: ST, S: 'simulated:gyroscopic_mechanism', I: TP });

  RM('create:crafting/kinetics/hand_crank');
  S('hand_crank', 'create:hand_crank', ['   ', ' HL', ' S '], { H: 'simulated:iron_handle', S: SH, L: 'minecraft:leather' });
  RM('simulated:iron_handle');
  S('iron_handle', 'simulated:iron_handle', ['   ', 'NIN', 'N N'], { N: 'minecraft:iron_nugget', I: 'minecraft:iron_ingot' });
  RM('simulated:copper_handle');
  S('copper_handle', '2x simulated:copper_handle', ['   ', 'NIN', 'N N'], { N: '#c:nuggets/copper', I: 'minecraft:copper_ingot' });

  ['white', 'orange', 'magenta', 'light_blue', 'yellow', 'lime', 'pink', 'gray', 'light_gray', 'cyan',
   'purple', 'blue', 'brown', 'green', 'red', 'black'].forEach(dye => {
    RM('aeronautics:' + dye + '_envelope');
    S(dye + '_envelope', '6x aeronautics:' + dye + '_envelope', ['SWS', 'WAW', 'SWS'], {
      W: 'minecraft:' + dye + '_wool', A: 'wayfarer_core:wax', S: 'minecraft:stick'
    });
  });
});
