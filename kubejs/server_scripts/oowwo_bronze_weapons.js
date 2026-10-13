// oowwo: curated bronze weapons — recipes + tags (2026-10-09). Items: startup_scripts/oowwo_bronze_weapons.js.
// Recipes copy the iron counterparts' shapes with wayfarer_core:bronze_ingot (nuggets -> bronze_nugget).

ServerEvents.recipes(function (event) {
  var B = 'wayfarer_core:bronze_ingot'
  event.shaped('oowwo:bronze_spear', ['  P', ' # ', '#  '], { P: B, '#': 'minecraft:stick' }).id('oowwo:bronze_spear')
  event.shaped('oowwo:bronze_dagger', [' M', 'S '], { M: B, S: 'minecraft:stick' }).id('oowwo:bronze_dagger')
  event.shaped('oowwo:bronze_double_axe', ['MSM', 'MSM', ' S '], { M: B, S: 'minecraft:stick' }).id('oowwo:bronze_double_axe')
  event.shaped('oowwo:bronze_glaive', [' MM', 'MS ', 'S  '], { M: B, S: 'minecraft:stick' }).id('oowwo:bronze_glaive')
  event.shaped('oowwo:bronze_longsword', ['#  ', ' X ', '  X'], { X: B, '#': '#c:wood_sticks' }).id('oowwo:bronze_longsword')
  event.shaped('oowwo:bronze_greathammer', ['XXX', 'YYY', ' # '], { X: B, Y: 'wayfarer_core:bronze_nugget', '#': '#c:wood_sticks' }).id('oowwo:bronze_greathammer')
  event.shaped('oowwo:bronze_cleaver', ['##', '#@'], { '#': B, '@': 'minecraft:stick' }).id('oowwo:bronze_cleaver')
})

ServerEvents.tags('item', function (event) {
  var ALL = ['oowwo:bronze_spear', 'oowwo:bronze_dagger', 'oowwo:bronze_double_axe', 'oowwo:bronze_glaive',
    'oowwo:bronze_longsword', 'oowwo:bronze_greathammer', 'oowwo:bronze_cleaver']
  // Wayfarer anvil upgrades (same as oowwo_upgradeable_all.js does for the iron versions)
  event.add('wayfarer:upgradeable', ALL)
  event.add('wayfarer:upgrade/attack', ALL)
  // mirror the iron counterparts' weapon-type tags
  event.add('archers:spears', 'oowwo:bronze_spear')
  event.add('rpg_series:weapon_type/spear', 'oowwo:bronze_spear')
  event.add('rogues:daggers', 'oowwo:bronze_dagger')
  event.add('rpg_series:weapon_type/dagger', 'oowwo:bronze_dagger')
  event.add('rogues:double_axes', 'oowwo:bronze_double_axe')
  event.add('rpg_series:weapon_type/double_axe', 'oowwo:bronze_double_axe')
  event.add('rogues:glaives', 'oowwo:bronze_glaive')
  event.add('rpg_series:weapon_type/glaive', 'oowwo:bronze_glaive')
  event.add('c:swords', ['oowwo:bronze_spear', 'oowwo:bronze_glaive', 'oowwo:bronze_longsword', 'oowwo:bronze_greathammer'])
  event.add('simplyswords:swords', ['oowwo:bronze_longsword', 'oowwo:bronze_greathammer'])
  event.add('simplyswords:medium_weapons', 'oowwo:bronze_longsword')
  event.add('simplyswords:heavy_weapons', 'oowwo:bronze_greathammer')
  event.add('dungeonsdelight:cleavers', 'oowwo:bronze_cleaver')
})
