// oowwo 2026-10-04 (Derek): the iron hoe ("Plow") is the only hoe, as in Wayfarer.
// Wayfarer evidence: config/reliable_remover/removed_items.json deletes wooden/stone/golden/diamond/netherite hoes,
// caverns_and_chasms:silver_hoe, caverns_and_chasms:.*copper_hoe and caverns_and_chasms:necromium.*.
// Removed by OUTPUT (recipes only). Copper hoe also dropped from oowwo_copper_loot.js.
// Replaces oowwo_no_silver_hoe.js. Modded hoes (Aether, Bronze, Saint's Dragons, etc.) are NOT touched here.
const OOWWO_NOT_PLOW = [
  'minecraft:wooden_hoe', 'minecraft:stone_hoe', 'minecraft:golden_hoe', 'minecraft:diamond_hoe',
  'minecraft:netherite_hoe',
  'caverns_and_chasms:silver_hoe', 'caverns_and_chasms:necromium_hoe',
  'caverns_and_chasms:copper_hoe', 'caverns_and_chasms:waxed_copper_hoe',
  'caverns_and_chasms:exposed_copper_hoe', 'caverns_and_chasms:waxed_exposed_copper_hoe',
  'caverns_and_chasms:weathered_copper_hoe', 'caverns_and_chasms:waxed_weathered_copper_hoe',
  'caverns_and_chasms:oxidized_copper_hoe', 'caverns_and_chasms:waxed_oxidized_copper_hoe'
]

ServerEvents.recipes(event => {
  OOWWO_NOT_PLOW.forEach(id => event.remove({ output: id }))
})
