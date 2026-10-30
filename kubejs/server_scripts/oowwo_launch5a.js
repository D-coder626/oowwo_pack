// oowwo: launch 5a — Wayfarer's tweaks for Incubation, Piglin Proliferation and Envelope (2026-10-29).
// Mods added: All Tutta's Needs 2.1.0, Big Brain 2.2.8, Incubation 5.0.2, Piglin Proliferation 2.0.16 (Wayfarer's jars
// and configs). Ported from Wayfarer kubejs: food/food.js (scrambled eggs), building/wood.js (pigeonhole),
// building/lighting.js (stone fire ring). Eggs use #c:eggs (oowwo convention; includes Re:Animal eggs).
ServerEvents.recipes(event => {
  const R = (what, fn) => { try { fn() } catch (e) { console.error('[oowwo_launch5a] ' + what + ' failed: ' + e) } }

  // Scrambled eggs: Incubation's crafting recipe -> Farmer's Delight cooking pot (2 eggs + milk, served in a bowl)
  R('scrambled_eggs', () => {
    event.remove({ id: 'incubation:scrambled_eggs' })
    event.custom({
      type: 'farmersdelight:cooking',
      recipe_book_tab: 'meals',
      ingredients: [{ tag: 'c:eggs' }, { tag: 'c:eggs' }, { tag: 'c:drinks/milk' }],
      container: { id: 'minecraft:bowl', count: 1 },
      experience: 0.3,
      cookingtime: 100,
      result: { id: 'incubation:scrambled_eggs', count: 1 }
    }).id('oowwo:launch5a/scrambled_eggs')
  })

  // Envelope pigeonhole: any planks, and a hay nest instead of a hay block
  R('pigeonhole', () => {
    event.replaceInput({ output: 'envelope:oak_pigeonhole' }, 'minecraft:oak_planks', '#minecraft:planks')
    event.replaceInput({ output: 'envelope:oak_pigeonhole' }, 'minecraft:hay_block', 'incubation:hay_nest')
  })

  // Stone fire ring: coal over nether wart over stone
  R('stone_fire_ring', () => {
    event.remove({ output: 'piglinproliferation:stone_fire_ring' })
    event.shaped('piglinproliferation:stone_fire_ring', [' C ', 'WWW', 'SSS'], {
      C: '#minecraft:coals', W: 'minecraft:nether_wart', S: '#minecraft:stone_tool_materials'
    }).id('oowwo:launch5a/stone_fire_ring')
  })
})
