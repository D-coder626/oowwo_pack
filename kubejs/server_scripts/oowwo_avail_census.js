// oowwo_avail_census.js — Task 5 availability census (read-only; delete when the audit is done).
// Dumps, from the LIVE game, every way an item can be obtained that data can describe:
//   recipes (outputs), loot tables (entries, tag entries, nested tables), global loot modifiers,
//   worldgen registries (blocks placed by features / noise / processors / modded registries),
//   structure templates (palette blocks, chest contents, loot-table refs), villager/wandering trades.
// USAGE:  /oowwo_avail all        (~5 s)   /oowwo_avail ingredients (v3)   /oowwo_avail glm   /oowwo_avail templates (slower; logs progress)
//         /oowwo_avail trades   (separate, runs villager trade listings with a dummy villager)
// OUTPUT: kubejs/oowwo_avail_<part>.json   (+ one summary line per part in logs/kubejs/server.log)
// Rhino rules: every loop variable is a function-scope var; every top-level name is prefixed OAV_/oav_.

var OAV_C = {}
try {
  OAV_C.BIR = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
  OAV_C.Registries = Java.loadClass('net.minecraft.core.registries.Registries')
  OAV_C.ResourceKey = Java.loadClass('net.minecraft.resources.ResourceKey')
  OAV_C.RL = Java.loadClass('net.minecraft.resources.ResourceLocation')
  OAV_C.TagKey = Java.loadClass('net.minecraft.tags.TagKey')
  OAV_C.Recipe = Java.loadClass('net.minecraft.world.item.crafting.Recipe')
  OAV_C.LootTable = Java.loadClass('net.minecraft.world.level.storage.loot.LootTable')
  OAV_C.CompoundTag = Java.loadClass('net.minecraft.nbt.CompoundTag')
  OAV_C.VillagerTrades = Java.loadClass('net.minecraft.world.entity.npc.VillagerTrades')
  OAV_C.EntityType = Java.loadClass('net.minecraft.world.entity.EntityType')
  OAV_C.RandomSource = Java.loadClass('net.minecraft.util.RandomSource')
} catch (e) { console.error('[oav] core class load failed: ' + e) }
try { OAV_C.JsonOps = Java.loadClass('com.mojang.serialization.JsonOps') } catch (e) { console.error('[oav] JsonOps blocked: ' + e) }
try { OAV_C.DPRH = Java.loadClass('net.neoforged.neoforge.registries.DataPackRegistriesHooks') } catch (e) { console.warn('[oav] DataPackRegistriesHooks: ' + e) }
try { OAV_C.RDL = Java.loadClass('net.minecraft.resources.RegistryDataLoader') } catch (e) { console.warn('[oav] RegistryDataLoader: ' + e) }
try { OAV_C.NFEH = Java.loadClass('net.neoforged.neoforge.common.NeoForgeEventHandler') } catch (e) { console.warn('[oav] NeoForgeEventHandler: ' + e) }
try { OAV_C.IGLM = Java.loadClass('net.neoforged.neoforge.common.loot.IGlobalLootModifier') } catch (e) { console.warn('[oav] IGlobalLootModifier: ' + e) }

var OAV_KNOWN = null      // id -> 'i' item, 'b' block, 'ib' both
var OAV_SKIP = { conditions: 1, predicate: 1, predicates: 1, term: 1, terms: 1, requirements: 1, match_tool: 1 }
var OAV_IDRE = /"([a-z0-9_.\-]+:[a-z0-9_.\-\/]+)"/g
var OAV_NAMERE = /"Name":"([a-z0-9_.\-]+:[a-z0-9_.\-\/]+)"/g

function oav_write(part, obj) {
  try { JsonIO.write('kubejs/oowwo_avail_' + part + '.json', obj); return true }
  catch (e) { console.error('[oav] JsonIO.write ' + part + ' failed: ' + e); return false }
}

function oav_known() {
  if (OAV_KNOWN) return OAV_KNOWN
  var k = {}, it, x, id
  it = OAV_C.BIR.ITEM.keySet().iterator()
  while (it.hasNext()) { k[String(it.next())] = 'i' }
  it = OAV_C.BIR.BLOCK.keySet().iterator()
  while (it.hasNext()) { id = String(it.next()); k[id] = k[id] ? 'ib' : 'b' }
  OAV_KNOWN = k
  return k
}

