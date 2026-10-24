// oowwo: Egg Delight recipes + pack-wide eggs (2026-10-24).
// Egg Delight 1.2 ships 14 of its 17 recipes in data/eggdelight/recipes/ (1.20 folder name), which 1.21.1
// never loads, so every egg dish was uncraftable. They are re-added here in 1.21 format
// (FD 1.3.2 schemas, c: tags), with every plain egg replaced by #c:eggs.
// #c:eggs gains the six Reanimal eggs (crocodile included); moa eggs and Spawn's eggs are already in it.
// Farmer's Delight's own egg recipes and Rustic Delight also read #c:eggs. Vanilla cake still takes chicken eggs only.
// Server script: /reload applies it.

ServerEvents.tags('item', event => {
  event.add('c:eggs', [
    'reanimal:kiwi_egg', 'reanimal:ostrich_egg', 'reanimal:penguin_egg',
    'reanimal:pigeon_egg', 'reanimal:vulture_egg', 'reanimal:crocodile_egg'
  ])
})

ServerEvents.recipes(event => {
  const R = (id, json) => {
    try { event.custom(json).id('oowwo:eggdelight/' + id) }
    catch (e) { console.error('[eggdelight] ' + id + ' failed: ' + e) }
  }
  const EGG = { tag: 'c:eggs' }
  const MILK = { tag: 'c:drinks/milk' }
  const BACON = { tag: 'c:foods/cooked_bacon' }
  const SUGAR = { item: 'minecraft:sugar' }
  const BREAD_SLICE = { item: 'eggdelight:bread_slice' }
  const KNIFE = [{ type: 'farmersdelight:item_ability', action: 'knife_dig' }, { tag: 'c:tools/knife' }]
  const cook = (id, time, ingredients, out, container) => {
    const j = { type: 'farmersdelight:cooking', cookingtime: time, experience: 0.35,
      ingredients: ingredients, result: { count: 1, id: out } }
    if (container) j.container = { count: 1, id: container }
    R(id, j)
  }
  const cut = (id, input, out, count) => R(id, { type: 'farmersdelight:cutting',
    ingredients: [{ item: input }], tool: KNIFE, result: [{ item: { count: count, id: out } }] })

  cook('bacon_and_egg_cup', 100, [BACON, EGG], 'eggdelight:bacon_and_egg_cup')
  cook('boiled_egg', 200, [EGG, { item: 'minecraft:water_bucket' }], 'eggdelight:boiled_egg')
  cook('custard', 200, [EGG, EGG, MILK, SUGAR], 'eggdelight:custard', 'minecraft:bowl')
  cook('egg_cookie', 200, [EGG, { item: 'minecraft:wheat' }, SUGAR], 'eggdelight:egg_cookie')
  cook('egg_in_a_basket', 200, [BREAD_SLICE, EGG], 'eggdelight:egg_in_a_basket')
  cook('egg_tart', 200, [EGG, SUGAR, MILK, EGG, { item: 'farmersdelight:wheat_dough' }], 'eggdelight:egg_tart')
  cook('egg_toast', 200, [EGG, BREAD_SLICE, { item: 'farmersdelight:onion' }, { item: 'farmersdelight:tomato' }], 'eggdelight:egg_toast')
  cook('eggs_benidict', 200, [BREAD_SLICE, BACON, EGG, MILK, EGG], 'eggdelight:eggs_benidict')
  cook('scotch_egg', 200, [EGG, EGG, BREAD_SLICE, { item: 'farmersdelight:minced_beef' }], 'eggdelight:scotch_egg')

  R('egg_pie', { type: 'minecraft:crafting_shaped', category: 'misc',
    pattern: ['EEE', 'MMM', 'SCS'],
    key: { E: EGG, M: MILK, S: SUGAR, C: { item: 'farmersdelight:pie_crust' } },
    result: { count: 1, id: 'eggdelight:egg_pie' } })

  cut('bread_slice', 'minecraft:bread', 'eggdelight:bread_slice', 4)
  cut('egg_pie_slice', 'eggdelight:egg_pie', 'eggdelight:egg_pie_slice', 4)
  cut('sliced_boiled_egg', 'eggdelight:peeled_boiled_egg', 'eggdelight:sliced_boiled_egg', 2)
  cut('sliced_scotch_egg', 'eggdelight:scotch_egg', 'eggdelight:sliced_scotch_egg', 2)
})
