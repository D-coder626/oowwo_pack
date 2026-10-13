// oowwo skill trees, Arcane: Alchemy path (2026-10-04). Separate file so an error here can't affect the other skill scripts.
// XP (Arcane): brewing potions, drinking a potion type for the first time, hitting with a Toxony oil-coated weapon.
// Hooks read from the jars: NeoForge MobEffectEvent$Applicable (Result.DO_NOT_APPLY) / $Added; Toxony OilUtil.OIL_USES component;
// vanilla BrewingStandBlockEntity.serverTick; Ars "wixie" perk = Potion Duration (node rewards, not scripted here).
// KubeJS 2101 remaps respected (getActual, getUuid, e.level, getTime); every handler wrapped in safe().

function safe(name, fn) {
  return function (e) {
    try { fn(e) } catch (err) { console.error('[oowwo_skills_alchemy] ' + name + ': ' + err) }
  }
}
function tryLoad(cls) { try { return Java.loadClass(cls) } catch (err) { console.warn('[oowwo_skills_alchemy] missing class ' + cls); return null } }

var BuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
var ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')
var ServerPlayer = Java.loadClass('net.minecraft.server.level.ServerPlayer')
var BlockPos = Java.loadClass('net.minecraft.core.BlockPos')
var DataComponents = Java.loadClass('net.minecraft.core.component.DataComponents')
var MobEffectCategory = Java.loadClass('net.minecraft.world.effect.MobEffectCategory')
var BrewingStandBE = Java.loadClass('net.minecraft.world.level.block.entity.BrewingStandBlockEntity')
var EffectApplicable = Java.loadClass('net.neoforged.neoforge.event.entity.living.MobEffectEvent$Applicable')
var ApplicableResult = Java.loadClass('net.neoforged.neoforge.event.entity.living.MobEffectEvent$Applicable$Result')
var EffectAdded = Java.loadClass('net.neoforged.neoforge.event.entity.living.MobEffectEvent$Added')
var UseItemStart = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingEntityUseItemEvent$Start')
var UseItemFinish = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingEntityUseItemEvent$Finish')
var LivingDamagePre = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingDamageEvent$Pre')
var BrewedPotion = tryLoad('net.neoforged.neoforge.event.brewing.PlayerBrewedPotionEvent')
var OilUtil = tryLoad('xyz.yfrostyf.toxony.api.util.OilUtil')
var JInteger = Java.loadClass('java.lang.Integer')

var CATEGORY = 'oowwo:arcane'
function hasTag(p, t) { return p.getTags().contains(t) }
function isPlayer(e) { return e != null && (e instanceof ServerPlayer) }
function debug(p, msg) { if (hasTag(p, 'oowwo_debug')) p.tell('[skills] ' + msg) }
function now(p) { return p.level.getTime() }
function itemId(stack) { return String(BuiltInRegistries.ITEM.getKey(stack.getItem())) }
function effId(holder) { var k = holder.unwrapKey(); return k.isPresent() ? String(k.get().location()) : '' }
function isHarmful(holder) { return holder.value().getCategory().equals(MobEffectCategory.HARMFUL) }
function isBeneficial(holder) { return holder.value().getCategory().equals(MobEffectCategory.BENEFICIAL) }

