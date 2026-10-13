// oowwo: wayfarer_core crucible. Wayfarer's own shape (T T / T T / TTT) is identical to
// Handcrafted's terracotta thick pot, so the crucible was unreachable. This uses a barrel-style
// layout instead: terracotta slabs at top-middle and bottom-middle.
//
// Two mods now add a plain terracotta slab — Terrain Slabs and Clayworks (added 2026-09-21).
// BOTH are accepted, so it does not matter which one the player happens to have crafted.
//
// To revert, delete this file.

ServerEvents.recipes(event => {
  event.shaped('wayfarer_core:crucible', [
    'TST',
    'T T',
    'TST'
  ], {
    T: 'minecraft:terracotta',
    S: [
      'terrain_slabs:terracotta_slab',
      'clayworks:terracotta_slab'
    ]
  }).id('oowwo:crucible');
});
