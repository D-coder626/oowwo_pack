// oowwo: Block Box seats clashed with Handcrafted tables (2026-10-12).
// Both used "###" over "/ /" (3 planks + 2 sticks), and the seat won, so tables could not be crafted.
// Seats now use a different shape instead:   ##.   (# = planks, / = stick, . = empty)
//                                            /./
// = 2 planks + 2 sticks -> 1 seat. Tables keep their normal recipe.
// Server script: /reload applies it (or /kubejs reload server_scripts).
ServerEvents.recipes(event => {
  const woods = ['acacia', 'bamboo', 'birch', 'cherry', 'crimson', 'dark_oak', 'jungle', 'mangrove', 'oak', 'spruce', 'warped'];
  woods.forEach(w => {
    try {
      event.remove({ id: 'blockbox:' + w + '_seat' });
      event.shaped(Item.of('blockbox:' + w + '_seat', 1), ['## ', '/ /'], {
        '#': 'minecraft:' + w + '_planks',
        '/': 'minecraft:stick'
      }).id('oowwo:blockbox_' + w + '_seat').group('bb_chairs');
    } catch (e) {
      console.warn('[oowwo_blockbox_seats] ' + w + ' skipped: ' + e);
    }
  });
});