var BUDGET = {}
function budget(p, key, amount, max, windowTicks) {
  var k = String(p.getUuid()) + key, t = now(p), b = BUDGET[k]
  if (b == null || t - b.start >= windowTicks) { b = { start: t, used: 0 }; BUDGET[k] = b }
  var allowed = Math.max(0, Math.min(amount, max - b.used)); b.used += allowed; return allowed
}
function giveXp(p, amount, why) {
  amount = Math.floor(amount); if (amount <= 0) return
  p.getServer().runCommandSilent('puffish_skills experience add ' + p.getScoreboardName() + ' ' + CATEGORY + ' ' + amount)
  debug(p, why + ': +' + amount + ' Arcane XP')
}
function pdata(p) {
  var pd = p.getServer().persistentData, root = pd.getCompound('oowwo_alchemy'), uuid = String(p.getUuid())
  return { get: function () { return root.getCompound(uuid) }, save: function (mine) { root.put(uuid, mine); pd.put('oowwo_alchemy', root) } }
}
function potionContents(stack) { return (stack == null || stack.isEmpty()) ? null : stack.get(DataComponents.POTION_CONTENTS) }
function isDrinkablePotion(stack) { return potionContents(stack) != null && !/splash|lingering/.test(itemId(stack)) }
function harmfulMap(p) {
  var out = {}, it = p.getActiveEffects().iterator()
  while (it.hasNext()) { var inst = it.next(); if (isHarmful(inst.getEffect())) out[effId(inst.getEffect())] = inst.getEffect() }
  return out
}
// re-apply an effect with a new duration/amplifier without our own Added handler reacting to it
var REAPPLY = {}
function reapply(e, holder, duration, amp, ambient, visible) {
  var key = String(e.getUuid()) + effId(holder)
  REAPPLY[key] = true
  try { e.removeEffect(holder); e.potionEffects.add(holder, Math.max(1, Math.round(duration)), amp, ambient, visible) } finally { delete REAPPLY[key] }
}

// ================= XP =================
if (BrewedPotion != null) {
  NativeEvents.onEvent(BrewedPotion, safe('xp_brew', function (e) {
    var p = e.getEntity()
    if (isPlayer(p)) giveXp(p, budget(p, 'brew', 3, 30, 6000), 'Brewed a potion')
  }))
}

// ================= drinking: first taste XP, Purging Draught, Philosopher's Draught =================
var BEFORE = {}
NativeEvents.onEvent(UseItemStart, safe('drink_start', function (e) {
  var p = e.getEntity()
  if (isPlayer(p) && isDrinkablePotion(e.getItem())) BEFORE[String(p.getUuid())] = harmfulMap(p)
}))
NativeEvents.onEvent(UseItemFinish, safe('drink_finish', function (e) {
  var p = e.getEntity(), stack = e.getItem()
  if (!isPlayer(p) || !isDrinkablePotion(stack)) return
  var pc = potionContents(stack)
  // first time drinking this potion type
  var key = pc.potion().isPresent() ? effId(pc.potion().get()) : 'custom'
  if (key !== 'minecraft:water' && key !== 'minecraft:awkward' && key !== 'minecraft:mundane' && key !== 'minecraft:thick') {
    var store = pdata(p), mine = store.get(), seen = mine.getCompound('drunk')
    if (!seen.getBoolean(key)) { seen.putBoolean(key, true); mine.put('drunk', seen); store.save(mine); giveXp(p, 10, 'New potion tasted (' + key + ')') }
  }
  var before = BEFORE[String(p.getUuid())] || {}
  var effects = []
  pc.getAllEffects().forEach(function (inst) { effects.push(inst.getEffect()) })
  p.getServer().scheduleInTicks(1, safe('drink_after', function () {
    // Purging Draught: clear one harmful effect you already had before drinking
    if (hasTag(p, 'oowwo_al_purge')) {
      for (var id in before) { var h = before[id]; if (p.hasEffect(h)) { p.removeEffect(h); debug(p, 'Purging Draught: cleared ' + id); break } }
    }
    // Philosopher's Draught: beneficial potion effects one level stronger and twice as long
    if (hasTag(p, 'oowwo_al_philosopher')) {
      effects.forEach(function (h) {
        if (!isBeneficial(h) || h.value().isInstantenous()) return
        var cur = p.getEffect(h); if (cur == null || cur.isInfiniteDuration()) return
        reapply(p, h, cur.getDuration() * 2, cur.getAmplifier() + 1, cur.isAmbient(), cur.isVisible())
        debug(p, "Philosopher's Draught: " + effId(h) + ' upgraded')
      })
    }
  }))
}))

// ================= immunities: Antivenom (Poison), Mithridatism (Toxin, Acid) =================
NativeEvents.onEvent(EffectApplicable, safe('applicable', function (e) {
  var p = e.getEntity()
  if (!isPlayer(p)) return
  var id = effId(e.getEffectInstance().getEffect())
  if ((id === 'minecraft:poison' && hasTag(p, 'oowwo_al_antivenom')) ||
      ((id === 'toxony:toxin' || id === 'toxony:acid') && hasTag(p, 'oowwo_al_mithridatism'))) {
    e.setResult(ApplicableResult.DO_NOT_APPLY)
  }
}))