// collect known item/block ids, '#tag' for tag entries, '@table' for nested loot tables
function oav_collect(node, skipConds, out) {
  var i, key
  if (node === null || node === undefined) return
  if (typeof node === 'string') { if (OAV_KNOWN[node]) out[node] = 1; return }
  if (Array.isArray(node)) { for (i = 0; i < node.length; i++) oav_collect(node[i], skipConds, out); return }
  if (typeof node === 'object') {
    if (node.type === 'minecraft:tag' && typeof node.name === 'string') out['#' + node.name] = 1
    if (node.type === 'minecraft:loot_table' && typeof node.value === 'string') out['@' + node.value] = 1
    for (key in node) {
      if (skipConds && OAV_SKIP[key]) continue
      oav_collect(node[key], skipConds, out)
    }
  }
}

function oav_keys(o) { var a = [], k; for (k in o) a.push(k); return a }

function oav_regex(str, re, out) {
  var m
  re.lastIndex = 0
  while ((m = re.exec(str)) !== null) { if (OAV_KNOWN[m[1]]) out[m[1]] = 1 }
}

function oav_items(server) {
  var res = { items: [], block_item: {} }, it, b, bid, iid
  it = OAV_C.BIR.ITEM.keySet().iterator()
  while (it.hasNext()) res.items.push(String(it.next()))
  it = OAV_C.BIR.BLOCK.iterator()
  while (it.hasNext()) {
    b = it.next()
    try {
      bid = String(OAV_C.BIR.BLOCK.getKey(b)); iid = String(OAV_C.BIR.ITEM.getKey(b.asItem()))
      if (iid !== 'minecraft:air') res.block_item[bid] = iid
    } catch (e) { }
  }
  return res
}

function oav_recipes(server) {
  var ra = server.registryAccess(), ops = ra.createSerializationContext(OAV_C.JsonOps.INSTANCE)
  var res = {}, errs = 0, it, h, r, rid, type, outs, st, j, obj, key, all, n = 0
  it = server.getRecipeManager().getRecipes().iterator()
  while (it.hasNext()) {
    h = it.next(); n++
    rid = String(h.id()); r = h.value(); outs = {}; type = '?'
    try { type = String(OAV_C.BIR.RECIPE_TYPE.getKey(r.getType())) } catch (e) { }
    try { st = r.getResultItem(ra); if (st && !st.isEmpty()) outs[String(OAV_C.BIR.ITEM.getKey(st.getItem()))] = 1 } catch (e) { }
    try {
      j = OAV_C.Recipe.CODEC.encodeStart(ops, r).result()
      if (j.isPresent()) {
        obj = JSON.parse(String(j.get().toString()))
        for (key in obj) { if (/result|output|product/i.test(key)) oav_collect(obj[key], false, outs) }
        if (oav_keys(outs).length === 0) { all = {}; oav_collect(obj, false, all); res[rid] = { t: type, o: [], all: oav_keys(all) }; continue }
      }
    } catch (e) { errs++ }
    res[rid] = { t: type, o: oav_keys(outs) }
  }
  console.info('[oav] recipes=' + n + ' codec_errors=' + errs)
  return res
}

// KubeJS hides Ingredient.getItems(); its own IngredientKJS methods are tried in order
function oav_ingIds(ing) {
  var out = [], seen = {}, it, x, arr, k
  function add(id) { id = String(id); if (id && id !== 'minecraft:air' && !seen[id]) { seen[id] = 1; out.push(id) } }
  try { it = ing.getItemIds().iterator(); while (it.hasNext()) add(it.next()); return out } catch (e) { }
  try { arr = ing.getStackArray(); for (k = 0; k < arr.length; k++) add(OAV_C.BIR.ITEM.getKey(arr[k].getItem())); return out } catch (e) { }
  try { it = ing.getStacks().iterator(); while (it.hasNext()) { x = it.next(); add(OAV_C.BIR.ITEM.getKey(x.getItem())) } return out } catch (e) { }
  throw 'no ingredient accessor'
}

