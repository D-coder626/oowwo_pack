// oowwo: Create Recipe Pass (step 6, 2026-10-26, deep-test first). Review page: "Create Recipe Pass" artifact.
// Wayfarer's material rules applied to Create / Deep Seas recipes neither pack had changed (rubber, wax, circuits,
// radio circuit, lead, steel, brass casing, slidy block, canvas/rope, scribing tools).
// Derek's decisions: D1 rubber for BRASS funnels/tunnels only (andesite keep kelp); D2 radio circuit in transmitter;
// D3 brass casing mixer; D4 fluid tank = iron sheets + Wayfarer fluid barrel; D5 keep both wrenches; D6 Create toolbox
// left alone; schematic table left alone; D7 retire Create millstone + crushing wheel (end stone powder moves to the
// Wayfarer millstone, brass blend reversal dropped); D8 one canvas + wax floater recipe; flywheel = lead.
// Server script: /reload applies it. To revert: delete this file.
ServerEvents.recipes(event => {
  const R = (name, fn) => { try { fn() } catch (e) { console.error('[oowwo_create_pass] ' + name + ': ' + e) } };
  const RM = id => R('remove ' + id, () => event.remove({ id: id }));
  const ID = s => 'oowwo:create_pass/' + s;

  // Brass Funnel
  ["create:crafting/logistics/brass_funnel"].forEach(RM);
  R('brass_funnel', () => event.shaped(Item.of('create:brass_funnel', 2), ["E", "A", "R"], {"E": "create:electron_tube", "A": "#c:ingots/brass", "R": "wayfarer_core:rubber"}).id(ID('brass_funnel')));
  // Brass Tunnel
  ["create:crafting/logistics/brass_tunnel"].forEach(RM);
  R('brass_tunnel', () => event.shaped(Item.of('create:brass_tunnel', 2), ["E ", "AA", "RR"], {"E": "create:electron_tube", "A": "#c:ingots/brass", "R": "wayfarer_core:rubber"}).id(ID('brass_tunnel')));
  // Spout
  ["create:crafting/kinetics/spout"].forEach(RM);
  R('spout', () => event.shaped(Item.of('create:spout', 1), ["T", "W"], {"T": "create:copper_casing", "W": "wayfarer_core:wax"}).id(ID('spout')));
  // Elevator Pulley
  ["create:crafting/kinetics/elevator_pulley"].forEach(RM);
  R('elevator_pulley', () => event.shaped(Item.of('create:elevator_pulley', 1), ["B", "R", "I"], {"B": "create:brass_casing", "R": "wayfarer_core:rubber", "I": "#c:plates/iron"}).id(ID('elevator_pulley')));
  // Hose Pulley
  ["create:crafting/kinetics/hose_pulley"].forEach(RM);
  R('hose_pulley', () => event.shaped(Item.of('create:hose_pulley', 1), ["B", "R", "I"], {"B": "create:copper_casing", "R": "wayfarer_core:rubber", "I": "#c:plates/copper"}).id(ID('hose_pulley')));
  // Rope Pulley
  ["create:crafting/kinetics/rope_pulley"].forEach(RM);
  R('rope_pulley', () => event.shaped(Item.of('create:rope_pulley', 1), ["B", "R", "I"], {"B": "create:andesite_casing", "R": "farmersdelight:rope", "I": "#c:plates/iron"}).id(ID('rope_pulley')));
  // Cart Assembler
  ["create:crafting/kinetics/cart_assembler"].forEach(RM);
  R('cart_assembler', () => event.shaped(Item.of('create:cart_assembler', 1), ["CXC", "L L"], {"C": "create:andesite_alloy", "X": "wayfarer_core:redstone_circuit", "L": "#minecraft:logs"}).id(ID('cart_assembler')));
  // Gantry Shaft
  ["create:crafting/kinetics/gantry_shaft"].forEach(RM);
  R('gantry_shaft', () => event.shaped(Item.of('create:gantry_shaft', 8), ["A", "X", "A"], {"A": "create:andesite_alloy", "X": "wayfarer_core:redstone_circuit"}).id(ID('gantry_shaft')));
  // Rose Quartz Lamp
  ["create:crafting/kinetics/rose_quartz_lamp"].forEach(RM);
  R('rose_quartz_lamp', () => event.shapeless(Item.of('create:rose_quartz_lamp', 1), ["create:polished_rose_quartz", "wayfarer_core:redstone_circuit", "#c:ingots/zinc"]).id(ID('rose_quartz_lamp')));
  // Redstone Contact
  ["create:crafting/logistics/redstone_contact"].forEach(RM);
  R('redstone_contact', () => event.shaped(Item.of('create:redstone_contact', 2), [" S ", "CXC", "CCC"], {"S": "#c:plates/iron", "C": "minecraft:cobblestone", "X": "wayfarer_core:redstone_circuit"}).id(ID('redstone_contact')));
  // Powered Latch
  ["create:crafting/logistics/powered_latch"].forEach(RM);
  R('powered_latch', () => event.shaped(Item.of('create:powered_latch', 1), [" X ", "RCR", "SSS"], {"X": "wayfarer_core:redstone_circuit", "R": "#c:dusts/redstone", "C": "minecraft:lever", "S": "#c:stones"}).id(ID('powered_latch')));
  // Powered Toggle Latch
  ["create:crafting/logistics/powered_toggle_latch"].forEach(RM);
  R('powered_toggle_latch', () => event.shaped(Item.of('create:powered_toggle_latch', 1), [" X ", " C ", "SSS"], {"X": "wayfarer_core:redstone_circuit", "C": "minecraft:lever", "S": "#c:stones"}).id(ID('powered_toggle_latch')));
  // Pulse Repeater
  ["create:crafting/logistics/pulse_repeater"].forEach(RM);
  R('pulse_repeater', () => event.shaped(Item.of('create:pulse_repeater', 1), ["RCX", "SSS"], {"R": "#c:dusts/redstone", "C": "#c:plates/brass", "X": "wayfarer_core:redstone_circuit", "S": "#c:stones"}).id(ID('pulse_repeater')));
  // Pulse Extender
  ["create:crafting/logistics/pulse_extender"].forEach(RM);
  R('pulse_extender', () => event.shaped(Item.of('create:pulse_extender', 1), ["  T", "RCX", "SSS"], {"R": "#c:dusts/redstone", "C": "#c:plates/brass", "T": "minecraft:redstone_torch", "X": "wayfarer_core:redstone_circuit", "S": "#c:stones"}).id(ID('pulse_extender')));
  // Pulse Timer
  ["create:crafting/logistics/pulse_timer"].forEach(RM);
  R('pulse_timer', () => event.shaped(Item.of('create:pulse_timer', 1), ["RCX", "SSS"], {"R": "minecraft:amethyst_shard", "C": "#c:plates/brass", "X": "wayfarer_core:redstone_circuit", "S": "#c:stones"}).id(ID('pulse_timer')));
  // Packager
  ["create:crafting/logistics/packager"].forEach(RM);
  R('packager', () => event.shaped(Item.of('create:packager', 1), [" C ", "CAC", "XCX"], {"C": "#c:ingots/iron", "A": "create:cardboard_block", "X": "wayfarer_core:redstone_circuit"}).id(ID('packager')));
  // Redstone Requester
  ["create:crafting/logistics/redstone_requester"].forEach(RM);
  R('redstone_requester', () => event.shaped(Item.of('create:redstone_requester', 1), ["X", "A", "B"], {"X": "wayfarer_core:redstone_circuit", "A": "create:stock_link", "B": "#c:ingots/iron"}).id(ID('redstone_requester')));
  // Adjustable Chain Gearshift
  ["create:crafting/kinetics/adjustable_chain_gearshift"].forEach(RM);
  R('adjustable_chain_gearshift', () => event.shapeless(Item.of('create:adjustable_chain_gearshift', 1), ["create:encased_chain_drive", "wayfarer_core:redstone_circuit"]).id(ID('adjustable_chain_gearshift')));
  // Controller Rail
  ["create:crafting/kinetics/controller_rail"].forEach(RM);
  R('controller_rail', () => event.shaped(Item.of('create:controller_rail', 6), ["NXN", "NSN", "NEN"], {"N": "minecraft:iron_nugget", "X": "wayfarer_core:redstone_circuit", "S": "#c:rods/wooden", "E": "create:electron_tube"}).id(ID('controller_rail')));
  // Transmitter
  ["create:crafting/materials/transmitter"].forEach(RM);
  R('transmitter', () => event.shaped(Item.of('create:transmitter', 1), [" N ", "LLL", " X "], {"N": "minecraft:lightning_rod", "L": "#c:plates/copper", "X": "wayfarer_core:radio_circuit"}).id(ID('transmitter')));
  // Speedometer
  ["create:crafting/kinetics/speedometer"].forEach(RM);
  R('speedometer', () => event.shaped(Item.of('create:speedometer', 1), ["G", "A"], {"G": "wayfarer_core:redstone_gauge", "A": "create:andesite_casing"}).id(ID('speedometer')));
  // Mechanical Saw
  ["create:crafting/kinetics/mechanical_saw"].forEach(RM);
  R('mechanical_saw', () => event.shaped(Item.of('create:mechanical_saw', 1), [" A ", "ASA", " C "], {"A": "#c:plates/iron", "S": "wayfarer_core:steel_ingot", "C": "create:andesite_casing"}).id(ID('mechanical_saw')));
  // Mechanical Mixer
  ["create:crafting/kinetics/mechanical_mixer"].forEach(RM);
  R('mechanical_mixer', () => event.shaped(Item.of('create:mechanical_mixer', 1), ["S", "B", "I"], {"S": "create:cogwheel", "B": "create:brass_casing", "I": "create:whisk"}).id(ID('mechanical_mixer')));
  // Clockwork Bearing
  ["create:crafting/kinetics/clockwork_bearing"].forEach(RM);
  R('clockwork_bearing', () => event.shaped(Item.of('create:clockwork_bearing', 1), ["III", "PTP", "PEP"], {"I": "#c:plates/brass", "P": "create:brass_casing", "T": "supplementaries:turn_table", "E": "create:electron_tube"}).id(ID('clockwork_bearing')));
  // Steam Engine
  ["create:crafting/kinetics/steam_engine"].forEach(RM);
  R('steam_engine', () => event.shaped(Item.of('create:steam_engine', 1), ["S", "A", "C"], {"S": "wayfarer_core:steel_ingot", "A": "create:andesite_alloy", "C": "#c:storage_blocks/copper"}).id(ID('steam_engine')));
  // Weighted Ejector
  ["create:crafting/kinetics/weighted_ejector"].forEach(RM);
  R('weighted_ejector', () => event.shaped(Item.of('create:weighted_ejector', 1), ["S", "D", "I"], {"S": "simulated:spring", "D": "create:depot", "I": "create:cogwheel"}).id(ID('weighted_ejector')));
  // Flywheel
  ["create:crafting/kinetics/flywheel"].forEach(RM);
  R('flywheel', () => event.shaped(Item.of('create:flywheel', 1), ["LLL", "LAL", "LLL"], {"L": "wayfarer_core:lead_ingot", "A": "create:shaft"}).id(ID('flywheel')));
  // Schematicannon
  ["create:crafting/schematics/schematicannon"].forEach(RM);
  R('schematicannon', () => event.shaped(Item.of('create:schematicannon', 1), [" B ", "LBL", "SDS"], {"B": "wayfarer_core:lead_block", "L": "#minecraft:logs", "S": "minecraft:smooth_stone", "D": "minecraft:dispenser"}).id(ID('schematicannon')));
  // Fluid Tank
  ["create:crafting/kinetics/fluid_tank"].forEach(RM);
  R('fluid_tank', () => event.shaped(Item.of('create:fluid_tank', 1), ["B", "F", "B"], {"B": "#c:plates/iron", "F": "wayfarer_core:fluid_barrel"}).id(ID('fluid_tank')));
  // Copper Backtank
  ["create:crafting/appliances/copper_backtank"].forEach(RM);
  R('copper_backtank', () => event.shaped(Item.of('create:copper_backtank', 1), ["AGA", "PWP", " P "], {"A": "create:andesite_alloy", "G": "create:shaft", "W": "minecraft:waxed_copper_block", "P": "#c:ingots/copper"}).id(ID('copper_backtank')));
  // Attribute Filter
  ["create:crafting/kinetics/attribute_filter"].forEach(RM);
  R('attribute_filter', () => event.shaped(Item.of('create:attribute_filter', 1), ["ACA"], {"A": "#c:nuggets/brass", "C": "farmersdelight:canvas"}).id(ID('attribute_filter')));
  // Package Filter
  ["create:crafting/kinetics/package_filter"].forEach(RM);
  R('package_filter', () => event.shaped(Item.of('create:package_filter', 1), ["NCN"], {"N": "#wayfarer:generic_metal_nugget", "C": "farmersdelight:canvas"}).id(ID('package_filter')));
  // Nozzle
  ["create:crafting/kinetics/nozzle"].forEach(RM);
  R('nozzle', () => event.shaped(Item.of('create:nozzle', 1), [" S ", " C ", "SSS"], {"S": "create:andesite_alloy", "C": "farmersdelight:canvas"}).id(ID('nozzle')));
  // Train Schedule
  ["create:crafting/kinetics/schedule"].forEach(RM);
  R('schedule', () => event.shapeless(Item.of('create:schedule', 4), ["#c:plates/obsidian", "minecraft:paper", "wayfarer_core:scribing_tools"]).id(ID('schedule')));
  // Metal Bracket
  ["create:crafting/kinetics/metal_bracket"].forEach(RM);
  R('metal_bracket', () => event.shaped(Item.of('create:metal_bracket', 4), ["NNN", "PCP"], {"N": "#wayfarer:generic_metal_nugget", "P": "#c:ingots/iron", "C": "create:andesite_alloy"}).id(ID('metal_bracket')));
  // Encased Chain Drive
  ["create:crafting/kinetics/encased_chain_drive_from_zinc"].forEach(RM);
  R('encased_chain_drive', () => event.shapeless(Item.of('create:encased_chain_drive', 1), ["create:andesite_casing", "minecraft:chain"]).id(ID('encased_chain_drive')));
  // Floater
  ["create_submarine:floater_black", "create_submarine:floater_blue", "create_submarine:floater_brown", "create_submarine:floater_cyan", "create_submarine:floater_gray", "create_submarine:floater_green", "create_submarine:floater_light_blue", "create_submarine:floater_light_gray", "create_submarine:floater_lime", "create_submarine:floater_magenta", "create_submarine:floater_orange", "create_submarine:floater_pink", "create_submarine:floater_purple", "create_submarine:floater_red", "create_submarine:floater_white", "create_submarine:floater_yellow"].forEach(RM);
  R('floater', () => event.shaped(Item.of('create_submarine:floater', 1), ["CXC", "XPX", "CXC"], {"C": "farmersdelight:canvas", "X": "wayfarer_core:wax", "P": "create_submarine:phycological_membrane"}).id(ID('floater')));
  // Copper Pressurizer
  ["create_submarine:copper_pressurizer"].forEach(RM);
  R('copper_pressurizer', () => event.shaped(Item.of('create_submarine:copper_pressurizer', 1), ["GGG", "GCG", "GGG"], {"G": "minecraft:glass", "C": "minecraft:waxed_copper_block"}).id(ID('copper_pressurizer')));
  // Ballast Vent
  ["create_submarine:ballast_vent"].forEach(RM);
  R('ballast_vent', () => event.shaped(Item.of('create_submarine:ballast_vent', 1), ["nCn", "CnC", "nCn"], {"n": "wayfarer_core:lead_nugget", "C": "minecraft:waxed_copper_block"}).id(ID('ballast_vent')));
  // Barometer
  ["create_submarine:barometer"].forEach(RM);
  R('barometer', () => event.shaped(Item.of('create_submarine:barometer', 1), ["GGG", "GXG", "III"], {"G": "create_submarine:iron_pressurizer", "X": "wayfarer_core:redstone_gauge", "I": "create:industrial_iron_block"}).id(ID('barometer')));

  // D7: Create's millstone and crushing wheel are retired (nothing left for them after oowwo_create_cut.js)
  ['create:crafting/kinetics/millstone', 'create:mechanical_crafting/crushing_wheel',
    'aeronautics:crushing/end_stone_powder', 'oowwo:brass/brass_blend_crushing'].forEach(RM)
  R('end_stone_powder', () => event.custom({
    type: 'wayfarer_core:grinding', ingredient: { item: 'minecraft:end_stone' }, input_count: 1,
    result: { id: 'aeronautics:end_stone_powder', count: 1 }, duration: 100, bonus_chance: 0, bonus_count: 0
  }).id(ID('grinding/end_stone_powder')))
})
