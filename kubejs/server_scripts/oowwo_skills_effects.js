// oowwo skill trees, Arcane script 2 (v3 tree, 2026-10-04): special effects of the tagged Arcane nodes.
// Pufferfish's `tag` reward adds/removes a player tag on unlock/lock; this script gives each tag its effect.
// KubeJS 2101 remaps (read from the KubeJS jar): DamageSource.getEntity -> getActual, getDirectEntity ->
// getImmediate; Entity.getUUID -> getUuid; Entity.getType -> getEntityType; extinguishFire -> extinguish;
// Entity.level() is a property (`e.level`); Level.getGameTime -> getTime; Entity.hurt -> attack(source, amount).
// Compare entities with .equals(). Every handler is wrapped in safe(): an error is logged, never thrown into a tick.

function safe(name, fn) {
  return function (e) {
    try { fn(e) } catch (err) { console.error('[oowwo_skills_effects] ' + name + ': ' + err) }
  }
}

var BuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
var ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')
var ServerPlayer = Java.loadClass('net.minecraft.server.level.ServerPlayer')
var LivingEntity = Java.loadClass('net.minecraft.world.entity.LivingEntity')
var Monster = Java.loadClass('net.minecraft.world.entity.monster.Monster')
var EntityType = Java.loadClass('net.minecraft.world.entity.EntityType')
var ItemEntity = Java.loadClass('net.minecraft.world.entity.item.ItemEntity')
var BlockPos = Java.loadClass('net.minecraft.core.BlockPos')
var AttributeModifier = Java.loadClass('net.minecraft.world.entity.ai.attributes.AttributeModifier')
var Operation = Java.loadClass('net.minecraft.world.entity.ai.attributes.AttributeModifier$Operation')
var DamageTypeTags = Java.loadClass('net.minecraft.tags.DamageTypeTags')
var TagKey = Java.loadClass('net.minecraft.tags.TagKey')
var Registries = Java.loadClass('net.minecraft.core.registries.Registries')
var EntityTypeTags = Java.loadClass('net.minecraft.tags.EntityTypeTags')
var CuriosApi = Java.loadClass('top.theillusivec4.curios.api.CuriosApi')
var MagicData = Java.loadClass('io.redspace.ironsspellbooks.api.magic.MagicData')

var LivingDamagePre = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingDamageEvent$Pre')
var LivingDamagePost = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingDamageEvent$Post')
var LivingDeath = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingDeathEvent')
var LivingDrops = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingDropsEvent')
var LivingKnockBack = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingKnockBackEvent')
var LivingFall = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingFallEvent')
var EnderManAnger = Java.loadClass('net.neoforged.neoforge.event.entity.living.EnderManAngerEvent')
var PearlTeleport = Java.loadClass('net.neoforged.neoforge.event.entity.EntityTeleportEvent$EnderPearl')

function hasTag(p, t) { return p.getTags().contains(t) }
function isPlayer(e) { return e != null && (e instanceof ServerPlayer) }
function debug(p, msg) { if (hasTag(p, 'oowwo_debug')) p.tell('[skills] ' + msg) }
function now(p) { return p.level.getTime() }

var HOLDERS = {}
function attrHolder(id) {
  if (!HOLDERS[id]) {
    var opt = BuiltInRegistries.ATTRIBUTE.getHolder(ResourceLocation.parse(id))
    HOLDERS[id] = opt.isPresent() ? opt.get() : 'missing'
  }
  return HOLDERS[id] === 'missing' ? null : HOLDERS[id]
}
function attrValue(p, id, fallback) {
  var h = attrHolder(id)
  return (h == null || !p.getAttributes().hasAttribute(h)) ? fallback : p.getAttributeValue(h)
}
// transient attribute modifier on/off (not saved; re-applied by the tick loop)
function setMod(p, attrId, modId, amount, on) {
  var h = attrHolder(attrId); if (h == null) return
  var inst = p.getAttribute(h); if (inst == null) return
  var rl = ResourceLocation.parse(modId)
  if (on) inst.addOrUpdateTransientModifier(new AttributeModifier(rl, amount, Operation.ADD_VALUE))
  // removeModifier is overloaded (ResourceLocation / AttributeModifier) and Rhino can't pick -> name the overload
  else if (inst.getModifier(rl) != null) inst['removeModifier(net.minecraft.resources.ResourceLocation)'](rl)
}
function modAmount(p, attrId, modId) {
  var h = attrHolder(attrId); if (h == null) return 0
  var inst = p.getAttribute(h); if (inst == null) return 0
  var m = inst.getModifier(ResourceLocation.parse(modId))
  return m == null ? 0 : m.amount()
}
var EFFECTS = {}
function effHolder(id) {
  if (!EFFECTS[id]) {
    var opt = BuiltInRegistries.MOB_EFFECT.getHolder(ResourceLocation.parse(id))
    EFFECTS[id] = opt.isPresent() ? opt.get() : 'missing'
  }
  return EFFECTS[id] === 'missing' ? null : EFFECTS[id]
}
function effect(e, id, ticks, amp) { var h = effHolder(id); if (h != null) e.potionEffects.add(h, ticks, amp, true, false) }
function hasEffect(e, id) { var h = effHolder(id); return h != null && e.hasEffect(h) }
function removeEffect(e, id) { var h = effHolder(id); if (h != null && e.hasEffect(h)) e.removeEffect(h) }

