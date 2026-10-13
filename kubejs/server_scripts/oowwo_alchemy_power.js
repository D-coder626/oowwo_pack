// oowwo: power layer for ALCHEMICALLY CRAFTED Wayfarer rings (2026-10-09, numbers approved by Derek).
// Only rings carrying custom_data {oowwo_alchemical:1} (set by the forge recipes in oowwo_alchemy.js) get these bonuses;
// loot rings keep Wayfarer's normal effect. Every bonus stacks ON TOP of the ring's own Wayfarer effect.
// Rings are read from Wayfarer's own ring slots (RingHandler.rings), not Curios.
// KubeJS 2101 remaps DamageSource.getEntity -> getActual and getDirectEntity -> getImmediate (fixed 2026-10-09).
// Keep the lore lines in OAL_RINGS (oowwo_alchemy.js) in sync with this table.
// Top-level names are prefixed OAL_ (server scripts share one global scope).
//
// OAL_POWER[ring id] fields (all optional):
//   immune   : damage type ids or '#tags' fully cancelled for the wearer
//   mult     : [damage type id or '#tag', multiplier] applied to damage the wearer takes
//   noEffect : mob effect ids that cannot be applied to the wearer
//   attrs    : [attribute id, amount, operation] applied while worn ('add_value' | 'add_multiplied_total')
//   tick     : name of a conditional effect checked every second (see oalTick)
//   reflect  : fraction of melee damage taken reflected to the attacker as thorns damage
//   meleeOut : multiplier on melee damage the wearer deals
//   hunger   : multiplier on hunger drain (exhaustion gained is trimmed once per second)
// Values raised 2026-10-09 (Derek approved the 'roughly double' table).
var OAL_POWER = {
  'wayfarer_core:sulfur_gemstone_ring': { immune: ['nomansland:corrosion'], mult: [['#minecraft:is_fire', 0.6]], noEffect: ['nomansland:corrosion'] },
  'wayfarer_core:sunlight_ring': { tick: 'sun_regen', attrs: [['minecraft:generic.armor', 2, 'add_value']] },
  'wayfarer_core:moonlight_ring': { tick: 'night_vision', attrs: [['minecraft:generic.max_health', 6, 'add_value']] },
  'wayfarer_core:fireward_ring': { immune: ['minecraft:on_fire', 'minecraft:in_fire', 'minecraft:campfire', 'minecraft:lava'] },
  'wayfarer_core:ring_of_warmth': { immune: ['minecraft:freeze'], hunger: 0.75 },
  'wayfarer_core:spellward_ring': { attrs: [['irons_spellbooks:spell_resist', 0.30, 'add_value']] },
  'wayfarer_core:ailward_ring': { noEffect: ['minecraft:hunger', 'minecraft:nausea', 'minecraft:blindness', 'minecraft:darkness', 'minecraft:slowness', 'minecraft:mining_fatigue'] },
  'wayfarer_core:bulwark_ring': { mult: [['#minecraft:is_explosion', 0.25]], attrs: [['minecraft:generic.armor', 4, 'add_value'], ['minecraft:generic.armor_toughness', 2, 'add_value']] },
  'wayfarer_core:silvercat_ring': { immune: ['#minecraft:is_fall'] },
  'wayfarer_core:ring_of_the_afflicted': { noEffect: ['minecraft:poison', 'minecraft:weakness', 'minecraft:wither'] },
  'wayfarer_core:thorn_ring': { reflect: 0.5 },
  'wayfarer_core:ring_of_the_rat': { attrs: [['minecraft:generic.movement_speed', 0.20, 'add_multiplied_total']] },
  'wayfarer_core:ring_of_silence': { tick: 'sneak_invis', attrs: [['minecraft:player.sneaking_speed', 0.15, 'add_value']] },
  'wayfarer_core:malevolent_ring': { attrs: [['minecraft:generic.max_health', 8, 'add_value']] },
  'wayfarer_core:ring_of_torment': { meleeOut: 1.30 },
  'wayfarer_core:visceral_ring': { tick: 'low_hp_regen' },
  'wayfarer_core:salt_gemstone_ring': { noEffect: ['minecraft:poison'], hunger: 0.75 },
  'wayfarer_core:mercury_gemstone_ring': { noEffect: ['minecraft:wither'], mult: [['minecraft:magic', 0.75], ['minecraft:indirect_magic', 0.75]] }
}

