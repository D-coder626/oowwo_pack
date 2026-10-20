// oowwo_bees.js — Productive Bees gating (Derek approved item by item, 2026-10-20).
// Plan + build log: claude/oowwo-bees-gating-2026-10-20.md. Hives, nests, cages, catcher, breeding rules
// and all comb output tables are left alone; this gates turning combs into resources and the automation blocks.
// Almost Unified rule: unified metals by #c: tag, never wayfarer_core ids.
// Recipe ids: oowwo:bees/<name>. To revert a section: delete it and /reload.

ServerEvents.recipes(event => {
  var R = fn => { try { fn() } catch (e) { console.warn('[oowwo_bees] skipped: ' + e) } }

  // ---------------------------------------------------------------- P1. Centrifuge (the choke point)
  // Jar (productivebees 13.13.5) had two recipes for productivebees:centrifuge: 7 iron + grindstone, and
  // grindstone over a cauldron (no iron). Removing by output kills both.
  // Now: 4 iron + 3 hermetic plating (Nether grume -> hermetic alloy -> plate) + grindstone.
  //   I P I
  //   P G P
  //   I . I
  event.remove({ output: 'productivebees:centrifuge' })
  R(() => event.shaped('productivebees:centrifuge', [
    'IPI',
    'PGP',
    'I I'
  ], {
    I: '#c:ingots/iron',
    P: 'wayfarer_core:hermetic_plating',
    G: 'minecraft:grindstone'
  }).id('oowwo:bees/centrifuge'))

  // ---------------------------------------------------------------- P3. Breeding chamber
  // Jar: IDI / IHI / III, D = rose bush, H = productivelib:upgrade_child, I = #c:ingots/iron.
  // Now: the rose bush becomes Enchanted: Witchcraft's Hint of Rebirth (witches' oven byproduct of a
  // spruce sapling). "For now" per Derek; lifesalt was judged too rare for this.
  event.remove({ output: 'productivebees:breeding_chamber' })
  R(() => event.shaped('productivebees:breeding_chamber', [
    'IDI',
    'IHI',
    'III'
  ], {
    I: '#c:ingots/iron',
    D: 'enchanted:hint_of_rebirth',
    H: 'productivelib:upgrade_child'
  }).id('oowwo:bees/breeding_chamber'))

  // ---------------------------------------------------------------- P2. Powered centrifuge
  // Jar: powered_centrifuge/vanilla (only live because mekanism/thermal/silents_mechanisms are absent) was
  // redstone dust + centrifuge + redstone dust in a row. Now: centrifuge + 2 redstone dust + 1 silver ingot
  // (shapeless). The plating cost lives in the centrifuge itself (P1).
  event.remove({ id: 'productivebees:powered_centrifuge/vanilla' })
  R(() => event.shapeless('productivebees:powered_centrifuge', [
    'productivebees:centrifuge',
    '#c:dusts/redstone',
    '#c:dusts/redstone',
    '#c:ingots/silver'
  ]).id('oowwo:bees/powered_centrifuge'))

  // ---------------------------------------------------------------- P4. Honey generator
  // Jar: IHI / IFI / III, H = #c:buckets/honey, F = furnace, I = #c:ingots/iron. It turns honey into FE, which
  // sidesteps Create's stress economy. Now: the bottom-centre iron becomes an Eidolon arcane gold ingot.
  event.remove({ output: 'productivebees:honey_generator' })
  R(() => event.shaped('productivebees:honey_generator', [
    'IHI',
    'IFI',
    'IAI'
  ], {
    I: '#c:ingots/iron',
    H: '#c:buckets/honey',
    F: 'minecraft:furnace',
    A: '#c:ingots/arcane_gold'
  }).id('oowwo:bees/honey_generator'))

  // ---------------------------------------------------------------- P5. Stability upgrade
  // Jar: CEC / EBE / CEC, C = #c:honeycombs, E = #c:ender_pearls, B = productivelib:upgrade_base; result is
  // productivelib:upgrade_stability (the yield multiplier on the 40% / 10% metal drops).
  // Now: the left and right ender pearls become oowwo:tincture_of_salt (fixation = stability; made by the
  // chain in oowwo_alchemy.js). The top and bottom pearls stay.
  event.remove({ output: 'productivelib:upgrade_stability' })
  R(() => event.shaped('productivelib:upgrade_stability', [
    'CEC',
    'TBT',
    'CEC'
  ], {
    C: '#c:honeycombs',
    E: '#c:ender_pearls',
    T: 'oowwo:tincture_of_salt',
    B: 'productivelib:upgrade_base'
  }).id('oowwo:bees/upgrade_stability'))
})
