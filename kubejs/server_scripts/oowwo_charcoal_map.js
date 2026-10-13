// oowwo: charcoal as another way to make an empty map (2026-10-12).
// Cheaper Maps already lets an ink sac or black dye replace the compass (8 paper around the centre).
// This adds charcoal as a third option with the same shape. Separate recipe, the mod's own is untouched.
// Server script: /reload applies it. To revert: delete this file.
ServerEvents.recipes(event => {
  event.shaped(Item.of('minecraft:map', 1), ['###', '#X#', '###'], {
    '#': 'minecraft:paper',
    'X': 'minecraft:charcoal'
  }).id('oowwo:map_from_charcoal');
});