var OAL_RingHandler = Java.loadClass('dev.tazer.wayfarer.ring.RingHandler')
var OAL_DataComponents = Java.loadClass('net.minecraft.core.component.DataComponents')
var OAL_RL = Java.loadClass('net.minecraft.resources.ResourceLocation')
var OAL_ResourceKey = Java.loadClass('net.minecraft.resources.ResourceKey')
var OAL_TagKey = Java.loadClass('net.minecraft.tags.TagKey')
var OAL_Registries = Java.loadClass('net.minecraft.core.registries.Registries')
var OAL_BuiltIn = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
var OAL_ServerPlayer = Java.loadClass('net.minecraft.server.level.ServerPlayer')
var OAL_LivingEntity = Java.loadClass('net.minecraft.world.entity.LivingEntity')
var OAL_Incoming = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingIncomingDamageEvent')
var OAL_Applicable = Java.loadClass('net.neoforged.neoforge.event.entity.living.MobEffectEvent$Applicable')
var OAL_ApplicableResult = Java.loadClass('net.neoforged.neoforge.event.entity.living.MobEffectEvent$Applicable$Result')
var OAL_AttributeModifier = Java.loadClass('net.minecraft.world.entity.ai.attributes.AttributeModifier')
var OAL_Operation = Java.loadClass('net.minecraft.world.entity.ai.attributes.AttributeModifier$Operation')
var OAL_MobEffectInstance = Java.loadClass('net.minecraft.world.effect.MobEffectInstance')
var OAL_DamageTypes = Java.loadClass('net.minecraft.world.damagesource.DamageTypes')

function oalLog(where, err) { console.error('[oowwo_alchemy_power] ' + where + ': ' + err) }

// ---- pre-resolve keys once ----
var OAL_KEYS = {}
Object.keys(OAL_POWER).forEach(function (ring) {
  var p = OAL_POWER[ring]
  try {
    OAL_KEYS[ring] = {
      immune: (p.immune || []).map(function (id) {
        var isTag = id.charAt(0) === '#'
        var rl = OAL_RL.parse(isTag ? id.substring(1) : id)
        return isTag ? OAL_TagKey.create(OAL_Registries.DAMAGE_TYPE, rl) : OAL_ResourceKey.create(OAL_Registries.DAMAGE_TYPE, rl)
      }),
      mult: (p.mult || []).map(function (m) {
        var isTag = m[0].charAt(0) === '#'
        var rl = OAL_RL.parse(isTag ? m[0].substring(1) : m[0])
        return { tag: isTag, key: isTag ? OAL_TagKey.create(OAL_Registries.DAMAGE_TYPE, rl) : OAL_ResourceKey.create(OAL_Registries.DAMAGE_TYPE, rl), x: m[1] }
      }),
      noEffect: (p.noEffect || []).map(function (id) { return OAL_RL.parse(id) }),
      attrs: (p.attrs || []).map(function (a, i) {
        return { attr: OAL_RL.parse(a[0]), amount: a[1], op: a[2] === 'add_multiplied_total' ? OAL_Operation.ADD_MULTIPLIED_TOTAL : OAL_Operation.ADD_VALUE,
          id: OAL_RL.parse('oowwo:alch_' + ring.split(':')[1] + '_' + i) }
      }),
      tick: p.tick || null, reflect: p.reflect || 0, meleeOut: p.meleeOut || 1, hunger: p.hunger || 1
    }
  } catch (err) { oalLog('table ' + ring, err) }
})

// ids of alchemically crafted rings the player is wearing in Wayfarer's ring slots
function oalWornAlchemical(player) {
  var out = []
  var h = OAL_RingHandler.rings(player)
  if (h == null) return out
  for (var i = 0; i < h.getSlots(); i++) {
    var st = h.getStackInSlot(i)
    if (st.isEmpty()) continue
    var cd = st.get(OAL_DataComponents.CUSTOM_DATA)
    if (cd == null || cd.copyTag().getInt('oowwo_alchemical') !== 1) continue
    var id = String(OAL_BuiltIn.ITEM.getKey(st.getItem()))
    if (OAL_KEYS[id]) out.push(id)
  }
  return out
}

function oalEffect(p, id, ticks, amp) {
  var h = OAL_BuiltIn.MOB_EFFECT.getHolder(OAL_RL.parse(id))
  if (h.isPresent()) p.addEffect(new OAL_MobEffectInstance(h.get(), ticks, amp, true, false, true))
}

function oalAttrInst(p, rl) {
  var h = OAL_BuiltIn.ATTRIBUTE.getHolder(rl)
  return h.isPresent() ? p.getAttribute(h.get()) : null
}

function oalIsMelee(src, attacker) {
  var d = src.getImmediate()
  return attacker != null && d != null && attacker.equals(d) && !src.is(OAL_DamageTypes.THORNS)
}

