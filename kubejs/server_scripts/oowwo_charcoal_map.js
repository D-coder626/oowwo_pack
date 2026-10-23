// oowwo: empty map recipes (2026-10-21; file was the charcoal-map script).
// Only two ways to get an empty map: 8 paper around scribing tools, or a filled map + soap (Supplementaries, untouched).
// Cheaper Maps' ink sac / black dye recipe and the old oowwo charcoal recipe are removed.
// Server script: /reload applies it.
ServerEvents.recipes(event => {
  event.remove({ id: 'minecraft:map' });
  event.remove({ id: 'oowwo:map_from_charcoal' });
  event.shaped(Item.of('minecraft:map', 1), ['###', '#X#', '###'], {
    '#': 'minecraft:paper',
    'X': 'wayfarer_core:scribing_tools'
  }).id('oowwo:map_from_scribing_tools');
});
