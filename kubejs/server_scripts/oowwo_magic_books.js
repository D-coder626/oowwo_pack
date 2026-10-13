// oowwo_magic_books.js — Iron's spell books placed in the tier ladder (Derek approved 2026-10-03).
// Plan: claude/oowwo-irons-spellbooks-proposal.md. Tier 1 = oowwo_magic_gates.js, Tier 2 = oowwo_magic_tier2.js.
// Read from irons_spellbooks 3.16.2 + irons_recipe_additions (IRA) 1.7. Untouched books keep their jar recipes.
// Wayfarer ids (steel, mercury, hermetic plating) are not Almost-Unified metals here, so the ids are safe.
// Recipe ids: oowwo:magic/<name>. To revert a section: delete it and /reload.

ServerEvents.recipes(event => {
  var R = fn => { try { fn() } catch (e) { console.warn('[oowwo_magic_books] skipped: ' + e) } }

  // ---------------------------------------------------------------- 10. Ironbound Tome (6 slots)
  // Jar: "CLL" / "CPP" / "CLL" (C chain, L #c:leathers, P paper) — no gate at all, and it out-slots the
  // silver Flimsy Journal (5). Now steel ingots for the chains (steel tier).
  event.remove({ id: 'irons_spellbooks:iron_spell_book' })
  R(() => event.shaped('irons_spellbooks:iron_spell_book', ['CLL', 'CPP', 'CLL'], {
    C: 'wayfarer_core:steel_ingot', L: '#c:leathers', P: 'minecraft:paper'
  }).id('oowwo:magic/irons_iron_spell_book'))

  // ---------------------------------------------------------------- 11. Rotten Spell Book (8 slots) — IRA recipe
  // IRA: "abc" / "bdb" / "cef" (a uncommon ink, b rotten flesh, c arcane essence, d Ironbound Tome,
  // e poisonous potato, f IRON SWORD). An 8-slot book with no Nether trip -> mercury ingot for the sword.
  // Still pre-Nether on purpose; its -15% spell resist is the trade-off. (Loot copies unchanged.)
  event.remove({ id: 'irons_recipe_additions:rotten_spellbook_recipe' })
  R(() => event.shaped('irons_spellbooks:rotten_spell_book', ['abc', 'bdb', 'cef'], {
    a: 'irons_spellbooks:uncommon_ink', b: 'minecraft:rotten_flesh', c: 'irons_spellbooks:arcane_essence',
    d: 'irons_spellbooks:iron_spell_book', e: 'minecraft:poisonous_potato', f: 'wayfarer_core:mercury_ingot'
  }).id('oowwo:magic/irons_rotten_spell_book'))

  // ---------------------------------------------------------------- 12. Cinder essence — no furnace route
  // IRA cinder_essence_smelting turned arcane essence into cinder essence in any furnace (no Nether), and cinder
  // essence feeds the alchemist cauldron and the Blaze manual. Removed. IRA's crafting recipe (blaze powder +
  // fire charge + arcane essence + charcoal) and boss/structure loot remain -> needs the Nether or phlogiston.
  event.remove({ id: 'irons_recipe_additions:cinder_essence_smelting' })

  // ---------------------------------------------------------------- 13. Ruined Book — feeds every 12-slot book
  // IRA: " a " / "bcb" / " b " (a shriving stone, b echo shard, c ENCHANTED BOOK). Hermetic plating replaces the
  // enchanted book (enchanting is off Wayfarer's path; same swap as the Enchanted spell book). Loot copies unchanged.
  event.remove({ id: 'irons_recipe_additions:ruined_book_recipe' })
  R(() => event.shaped('irons_spellbooks:ruined_book', [' a ', 'bcb', ' b '], {
    a: 'irons_spellbooks:shriving_stone', b: 'minecraft:echo_shard', c: 'wayfarer_core:hermetic_plating'
  }).id('oowwo:magic/irons_ruined_book'))
})
