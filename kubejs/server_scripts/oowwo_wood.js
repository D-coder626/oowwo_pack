// oowwo_wood.js — port of Wayfarer's building/wood.js (Wayfarer copy dated 2026-09-23).
//
// Wayfarer's idea: every sign, hanging sign and Supplementaries way sign needs scribing tools.
//   sign         ' PP' / ' XS'  -> 3   (P planks, X wayfarer_core:scribing_tools, S stick)
//   hanging sign ' XC' / ' PP'  -> 3   (C chain)
//   way sign     ' X ' / 'PPP'  -> 3
// and every other recipe that makes an item in #wayfarer:all_signs is removed (Farmer's Delight
// excepted; its canvas signs already get scribing recipes in oowwo_small_ports.js).
//
// Differences from Wayfarer, on purpose:
//   - Wayfarer lists 21 woods by hand (its mod set). oowwo has more wood mods, and Wayfarer's blanket
//     removal would leave their signs uncraftable. So the woods are DISCOVERED from the pack's own sign
//     recipes: every original crafting recipe that makes a #minecraft:signs item tells us its planks.
//     Hanging signs and way signs take the planks of the matching sign.
//   - Removal is per item, and only for signs that received a scribing recipe. Anything that could not
//     be matched keeps its original recipe and is listed in logs/kubejs/server.log
//     ("[oowwo_wood] kept original recipe").
//   - SKIPPED (mods not in oowwo): Another Furniture tables/shutters/flower box, Every Compat furniture
//     and driftwood blocks, Envelope pigeonhole.
//   - Driftwood cannon boat + sled: added only if both items exist.
//   - var, not const/let, inside callbacks (Rhino 'redeclaration' error seen in oowwo_seed_pots v1).
//
// KubeJS fact (read from the 2101.7.2 jar): event.remove() only searches the pack's ORIGINAL recipes,
// never recipes added by scripts, so the new scribing recipes cannot remove themselves.
// Recipe ids: oowwo:wood/<item path>. To revert: delete this file.

const $BuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
const $ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')

ServerEvents.tags('item', event => {
  event.add('wayfarer:all_signs', ['#minecraft:signs', '#minecraft:hanging_signs', '#supplementaries:way_signs'])
})

