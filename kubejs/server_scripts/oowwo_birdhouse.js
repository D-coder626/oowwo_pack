// --- COURIER OWLS BIRD HOUSE: STRIPPED LOGS TOO (2026-10-14) ---
// The base recipe (kubejs/data/courier_owls/recipe/bird_house_oak.json) is slabs on top + logs around the ring;
// Moonlight copies it for every other wood at load. That data route only carries ONE log item per wood, so this
// script adds a second recipe per wood that takes the STRIPPED log instead (3 slabs + 5 stripped logs).
// Woods are discovered from the registry: courier_owls:[<mod>/]bird_house_<wood> -> <mod>:<wood>_slab and
// <mod>:stripped_<wood>_log | _stem | _block. Woods whose items can't be found are listed in the server log.
// Recipe ids: oowwo:birdhouse_stripped/<mod>_<wood>. To revert: delete this file.

const $BH_REG = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
const $BH_RL = Java.loadClass('net.minecraft.resources.ResourceLocation')

ServerEvents.recipes(event => {
  var has = id => { try { return $BH_REG.ITEM.containsKey($BH_RL.parse(id)) } catch (e) { return false } }
  var made = [], skipped = []
  var keys = $BH_REG.ITEM.keySet().toArray()
  for (var i = 0; i < keys.length; i++) {
    var rl = String(keys[i].toString())
    if (rl.indexOf('courier_owls:') !== 0) continue
    var path = rl.substring('courier_owls:'.length)
    var m = path.match(/^(?:(.+)\/)?bird_house_(.+)$/)
    if (!m) continue
    var mod = m[1] ? m[1] : 'minecraft'
    var wood = m[2]
    var slab = mod + ':' + wood + '_slab'
    var stripped = null
    var cands = ['stripped_' + wood + '_log', 'stripped_' + wood + '_stem', 'stripped_' + wood + '_block']
    for (var c = 0; c < cands.length && !stripped; c++) { if (has(mod + ':' + cands[c])) stripped = mod + ':' + cands[c] }
    if (!has(slab) || !stripped) { skipped.push(rl); continue }
    try {
      event.shaped(rl, ['SSS', 'P P', 'PPP'], { S: slab, P: stripped }).id('oowwo:birdhouse_stripped/' + mod + '_' + wood)
      made.push(rl)
    } catch (e) {
      skipped.push(rl + ' (' + e + ')')
    }
  }
  console.log('[oowwo_birdhouse] stripped-log recipes added: ' + made.length)
  if (skipped.length) console.log('[oowwo_birdhouse] no stripped log / slab found for: ' + skipped.join(', '))
});