// ---- damage: wearer taking damage (immune / mult / reflect) and wearer dealing melee (meleeOut) ----
NativeEvents.onEvent(OAL_Incoming, function (e) {
  try {
    var victim = e.getEntity()
    var src = e.getSource()
    var attacker = src.getActual()
    var amount = e.getAmount()
    var reflect = 0

    if (victim instanceof OAL_ServerPlayer) {
      var rings = oalWornAlchemical(victim)
      for (var r = 0; r < rings.length; r++) {
        var k = OAL_KEYS[rings[r]]
        for (var i = 0; i < k.immune.length; i++) {
          if (src.is(k.immune[i])) { e.setCanceled(true); return }
        }
        for (var j = 0; j < k.mult.length; j++) {
          if (src.is(k.mult[j].key)) amount *= k.mult[j].x
        }
        reflect += k.reflect
      }
    }

    if (attacker instanceof OAL_ServerPlayer && oalIsMelee(src, attacker)) {
      var out = oalWornAlchemical(attacker)
      for (var o = 0; o < out.length; o++) amount *= OAL_KEYS[out[o]].meleeOut
    }

    if (amount !== e.getAmount()) e.setAmount(amount)

    if (reflect > 0 && attacker instanceof OAL_LivingEntity && !attacker.equals(victim) && oalIsMelee(src, attacker)) {
      attacker.hurt(victim.damageSources().thorns(victim), amount * reflect)
    }
  } catch (err) { oalLog('damage', err) }
})

// ---- effects that cannot be applied ----
NativeEvents.onEvent(OAL_Applicable, function (e) {
  try {
    var p = e.getEntity()
    if (!(p instanceof OAL_ServerPlayer)) return
    var rings = oalWornAlchemical(p)
    if (rings.length === 0) return
    var eff = e.getEffectInstance().getEffect()
    for (var r = 0; r < rings.length; r++) {
      var k = OAL_KEYS[rings[r]]
      for (var i = 0; i < k.noEffect.length; i++) {
        if (eff.is(k.noEffect[i])) { e.setResult(OAL_ApplicableResult.DO_NOT_APPLY); return }
      }
    }
  } catch (err) { oalLog('effect', err) }
})

// ---- every second: attribute bonuses + conditional effects ----
function oalTick(p, kind) {
  var level = p.level
  if (kind === 'sun_regen') {
    if (level.isDay() && level.canSeeSky(p.blockPosition().above())) oalEffect(p, 'minecraft:regeneration', 60, 1)
  } else if (kind === 'night_vision') {
    if (!level.isDay()) oalEffect(p, 'minecraft:night_vision', 400, 0)
  } else if (kind === 'sneak_invis') {
    if (p.isShiftKeyDown()) oalEffect(p, 'minecraft:invisibility', 40, 0)
  } else if (kind === 'low_hp_regen') {
    if (p.getHealth() < p.getMaxHealth() / 2) oalEffect(p, 'minecraft:regeneration', 60, 1)
  }
}

var OAL_LAST_EXH = {}

PlayerEvents.tick(function (event) {
  var p = event.player
  if (p.tickCount % 20 !== 0) return
  try {
    var worn = oalWornAlchemical(p)
    var wornSet = {}
    worn.forEach(function (id) { wornSet[id] = true })
    // attributes: add for worn rings, remove for the rest
    Object.keys(OAL_KEYS).forEach(function (ring) {
      var k = OAL_KEYS[ring]
      k.attrs.forEach(function (a) {
        var inst = oalAttrInst(p, a.attr)
        if (inst == null) return
        var has = inst.getModifier(a.id) != null
        if (wornSet[ring] && !has) inst.addTransientModifier(new OAL_AttributeModifier(a.id, a.amount, a.op))
        else if (!wornSet[ring] && has) inst['removeModifier(net.minecraft.resources.ResourceLocation)'](a.id)
      })
    })
    worn.forEach(function (ring) { if (OAL_KEYS[ring].tick) oalTick(p, OAL_KEYS[ring].tick) })
    // hunger drain: trim the exhaustion gained since the last check
    var hm = 1
    worn.forEach(function (ring) { hm *= OAL_KEYS[ring].hunger })
    var fd = p.getFoodData()
    var uuid = String(p.getUuid())
    var cur = fd.getExhaustionLevel()
    var last = OAL_LAST_EXH[uuid]
    if (hm < 1 && last != null && cur > last) {
      cur = last + (cur - last) * hm
      fd.setExhaustion(cur)
    }
    OAL_LAST_EXH[uuid] = cur
  } catch (err) { oalLog('tick', err) }
})

console.info('[oowwo_alchemy_power] loaded ' + Object.keys(OAL_POWER).length + ' ring power(s)')