function oav_ingredients(server) {
  // per recipe: list of ingredient groups (alternatives), via Recipe.getIngredients() -> Ingredient.getItems().
  // groups are interned: res.groups[i] = [ids]; res.recipes[rid] = { t: type, g: [groupIdx...] } ; n=-1 means getIngredients failed
  var res = { groups: [], recipes: {} }, gidx = {}, it, h, r, rid, type, ings, i, k, ing, stacks, ids, key, gl, n = 0, errs = 0, seen
  it = server.getRecipeManager().getRecipes().iterator()
  while (it.hasNext()) {
    h = it.next(); n++
    rid = String(h.id()); r = h.value(); type = '?'; gl = []
    try { type = String(OAV_C.BIR.RECIPE_TYPE.getKey(r.getType())) } catch (e) { }
    try {
      ings = r.getIngredients()
      for (i = 0; i < ings.size(); i++) {
        ing = ings.get(i)
        ids = oav_ingIds(ing)
        if (ids.length === 0) continue
        ids.sort()
        key = ids.join(',')
        if (gidx[key] === undefined) { gidx[key] = res.groups.length; res.groups.push(ids) }
        gl.push(gidx[key])
      }
      res.recipes[rid] = { t: type, g: gl }
    } catch (e) { errs++; res.recipes[rid] = { t: type, g: -1, e: '' + e } }
  }
  console.info('[oav] ingredients recipes=' + n + ' groups=' + res.groups.length + ' errors=' + errs)
  return res
}

function oav_loot(server) {
  var ra = server.registryAccess(), ops = ra.createSerializationContext(OAV_C.JsonOps.INSTANCE)
  var holder = server.reloadableRegistries(), res = {}, tags = {}, errs = 0, it, rl, tbl, j, out, k, n = 0
  it = holder.getKeys(OAV_C.Registries.LOOT_TABLE).iterator()
  while (it.hasNext()) {
    rl = it.next(); n++; out = {}
    try {
      tbl = holder.getLootTable(OAV_C.ResourceKey.create(OAV_C.Registries.LOOT_TABLE, rl))
      j = OAV_C.LootTable.DIRECT_CODEC.encodeStart(ops, tbl).result()
      if (j.isPresent()) oav_collect(JSON.parse(String(j.get().toString())), true, out)
    } catch (e) { errs++; out['!err'] = 1 }
    res[String(rl)] = oav_keys(out)
    for (k in out) if (k.charAt(0) === '#') tags[k.substring(1)] = 1
  }
  console.info('[oav] loot tables=' + n + ' errors=' + errs)
  return { tables: res, tags: oav_tags(tags) }
}

function oav_tags(tagSet) {
  var res = {}, t, it, list
  for (t in tagSet) {
    list = []
    try {
      it = OAV_C.BIR.ITEM.getTagOrEmpty(OAV_C.TagKey.create(OAV_C.Registries.ITEM, OAV_C.RL.parse(t))).iterator()
      while (it.hasNext()) list.push(String(it.next().unwrapKey().get().location()))
    } catch (e) { list.push('!err ' + e) }
    res[t] = list
  }
  return res
}

function oav_glm(server) {
  // Not available: the resource-manager map has ResourceLocation keys and Rhino's NativeJavaMap property lookup
  // calls TreeMap.containsKey(String) -> ClassCastException that escapes try/catch (2026-10-04). GLMs are checked from jars instead.
  return ['unsupported']
}

var OAV_WG_SKIP = { 'minecraft:worldgen/biome': 1, 'minecraft:worldgen/placed_feature': 1, 'minecraft:worldgen/template_pool': 1,
  'minecraft:worldgen/world_preset': 1, 'minecraft:dimension_type': 1, 'minecraft:worldgen/structure_set': 1 }