var IS_MAGIC = TagKey.create(Registries.DAMAGE_TYPE, ResourceLocation.parse('neoforge:is_magic'))
var ILLAGERS = TagKey.create(Registries.ENTITY_TYPE, ResourceLocation.parse('minecraft:illager'))
function dmgId(src) { var key = src.typeHolder().unwrapKey(); return key.isPresent() ? String(key.get().location()) : '' }
function dmgNamespace(src) { var key = src.typeHolder().unwrapKey(); return key.isPresent() ? String(key.get().location().getNamespace()) : '' }
var SPELL_NS = { 'irons_spellbooks': true, 'ars_nouveau': true, 'ars_elemental': true, 'ars_elemancy': true,
  'ars_technica': true, 'gtbcs_geomancy_plus': true, 'gtbcs_spell_lib': true }
function isSpellDamage(src) { return SPELL_NS[dmgNamespace(src)] === true || src.is(IS_MAGIC) }
function entityId(e) { return String(BuiltInRegistries.ENTITY_TYPE.getKey(e.getEntityType())) }
function blockBelowId(p) { return String(BuiltInRegistries.BLOCK.getKey(p.level.getBlockState(BlockPos.containing(p.getX(), p.getY() - 0.2, p.getZ())).getBlock())) }
function isUndead(e) { return e != null && e.getEntityType().is(EntityTypeTags.UNDEAD) }
function isMelee(src, attacker) { var d = src.getImmediate(); return attacker != null && d != null && attacker.equals(d) }
// owner of an Iron's summon (IMagicSummon.getSummoner) or Ars summon (ISummon.getOwnerAlt); null otherwise
function summonOwner(e) {
  if (e == null) return null
  try { if (typeof e.getSummoner === 'function') { var s = e.getSummoner(); if (s != null) return s } } catch (err) {}
  try { if (typeof e.getOwnerAlt === 'function') { var o = e.getOwnerAlt(); if (o != null) return o } } catch (err) {}
  return null
}

function curioEquipped(p, itemIds) {
  var opt = CuriosApi.getCuriosInventory(p)
  if (!opt.isPresent()) return false
  var inv = opt.get()
  for (var i = 0; i < itemIds.length; i++) {
    var item = BuiltInRegistries.ITEM.get(ResourceLocation.parse(itemIds[i]))
    if (item != null && inv.isEquipped(item)) return true
  }
  return false
}
function holdsCastingItem(p) {
  var ids = [String(p.getMainHandItem().getId()), String(p.getOffhandItem().getId())]
  for (var i = 0; i < ids.length; i++) if (/spell_?book|staff|grimoire|caster_tome|wand/.test(ids[i])) return true
  return false
}
function nearbyMonsters(e, r) { return e.level.getEntitiesOfClass(Monster, e.getBoundingBox().inflate(r)) }

var CD = {}
function ready(p, key, ticks) {
  var k = String(p.getUuid()) + key, t = now(p)
  if (CD[k] != null && t - CD[k] < ticks) return false
  CD[k] = t; return true
}

