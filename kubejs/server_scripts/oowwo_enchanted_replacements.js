// oowwo: recipes for the Enchanted replacement items (2026-10-29). Items: startup_scripts/oowwo_enchanted_items.js.
// Washes: Brewin' and Chewin' keg, 1000 mB water + ingredients -> 4 wash bottles. Each wash distills into the product.
// Approved by Derek 2026-10-29 "for now, subject to change during gameplay".
ServerEvents.recipes(event => {
  const R = (what, fn) => { try { fn() } catch (e) { console.error('[oowwo_enchanted] ' + what + ' failed: ' + e) } }
  const ing = x => x.startsWith('#') ? { tag: x.substring(1) } : { item: x }

  const WASHES = [
    // [wash, ingredients (max 4), product, product count]
    ['moonlit_wash', ['minecraft:lapis_lazuli', 'minecraft:phantom_membrane', 'minecraft:birch_sapling'], 'goddess_tear', 1],
    ['ender_wash', ['minecraft:ender_pearl', 'minecraft:chorus_fruit'], 'ender_dew', 1],
    ['arcane_wash', ['minecraft:amethyst_shard', 'minecraft:glow_berries', 'minecraft:glowstone_dust'], 'arcane_spirit', 1],
    ['pine_wash', ['minecraft:spruce_sapling', 'minecraft:sweet_berries', 'minecraft:honey_bottle'], 'rebirth_spirit', 1]
  ]
  WASHES.forEach(w => {
    R(w[0], () => {
      const ings = w[1].map(ing)
      while (ings.length < 4) ings.push([])
      event.custom({
        type: 'brewinandchewin:fermenting',
        base_fluid: { amount: 1000, ingredient: { tag: '#c:water' }, unit: 'millibuckets' },
        experience: 1.0,
        ingredients: ings,
        result: { id: 'oowwo:' + w[0], count: 4 },
        unit: 'millibuckets'
      }).id('oowwo:enchanted/' + w[0])
    })
    R(w[2], () => {
      event.custom({
        type: 'brewinandchewin:distilling',
        distilling_time: 1200,
        experience: 1.0,
        ingredient: [{ item: 'oowwo:' + w[0] }],
        result: { id: 'oowwo:' + w[2], count: w[3] },
        water_cost: 1
      }).id('oowwo:enchanted/' + w[2])
    })
  })

  R('quicklime', () => {
    event.smelting('oowwo:quicklime', 'minecraft:calcite').xp(0.1).id('oowwo:enchanted/quicklime')
  })
  R('attuned_stone', () => {
    event.shaped('oowwo:attuned_stone', ['S', 'D', 'L'],
      { S: 'oowwo:arcane_spirit', D: 'minecraft:diamond', L: 'minecraft:lava_bucket' }).id('oowwo:enchanted/attuned_stone')
  })
  R('charged_attuned_stone', () => {
    event.shapeless('oowwo:charged_attuned_stone', ['oowwo:attuned_stone', 'oowwo:arcane_spirit',
      'minecraft:redstone', 'minecraft:redstone', 'minecraft:redstone', 'minecraft:redstone']).id('oowwo:enchanted/charged_attuned_stone')
  })
  R('ritual_chalk', () => {
    event.shaped('oowwo:ritual_chalk', ['BTB', 'BQB', 'BQB'],
      { B: 'minecraft:bone_meal', T: 'oowwo:goddess_tear', Q: 'oowwo:quicklime' }).id('oowwo:enchanted/ritual_chalk')
  })
})
