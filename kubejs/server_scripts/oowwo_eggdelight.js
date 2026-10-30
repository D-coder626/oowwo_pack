// oowwo: pack-wide eggs (2026-10-24; trimmed 2026-10-28 when Egg Delight was removed).
// #c:eggs gains the six Reanimal eggs (crocodile included); moa eggs and Spawn's eggs are already in it.
// Farmer's Delight's own egg recipes and Rustic Delight read #c:eggs. Vanilla cake still takes chicken eggs only.
// The Egg Delight recipe block that used to live here was deleted with the mod.
// Server script: /reload applies it.

ServerEvents.tags('item', event => {
  event.add('c:eggs', [
    'reanimal:kiwi_egg', 'reanimal:ostrich_egg', 'reanimal:penguin_egg',
    'reanimal:pigeon_egg', 'reanimal:vulture_egg', 'reanimal:crocodile_egg'
  ])
})