var RESONANCE = {
  'pyromancy': { focus: ['ars_elemental:fire_focus', 'ars_elemental:lesser_fire_focus'], power: 'irons_spellbooks:fire_spell_power' },
  'stormcalling': { focus: ['ars_elemental:air_focus', 'ars_elemental:lesser_air_focus'], power: 'irons_spellbooks:lightning_spell_power' },
  'cryomancy': { focus: ['ars_elemental:water_focus', 'ars_elemental:lesser_water_focus'], power: 'irons_spellbooks:ice_spell_power' },
  'geomancy': { focus: ['ars_elemental:earth_focus', 'ars_elemental:lesser_earth_focus'], power: 'gtbcs_geomancy_plus:geo_spell_power' }
}
var COLD_BLOCKS = { 'minecraft:snow': 1, 'minecraft:snow_block': 1, 'minecraft:powder_snow': 1, 'minecraft:ice': 1, 'minecraft:packed_ice': 1, 'minecraft:blue_ice': 1, 'minecraft:frosted_ice': 1 }
var VERDANT_BLOCKS = /grass|moss|leaves|podzol|mycelium/
var VOID_KIN = { 'minecraft:enderman': 1, 'minecraft:endermite': 1, 'minecraft:shulker': 1 }
function bloodhound(p) { return hasTag(p, 'oowwo_scent_of_blood') ? { r: 32, t: 0.65 } : { r: 16, t: 0.5 } }
function isChilled(e) {
  return hasEffect(e, 'irons_spellbooks:chilled') || hasEffect(e, 'ars_elemental:frozen') || hasEffect(e, 'ars_nouveau:freezing') || e.getTicksFrozen() > 0
}
var LAST_POS = {}

