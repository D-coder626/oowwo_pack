// oowwo: Wayfarer technology/redstone_circuitry.js + special_circuitry.js — the recipe changes.
// (The circuit items themselves — redstone/audio/video/radio circuit, crystals, redstone gauge —
// were already ported in wayfarer_port.js.)
//
// REDSTONE CIRCUIT now needed by: dispenser, dropper, observer, piston, daylight detector,
// redstone lamp, crafter, copper bulbs (which also swap blaze rod -> glowstone dust), Create
// analog lever / clutch / gearshift, Simulated directional gearshift, Supplementaries relayer,
// redstone illuminator, turn table, spring launcher, speaker block, crank, C&C winch.
// Other changes: 4 piston extension poles from planks + iron; Create water wheel needs a
// Supplementaries turn table instead of a shaft; Create's andesite-casing encased chain drive
// recipe removed (the zinc one stays).
// AUDIO CIRCUIT (special_circuitry.js) now needed by: note block (6 per craft, with rubber) and
// jukebox. The audio circuit needs an amethyst crystal (aqua regia), so these are later-game.
//
// SKIPPED: Etched radio, Vista television (mods not in oowwo).
// DEVIATIONS: recipe ids added (oowwo:circuits/...). To revert: delete this file.

ServerEvents.recipes(event => {
  const R = fn => { try { fn(); } catch (e) { console.warn('[circuits] skipped: ' + e); } };
  const RM = id => event.remove({ id: id });
  const RI = (id, from, to) => R(() => event.replaceInput({ id: id }, from, to));
  const CIRCUIT = 'wayfarer_core:redstone_circuit';

  RI('minecraft:dispenser', 'minecraft:redstone', CIRCUIT);
  RI('minecraft:dropper', 'minecraft:redstone', CIRCUIT);
  RI('create:crafting/kinetics/analog_lever', 'create:andesite_casing', CIRCUIT);
  RI('simulated:directional_gearshift', 'minecraft:redstone_torch', CIRCUIT);
  RI('create:crafting/kinetics/clutch', 'minecraft:redstone', CIRCUIT);
  RI('create:crafting/kinetics/gearshift', 'minecraft:redstone', CIRCUIT);

  RM('minecraft:observer');
  R(() => event.shaped('minecraft:observer', ['CCC', 'DXQ', 'CCC'], {
    C: 'minecraft:cobblestone', D: 'minecraft:redstone', X: CIRCUIT, Q: 'minecraft:quartz'
  }).id('oowwo:circuits/observer'));
  RM('minecraft:piston');
  R(() => event.shaped('minecraft:piston', ['PPP', 'IEI', 'CRC'], {
    C: 'minecraft:cobblestone', I: 'minecraft:iron_ingot', R: CIRCUIT,
    E: 'create:piston_extension_pole', P: '#minecraft:planks'
  }).id('oowwo:circuits/piston'));
  RM('supplementaries:relayer');
  R(() => event.shaped('supplementaries:relayer', ['CCC', 'DXT', 'CCC'], {
    C: 'minecraft:cobblestone', D: 'minecraft:redstone', X: CIRCUIT, T: 'wayfarer_core:tin_ingot'
  }).id('oowwo:circuits/relayer'));
  RM('minecraft:daylight_detector');
  R(() => event.shaped('minecraft:daylight_detector', ['GGG', 'QXQ', 'PDP'], {
    P: '#minecraft:planks', D: 'minecraft:redstone', X: CIRCUIT, G: '#c:glass_blocks', Q: 'minecraft:quartz'
  }).id('oowwo:circuits/daylight_detector'));
  RM('minecraft:redstone_lamp');
  R(() => event.shaped('minecraft:redstone_lamp', [' G ', 'GDG', ' C '], {
    D: 'minecraft:glowstone_dust', C: CIRCUIT, G: '#c:glass_blocks'
  }).id('oowwo:circuits/redstone_lamp'));
  RM('supplementaries:redstone_illuminator');
  R(() => event.shaped('supplementaries:redstone_illuminator', [' G ', 'GDG', ' C '], {
    D: 'minecraft:glowstone_dust', C: CIRCUIT, G: 'minecraft:prismarine_crystals'
  }).id('oowwo:circuits/redstone_illuminator'));
  RM('minecraft:crafter');
  R(() => event.shaped('minecraft:crafter', ['IRI', 'CXC', 'DDD'], {
    D: 'minecraft:redstone', X: CIRCUIT, C: 'minecraft:copper_ingot', I: 'minecraft:iron_ingot', R: 'minecraft:crafting_table'
  }).id('oowwo:circuits/crafter'));
  RM('create:crafting/kinetics/piston_extension_pole');
  R(() => event.shaped('4x create:piston_extension_pole', [' P ', ' I ', ' P '], {
    P: '#minecraft:planks', I: 'minecraft:iron_ingot'
  }).id('oowwo:circuits/piston_extension_pole'));
  RM('supplementaries:turn_table');
  R(() => event.shaped('supplementaries:turn_table', ['PPP', 'CIC', 'CXC'], {
    X: CIRCUIT, C: 'minecraft:cobblestone', I: 'create:cogwheel', P: '#minecraft:planks'
  }).id('oowwo:circuits/turn_table'));
  RI('create:crafting/kinetics/water_wheel', 'create:shaft', 'supplementaries:turn_table');
  RM('supplementaries:spring_launcher');
  R(() => event.shaped('supplementaries:spring_launcher', ['PPP', 'IEI', 'CRC'], {
    C: 'minecraft:cobblestone', R: CIRCUIT, I: 'simulated:spring',
    E: 'create:piston_extension_pole', P: '#minecraft:planks'
  }).id('oowwo:circuits/spring_launcher'));
  RM('supplementaries:speaker_block');
  R(() => event.shaped('supplementaries:speaker_block', [' D ', 'NXN', '   '], {
    X: CIRCUIT, N: 'minecraft:note_block', D: 'wayfarer_core:scribing_tools'
  }).id('oowwo:circuits/speaker_block'));
  RM('supplementaries:crank');
  R(() => event.shaped('supplementaries:crank', [' L ', ' R ', ' S '], {
    L: 'minecraft:lever', R: CIRCUIT, S: 'minecraft:smooth_stone'
  }).id('oowwo:circuits/crank'));
  RM('caverns_and_chasms:winch');
  R(() => event.shaped('caverns_and_chasms:winch', [' L ', ' R ', ' S '], {
    L: 'supplementaries:crank', R: CIRCUIT, S: 'simulated:spring'
  }).id('oowwo:circuits/winch'));
  RM('create:crafting/kinetics/encased_chain_drive');

  ['', 'exposed_', 'weathered_', 'oxidized_'].forEach(stage => ['', 'waxed_'].forEach(waxed => {
    RI('minecraft:' + waxed + stage + 'copper_bulb', 'minecraft:blaze_rod', 'minecraft:glowstone_dust');
    RI('minecraft:' + waxed + stage + 'copper_bulb', 'minecraft:redstone', CIRCUIT);
  }));

  // special_circuitry.js
  RM('minecraft:note_block');
  R(() => event.shaped('6x minecraft:note_block', ['DQD', 'QXQ', 'DQD'], {
    D: '#minecraft:planks', X: 'wayfarer_core:audio_circuit', Q: 'wayfarer_core:rubber'
  }).id('oowwo:circuits/note_block'));
  RM('minecraft:jukebox');
  R(() => event.shaped('minecraft:jukebox', [' D ', 'NXN', '   '], {
    X: 'wayfarer_core:audio_circuit', N: 'minecraft:note_block', D: 'minecraft:diamond'
  }).id('oowwo:circuits/jukebox'));
});
