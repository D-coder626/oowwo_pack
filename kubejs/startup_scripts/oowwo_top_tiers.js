// oowwo: top-tier ladder, startup half (Derek, 2026-10-31).
//   Steel (vanilla diamond ids) < Adamantite (Dwarfs Tyranny mythril) < Necromium (Caverns & Chasms) < Echo (Create: Deep Dark)
// Recipes and tags: server_scripts/oowwo_top_tiers.js. Names: startup_scripts/oowwo_display_names.js.
// Fluid texture: kubejs/assets/oowwo/textures/block/fluid/molten_adamantite.png (+ .mcmeta).
// Startup script: needs a FULL restart (server and client). To revert: delete all three files.
//
// What this file does
//   1. Registers oowwo:molten_adamantite (blast furnace / casting only, no bucket, no block).
//   2. Durability: tools and armour are set so each tier outlasts the one below it
//      (steel values come from oowwo_tier_rebalance.js: tools 2750, armour 663/828/795/729).
//   3. Sword damage: necromium 7 -> 9.5, echo 8 -> 11 (adamantite keeps its own 8.5).
//      setAttackDamage takes the modifier; the tooltip shows 1 + modifier.
//   4. Armour: protection/toughness/knockback bonuses are ADDED on top of each item's own modifiers through
//      NeoForge's ItemAttributeModifierEvent, so C&C's Slowness Retribution and echo's set effect are untouched.
//      Runs on both sides (startup script), so tooltips match the server.

StartupEvents.registry('fluid', function (event) {
  event.create('oowwo:molten_adamantite')
    .displayName('Molten Adamantite')
    .tint(0xFFFFFF)   // colour is in the texture (Wayfarer molten iron recoloured to the adamantite ingot palette)
    .stillTexture('oowwo:block/fluid/molten_adamantite')
    .flowingTexture('oowwo:block/fluid/molten_adamantite')
    .noBucket()
    .noBlock()
})

var OTT_TOOLS = {
  adamantite: { dur: 3000, ids: ['dwarfs_tyranny:mythril_sword', 'dwarfs_tyranny:mythril_pickaxe', 'dwarfs_tyranny:mythril_axe',
    'dwarfs_tyranny:mythril_shovel', 'dwarfs_tyranny:mythril_hoe'] },
  necromium: { dur: 3300, ids: ['caverns_and_chasms:necromium_sword', 'caverns_and_chasms:necromium_pickaxe',
    'caverns_and_chasms:necromium_axe', 'caverns_and_chasms:necromium_shovel', 'caverns_and_chasms:necromium_hoe'] },
  echo: { dur: 3600, ids: ['create_deep_dark:echo_sword'] }
}
// helmet, chestplate, leggings, boots
var OTT_ARMOR_DUR = {
  adamantite: [730, 910, 875, 800],
  necromium: [800, 1000, 960, 880],
  echo: [880, 1100, 1050, 970]
}
var OTT_ARMOR_IDS = {
  adamantite: ['dwarfs_tyranny:mythril_armor_helmet', 'dwarfs_tyranny:mythril_armor_chestplate',
    'dwarfs_tyranny:mythril_armor_leggings', 'dwarfs_tyranny:mythril_armor_boots'],
  necromium: ['caverns_and_chasms:necromium_helmet', 'caverns_and_chasms:necromium_chestplate',
    'caverns_and_chasms:necromium_leggings', 'caverns_and_chasms:necromium_boots'],
  echo: ['create_deep_dark:echo_armor_helmet', 'create_deep_dark:echo_armor_chestplate',
    'create_deep_dark:echo_armor_leggings', 'create_deep_dark:echo_armor_boots']
}
// sword damage modifier (tooltip = 1 + value)
var OTT_SWORD_DMG = {
  'caverns_and_chasms:necromium_sword': 8.5,
  'create_deep_dark:echo_sword': 10.0
}

