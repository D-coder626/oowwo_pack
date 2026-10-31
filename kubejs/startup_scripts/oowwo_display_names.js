// oowwo: display names that a resource pack / KubeJS lang can't override (mod lang files load above KubeJS's) (Derek, 2026-10-31).
//   Dwarfs Tyranny 'Mythril' -> 'Adamantite', Eidolon 'Crucible' -> 'Alchemical Cauldron' (vs Wayfarer's Crucible).
// Items: the item_name component is replaced (shows in inventories, EMI, tooltips, chat; existing stacks included).
// Placed blocks (Jade etc.): the block's name key points at a new oowwo.* key, defined in client_scripts/oowwo_display_names_lang.js.
// IDs are unchanged. Startup script: full restart of server and client. To revert: delete both files.
var ODN_Component = Java.loadClass('net.minecraft.network.chat.Component')
var ODN_ITEMS = {
  "dwarfs_tyranny:mythril_ore": "Adamantite Ore",
  "dwarfs_tyranny:raw_mythril": "Raw Adamantite",
  "dwarfs_tyranny:mythril_ingot": "Adamantite Ingot",
  "dwarfs_tyranny:mythril_armor_helmet": "Adamantite Helmet",
  "dwarfs_tyranny:mythril_armor_chestplate": "Adamantite Chestplate",
  "dwarfs_tyranny:mythril_armor_leggings": "Adamantite Leggings",
  "dwarfs_tyranny:mythril_armor_boots": "Adamantite Boots",
  "dwarfs_tyranny:mythril_pickaxe": "Adamantite Pickaxe",
  "dwarfs_tyranny:mythril_axe": "Adamantite Axe",
  "dwarfs_tyranny:mythril_sword": "Adamantite Sword",
  "dwarfs_tyranny:mythril_shovel": "Adamantite Shovel",
  "dwarfs_tyranny:mythril_hoe": "Adamantite Hoe",
  "dwarfs_tyranny:mythril_block": "Adamantite Block",
  "dwarfs_tyranny:mythril_nugget": "Adamantite Nugget",
  "dwarfs_tyranny:mythril_raw_block": "Block of Raw Adamantite",
  "dwarfs_tyranny:mythril_pipe": "Adamantite Pipe",
  "dwarfs_tyranny:mythril_furnace": "Adamantite Furnace",
  "dwarfs_tyranny:mythril_tank": "Adamantite Tank",
  "eidolon_repraised:crucible": "Alchemical Cauldron"
}
var ODN_BLOCKS = {
  "dwarfs_tyranny:mythril_ore": "oowwo.name.mythril_ore",
  "dwarfs_tyranny:mythril_block": "oowwo.name.mythril_block",
  "dwarfs_tyranny:mythril_raw_block": "oowwo.name.mythril_raw_block",
  "dwarfs_tyranny:mythril_pipe": "oowwo.name.mythril_pipe",
  "dwarfs_tyranny:mythril_furnace": "oowwo.name.mythril_furnace",
  "dwarfs_tyranny:mythril_tank": "oowwo.name.mythril_tank",
  "eidolon_repraised:crucible": "oowwo.name.crucible"
}

ItemEvents.modification(function (event) {
  var n = 0
  Object.keys(ODN_ITEMS).forEach(function (id) {
    try { event.modify(id, function (item) { item.setItemName(ODN_Component.literal(ODN_ITEMS[id])) }); n++ }
    catch (e) { console.error('[oowwo_display_names] item ' + id + ': ' + e) }
  })
  console.info('[oowwo_display_names] renamed ' + n + ' items')
})

BlockEvents.modification(function (event) {
  var n = 0
  Object.keys(ODN_BLOCKS).forEach(function (id) {
    try { event.modify(id, function (block) { block.setNameKey(ODN_BLOCKS[id]) }); n++ }
    catch (e) { console.error('[oowwo_display_names] block ' + id + ': ' + e) }
  })
  console.info('[oowwo_display_names] renamed ' + n + ' blocks')
})
