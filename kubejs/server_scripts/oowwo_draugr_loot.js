// oowwo: no iron ingots from Mebahel's Draugr content (Derek, 2026-10-07).
// Why: Draugr chests (raid, crypt, fort, grave) and Draugr mobs handed out iron ingots before the bloomery.
// Structures (graves, crypts, forts, bastion, tower, ruins, church) all fill their chests from these same tables
// (checked in every structure .nbt), so this covers them too.
// Mob tables also cover flame_atronach and infernal_draugr (same mod). The Elder Scrolls Core "apprentice"
// lockpicking bonus table (the only one of its five with an iron ingot) is included as well.
// Removal only - nothing is added in its place. Iron NUGGETS (novice lockpicking table) are left alone.
// Same approach as oowwo_misc.js removing iron ingots from vanilla zombies. Top-level prefix ODL_.
// To revert: delete this file.

var ODL_TABLES = [
  'mebahelcreaturesdraugr:chests/draugr_crypt_boss_room',
  'mebahelcreaturesdraugr:chests/draugr_crypt_common',
  'mebahelcreaturesdraugr:chests/draugr_crypt_epic',
  'mebahelcreaturesdraugr:chests/draugr_crypt_rare',
  'mebahelcreaturesdraugr:chests/draugr_crypt_rare_ice',
  'mebahelcreaturesdraugr:chests/draugr_fort_common',
  'mebahelcreaturesdraugr:chests/draugr_fort_epic',
  'mebahelcreaturesdraugr:chests/draugr_fort_rare',
  'mebahelcreaturesdraugr:chests/raid/draugr_raid',
  'mebahelcreaturesdraugr:entities/draugr',
  'mebahelcreaturesdraugr:entities/draugr_archer',
  'mebahelcreaturesdraugr:entities/draugr_scourge',
  'mebahelcreaturesdraugr:entities/draugr_wight',
  'mebahelcreaturesdraugr:entities/flame_atronach',
  'mebahelcreaturesdraugr:entities/infernal_draugr',
  'mebahelelderscrollscore:chests/lockpicking_bonus/apprentice'
]

LootJS.modifiers(event => {
  ODL_TABLES.forEach(function (table) {
    event.addTableModifier(table).removeLoot('minecraft:iron_ingot')
  })
})