ItemEvents.modification(function (event) {
  var n = 0
  Object.keys(OTT_TOOLS).forEach(function (t) {
    OTT_TOOLS[t].ids.forEach(function (id) {
      try { event.modify(id, function (item) { item.setMaxDamage(OTT_TOOLS[t].dur) }); n++ }
      catch (e) { console.error('[oowwo_top_tiers] durability ' + id + ': ' + e) }
    })
  })
  Object.keys(OTT_ARMOR_IDS).forEach(function (t) {
    OTT_ARMOR_IDS[t].forEach(function (id, i) {
      try { event.modify(id, function (item) { item.setMaxDamage(OTT_ARMOR_DUR[t][i]) }); n++ }
      catch (e) { console.error('[oowwo_top_tiers] durability ' + id + ': ' + e) }
    })
  })
  Object.keys(OTT_SWORD_DMG).forEach(function (id) {
    try { event.modify(id, function (item) { item.setAttackDamage(OTT_SWORD_DMG[id]) }); n++ }
    catch (e) { console.error('[oowwo_top_tiers] damage ' + id + ': ' + e) }
  })
  console.info('[oowwo_top_tiers] applied ' + n + ' item modifications')
})

// ---- armour bonuses, added on top of the item's own modifiers ----
// per piece: [protection, toughness, knockback resistance] ADDED
var OTT_ARMOR_BONUS = {}
OTT_ARMOR_IDS.necromium.forEach(function (id) { OTT_ARMOR_BONUS[id] = [0, 1.5, 0.1] })   // toughness 2 -> 3.5, KB 0 -> 0.1
OTT_ARMOR_IDS.echo.forEach(function (id) { OTT_ARMOR_BONUS[id] = [1, 1.5, 0] })        // protection +1 each, toughness 3 -> 4.5

var OTT_AttrEvent = Java.loadClass('net.neoforged.neoforge.event.ItemAttributeModifierEvent')
var OTT_Attributes = Java.loadClass('net.minecraft.world.entity.ai.attributes.Attributes')
var OTT_Modifier = Java.loadClass('net.minecraft.world.entity.ai.attributes.AttributeModifier')
var OTT_Operation = Java.loadClass('net.minecraft.world.entity.ai.attributes.AttributeModifier$Operation')
var OTT_SlotGroup = Java.loadClass('net.minecraft.world.entity.EquipmentSlotGroup')
var OTT_RL = Java.loadClass('net.minecraft.resources.ResourceLocation')
var OTT_BuiltIn = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')

var OTT_SLOTS = [['head', OTT_SlotGroup.HEAD], ['chest', OTT_SlotGroup.CHEST], ['legs', OTT_SlotGroup.LEGS], ['feet', OTT_SlotGroup.FEET]]
var OTT_ERR_LOGGED = false
var OTT_MODS = {}   // item id -> [[attribute, modifier, slotGroup], ...], built once
Object.keys(OTT_ARMOR_BONUS).forEach(function (id) {
  var tier = id.indexOf('necromium') >= 0 ? 'necromium' : 'echo'
  var idx = OTT_ARMOR_IDS[tier].indexOf(id)
  var slot = OTT_SLOTS[idx]
  var b = OTT_ARMOR_BONUS[id]
  var list = []
  var add = function (attr, name, amount) {
    if (amount === 0) return
    list.push([attr, new OTT_Modifier(OTT_RL.parse('oowwo:top_tier_' + name + '_' + slot[0]), amount, OTT_Operation.ADD_VALUE), slot[1]])
  }
  add(OTT_Attributes.ARMOR, 'armor', b[0])
  add(OTT_Attributes.ARMOR_TOUGHNESS, 'toughness', b[1])
  add(OTT_Attributes.KNOCKBACK_RESISTANCE, 'knockback', b[2])
  OTT_MODS[id] = list
})

NativeEvents.onEvent(OTT_AttrEvent, function (event) {
  try {
    var stack = event.getItemStack()
    if (stack.isEmpty()) return
    var list = OTT_MODS[String(OTT_BuiltIn.ITEM.getKey(stack.getItem()))]
    if (!list) return
    for (var i = 0; i < list.length; i++) event.addModifier(list[i][0], list[i][1], list[i][2])
  } catch (e) {
    if (!OTT_ERR_LOGGED) { OTT_ERR_LOGGED = true; console.error('[oowwo_top_tiers] armour bonus (logged once): ' + e) }
  }
})
