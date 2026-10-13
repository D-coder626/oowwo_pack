// oowwo: curated bronze weapons (2026-10-09, Derek: "new bronze weapons for a curated set").
// Startup script: needs a full restart. Recipes + tags: server_scripts/oowwo_bronze_weapons.js.
// Cleaver name: client_scripts/oowwo_bronze_weapons_lang.js. Better Combat: kubejs/data/oowwo/weapon_attributes/.
// Each weapon = its iron counterpart with 1 less attack damage, same attack speed, Wayfarer BRONZE tier
// (275 uses, enchantability 10, repaired with wayfarer_core:bronze_ingot). Skill lock attack:5 (iron is 10).
// SwordItem damage shown in game = 1 + baseline + tier bonus (bronze bonus = 1).
//   item                based on                          iron dmg  bronze dmg  speed
//   bronze_spear        archers:iron_spear                6         5           -2.6
//   bronze_dagger       rogues:iron_dagger                4.3       3.3         -1.6
//   bronze_double_axe   rogues:iron_double_axe            8         7           -2.8
//   bronze_glaive       rogues:iron_glaive                6.8       5.8         -2.6
//   bronze_longsword    simplyswords:iron_longsword       6         5           -2.4
//   bronze_greathammer  simplyswords:iron_greathammer     10        9           -3.2
//   bronze_cleaver      dungeonsdelight:iron_cleaver      5.5       4.5         -3.1 (real DD CleaverItem: throwable)

var OBW_SWORDS = [
  // id, displayName, damage baseline, speed, parent model, texture key
  ['bronze_spear', 'Bronze Spear', 3.0, -2.6, 'archers:item/base/spear_28', 'layer0'],
  ['bronze_dagger', 'Bronze Dagger', 1.3, -1.6, 'minecraft:item/handheld', 'layer0'],
  ['bronze_double_axe', 'Bronze Double Axe', 5.0, -2.8, 'rogues:item/base/double_axe_18', 'layer0'],
  ['bronze_glaive', 'Bronze Glaive', 3.8, -2.6, 'rogues:item/base/glaive_30', 'layer0'],
  ['bronze_longsword', 'Bronze Longsword', 3.0, -2.4, 'simplyswords:item/template_longsword', 'layer0'],
  ['bronze_greathammer', 'Bronze Greathammer', 7.0, -3.2, 'simplyswords:item/template_reworked_greathammer', 'texture']
]

function obwBronzeTier(tier) {
  tier.setUses(275)
  tier.setSpeed(4.0)
  tier.setAttackDamageBonus(1.0)
  tier.setEnchantmentValue(10)
  tier.setIncorrectBlocksForDropsTag('minecraft:incorrect_for_stone_tool')
  tier.setRepairIngredient(Ingredient.of('wayfarer_core:bronze_ingot'))
}

StartupEvents.registry('item', function (event) {
  OBW_SWORDS.forEach(function (w) {
    try {
      var tex = {}
      tex[w[5]] = 'oowwo:item/' + w[0]
      event.create('oowwo:' + w[0], 'sword')
        .displayName(w[1])
        .modifyTier(obwBronzeTier)
        .attackDamageBaseline(w[2])
        .speedBaseline(w[3])
        .parentModel(w[4])
        .textures(tex)
    } catch (err) {
      console.error('[oowwo_bronze_weapons] ' + w[0] + ': ' + err)
    }
  })

  // Cleaver: the real Dungeons Delight CleaverItem (throwable, Serrated Strike), on Wayfarer's BRONZE tier.
  try {
    var CleaverItem = Java.loadClass('net.yirmiri.dungeonsdelight.common.item.CleaverItem')
    var WayfarerTiers = Java.loadClass('dev.tazer.wayfarer.registry.WayfarerTiers')
    var ItemProps = Java.loadClass('net.minecraft.world.item.Item$Properties')
    event.createCustom('oowwo:bronze_cleaver', function () {
      // same args as DD's iron cleaver: range 1.25, damage 2.5, speed -3.1
      return new CleaverItem(1.25, WayfarerTiers.BRONZE, 2.5, -3.1, new ItemProps().durability(275))
    })
  } catch (err) {
    console.error('[oowwo_bronze_weapons] bronze_cleaver: ' + err)
  }
  console.info('[oowwo_bronze_weapons] registered ' + (OBW_SWORDS.length + 1) + ' bronze weapons')
})
