// oowwo_magic_gates.js — spellcasting locked behind Wayfarer alchemy (Derek, 2026-10-02).
// Plan: claude/oowwo-spellcasting-gate-plan.md (project doc). Decisions:
//   - First casting = silver (moon/spirit) + mercury (mind); later tiers move into Nether materials.
//   - Archers / Rogues & Warriors class skills stay martial and OPEN (Spell Engine binding table untouched).
//   - Hexerei / Hexalia / EvilCraft are not gated, but may take Wayfarer materials where it fits (later).
// Built one mod at a time; each section is verified in EMI before the next is added.
// Almost Unified rule: silver is always '#c:ingots/silver', never a wayfarer_core id.
// Recipe ids: oowwo:magic/<name>. To revert a section: delete it and /reload.

ServerEvents.recipes(event => {
  var R = fn => { try { fn() } catch (e) { console.warn('[oowwo_magic_gates] skipped: ' + e) } }

  // ---------------------------------------------------------------- 1. ARS NOUVEAU (2026-10-02)
  // The novice spell book is the only way into Ars casting (every Ars addon builds on it).
  // Jar recipes (ars_nouveau 5.13.0): book + 4 iron tools, and worn notebook + 4 iron tools.
  // The login gift (config spawnBook) is the WORN NOTEBOOK guide, not a spell book — read from
  // EventHandler, so it is not a leak. Apprentice/archmage upgrades start from the novice book.
  event.remove({ id: 'ars_nouveau:novice_spell_book' })
  event.remove({ id: 'ars_nouveau:novice_spellbook_alt' })
  R(() => event.shapeless('ars_nouveau:novice_spell_book', [
    ['minecraft:book', 'ars_nouveau:worn_notebook'],
    '#c:ingots/silver', '#c:ingots/silver',
    'wayfarer_core:mercury_droplet',
    'enchanted:tear_of_the_goddess'   // 2026-10-17: was lapis; Enchanted distillery (breath of the goddess + lapis)
  ]).id('oowwo:magic/ars_novice_spell_book'))

  // ---------------------------------------------------------------- 2. IRON'S SPELLBOOKS — inscription table
  // The table is the only way to put spells (scrolls) into a spell book, so it is Iron's casting gate.
  // Jar recipe (3.16.2): "  B" / "TTT" / "L L" (B book, T wooden slab, L wooden fence). No other recipe makes it.
  // Now: silver either side of the book, a mercury droplet between the legs.
  event.remove({ id: 'irons_spellbooks:inscription_table' })
  R(() => event.shaped('irons_spellbooks:inscription_table', ['SBI', 'TTT', 'LML'], {
    S: '#c:ingots/silver', I: 'eidolon_repraised:magic_ink', B: 'minecraft:book', M: 'wayfarer_core:mercury_droplet',
    T: '#minecraft:wooden_slabs', L: '#minecraft:wooden_fences'
  }).id('oowwo:magic/irons_inscription_table'))

  // ---------------------------------------------------------------- 3. IRON'S SPELLBOOKS — copper spell book
  // The cheapest Iron's book. Jar recipe (3.16.2): "CPP" / "SPP" / "CPP" (C copper ingot, S string, P paper).
  // Now silver (the moon metal) in place of copper; same shape. The item keeps its name and texture.
  // 2026-10-19 (Derek): all six paper become Eidolon parchment (crucible: leather, 2 stirs, 3 paper + enchanted ash -> 4).
  event.remove({ id: 'irons_spellbooks:copper_spell_book' })
  R(() => event.shaped('irons_spellbooks:copper_spell_book', ['CPP', 'SPP', 'CPP'], {
    C: '#c:ingots/silver', S: 'minecraft:string', P: 'eidolon_repraised:parchment'
  }).id('oowwo:magic/irons_copper_spell_book'))

  // ---------------------------------------------------------------- 4. IRON'S SPELLBOOKS — scroll forge
  // Makes new scrolls (paper + ink + a focus item). TWO recipes existed:
  //   irons_spellbooks:scroll_forge (3.16.2)                  "DDD" / " O " / "OOO"  D polished deepslate, O crying obsidian
  //   irons_recipe_additions:scroll_forge_recipe (1.7)         "DDD" / " B " / "BSB"  B plain OBSIDIAN, S shriving stone
  // The second skipped both the crying obsidian (rift progression) and the mercury. Derek 2026-10-03: combine them:
  //   "DMD" / " O " / "OSO"  M mercury ingot, S shriving stone (raw iron + amethyst), O crying obsidian.
  event.remove({ id: 'irons_spellbooks:scroll_forge' })
  event.remove({ id: 'irons_recipe_additions:scroll_forge_recipe' })
  R(() => event.shaped('irons_spellbooks:scroll_forge', ['DMD', ' O ', 'OSO'], {
    D: 'minecraft:polished_deepslate', M: 'wayfarer_core:mercury_ingot', O: 'minecraft:crying_obsidian',
    S: 'eidolon_repraised:lesser_soul_gem'   // 2026-10-17: was shriving stone
  }).id('oowwo:magic/irons_scroll_forge'))
})
