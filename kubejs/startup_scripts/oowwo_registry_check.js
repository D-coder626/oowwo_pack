// oowwo_registry_check.js — TEMPORARY diagnostic, 2026-10-29. Delete once the join failure is understood.
// Join failures say "The server send registries with unknown keys: create:<item>" with a DIFFERENT Create item per client
// launch (basin, mechanical_press, tree_fertilizer, sand_paper, package_filter), and only a client restart clears it.
// NeoForge raises that when the client's item registry answers containsKey(key) = false for a key the server has.
// This checks, right after startup, whether every registered item/block can actually be found by key (the lookup the
// join uses), and logs the size of each internal map. A mismatch means the registry's key map was damaged at startup.
var ORC_BIR = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
var ORC_Key = Java.loadClass('net.minecraft.resources.ResourceKey')

function orcCheck(name, reg) {
  var missing = [], total = 0
  var it = reg.keySet().iterator()
  while (it.hasNext()) {
    var rl = it.next(); total++
    var key = ORC_Key.create(reg.key(), rl)
    // explicit overloads: Rhino can't pick between containsKey/get(ResourceKey) and (ResourceLocation)
    if (!reg['containsKey(net.minecraft.resources.ResourceKey)'](key) || reg['get(net.minecraft.resources.ResourceLocation)'](rl) == null) missing.push(String(rl))
  }
  var sizes = 'size=' + reg.size() + ' keySet=' + total + ' entrySet=' + reg.entrySet().size() + ' registryKeySet=' + reg.registryKeySet().size()
  if (missing.length) console.error('[oowwo_registry_check] ' + name + ' BROKEN: ' + missing.length + ' entries not findable by key: ' + missing.join(', ') + ' (' + sizes + ')')
  else console.info('[oowwo_registry_check] ' + name + ' OK (' + sizes + ')')
}

StartupEvents.postInit(event => {
  try { orcCheck('item', ORC_BIR.ITEM); orcCheck('block', ORC_BIR.BLOCK) } catch (e) { console.error('[oowwo_registry_check] ' + e) }
})