// ================= once per second =================
PlayerEvents.tick(safe('tick', function (e) {
  var p = e.player
  if (!isPlayer(p)) return
  var t = now(p)
  if (t % 20 !== 0) return
  var level = p.level

  // Meditation: crouching and not moving for 2 checks -> +100% mana regen
  if (hasTag(p, 'oowwo_meditation')) {
    var k = String(p.getUuid())
    var pos = Math.floor(p.getX() * 10) + ',' + Math.floor(p.getY() * 10) + ',' + Math.floor(p.getZ() * 10)
    var still = p.isCrouching() && LAST_POS[k] && LAST_POS[k].pos === pos
    LAST_POS[k] = { pos: pos, n: still ? (LAST_POS[k].n + 1) : 0 }
    setMod(p, 'irons_spellbooks:mana_regen', 'oowwo:meditation', 1.0, still && LAST_POS[k].n >= 1)
  } else setMod(p, 'irons_spellbooks:mana_regen', 'oowwo:meditation', 1.0, false)

  // Witchsight: holding a spellbook/staff -> invisible creatures within 16 glow (no night vision any more)
  if (hasTag(p, 'oowwo_witchsight') && holdsCastingItem(p)) {
    level.getEntitiesOfClass(LivingEntity, p.getBoundingBox().inflate(16)).forEach(function (m) {
      if (!m.equals(p) && m.isInvisible()) effect(m, 'minecraft:glowing', 30, 0)
    })
  }

  // Bloodhound (+ Scent of Blood): wounded creatures glow
  if (hasTag(p, 'oowwo_bloodhound')) {
    var bh = bloodhound(p)
    level.getEntitiesOfClass(LivingEntity, p.getBoundingBox().inflate(bh.r)).forEach(function (m) {
      if (!m.equals(p) && m.isAlive() && m.getHealth() < m.getMaxHealth() * bh.t) effect(m, 'minecraft:glowing', 30, 0)
    })
  }
  // Radiance: undead within 8 glow
  if (hasTag(p, 'oowwo_radiance')) {
    level.getEntitiesOfClass(LivingEntity, p.getBoundingBox().inflate(8)).forEach(function (m) { if (isUndead(m)) effect(m, 'minecraft:glowing', 30, 0) })
  }

  var raining = level.isRainingAt(p.blockPosition())
  // Stormborn: Speed I in rain (Wet Wired: also standing in water)
  if (hasTag(p, 'oowwo_stormborn') && (raining || (hasTag(p, 'oowwo_wet_wired') && p.isInWater()))) effect(p, 'minecraft:speed', 40, 0)
  // Static Build-up: +10% lightning power in rain
  setMod(p, 'irons_spellbooks:lightning_spell_power', 'oowwo:static_buildup', 0.10, hasTag(p, 'oowwo_static_buildup') && (raining || level.isThundering()))

  // Winter's Child: never freezes
  if (hasTag(p, 'oowwo_winters_child') && p.getTicksFrozen() > 0) p.setTicksFrozen(0)
  // Glacial Skin: +2 armor toughness on snow/ice
  setMod(p, 'minecraft:generic.armor_toughness', 'oowwo:glacial_skin', 2, hasTag(p, 'oowwo_glacial_skin') && (COLD_BLOCKS[blockBelowId(p)] === 1 || COLD_BLOCKS[String(BuiltInRegistries.BLOCK.getKey(level.getBlockState(p.blockPosition()).getBlock()))] === 1))

  // Kindled Soul: +10% fire power while burning
  setMod(p, 'irons_spellbooks:fire_spell_power', 'oowwo:kindled_soul', 0.10, hasTag(p, 'oowwo_kindled_soul') && p.isOnFire())

  // Verdant Renewal: Regeneration pulse every 10 seconds on grass/moss/leaves
  if (hasTag(p, 'oowwo_verdant_renewal') && t % 100 === 0 && VERDANT_BLOCKS.test(blockBelowId(p))) {
    effect(p, 'minecraft:regeneration', 60, 1); debug(p, 'Verdant Renewal pulse')
  }

  // Crimson Pact: below half health -> life steal tripled, +30% blood power
  var pact = hasTag(p, 'oowwo_crimson_pact') && p.getHealth() < p.getMaxHealth() * 0.5
  var baseLs = attrValue(p, 'apothic_attributes:life_steal', 0) - modAmount(p, 'apothic_attributes:life_steal', 'oowwo:crimson_pact')
  setMod(p, 'apothic_attributes:life_steal', 'oowwo:crimson_pact', Math.max(0, baseLs * 2), pact && baseLs > 0)
  setMod(p, 'irons_spellbooks:blood_spell_power', 'oowwo:crimson_pact_power', 0.30, pact)

  // Warlord: +3% spell power per own summon within 16 (max 5)
  if (hasTag(p, 'oowwo_warlord')) {
    var n = 0
    level.getEntitiesOfClass(LivingEntity, p.getBoundingBox().inflate(16)).forEach(function (m) {
      var o = summonOwner(m); if (o != null && o.equals(p)) n++
    })
    n = Math.min(6, n)
    setMod(p, 'irons_spellbooks:spell_power', 'oowwo:warlord', 0.05 * n, n > 0)
  } else setMod(p, 'irons_spellbooks:spell_power', 'oowwo:warlord', 0, false)

  // Focus Resonance: matching Ars Elemental focus equipped -> +10% school power, +10% mana regen
  Object.keys(RESONANCE).forEach(function (sid) {
    var on = hasTag(p, 'oowwo_resonance_' + sid) && curioEquipped(p, RESONANCE[sid].focus)
    setMod(p, RESONANCE[sid].power, 'oowwo:resonance_' + sid, 0.10, on)
    setMod(p, 'irons_spellbooks:mana_regen', 'oowwo:resonance_regen_' + sid, 0.10, on)
  })

  // Fusions
  var clearsFire = hasTag(p, 'oowwo_fusion_cinder') || hasTag(p, 'oowwo_fusion_vapor') || hasTag(p, 'oowwo_fusion_lava')
  if (clearsFire && p.isOnFire()) p.extinguish()
  var refillsAir = hasTag(p, 'oowwo_fusion_tempest') || hasTag(p, 'oowwo_fusion_mire') || hasTag(p, 'oowwo_fusion_vapor')
  if (refillsAir && p.getAirSupply() < 40 && ready(p, 'air', 600)) { p.setAirSupply(p.getMaxAirSupply()); debug(p, 'Fusion: air refilled') }
  var feeds = hasTag(p, 'oowwo_fusion_mire') || hasTag(p, 'oowwo_fusion_silt') || hasTag(p, 'oowwo_fusion_lava')
  if (feeds && p.getY() < 0 && p.getFoodData().getFoodLevel() <= 4 && ready(p, 'food', 2400)) { p.getFoodData().eat(6, 0.6); debug(p, 'Fusion: food appeared') }
}))