ServerEvents.recipes(event => {
  var TOOLS = 'wayfarer_core:scribing_tools'
  var R = fn => { try { fn() } catch (e) { console.warn('[oowwo_wood] skipped: ' + e) } }
  var has = id => { try { return $BuiltInRegistries.ITEM.containsKey($ResourceLocation.parse(id)) } catch (e) { return false } }
  var rid = id => 'oowwo:wood/' + id.replace(':', '/')

  // ---- 1. discover: sign item -> planks ingredient, from the pack's own sign recipes
  var plankOf = {}          // 'mod:x_sign' -> 'mod:x_planks' or '#tag'
  var resultId = json => {
    if (!json || !json.has('result')) return null
    var r = json.get('result')
    if (!r) return null
    if (r.isJsonPrimitive()) return String(r.getAsString())
    var o = r.getAsJsonObject()
    var k = o.has('id') ? 'id' : (o.has('item') ? 'item' : null)
    return k ? String(o.get(k).getAsString()) : null
  }
  var ingOf = el => {
    if (!el || !el.isJsonObject()) return null   // arrays of alternatives: fall back to the name rule
    var o = el.getAsJsonObject()
    if (o.has('item')) return String(o.get('item').getAsString())
    if (o.has('tag')) return '#' + String(o.get('tag').getAsString())
    return null
  }
  event.forEachRecipe({ type: 'minecraft:crafting_shaped', output: '#minecraft:signs' }, r => {
    var json = r.json
    var out = resultId(json)
    if (!out || !json.has('pattern') || !json.has('key')) return
    var counts = {}
    var rows = json.getAsJsonArray('pattern')
    for (var i = 0; i < rows.size(); i++) {
      var row = String(rows.get(i).getAsString())
      for (var j = 0; j < row.length; j++) {
        var c = row.charAt(j)
        if (c !== ' ') counts[c] = (counts[c] || 0) + 1
      }
    }
    var best = null
    for (var k in counts) { if (best === null || counts[k] > counts[best]) best = k }
    var ing = best ? ingOf(json.getAsJsonObject('key').get(best)) : null
    if (ing && !plankOf[out]) plankOf[out] = ing
  })
  // name rule fallback: mod:x_sign -> mod:x_planks
  var planksFor = signId => {
    if (plankOf[signId]) return plankOf[signId]
    var guess = signId.replace(/_sign$/, '_planks')
    return has(guess) ? guess : null
  }

  // ---- 2. collect every sign-like item that currently has an original recipe
  var targets = {}   // item id -> 'sign' | 'hanging' | 'way'
  var collect = (tag, kind) => event.forEachRecipe({ output: tag }, r => {
    var out = resultId(r.json)
    if (out && !targets[out]) targets[out] = kind
  })
  collect('#minecraft:signs', 'sign')
  collect('#minecraft:hanging_signs', 'hanging')
  collect('#supplementaries:way_signs', 'way')

  // which ordinary sign does a hanging / way sign belong to?
  var signFor = (id, kind) => {
    if (kind === 'sign') return id
    if (kind === 'hanging') return id.replace(/_hanging_sign$/, '_sign')
    // supplementaries:way_sign_<wood>  or  supplementaries:<mod>/way_sign_<wood>
    var p = id.split(':')[1]
    var m = p.match(/^(?:(.+)\/)?way_sign_(.+)$/)
    if (!m) return null
    return (m[1] ? m[1] : 'minecraft') + ':' + m[2] + '_sign'
  }

  var made = [], kept = []
  Object.keys(targets).forEach(id => {
    if (id.split(':')[0] === 'farmersdelight') return
    var kind = targets[id]
    var sign = signFor(id, kind)
    var planks = sign ? planksFor(sign) : null
    if (!planks) { kept.push(id); return }
    var ok = true
    if (kind === 'sign') {
      R(() => event.shaped('3x ' + id, [' PP', ' XS', '   '], { X: TOOLS, S: 'minecraft:stick', P: planks }).id(rid(id)))
    } else if (kind === 'hanging') {
      R(() => event.shaped('3x ' + id, [' XC', ' PP', '   '], { X: TOOLS, C: 'minecraft:chain', P: planks }).id(rid(id)))
    } else if (kind === 'way') {
      R(() => event.shaped('3x ' + id, [' X ', 'PPP', '   '], { X: TOOLS, P: planks }).id(rid(id)))
    } else ok = false
    if (ok) { event.remove({ output: id, not: { mod: 'farmersdelight' } }); made.push(id) }
  })
  console.info('[oowwo_wood] scribing recipes for ' + made.length + ' signs')
  if (kept.length) console.info('[oowwo_wood] kept original recipe (no planks found) for: ' + kept.join(', '))

  // ---- 3. driftwood extras from Wayfarer, only if the items exist
  if (has('supplementaries:upgrade_aquatic/cannon_boat_driftwood') && has('upgrade_aquatic:driftwood_boat'))
    R(() => event.shapeless('supplementaries:upgrade_aquatic/cannon_boat_driftwood',
      ['supplementaries:cannon', 'upgrade_aquatic:driftwood_boat']).id('oowwo:wood/cannon_boat_driftwood'))
  if (has('snowyspirit:upgrade_aquatic/sled_driftwood'))
    R(() => event.shaped('snowyspirit:upgrade_aquatic/sled_driftwood', ['PPS', 'SSS'], {
      P: 'upgrade_aquatic:driftwood_planks', S: 'minecraft:stick' }).id('oowwo:wood/sled_driftwood'))
})
