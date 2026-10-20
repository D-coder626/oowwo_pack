// oowwo_magic_tier2.js — spellcasting Tier 2: Nether materials (Derek approved 2026-10-03).
// Plan: claude/oowwo-spellcasting-tier2-proposal.md. Tier 1 (silver + mercury) is oowwo_magic_gates.js.
// Wayfarer materials: phlogiston growth (Nether only; silk touch), hermetic plating (Nether grume ->
// hermetic alloy -> plate mould), lifesalt (lifegem -> Toxony mortar), mercury ingot, crying obsidian.
// Almost Unified rule: unified metals by #c: tag (lead/gold/silver), never wayfarer_core ids.
// Recipe ids: oowwo:magic/<name>. To revert a section: delete it and /reload.

ServerEvents.recipes(event => {
  var R = fn => { try { fn() } catch (e) { console.warn('[oowwo_magic_tier2] skipped: ' + e) } }

  // ---------------------------------------------------------------- 5. ARS — apprentice spell book upgrade
  // Jar (ars_nouveau 5.13.0) apprentice_book_upgrade, type ars_nouveau:book_upgrade (keeps the book's spells):
  //   novice book + obsidian + 3 diamonds + 2 quartz blocks + 2 blaze rods.
  // Now (9 slots max): novice book + 2 hermetic plating + 2 phlogiston growth + quartz block +
  //   crying obsidian + lifesalt + mercury ingot. (Proposal listed 2 quartz blocks = 10 items; one dropped to fit.)
  event.remove({ id: 'ars_nouveau:apprentice_book_upgrade' })
  R(() => event.custom({
    type: 'ars_nouveau:book_upgrade', category: 'misc',
    ingredients: [
      { item: 'ars_nouveau:novice_spell_book' },
      { item: 'wayfarer_core:hermetic_plating' }, { item: 'wayfarer_core:hermetic_plating' },
      { item: 'wayfarer_core:phlogiston_growth' }, { item: 'wayfarer_core:phlogiston_growth' },
      { item: 'minecraft:quartz_block' },
      { item: 'minecraft:crying_obsidian' },
      { item: 'wayfarer_core:lifesalt' },
      { item: 'wayfarer_core:mercury_ingot' }
    ],
    result: { count: 1, id: 'ars_nouveau:apprentice_spell_book' }
  }).id('oowwo:magic/ars_apprentice_book_upgrade'))

  // ---------------------------------------------------------------- 6. ARS — imbuement chamber
  // Jar: "xyx" / "x x" / "xyx" (x archwood planks, y gold ingot). Makes source gems, which nearly all of Ars
  // needs, so it stays pre-Nether. 2026-10-20 (Derek): centre is a charged attuned stone (Enchanted), was lifesalt.
  event.remove({ id: 'ars_nouveau:imbuement_chamber' })
  R(() => event.shaped('ars_nouveau:imbuement_chamber', ['xyx', 'xLx', 'xyx'], {
    x: 'ars_nouveau:archwood_planks', y: '#c:ingots/gold', L: 'enchanted:attuned_stone_charged'
  }).id('oowwo:magic/ars_imbuement_chamber'))

  // ---------------------------------------------------------------- 7. IRON'S — alchemist cauldron (+ vanilla cauldron)
  // Jar (3.16.2): "I I" / "ICI" / "EFE" (I iron ingot, C cauldron, E arcane essence, F cinder essence).
  // First build used '#c:ingots/lead' for I — that tag is EMPTY in oowwo (no mod defines it; the lead tier uses
  // wayfarer_core:lead_ingot), so the recipe showed blank slots and was uncraftable. Derek 2026-10-03: lead moves
  // into the VANILLA cauldron instead, and the alchemist cauldron = cauldron + cinder essence + 2 arcane essence.
  event.remove({ id: 'irons_spellbooks:alchemist_cauldron' })
  R(() => event.shaped('irons_spellbooks:alchemist_cauldron', [' C ', 'EFE'], {
    C: 'minecraft:cauldron', E: 'irons_spellbooks:arcane_essence', F: 'irons_spellbooks:cinder_essence'
  }).id('oowwo:magic/irons_alchemist_cauldron'))
  // Vanilla cauldron: "L L" / "L L" / "LLL" in lead (vanilla shape, iron -> lead). Removed by OUTPUT so no other
  // mod's cauldron recipe can bypass the lead. Lead is not unified by Almost Unified -> the wayfarer_core id is safe.
  event.remove({ output: 'minecraft:cauldron' })
  R(() => event.shaped('minecraft:cauldron', ['L L', 'L L', 'LLL'], {
    L: 'wayfarer_core:lead_ingot'
  }).id('oowwo:magic/lead_cauldron'))

  // ---------------------------------------------------------------- 8. IRON'S — gold spell book ("sun" book)
  // Jar: "GMM" / "GHH" / "GMM" (G gold ingot, M arcane essence, H hogskin). Now phlogiston growth for the hogskin.
  event.remove({ id: 'irons_spellbooks:gold_spell_book' })
  R(() => event.shaped('irons_spellbooks:gold_spell_book', ['GMM', 'GPP', 'GMM'], {
    G: '#c:ingots/gold', M: 'irons_spellbooks:arcane_essence', P: 'wayfarer_core:phlogiston_growth'
  }).id('oowwo:magic/irons_gold_spell_book'))

  // ---------------------------------------------------------------- 9. IRON'S — diamond spell book
  // Jar: "DHH" / "TET" / "DHH" (D diamond, H hogskin, T magic cloth, E enchanted book).
  // Now hermetic plating for the enchanted book (enchanting is not on Wayfarer's path).
  event.remove({ id: 'irons_spellbooks:diamond_spell_book' })
  R(() => event.shaped('irons_spellbooks:diamond_spell_book', ['DHH', 'TPT', 'DHH'], {
    D: '#c:gems/diamond', H: 'irons_spellbooks:hogskin', T: 'irons_spellbooks:magic_cloth',
    P: 'wayfarer_core:hermetic_plating'
  }).id('oowwo:magic/irons_diamond_spell_book'))
})
