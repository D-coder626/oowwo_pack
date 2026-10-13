// oowwo: make the AdFinders Mineral Finder the EARLY, wayfarer-tier finder.
//
// Why: all three AdFinders recipes need 2 comparators (nether quartz) and a compass (4 iron).
// In oowwo's chain tin gates bronze, bronze gates iron, iron gates the Nether — so the finder
// that locates tin was unreachable until long after tin stopped being the bottleneck.
//
// AdFinders registers only three finder items (gem/metal/mineral) and their behaviour is in Java,
// so a fourth "wayfarer finder" item is not possible from KubeJS. Instead the Mineral Finder is
// retiered to pre-iron materials and given copper + tin targets (see the Targets/*.cfg edits).
// The Metal Finder keeps its gold recipe and its full target list, so it stays the real upgrade.
//
// Recipe uses only things reachable before iron: copper (the bone pick mines it), one tin ingot,
// a bone, and a glass pane. No redstone (iron-gated), no quartz (Nether), no iron.
//
// To revert: delete this file (the vanilla iron/compass/comparator recipe returns).

ServerEvents.recipes(event => {
  event.remove({ output: 'adfinders:mineral_finder' });

  event.shaped('adfinders:mineral_finder', [
    'CGC',
    'CTC',
    'CBC'
  ], {
    C: '#c:ingots/copper',
    G: '#c:glass_panes',
    T: 'wayfarer_core:tin_ingot',
    B: 'minecraft:bone'
  }).id('oowwo:mineral_finder_early');
});