// ================= durations: Mithridatism halves harmful effects on you; Volatile Mixtures stretches your splash potions =================
NativeEvents.onEvent(EffectAdded, safe('added', function (e) {
  var target = e.getEntity(), inst = e.getEffectInstance()
  if (inst == null || inst.isInfiniteDuration()) return
  var h = inst.getEffect()
  if (REAPPLY[String(target.getUuid()) + effId(h)] || h.value().isInstantenous()) return
  var src = e.getEffectSource()
  var halve = isPlayer(target) && hasTag(target, 'oowwo_al_mithridatism') && isHarmful(h)
  var stretch = isPlayer(src) && hasTag(src, 'oowwo_al_volatile')
  if (!halve && !stretch) return
  var f = (halve ? 0.5 : 1) * (stretch ? 1.5 : 1)
  if (f === 1) return
  target.getServer().scheduleInTicks(1, safe('added_after', function () {
    var cur = target.getEffect(h)
    if (cur == null || cur.isInfiniteDuration()) return
    reapply(target, h, cur.getDuration() * f, cur.getAmplifier(), cur.isAmbient(), cur.isVisible())
    if (halve && isPlayer(target)) debug(target, 'Mithridatism: ' + effId(h) + ' halved')
    if (stretch) debug(src, 'Volatile Mixtures: ' + effId(h) + ' x1.5')
  }))
}))

// ================= Toxony oils: XP on oil-coated hits; Slow-Curing Oils =================
NativeEvents.onEvent(LivingDamagePre, safe('oil_hit', function (e) {
  if (OilUtil == null) return
  var p = e.getSource().getActual()
  if (!isPlayer(p) || p.equals(e.getEntity())) return
  var weapon = p.getMainHandItem()
  if (weapon.isEmpty() || !OilUtil.hasOil(weapon)) return
  giveXp(p, budget(p, 'oil', 1, 30, 6000), 'Oil-coated hit')
  if (!hasTag(p, 'oowwo_al_oils')) return
  var usesType = OilUtil.OIL_USES.get()
  var before = weapon.get(usesType)
  if (before == null) return
  p.getServer().scheduleInTicks(1, safe('oil_refund', function () {
    var after = weapon.get(usesType)
    if (after != null && after < before && Math.random() < 0.5) { weapon.set(usesType, JInteger.valueOf(Number(after) + 1)); /* a Java Integer, not a JS number */ debug(p, 'Slow-Curing Oils: charge kept') }
  }))
}))

// ================= Bubbling Retorts: brewing stands within 4 blocks brew twice as fast =================
var BREW_TICK = -1, BREW_DONE = {}
PlayerEvents.tick(safe('brewing', function (e) {
  var p = e.player
  if (!isPlayer(p) || !hasTag(p, 'oowwo_al_brewing')) return
  var level = p.level, t = level.getTime()
  if (t !== BREW_TICK) { BREW_TICK = t; BREW_DONE = {} }
  var cx = Math.floor(p.getX()), cy = Math.floor(p.getY()), cz = Math.floor(p.getZ()), seen = {}
  for (var ox = -4; ox <= 4; ox += 8) for (var oz = -4; oz <= 4; oz += 8) {
    var chunk = level.getChunkAt(BlockPos.containing(cx + ox, cy, cz + oz)), ck = String(chunk.getPos())
    if (seen[ck]) continue
    seen[ck] = true
    var it = chunk.getBlockEntities().values().iterator()
    while (it.hasNext()) {
      var be = it.next(), bp = be.getBlockPos()
      if (!(be instanceof BrewingStandBE)) continue
      if (Math.abs(bp.getX() - cx) > 4 || Math.abs(bp.getY() - cy) > 4 || Math.abs(bp.getZ() - cz) > 4) continue
      var key = String(bp.asLong())
      if (BREW_DONE[key]) continue
      BREW_DONE[key] = true
      BrewingStandBE.serverTick(level, bp, be.getBlockState(), be)
    }
  }
}))
