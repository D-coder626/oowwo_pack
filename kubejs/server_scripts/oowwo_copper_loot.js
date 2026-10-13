// oowwo — copper gear (and anything else) in early-game overworld chests
// ---------------------------------------------------------------------------
// Adds Caverns & Chasms copper tools and armour to early overworld chest loot.
// NOTHING is removed. Iron and everything else stay exactly as they are.
//
// Oxidation is keyed to the structure: buried and drowned places give aged
// copper, inhabited villages give fresh copper that will weather in your hands.
//
// TO ADD NON-GEAR ITEMS (sage, spell books, whatever) skip to the EXTRAS
// block near the bottom. It is one line per item.
//
// UNVERIFIED IN GAME. After the first /reload, read logs/kubejs/server.txt
// before believing any of it.
// ---------------------------------------------------------------------------

LootJS.modifiers(event => {

  // Uncomment to have LootJS print every modifier it built. Lands in latest.log.
  // event.enableLogging()

  // =========================================================================
  // PART 1 — copper gear, aged by structure
  // =========================================================================

  // 2026-10-04 (Derek): copper PICKAXE removed from the pack (it mined at iron level and out-mined bronze;
  // see oowwo_no_copper_pickaxe.js). 2026-10-04: copper HOE removed too (iron hoe "Plow" is the only hoe,
  // see oowwo_only_plow.js). Axe/shovel stay.
  const TOOLS  = ['axe', 'shovel']
  const ARMOR  = ['helmet', 'chestplate', 'leggings', 'boots']
  const WEAPON = ['sword']
  const ALL    = TOOLS.concat(WEAPON).concat(ARMOR)

  // [ loot table, oxidation prefix, pieces, per-piece chance ]
  //
  // Each piece rolls independently, so the odds of a chest containing at
  // least one copper item are  1 - (1 - chance)^(number of pieces).
  // At 0.06 across 9 pieces that is about 42%; at 0.14 across 4, about 45%.
  const GEAR_TABLES = [

    // --- buried, damp, long abandoned ------------------------------------
    ['minecraft:chests/simple_dungeon',              'weathered_', ALL,    0.06],
    ['minecraft:chests/abandoned_mineshaft',         'weathered_', TOOLS,  0.07],

    // --- ancient and fully exposed to the sky -----------------------------
    ['minecraft:chests/ruined_portal',               'oxidized_',  ALL,    0.05],
    ['minecraft:chests/desert_pyramid',              'oxidized_',  ALL,    0.05],
    ['minecraft:chests/jungle_temple',               'oxidized_',  ALL,    0.05],

    // --- underwater -------------------------------------------------------
    ['minecraft:chests/shipwreck_supply',            'oxidized_',  TOOLS,  0.06],
    ['minecraft:chests/shipwreck_treasure',          'oxidized_',  ARMOR,  0.07],
    ['minecraft:chests/underwater_ruin_small',       'oxidized_',  ALL,    0.05],
    ['minecraft:chests/underwater_ruin_big',         'oxidized_',  ALL,    0.06],

    // --- occupied, kept in service but not polished ------------------------
    ['minecraft:chests/pillager_outpost',            'exposed_',   WEAPON.concat(ARMOR), 0.08],
    ['minecraft:chests/igloo_chest',                 'exposed_',   TOOLS,  0.06],

    // --- inhabited and maintained: fresh copper ---------------------------
    ['minecraft:chests/village/village_toolsmith',   '',           TOOLS,  0.14],
    ['minecraft:chests/village/village_weaponsmith', '',           WEAPON, 0.16],
    ['minecraft:chests/village/village_armorer',     '',           ARMOR,  0.14],
    ['minecraft:chests/village/village_mason',       '',           TOOLS,  0.05],
    ['minecraft:chests/village/village_desert_house','',           TOOLS,  0.03],
    ['minecraft:chests/village/village_plains_house','',           TOOLS,  0.03],
    ['minecraft:chests/village/village_savanna_house','',          TOOLS,  0.03],
    ['minecraft:chests/village/village_snowy_house', '',           TOOLS,  0.03],
    ['minecraft:chests/village/village_taiga_house', '',           TOOLS,  0.03]
  ]

  GEAR_TABLES.forEach(([table, age, pieces, chance]) => {
    pieces.forEach(piece => {
      event.addTableModifier(table)
        .name(`oowwo_copper/${table.replace(/[:/]/g, '_')}/${age}${piece}`)
        .randomChance(chance)
        .addLoot(`caverns_and_chasms:${age}copper_${piece}`)
    })
  })

  // =========================================================================
  // PART 2 — EXTRAS: anything else you want in a chest
  // =========================================================================
  //
  //   [ loot table, item id, chance, count ]
  //
  // - loot table accepts wildcards: 'minecraft:chests/village/*' works.
  // - chance is 0..1, rolled once per line.
  // - count is optional; leave it off for 1. Use a plain number.
  //
  // Add a line, save, /reload in game. That is the whole workflow — no
  // restart, no datapack, no world reload.
  //
  // All ids below are REAL and verified inside the installed jars. They are
  // commented out; uncomment the ones you want.

  const EXTRAS = [

    // --- Hexerei herbs -----------------------------------------------------
    // Witch huts and swamp-ish loot are the obvious homes for these.
    // ['minecraft:chests/simple_dungeon',              'hexerei:sage',              0.25, 2],
    // ['minecraft:chests/simple_dungeon',              'hexerei:sage_seed',         0.20, 3],
    // ['minecraft:chests/village/village_temple',      'hexerei:dried_sage_bundle', 0.30],
    // ['minecraft:chests/village/*',                   'hexerei:mandrake_root',     0.10],
    // ['minecraft:chests/abandoned_mineshaft',         'hexerei:belladonna_berries',0.15, 2],
    //   others: hexerei:sage_bundle, hexerei:dried_sage, hexerei:mugwort_flowers,
    //           hexerei:yellow_dock_flowers, hexerei:belladonna_flowers

    // --- Ars Nouveau -------------------------------------------------------
    // NOTE: spell books and caster tomes drop BLANK. A novice_spell_book is a
    // real starting item; an archmage_spell_book with no spell in it is just
    // an expensive-looking empty book. Glyphs are the better reward - there
    // are 82 of them and each one is a recipe you would otherwise grind for.
    // ['minecraft:chests/simple_dungeon',              'ars_nouveau:blank_parchment',    0.20, 2],
    // ['minecraft:chests/stronghold_library',          'ars_nouveau:novice_spell_book',  0.35],
    // ['minecraft:chests/jungle_temple',               'ars_nouveau:glyph_break',        0.25],
    // ['minecraft:chests/desert_pyramid',              'ars_nouveau:glyph_amplify',      0.25],
    // ['minecraft:chests/ruined_portal',               'ars_nouveau:glyph_blink',        0.20],
    //   full glyph list: JEI, search "glyph". Ids are ars_nouveau:glyph_<name>.

  ]

  EXTRAS.forEach(([table, item, chance, count]) => {
    event.addTableModifier(table)
      .name(`oowwo_extra/${table.replace(/[:/*]/g, '_')}/${item.replace(':', '_')}`)
      .randomChance(chance)
      .addLoot(count ? Item.of(item, count) : item)
  })
})

// ---------------------------------------------------------------------------
// NOTES
//
// Why per-item modifiers instead of one weighted pool:
//   LootJS's modifier path has no per-entry weight - weights only exist on the
//   real-pool path (LootJS.lootTables). One modifier per item, each with its
//   own randomChance, is the honest way to get independent odds. Verified by
//   javap: LootActionContainer has addLoot / addAlternativesLoot but
//   ItemLootEntry has no weight().
//
// Why nothing here targets `lootintegrations:chests/*`:
//   LootIntegrations pours its own sub-tables into these same chests, and
//   those sub-tables DO pass through the NeoForge modifier hook, so a rule
//   aimed at them would work. But `lootintegrations:chests/easy` feeds many
//   host tables at once, including nether and end ones - copper would spray
//   far outside the overworld. Adding to the named vanilla tables keeps the
//   blast radius exactly where it was aimed.
//
// Modded structures are deliberately absent:
//   Dungeons & Taverns, IDA, Integrated Villages, Epic Structures and the rest
//   all ship their own tables. Their ids have NOT been verified, so guessing
//   them here would just produce silent no-ops. Get the vanilla set confirmed
//   in game first, then add them from a checked list.
// ---------------------------------------------------------------------------