function oav_world(server) {
  var ra = server.registryAccess(), ops = ra.createSerializationContext(OAV_C.JsonOps.INSTANCE)
  var res = {}, list, i, rd, key, reg, codec, it, en, j, s, strong, weak, errs = 0, regName
  try { list = OAV_C.DPRH.getDataPackRegistries() } catch (e) { list = OAV_C.RDL.WORLDGEN_REGISTRIES }
  for (i = 0; i < list.size(); i++) {
    rd = list.get(i); key = rd.key(); regName = String(key.location())
    if (OAV_WG_SKIP[regName]) continue
    try { reg = ra.registryOrThrow(key) } catch (e) { continue }
    codec = rd.elementCodec()
    it = reg.entrySet().iterator()
    while (it.hasNext()) {
      en = it.next(); strong = {}; weak = {}
      try {
        j = codec.encodeStart(ops, en.getValue()).result()
        if (!j.isPresent()) continue
        s = String(j.get().toString())
        oav_regex(s, OAV_NAMERE, strong)
        oav_regex(s, OAV_IDRE, weak)
      } catch (e) { errs++; continue }
      if (oav_keys(weak).length) res[regName + '|' + String(en.getKey().location())] = { s: oav_keys(strong), w: oav_keys(weak) }
    }
  }
  console.info('[oav] worldgen entries with ids=' + oav_keys(res).length + ' errors=' + errs)
  return res
}

function oav_templates(server) {
  // reads the template NBT directly (no SNBT/regex: Rhino regex on whole templates took minutes)
  var mgr = server.getStructureManager(), res = {}, it, rl, opt, nbt, out, n = 0, errs = 0, t0 = Date.now()
  var pal, pals, i, k, blocks, c, bn, items, lt, ents, en
  function addId(id) { if (id && OAV_KNOWN[id]) out[id] = 1 }
  function addPalette(list) { var q; for (q = 0; q < list.size(); q++) addId(String(list.getCompound(q).getString('Name'))) }
  it = mgr.listTemplates().iterator()
  while (it.hasNext()) {
    rl = it.next(); n++; out = {}
    if (n % 500 === 0) console.info('[oav] templates progress ' + n + ' (' + (Date.now() - t0) + ' ms)')
    try {
      opt = mgr.get(rl)
      if (!opt.isPresent()) continue
      nbt = opt.get().save(new OAV_C.CompoundTag())
      if (nbt.contains('palette')) addPalette(nbt.getList('palette', 10))
      if (nbt.contains('palettes')) { pals = nbt.getList('palettes', 9); for (i = 0; i < pals.size(); i++) addPalette(pals.getList(i)) }
      blocks = nbt.getList('blocks', 10)
      for (i = 0; i < blocks.size(); i++) {
        c = blocks.getCompound(i)
        if (!c.contains('nbt')) continue
        bn = c.getCompound('nbt')
        if (bn.contains('Items')) { items = bn.getList('Items', 10); for (k = 0; k < items.size(); k++) addId(String(items.getCompound(k).getString('id'))) }
        if (bn.contains('item')) addId(String(bn.getCompound('item').getString('id')))
        if (bn.contains('LootTable')) { lt = String(bn.getString('LootTable')); if (lt) out['@' + lt] = 1 }
      }
      ents = nbt.getList('entities', 10)
      for (i = 0; i < ents.size(); i++) {
        en = ents.getCompound(i).getCompound('nbt')
        if (en.contains('Item')) addId(String(en.getCompound('Item').getString('id')))
        if (en.contains('id')) out['%' + String(en.getString('id'))] = 1
      }
    } catch (e) { errs++; out['!err ' + e] = 1 }
    if (oav_keys(out).length) res[String(rl)] = oav_keys(out)
  }
  console.info('[oav] templates=' + n + ' errors=' + errs)
  return res
}

