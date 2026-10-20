// oowwo_magic_ars.js — the rest of Ars Nouveau (non-spell-book) behind Wayfarer + Eidolon/Enchanted (Derek, 2026-10-20).
// Proposal approved row by row: scribes table (arcane gold + magic ink), source jar/relays/sourcelinks (silver),
// enchanting apparatus (arcane gold + lesser soul gem); everything else = arcane gold plus the proposed gate.
// Materials: Eidolon arcane gold (#c:*/arcane_gold), magic ink, lesser soul gem, shadow gem; Enchanted attuned stone;
// Wayfarer silver (#c:ingots/silver) and mercury droplet. Imbuement chamber is in oowwo_magic_tier2.js.
// Ars addon gear (Elemental, Elemancy, Technica...) builds on the apparatus/foci, so it inherits this gate.
// Recipe ids: oowwo:magic/ars_<name>. To revert a section: delete it and /reload.

ServerEvents.recipes(event => {
  var R = fn => { try { fn() } catch (e) { console.warn('[oowwo_magic_ars] skipped: ' + e) } }

  // ---------------------------------------------------------------- 1. SCRIBES TABLE (glyph learning)
  // Jar: "xxx" / "yy" / "zz" (x archwood slab, y gold nugget, z archwood log).
  // Now: arcane gold nuggets either side of a magic ink in the centre.
  event.remove({ id: 'ars_nouveau:scribes_table' })
  R(() => event.shaped('ars_nouveau:scribes_table', ['xxx', 'yIy', 'z z'], {
    x: 'ars_nouveau:archwood_slab', y: '#c:nuggets/arcane_gold', I: 'eidolon_repraised:magic_ink', z: '#c:logs/archwood'
  }).id('oowwo:magic/ars_scribes_table'))

  // ---------------------------------------------------------------- 2. SOURCE JAR, RELAYS, SOURCELINKS (Wayfarer silver)
  // Jar source jar: "yyy" / "xx" / "yyy" (y archwood slab, x glass). Now a silver ingot between two glass.
  event.remove({ id: 'ars_nouveau:source_jar' })
  R(() => event.shaped('ars_nouveau:source_jar', ['yyy', 'xSx', 'yyy'], {
    x: '#c:glass_blocks', y: 'ars_nouveau:archwood_slab', S: '#c:ingots/silver'
  }).id('oowwo:magic/ars_source_jar'))
  // Relay (gold ingots round a source block) and the five basic sourcelinks (gold ingots): gold -> silver.
  // The relay variants (splitter, collector, deposit, warp...) start from the relay, so they inherit.
  R(() => event.replaceInput({ id: 'ars_nouveau:relay' }, '#c:ingots/gold', '#c:ingots/silver'))
  ;['agronomic', 'alchemical', 'mycelial', 'vitalic', 'volcanic'].forEach(n => {
    R(() => event.replaceInput({ id: 'ars_nouveau:' + n + '_sourcelink' }, '#c:ingots/gold', '#c:ingots/silver'))
  })

  // ---------------------------------------------------------------- 3. ENCHANTING APPARATUS (the big gate)
  // Jar: "nsn" / "gdg" / "nsn" (n gold nugget, s sourcestone, g gold ingot, d diamond).
  // Now: arcane gold ingots either side, a lesser soul gem in the centre.
  event.remove({ id: 'ars_nouveau:enchanting_apparatus' })
  R(() => event.shaped('ars_nouveau:enchanting_apparatus', ['nsn', 'gdg', 'nsn'], {
    n: '#c:nuggets/gold', s: 'ars_nouveau:sourcestone', g: '#c:ingots/arcane_gold', d: 'eidolon_repraised:lesser_soul_gem'
  }).id('oowwo:magic/ars_enchanting_apparatus'))

  // ---------------------------------------------------------------- 4. SPELL TURRET (basic) — silver/mercury + arcane gold
  // Jar: "xxx" / "xzy" / "yyy" (x source gem, z redstone block, y gold ingot).
  // Now: arcane gold along the bottom, a mercury droplet where the single gold sat.
  event.remove({ id: 'ars_nouveau:basic_spell_turret' })
  R(() => event.shaped('ars_nouveau:basic_spell_turret', ['xxx', 'xzm', 'yyy'], {
    x: '#c:gems/source', z: '#c:storage_blocks/redstone', m: 'wayfarer_core:mercury_droplet', y: '#c:ingots/arcane_gold'
  }).id('oowwo:magic/ars_basic_spell_turret'))

  // ---------------------------------------------------------------- 5. RITUAL BRAZIER (Enchanted ritual chalk + arcane gold)
  // Jar: arcane pedestal + source block + 3 gold ingots (shapeless).
  event.remove({ id: 'ars_nouveau:ritual_brazier' })
  R(() => event.shapeless('ars_nouveau:ritual_brazier', [
    'ars_nouveau:arcane_pedestal', '#c:storage_blocks/source',
    '#c:ingots/arcane_gold', '#c:ingots/arcane_gold', '#c:ingots/arcane_gold', 'enchanted:ritual_chalk'
  ]).id('oowwo:magic/ars_ritual_brazier'))

  // ---------------------------------------------------------------- 6. APPARATUS ITEMS: Enchanter's sword/shield, amulets, charms
  // Recipes are ars_nouveau:enchanting_apparatus; JSON from the jar with the pedestal items swapped:
  //   sword/shield: gold blocks -> arcane gold blocks, +/- diamond -> shadow gem
  //   amulets: diamond/gold -> shadow gem / lesser soul gem / arcane gold
  //   charms: gold/source -> arcane gold + attuned stone (Enchanted)
  event.remove({ id: 'ars_nouveau:enchanters_sword' })
  R(() => event.custom({"type":"ars_nouveau:enchanting_apparatus","keepNbtOfReagent":true,"pedestalItems":[{"item":"eidolon_repraised:shadow_gem"},{"tag":"c:storage_blocks/arcane_gold"},{"tag":"c:storage_blocks/arcane_gold"},{"tag":"c:storage_blocks/source"},{"tag":"c:storage_blocks/source"}],"reagent":{"item":"minecraft:diamond_sword"},"result":{"count":1,"id":"ars_nouveau:enchanters_sword"},"sourceCost":0}).id('oowwo:magic/ars_enchanters_sword'))

  event.remove({ id: 'ars_nouveau:enchanters_shield' })
  R(() => event.custom({"type":"ars_nouveau:enchanting_apparatus","keepNbtOfReagent":true,"pedestalItems":[{"tag":"c:storage_blocks/arcane_gold"},{"tag":"c:storage_blocks/arcane_gold"},{"tag":"c:storage_blocks/source"},{"tag":"c:storage_blocks/source"},{"item":"eidolon_repraised:shadow_gem"}],"reagent":{"item":"minecraft:shield"},"result":{"count":1,"id":"ars_nouveau:enchanters_shield"},"sourceCost":0}).id('oowwo:magic/ars_enchanters_shield'))

  event.remove({ id: 'ars_nouveau:amulet_of_mana_boost' })
  R(() => event.custom({"type":"ars_nouveau:enchanting_apparatus","keepNbtOfReagent":false,"pedestalItems":[{"item":"eidolon_repraised:shadow_gem"},{"tag":"c:ingots/arcane_gold"},{"tag":"c:ingots/arcane_gold"},{"tag":"c:gems/source"},{"tag":"c:gems/source"},{"tag":"c:gems/source"},{"tag":"c:gems/source"},{"tag":"c:gems/source"}],"reagent":{"item":"ars_nouveau:dull_trinket"},"result":{"count":1,"id":"ars_nouveau:amulet_of_mana_boost"},"sourceCost":0}).id('oowwo:magic/ars_amulet_of_mana_boost'))

  event.remove({ id: 'ars_nouveau:amulet_of_mana_regen' })
  R(() => event.custom({"type":"ars_nouveau:enchanting_apparatus","keepNbtOfReagent":false,"pedestalItems":[{"item":"eidolon_repraised:lesser_soul_gem"},{"tag":"c:gems/diamond"},{"tag":"c:ingots/arcane_gold"},{"tag":"c:ingots/arcane_gold"},{"tag":"c:gems/source"},{"tag":"c:gems/source"},{"tag":"c:gems/source"},{"tag":"c:gems/source"}],"reagent":{"item":"ars_nouveau:dull_trinket"},"result":{"count":1,"id":"ars_nouveau:amulet_of_mana_regen"},"sourceCost":0}).id('oowwo:magic/ars_amulet_of_mana_regen'))

  event.remove({ id: 'ars_nouveau:starbuncle_charm' })
  R(() => event.custom({"type":"ars_nouveau:enchanting_apparatus","keepNbtOfReagent":true,"pedestalItems":[{"tag":"c:ingots/arcane_gold"},{"tag":"c:ingots/arcane_gold"},{"item":"enchanted:attuned_stone"},{"item":"enchanted:attuned_stone"}],"reagent":{"item":"ars_nouveau:starbuncle_shards"},"result":{"count":1,"id":"ars_nouveau:starbuncle_charm"},"sourceCost":0}).id('oowwo:magic/ars_starbuncle_charm'))

  event.remove({ id: 'ars_nouveau:wixie_charm' })
  R(() => event.custom({"type":"ars_nouveau:enchanting_apparatus","keepNbtOfReagent":false,"pedestalItems":[{"tag":"minecraft:saplings"},{"tag":"c:gems/emerald"},{"item":"minecraft:crafting_table"},{"item":"minecraft:brewing_stand"},{"tag":"c:ingots/arcane_gold"},{"item":"enchanted:attuned_stone"}],"reagent":{"item":"ars_nouveau:wixie_shards"},"result":{"count":1,"id":"ars_nouveau:wixie_charm"},"sourceCost":0}).id('oowwo:magic/ars_wixie_charm'))

  event.remove({ id: 'ars_nouveau:alakarkinos_charm' })
  R(() => event.custom({"type":"ars_nouveau:enchanting_apparatus","keepNbtOfReagent":false,"pedestalItems":[{"item":"minecraft:brush"},{"tag":"minecraft:decorated_pot_sherds"},{"tag":"minecraft:decorated_pot_sherds"},{"tag":"minecraft:decorated_pot_sherds"},{"tag":"c:ingots/arcane_gold"},{"item":"enchanted:attuned_stone"}],"reagent":{"item":"ars_nouveau:alakarkinos_token"},"result":{"count":1,"id":"ars_nouveau:alakarkinos_charm"},"sourceCost":0}).id('oowwo:magic/ars_alakarkinos_charm'))

  event.remove({ id: 'ars_nouveau:drygmy_charm' })
  R(() => event.custom({"type":"ars_nouveau:enchanting_apparatus","keepNbtOfReagent":false,"pedestalItems":[{"tag":"minecraft:fishes"},{"item":"minecraft:wheat"},{"item":"minecraft:apple"},{"item":"minecraft:carrot"},{"tag":"c:seeds"},{"tag":"c:ingots/arcane_gold"},{"item":"enchanted:attuned_stone"},{"tag":"c:gems/source"}],"reagent":{"item":"ars_nouveau:drygmy_shard"},"result":{"count":1,"id":"ars_nouveau:drygmy_charm"},"sourceCost":0}).id('oowwo:magic/ars_drygmy_charm'))

  event.remove({ id: 'ars_nouveau:whirlisprig_charm' })
  R(() => event.custom({"type":"ars_nouveau:enchanting_apparatus","keepNbtOfReagent":false,"pedestalItems":[{"tag":"c:gems/source"},{"item":"ars_nouveau:magebloom_crop"},{"item":"ars_nouveau:magebloom"},{"item":"enchanted:attuned_stone"},{"item":"minecraft:oak_sapling"},{"item":"minecraft:spruce_sapling"},{"item":"minecraft:birch_sapling"},{"tag":"c:ingots/arcane_gold"}],"reagent":{"item":"ars_nouveau:whirlisprig_shards"},"result":{"count":1,"id":"ars_nouveau:whirlisprig_charm"},"sourceCost":0}).id('oowwo:magic/ars_whirlisprig_charm'))
})
