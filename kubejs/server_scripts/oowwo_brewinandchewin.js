// oowwo: Brewin' and Chewin' 5.0 workstations, Wayfarer style (2026-10-26, deep-test first).
// Port of Wayfarer's wax.js B&C lines: honeycomb -> wayfarer_core:wax on the distillery,
// and the keg / aging cask / bottle rack rebuilt around a barrel + wax (keg also takes a No Man's Land tap).
// Server script: /reload applies it.
ServerEvents.recipes(event => {
  const WAX = 'wayfarer_core:wax'
  const R = (fn, what) => { try { fn() } catch (e) { console.error('[oowwo_bnc] ' + what + ' failed: ' + e) } }

  // Distillery keeps its shape (copper, furnace, bucket); the honeycomb becomes wax.
  R(() => event.replaceInput({ output: 'brewinandchewin:distillery' }, 'minecraft:honeycomb', WAX), 'distillery')

  const reshape = (out, pattern, key) => R(() => {
    event.remove({ output: out })
    event.shaped(Item.of(out, 1), pattern, key).id('oowwo:bnc/' + out.split(':')[1])
  }, out)

  reshape('brewinandchewin:keg', ['PIP', 'TBW', 'PIP'],
    { P: '#minecraft:planks', B: 'minecraft:barrel', I: 'minecraft:iron_ingot', W: WAX, T: 'nomansland:tap' })
  reshape('brewinandchewin:aging_cask', ['IPI', 'WBW', 'IPI'],
    { P: '#minecraft:planks', B: 'minecraft:barrel', I: 'minecraft:iron_ingot', W: WAX })
  reshape('brewinandchewin:bottle_rack', ['PPP', ' W ', 'PPP'],
    { P: '#minecraft:planks', W: WAX })
})