// ================= damage taken / dealt =================
NativeEvents.onEvent(LivingDamagePre, safe('damage', function (e) {
  var victim = e.getEntity()
  var src = e.getSource()
  var attacker = src.getActual()

  // ---------- player takes damage ----------
  if (isPlayer(victim)) {
    var p = victim
    var d0 = e.getNewDamage(), d = d0
    if (hasTag(p, 'oowwo_ember_heart') && src.is(DamageTypeTags.IS_FIRE)) {
      d *= hasTag(p, 'oowwo_cinderborn') ? 0.25 : 0.5
      if (hasTag(p, 'oowwo_magma_skin') && dmgId(src) === 'minecraft:lava') d *= 0.5
    }
    if (hasTag(p, 'oowwo_stormborn') && src.is(DamageTypeTags.IS_LIGHTNING)) d = 0
    if (hasTag(p, 'oowwo_winters_child') && src.is(DamageTypeTags.IS_FREEZING)) d = 0
    if (hasTag(p, 'oowwo_void_touched') && dmgId(src) === 'minecraft:ender_pearl') d = 0
    if (hasTag(p, 'oowwo_sanctified') && isUndead(attacker)) d *= hasTag(p, 'oowwo_absolution') ? 0.75 : 0.85
    if (hasTag(p, 'oowwo_bedrock_stance') && p.isCrouching()) d *= 0.9
    if (hasTag(p, 'oowwo_void_kin') && attacker != null && VOID_KIN[entityId(attacker)]) d *= 0.75
    if (hasTag(p, 'oowwo_arbiter') && attacker != null && attacker.getEntityType().is(ILLAGERS)) d *= 0.85
    if ((hasTag(p, 'oowwo_fusion_cinder') || hasTag(p, 'oowwo_fusion_tempest') || hasTag(p, 'oowwo_fusion_silt')) && src.is(DamageTypeTags.IS_FALL)) d *= 0.5
    // Guardian Angel: a killing blow leaves you at 1 health (5 minute cooldown)
    if (hasTag(p, 'oowwo_guardian_angel') && d >= p.getHealth() && d > 0 && ready(p, 'guardian_angel', 2400)) {
      d = Math.max(0, p.getHealth() - 1)
      effect(p, 'minecraft:regeneration', 160, 2)
      effect(p, 'minecraft:absorption', 160, 1)
      p.tell('Guardian Angel saved you! (2 minute cooldown)')
    }
    if (d !== d0) { e.setNewDamage(d); debug(p, 'Damage taken: ' + d0.toFixed(2) + ' -> ' + d.toFixed(2)) }

    var livingAttacker = attacker != null && (attacker instanceof LivingEntity) && !attacker.equals(p)
    // Thornskin (+ Barbed, Entangle, Briar Venom): melee attackers get hurt back
    if (hasTag(p, 'oowwo_thornskin') && livingAttacker && isMelee(src, attacker) && dmgId(src) !== 'minecraft:thorns') {
      attacker.attack(p.damageSources().thorns(p), hasTag(p, 'oowwo_barbed') ? 2.0 : 1.0)
      if (hasTag(p, 'oowwo_entangle')) effect(attacker, 'minecraft:slowness', 40, 0)
      if (hasTag(p, 'oowwo_briar_venom')) effect(attacker, 'minecraft:poison', 40, 0)
    }
    // Frost Aura: attackers are Chilled
    if (hasTag(p, 'oowwo_frost_aura') && livingAttacker) effect(attacker, 'irons_spellbooks:chilled', 40, 0)
    // Thunderlord: in rain, lightning strikes whoever hits you (30s)
    if (hasTag(p, 'oowwo_thunderlord') && livingAttacker && p.level.isRainingAt(p.blockPosition()) && ready(p, 'thunderlord', 200)) smite(p, attacker)
    // Blink: hit while sneaking -> teleport away (60s)
    if (hasTag(p, 'oowwo_blink') && p.isCrouching() && d > 0 && ready(p, 'blink', 400)) {
      p.getServer().scheduleInTicks(1, safe('blink', function () {
        for (var i = 0; i < 16; i++) {
          var tx = p.getX() + (Math.random() - 0.5) * 12, ty = p.getY() + Math.floor((Math.random() - 0.5) * 6), tz = p.getZ() + (Math.random() - 0.5) * 12
          if (p.randomTeleport(tx, ty, tz, true)) { debug(p, 'Blink!'); return }
        }
      }))
    }
  }

  // ---------- player deals damage ----------
  if (isPlayer(attacker) && !victim.equals(attacker)) {
    var a = attacker, m = 1.0
    if (hasTag(a, 'oowwo_conjurer') && victim.getEntityType().is(ILLAGERS)) m *= hasTag(a, 'oowwo_arbiter') ? 1.35 : 1.20
    if (hasTag(a, 'oowwo_consecrated') && isUndead(victim)) m *= 1.10
    if (hasTag(a, 'oowwo_frenzy') && victim.getHealth() < victim.getMaxHealth() * bloodhound(a).t) m *= 1.10
    if (isChilled(victim)) {
      if (hasTag(a, 'oowwo_hoarfrost')) m *= 1.10
      if (hasTag(a, 'oowwo_shatter')) {
        m *= 1.50
        removeEffect(victim, 'irons_spellbooks:chilled'); victim.setTicksFrozen(0)
        nearbyMonsters(victim, 4).forEach(function (o) { if (!o.equals(victim)) effect(o, 'irons_spellbooks:chilled', 60, 0) })
        debug(a, 'Shatter!')
      }
    }
    if (m !== 1.0) { e.setNewDamage(e.getNewDamage() * m); debug(a, 'Damage dealt x' + m.toFixed(2)) }

    // Thunderlord: in rain, your melee hits call lightning too (shared 10s cooldown)
    if (hasTag(a, 'oowwo_thunderlord') && isMelee(src, a) && a.level.isRainingAt(a.blockPosition()) && ready(a, 'thunderlord', 200)) smite(a, victim)
    // Conductor: in rain, melee hits arc a 2-damage shock to one nearby enemy (10s)
    if (hasTag(a, 'oowwo_conductor') && isMelee(src, a) && a.level.isRainingAt(a.blockPosition()) && ready(a, 'conductor', 200)) {
      var others = nearbyMonsters(victim, 5)
      for (var i = 0; i < others.size(); i++) {
        var o = others.get(i)
        if (!o.equals(victim)) { o.attack(a.damageSources().lightningBolt(), 2.0); debug(a, 'Conductor: arc to ' + o.getName().getString()); break }
      }
    }
  }

  // ---------- summons ----------
  var atkOwner = summonOwner(attacker)
  // Necromancer's Pact: summons of a player with the Necromancy focus equipped deal +15%
  if (isPlayer(atkOwner) && hasTag(atkOwner, 'oowwo_necromancers_pact') && curioEquipped(atkOwner, ['ars_elemental:necrotic_focus'])) {
    e.setNewDamage(e.getNewDamage() * 1.15)
  }
  // Commander: your summons take 15% less damage
  var vOwner = summonOwner(victim)
  if (isPlayer(vOwner) && hasTag(vOwner, 'oowwo_commander')) e.setNewDamage(e.getNewDamage() * 0.85)
}))

