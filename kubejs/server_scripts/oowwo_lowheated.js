// oowwo: Create Low-Heated tweaks (2026-10-26, deep-test first).
// Basic Burner: was 3 andesite alloy in an L; now 3 alloy + 2 lead ingots (Derek's shape):
//   A _ A
//   L A L
// Low-Heated's ~42 low-heat mixing recipes (Farmer's Delight meals etc.) are KEPT on purpose:
// the planned Wayfarer-style removal of create:mixing must exempt the createlowheated namespace.
// Server script: /reload applies it.
ServerEvents.recipes(event => {
  try {
    event.remove({ id: 'createlowheated:basic_burner' })
    event.shaped(Item.of('createlowheated:basic_burner', 1), ['A A', 'LAL'], {
      A: 'create:andesite_alloy',
      L: 'wayfarer_core:lead_ingot'
    }).id('oowwo:lowheated/basic_burner')
  } catch (e) { console.error('[oowwo_lowheated] basic_burner failed: ' + e) }
})