function oav_trades(server) {
  var level = server.overworld(), vil = OAV_C.EntityType.VILLAGER.create(level), rnd = OAV_C.RandomSource.create(4242)
  var res = {}, types = [], it, en, prof, lvIt, lv, arr, i, li, cname, key, out, s, t, offer, skipped = 0, errs = 0
  it = OAV_C.BIR.VILLAGER_TYPE.iterator(); while (it.hasNext()) types.push(it.next())
  function sample(listing, key) {
    out = {}
    for (t = 0; t < types.length; t++) {
      try { vil.setVillagerData(vil.getVillagerData().setType(types[t])) } catch (e) { }
      for (s = 0; s < 3; s++) {
        try {
          offer = listing.getOffer(vil, rnd)
          if (offer) {
            out[String(OAV_C.BIR.ITEM.getKey(offer.getResult().getItem()))] = 1
          }
        } catch (e) { errs++ }
      }
    }
    res[key] = oav_keys(out)
  }
  it = OAV_C.VillagerTrades.TRADES.entrySet().iterator()
  while (it.hasNext()) {
    en = it.next(); prof = String(en.getKey())
    try { prof = String(OAV_C.BIR.VILLAGER_PROFESSION.getKey(en.getKey())) } catch (e) { }
    try { vil.setVillagerData(vil.getVillagerData().setProfession(en.getKey())) } catch (e) { }
    for (lv = 1; lv <= 5; lv++) {
      arr = null
      try { arr = en.getValue()[lv] } catch (e) { }
      if (!arr) continue
      for (i = 0; i < arr.length; i++) {
        li = arr[i]; cname = ''
        try { cname = String(li.getClass().getName()) } catch (e) { }
        key = prof + '|' + lv + '|' + i + '|' + cname
        if (/Map/.test(cname)) { skipped++; res[key] = ['!skipped-map']; continue }
        sample(li, key)
      }
    }
  }
  try {
    for (lv = 1; lv <= 3; lv++) {
      arr = null
      try { arr = OAV_C.VillagerTrades.WANDERING_TRADER_TRADES[lv] } catch (e) { }
      if (!arr) continue
      for (i = 0; i < arr.length; i++) {
        li = arr[i]; cname = ''
        try { cname = String(li.getClass().getName()) } catch (e) { }
        key = 'wandering|' + lv + '|' + i + '|' + cname
        if (/Map/.test(cname)) { skipped++; res[key] = ['!skipped-map']; continue }
        sample(li, key)
      }
    }
  } catch (e) { res['!wandering'] = ['' + e] }
  console.info('[oav] trades listings=' + oav_keys(res).length + ' skipped_maps=' + skipped + ' errors=' + errs)
  return res
}

ServerEvents.commandRegistry(function (event) {
  var Commands = event.commands
  function run(ctx, parts) {
    var server = ctx.source.getServer(), p, t0, data, ok
    function say(m) { try { ctx.source.sendSystemMessage(Text.of(m)) } catch (e) { console.info(m) } }
    oav_known()
    for (p = 0; p < parts.length; p++) {
      t0 = Date.now(); data = null
      try {
        if (parts[p] === 'items') data = oav_items(server)
        if (parts[p] === 'recipes') data = oav_recipes(server)
        if (parts[p] === 'ingredients') data = oav_ingredients(server)
        if (parts[p] === 'loot') data = oav_loot(server)
        if (parts[p] === 'glm') data = oav_glm(server)
        if (parts[p] === 'world') data = oav_world(server)
        if (parts[p] === 'templates') data = oav_templates(server)
        if (parts[p] === 'trades') data = oav_trades(server)
        ok = oav_write(parts[p], data)
        say('§a[oav] ' + parts[p] + ' done in ' + (Date.now() - t0) + ' ms, file=' + ok)
        console.info('[oav] ' + parts[p] + ' done in ' + (Date.now() - t0) + ' ms, file=' + ok)
      } catch (e) {
        say('§c[oav] ' + parts[p] + ' FAILED: ' + e)
        console.error('[oav] ' + parts[p] + ' FAILED: ' + e)
      }
    }
    return 1
  }
  event.register(Commands.literal('oowwo_avail')
    .then(Commands.literal('all').executes(function (ctx) { return run(ctx, ['items', 'recipes', 'loot', 'glm', 'world']) }))
    .then(Commands.literal('ingredients').executes(function (ctx) { return run(ctx, ['ingredients']) }))
    .then(Commands.literal('glm').executes(function (ctx) { return run(ctx, ['glm']) }))
    .then(Commands.literal('templates').executes(function (ctx) { return run(ctx, ['templates']) }))
    .then(Commands.literal('trades').executes(function (ctx) { return run(ctx, ['trades']) })))
})
