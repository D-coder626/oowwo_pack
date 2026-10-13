// oowwo: Wayfarer rings as a rare find in (almost) every chest (2026-10-09, Derek: "found in most chests rarely").
// Ring plan step 4. Adds ONE extra pool to every chest loot table (any table id with "chests/" in its path) that
// rolls one ring with ORL_CHANCE. Loot rings are the plain Wayfarer versions — the stronger "Alchemically Forged"
// versions only come from the cauldron + hammer recipe (oowwo_alchemy.js).
// Skipped: tables that already get a ring pool from oowwo_loot_integration.js (dungeons, strongholds, ancient city,
// Nether structures... they keep their higher rates) and oowwo's own oowwo:loot/* tables.
// Nothing is removed. Rhino: no const/let in callbacks; top-level names use ORL_.

var ORL_CHANCE = 0.03 // 3% per chest
var ORL_DAMAGE = [0.2, 0.8]
// [ring, weight] - cursed rings and Silence rarer, junk iron rings most common
var ORL_RINGS = [
  ['wayfarer_core:rusted_iron_ring', 15], ['wayfarer_core:dull_iron_ring', 15],
  ['wayfarer_core:bulwark_ring', 8], ['wayfarer_core:fireward_ring', 8], ['wayfarer_core:spellward_ring', 8],
  ['wayfarer_core:ailward_ring', 8], ['wayfarer_core:ring_of_the_afflicted', 8], ['wayfarer_core:ring_of_warmth', 8],
  ['wayfarer_core:ring_of_the_rat', 8], ['wayfarer_core:silvercat_ring', 8], ['wayfarer_core:sunlight_ring', 6],
  ['wayfarer_core:moonlight_ring', 6], ['wayfarer_core:thorn_ring', 6], ['wayfarer_core:sulfur_gemstone_ring', 5],
  ['wayfarer_core:salt_gemstone_ring', 5], ['wayfarer_core:mercury_gemstone_ring', 5], ['wayfarer_core:ring_of_silence', 3],
  ['wayfarer_core:malevolent_ring', 3], ['wayfarer_core:ring_of_torment', 2], ['wayfarer_core:visceral_ring', 2]
]

LootJS.lootTables(function (event) {
  var W = function (msg) { console.warn('[oowwo_ring_loot] ' + msg) }
  try {
    event.create('oowwo:loot/any_ring').createPool(function (pool) {
      ORL_RINGS.forEach(function (r) { pool.addEntry(LootEntry.of(r[0]).withWeight(r[1]).damage(ORL_DAMAGE)) })
    })
  } catch (err) { W('pool: ' + err); return }

  // tables that already have a ring pool (oowwo_loot_integration.js)
  var skip = {}
  if (typeof OLI_INJECT !== 'undefined') {
    OLI_INJECT.forEach(function (row) { if (String(row[1]).indexOf('rings') >= 0) skip[row[0]] = true })
  }

  var added = 0, skipped = 0
  event.getLootTableIds().forEach(function (rl) {
    var id = String(rl)
    if (id.indexOf('chests/') < 0 || id.indexOf('oowwo:') === 0) return
    if (skip[id]) { skipped++; return }
    try {
      event.getLootTable(rl).createPool(function (pool) {
        pool.addEntry(LootEntry.reference('oowwo:loot/any_ring').when(function (c) { c.randomChance(ORL_CHANCE) }))
      })
      added++
    } catch (err) { W(id + ': ' + err) }
  })
  console.info('[oowwo_ring_loot] ring pool added to ' + added + ' chest tables (' + skipped + ' skipped: already have rings), chance ' + ORL_CHANCE)
})
