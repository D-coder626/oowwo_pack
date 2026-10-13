// oowwo: campfire takes a Farmer's Delight straw bale instead of coal, matching the Wayfarer pack.
//
// Wayfarer's own recipe, copied exactly from its
// server_scripts/metallurgy_and_progression/primitive_tools_and_workstations.js:
//   remove minecraft:campfire, then shaped [" S ", "SBS", "CCC"]
//   S = minecraft:stick, B = farmersdelight:straw_bale, C = #minecraft:logs_that_burn
//
// A straw bale is 9 farmersdelight:straw; straw comes from cutting wheat on a cutting board.
// Soul campfire is NOT touched here — Wayfarer also rewrites it (bone ash in place of the sticks),
// say the word and it can be added.
//
// To revert: delete this file.

ServerEvents.recipes(event => {
  event.remove({ output: 'minecraft:campfire' });

  event.shaped('minecraft:campfire', [
    ' S ',
    'SBS',
    'CCC'
  ], {
    S: 'minecraft:stick',
    B: 'farmersdelight:straw_bale',
    C: '#minecraft:logs_that_burn'
  }).id('oowwo:campfire_from_straw_bale');
});
