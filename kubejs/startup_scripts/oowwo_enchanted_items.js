// oowwo: replacements for the Enchanted items the pack used (2026-10-29, Enchanted removed). Startup script: full restart.
// Recipes: server_scripts/oowwo_enchanted_replacements.js (Brewin' and Chewin' keg + distillery, crafting, smelting).
// Textures are tinted vanilla ones (no custom art yet).
var OEI_ITEMS = [
  // [id, name, texture, tint, tooltip, glow]
  ['moonlit_wash', 'Moonlit Wash', 'minecraft:item/honey_bottle', 0xB8C8F0, 'Distill into a Goddess Tear.', false],
  ['ender_wash', 'Ender Wash', 'minecraft:item/honey_bottle', 0x2E8B76, 'Distill into Ender Dew.', false],
  ['arcane_wash', 'Arcane Wash', 'minecraft:item/honey_bottle', 0x9B6BE0, 'Distill into Arcane Spirit.', false],
  ['pine_wash', 'Pine Wash', 'minecraft:item/honey_bottle', 0x5E8C3A, 'Distill into Rebirth Spirit.', false],
  ['goddess_tear', 'Goddess Tear', 'minecraft:item/ghast_tear', 0x9FC7FF, 'Moonlight, distilled.', false],
  ['ender_dew', 'Ender Dew', 'minecraft:item/ghast_tear', 0x3FAE8E, null, false],
  ['quicklime', 'Quicklime', 'minecraft:item/sugar', 0xFFFFFF, null, false],
  ['arcane_spirit', 'Arcane Spirit', 'minecraft:item/experience_bottle', 0xA070FF, null, false],
  ['rebirth_spirit', 'Rebirth Spirit', 'minecraft:item/experience_bottle', 0x6BBF59, null, false],
  ['attuned_stone', 'Attuned Stone', 'minecraft:item/echo_shard', 0xB070FF, null, false],
  ['charged_attuned_stone', 'Charged Attuned Stone', 'minecraft:item/echo_shard', 0xFF7070, null, true],
  ['ritual_chalk', 'Ritual Chalk', 'minecraft:item/clay_ball', 0xF2F0E8, null, false]
]

StartupEvents.registry('item', function (event) {
  for (var i = 0; i < OEI_ITEMS.length; i++) {
    var d = OEI_ITEMS[i]
    var b = event.create('oowwo:' + d[0]).displayName(d[1]).texture(d[2])
    try { if (d[3] !== 0xFFFFFF) b.color(0, d[3]) } catch (e) { console.warn('[oowwo_enchanted_items] tint ' + d[0] + ': ' + e) }
    if (d[4]) b.tooltip(d[4])
    if (d[5]) b.glow(true)
  }
})