function smite(p, target) {
  var bolt = EntityType.LIGHTNING_BOLT.create(p.level)
  if (bolt != null) { bolt.setPos(target.getX(), target.getY(), target.getZ()); bolt.setCause(p); p.level.addFreshEntity(bolt); debug(p, 'Thunderlord!') }
}
// Earthen Bulwark: dropping below half health -> Resistance I 5s + slow nearby enemies (45s)
NativeEvents.onEvent(LivingDamagePost, safe('earthen_bulwark', function (e) {
  var p = e.getEntity()
  if (!isPlayer(p) || !hasTag(p, 'oowwo_earthen_bulwark')) return
  if (p.getHealth() > 0 && p.getHealth() < p.getMaxHealth() * 0.5 && ready(p, 'earthen_bulwark', 600)) {
    effect(p, 'minecraft:resistance', 160, 1)
    nearbyMonsters(p, 5).forEach(function (m) { effect(m, 'minecraft:slowness', 100, 1) })
    debug(p, 'Earthen Bulwark!')
  }
}))

// Inferno (fire kills ignite nearby enemies) + Exsanguinate (wounded kills restore mana)
// Inferno: burst ignites enemies within 6 for 8s; enemies it ignited spread it again when they die (any cause, while burning)
var INFERNO = {}   // victim uuid -> owning player
function inferno(p, victim) {
  nearbyMonsters(victim, 6).forEach(function (m) {
    if (m.equals(victim)) return
    m.igniteForSeconds(8); INFERNO[String(m.getUuid())] = p
  })
  debug(p, 'Inferno!')
}
NativeEvents.onEvent(LivingDeath, safe('death', function (e) {
  var victim = e.getEntity(), src = e.getSource(), p = src.getActual()
  var vk = String(victim.getUuid()), chainOwner = INFERNO[vk]
  if (chainOwner != null) {
    delete INFERNO[vk]
    if ((p == null || !isPlayer(p)) && victim.isOnFire() && chainOwner.isAlive() && hasTag(chainOwner, 'oowwo_inferno')) inferno(chainOwner, victim)
  }
  if (!isPlayer(p) || victim.equals(p)) return
  if (hasTag(p, 'oowwo_inferno') && (src.is(DamageTypeTags.IS_FIRE) || victim.isOnFire())) inferno(p, victim)
  if (hasTag(p, 'oowwo_exsanguinate') && hasEffect(victim, 'minecraft:glowing')) {
    var md = MagicData.getPlayerMagicData(p)
    md.setMana(Math.min(attrValue(p, 'irons_spellbooks:max_mana', 100), md.getMana() + 5))
    debug(p, 'Exsanguinate: +5 mana')
  }
}))

// Rooted: no knockback while sneaking
NativeEvents.onEvent(LivingKnockBack, safe('knockback', function (e) {
  var p = e.getEntity()
  if (isPlayer(p) && hasTag(p, 'oowwo_rooted') && p.isCrouching()) e.setCanceled(true)
}))

// Tremor: landing from more than 4 blocks slows enemies within 4
NativeEvents.onEvent(LivingFall, safe('tremor', function (e) {
  var p = e.getEntity()
  if (!isPlayer(p) || !hasTag(p, 'oowwo_tremor') || e.getDistance() <= 4) return
  nearbyMonsters(p, 4).forEach(function (m) { effect(m, 'minecraft:slowness', 60, 1) })
  debug(p, 'Tremor!')
}))

// Void-Touched: endermen ignore your gaze
NativeEvents.onEvent(EnderManAnger, safe('enderman', function (e) {
  var p = e.getPlayer()
  if (isPlayer(p) && hasTag(p, 'oowwo_void_touched')) e.setCanceled(true)
}))

// Pearl Recall (25% pearl back) + Phase Step (Resistance I 2s after a pearl teleport)
NativeEvents.onEvent(PearlTeleport, safe('pearl', function (e) {
  var p = e.getPlayer()
  if (!isPlayer(p)) return
  if (hasTag(p, 'oowwo_phase_step')) effect(p, 'minecraft:resistance', 40, 0)
  if (hasTag(p, 'oowwo_pearl_recall') && !p.isCreative() && Math.random() < 0.25) { p.give('minecraft:ender_pearl'); debug(p, 'Pearl Recall') }
}))

// ================= drops =================
var COOKED = {
  'minecraft:beef': 'minecraft:cooked_beef', 'minecraft:porkchop': 'minecraft:cooked_porkchop',
  'minecraft:chicken': 'minecraft:cooked_chicken', 'minecraft:mutton': 'minecraft:cooked_mutton',
  'minecraft:rabbit': 'minecraft:cooked_rabbit', 'minecraft:cod': 'minecraft:cooked_cod',
  'minecraft:salmon': 'minecraft:cooked_salmon'
}
NativeEvents.onEvent(LivingDrops, safe('drops', function (e) {
  var victim = e.getEntity(), src = e.getSource(), killer = src.getActual()
  if (!isPlayer(killer)) return
  if (hasTag(killer, 'oowwo_ember_heart') && (src.is(DamageTypeTags.IS_FIRE) || victim.isOnFire())) {
    e.getDrops().forEach(function (ie) {
      var st = ie.getItem(), cooked = COOKED[String(st.getId())]
      if (cooked) ie.setItem(Item.of(cooked, st.getCount()))
    })
  }
  if (hasTag(killer, 'oowwo_spellbound_scavenger') && isSpellDamage(src) && Math.random() < 0.05) {
    e.getDrops().add(new ItemEntity(victim.level, victim.getX(), victim.getY(), victim.getZ(), Item.of('irons_spellbooks:arcane_essence')))
    debug(killer, 'Spellbound Scavenger: Arcane Essence')
  }
}))
