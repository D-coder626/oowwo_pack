// oowwo skill trees, Martial script (v3 tree, 2026-10-04): special effects of the tagged Martial nodes.
// Same rules as the Arcane scripts: every handler wrapped in safe(); KubeJS 2101 remaps respected
// (DamageSource getActual/getImmediate, Entity getUuid/getEntityType/attack, Level getTime, .equals() for entities).

function safe(name, fn) {
  return function (e) {
    try { fn(e) } catch (err) { console.error('[oowwo_skills_martial] ' + name + ': ' + err) }
  }
}

var BuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
var ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')
var ServerPlayer = Java.loadClass('net.minecraft.server.level.ServerPlayer')
var LivingEntity = Java.loadClass('net.minecraft.world.entity.LivingEntity')
var Mob = Java.loadClass('net.minecraft.world.entity.Mob')
var TamableAnimal = Java.loadClass('net.minecraft.world.entity.TamableAnimal')
var AbstractArrow = Java.loadClass('net.minecraft.world.entity.projectile.AbstractArrow')
var AttributeModifier = Java.loadClass('net.minecraft.world.entity.ai.attributes.AttributeModifier')
var Operation = Java.loadClass('net.minecraft.world.entity.ai.attributes.AttributeModifier$Operation')
var Vec3 = Java.loadClass('net.minecraft.world.phys.Vec3')
var DamageTypeTags = Java.loadClass('net.minecraft.tags.DamageTypeTags')

var LivingDamagePre = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingDamageEvent$Pre')
var LivingDamagePost = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingDamageEvent$Post')
var LivingDeath = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingDeathEvent')
var ShieldBlock = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingShieldBlockEvent')
var LivingKnockBack = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingKnockBackEvent')
var Visibility = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingEvent$LivingVisibilityEvent')

function hasTag(p, t) { return p.getTags().contains(t) }
function isPlayer(e) { return e != null && (e instanceof ServerPlayer) }
function debug(p, msg) { if (hasTag(p, 'oowwo_debug')) p.tell('[skills] ' + msg) }
var EFFECTS = {}
function effect(e, id, ticks, amp) {
  if (!EFFECTS[id]) EFFECTS[id] = BuiltInRegistries.MOB_EFFECT.getHolder(ResourceLocation.parse(id)).get()
  e.potionEffects.add(EFFECTS[id], ticks, amp, true, true)
}
var CD = {}
function ready(p, key, ticks) {
  var k = String(p.getUuid()) + key, now = p.level.getTime()
  if (CD[k] != null && now - CD[k] < ticks) return false
  CD[k] = now; return true
}
function lowHealth(p, frac) { return p.getHealth() > 0 && p.getHealth() < p.getMaxHealth() * frac }

// ================= Iron Shoulders: cancel wayfarer_core's armour speed penalty =================
var SPEED = null
var IRON_ID = ResourceLocation.parse('oowwo:iron_shoulders')
// ================= per-second work: Iron Shoulders, Tracker, Rally =================
var MARKS = {}       // victim uuid -> { by: attacker uuid, until: game time, entity }
var GUARD_RANGE = function (g) { return hasTag(g, 'oowwo_bodyguard') ? 10 : 6 }
PlayerEvents.tick(safe('martial_tick', function (e) {
  var p = e.player
  if (!isPlayer(p)) return
  var now = p.level.getTime()
  if (now % 20 !== 0) return

  // Iron Shoulders
  if (SPEED == null) SPEED = BuiltInRegistries.ATTRIBUTE.getHolder(ResourceLocation.parse('minecraft:generic.movement_speed')).get()
  var inst = p.getAttribute(SPEED)
  if (inst != null) {
    if (!hasTag(p, 'oowwo_iron_shoulders')) {
      if (inst.getModifier(IRON_ID) != null) inst['removeModifier(net.minecraft.resources.ResourceLocation)'](IRON_ID)
    } else {
      var product = 1.0
      inst.getModifiers().forEach(function (m) {
        var path = String(m.id().getPath())
        if (path.indexOf('base_movement_speed') === 0 && m.operation().equals(Operation.ADD_MULTIPLIED_TOTAL) && m.amount() < 0) product *= (1 + m.amount())
      })
      var counter = product > 0.01 ? (1 / product - 1) : 0
      if (counter > 0.0001) inst.addOrUpdateTransientModifier(new AttributeModifier(IRON_ID, counter, Operation.ADD_MULTIPLIED_TOTAL))
      else if (inst.getModifier(IRON_ID) != null) inst['removeModifier(net.minecraft.resources.ResourceLocation)'](IRON_ID)
    }
  }

  // Juggernaut: Resistance I while below half health
  if (hasTag(p, 'oowwo_juggernaut') && lowHealth(p, 0.5)) effect(p, 'minecraft:resistance', 40, 0)

  // Tracker: Speed I while your marked target is alive within 32 blocks
  if (hasTag(p, 'oowwo_tracker')) {
    var me = String(p.getUuid())
    for (var k in MARKS) {
      var mk = MARKS[k]
      if (mk.by !== me || mk.until <= now || mk.entity == null || !mk.entity.isAlive()) continue
      if (mk.entity.distanceToSqr(p) <= 32 * 32) { effect(p, 'minecraft:speed', 40, 0); break }
    }
  }

  // Rally: allies Guardian protects get a Regeneration I pulse every 10 seconds
  if (hasTag(p, 'oowwo_guardian') && hasTag(p, 'oowwo_rally') && now % 200 === 0) {
    p.level.getEntitiesOfClass(LivingEntity, p.getBoundingBox().inflate(GUARD_RANGE(p))).forEach(function (m) {
      if (m.equals(p)) return
      var owner = (m instanceof TamableAnimal) ? m.getOwner() : null
      if (isPlayer(m) || (owner != null && owner.equals(p))) effect(m, 'minecraft:regeneration', 50, 0)
    })
  }
}))

// ================= damage dealt / taken =================
var BACKSTAB = {}    // victim uuid -> { by, at } last backstab (for Vanish)
var HIT_BEFORE = {}  // player uuid + victim uuid -> true (Death Mark: first hit only)
NativeEvents.onEvent(LivingDamagePre, safe('damage', function (e) {
  var victim = e.getEntity()
  var src = e.getSource()
  var attacker = src.getActual()
  var direct = src.getImmediate()
  var now = victim.level.getTime()
  var vk = String(victim.getUuid())

  if (isPlayer(attacker) && !attacker.equals(victim)) {
    var a = attacker, ak = String(a.getUuid()), m = 1.0
    var melee = direct != null && direct.equals(a)

    // Shadowstep backstab (+50%, Assassinate +75%), melee only
    if (hasTag(a, 'oowwo_shadowstep') && melee) {
      var look = victim.getLookAngle()
      var toAttacker = new Vec3(a.getX() - victim.getX(), 0, a.getZ() - victim.getZ())
      if (toAttacker.lengthSqr() > 0.000001 && look.dot(toAttacker.normalize()) < -0.3) {
        m *= hasTag(a, 'oowwo_assassinate') ? 1.75 : 1.5
        BACKSTAB[vk] = { by: ak, at: now }
        debug(a, 'Shadowstep: backstab')
      }
    }
    // Death Mark: first hit on a creature that isn't targeting you deals double
    if (hasTag(a, 'oowwo_death_mark') && (victim instanceof Mob) && !HIT_BEFORE[ak + vk]) {
      var tgt = victim.getTarget()
      if (tgt == null || !tgt.equals(a)) { m *= 3.0; debug(a, 'Death Mark: triple damage') }
    }
    HIT_BEFORE[ak + vk] = true

    // Hunter's Mark: marked targets take +10% (Long Mark +15%) from you; arrow hits (re)apply the mark
    var marked = MARKS[vk] && MARKS[vk].by === ak && MARKS[vk].until > now
    if (marked) m *= hasTag(a, 'oowwo_long_mark') ? 1.15 : 1.10
    var projectile = src.is(DamageTypeTags.IS_PROJECTILE)
    // Deadeye: fully drawn (critical) arrows at a marked target always deal x1.5
    if (marked && projectile && hasTag(a, 'oowwo_deadeye') && direct != null && (direct instanceof AbstractArrow) && direct.isCritArrow()) {
      m *= 2.5; debug(a, 'Deadeye!')
    }
    if (hasTag(a, 'oowwo_hunters_mark') && projectile) {
      var dur = hasTag(a, 'oowwo_long_mark') ? 400 : 200
      MARKS[vk] = { by: ak, until: now + dur, entity: victim }
      effect(victim, 'minecraft:glowing', dur, 0)
      debug(a, "Hunter's Mark applied")
    }
    // Juggernaut: below half health, +40% melee damage
    if (hasTag(a, 'oowwo_juggernaut') && melee && lowHealth(a, 0.5)) m *= 1.40

    if (m !== 1.0) e.setNewDamage(e.getNewDamage() * m)
  }

  // Guardian (+ Shieldwall, Bodyguard): other players and your tamed animals near you take less damage
  var guardians = victim.level.getEntitiesOfClass(ServerPlayer, victim.getBoundingBox().inflate(10))
  for (var i = 0; i < guardians.size(); i++) {
    var g = guardians.get(i)
    if (g.equals(victim) || !hasTag(g, 'oowwo_guardian')) continue
    if (g.distanceToSqr(victim) > GUARD_RANGE(g) * GUARD_RANGE(g)) continue
    var owner = (victim instanceof TamableAnimal) ? victim.getOwner() : null
    if (isPlayer(victim) || (owner != null && owner.equals(g))) {
      e.setNewDamage(e.getNewDamage() * (hasTag(g, 'oowwo_shieldwall') ? 0.75 : 0.85))
      debug(g, 'Guardian: protected ' + victim.getName().getString())
      break
    }
  }
}))

// Adrenaline: dropping below 30% health -> Speed II + Resistance I for 4s, 60s cooldown
NativeEvents.onEvent(LivingDamagePost, safe('adrenaline', function (e) {
  var p = e.getEntity()
  if (!isPlayer(p) || !hasTag(p, 'oowwo_adrenaline')) return
  if (lowHealth(p, 0.3) && ready(p, 'adrenaline', 1200)) {
    effect(p, 'minecraft:speed', 80, 1)
    effect(p, 'minecraft:resistance', 80, 0)
    debug(p, 'Adrenaline!')
  }
}))

// Kills: Bloodlust (+ Blood Frenzy), Carnage, Feast of War, Vanish, Marked Prey
var KILLS = {}       // player uuid -> last kill game time (Carnage)
NativeEvents.onEvent(LivingDeath, safe('kills', function (e) {
  var victim = e.getEntity()
  var killer = e.getSource().getActual()
  var vk = String(victim.getUuid())
  if (isPlayer(killer) && !killer.equals(victim)) {
    var p = killer, pk = String(p.getUuid()), now = p.level.getTime()
    if (hasTag(p, 'oowwo_bloodlust')) {
      var heal = hasTag(p, 'oowwo_blood_frenzy') ? 3.0 : 2.0
      p.heal(heal)
      effect(p, 'minecraft:haste', 80, 0)
      debug(p, 'Bloodlust: +' + heal + ' health')
    }
    if (hasTag(p, 'oowwo_carnage')) {
      if (KILLS[pk] != null && now - KILLS[pk] <= 100) { effect(p, 'minecraft:strength', 60, 0); debug(p, 'Carnage!') }
      KILLS[pk] = now
    }
    if (hasTag(p, 'oowwo_feast_of_war')) {
      var fd = p.getFoodData(); fd.setFoodLevel(Math.min(20, fd.getFoodLevel() + 1))
    }
    if (hasTag(p, 'oowwo_vanish') && BACKSTAB[vk] && BACKSTAB[vk].by === pk && now - BACKSTAB[vk].at <= 20) {
      effect(p, 'minecraft:invisibility', 60, 0); debug(p, 'Vanish!')
    }
    if (hasTag(p, 'oowwo_marked_prey') && MARKS[vk] && MARKS[vk].by === pk && MARKS[vk].until > now) {
      p.give('minecraft:arrow'); debug(p, 'Marked Prey: arrow back')
    }
  }
  // clean up per-victim state
  delete MARKS[vk]; delete BACKSTAB[vk]
  for (var key in HIT_BEFORE) if (key.indexOf(vk) > 0) delete HIT_BEFORE[key]
}))

// Riposte (Strength I 2s) and Bulwark (reflect 30% of blocked damage) on shield blocks
NativeEvents.onEvent(ShieldBlock, safe('shield', function (e) {
  var p = e.getEntity()
  if (!isPlayer(p)) return
  if (typeof e.getBlocked === 'function' && !e.getBlocked()) return
  if (hasTag(p, 'oowwo_riposte')) { effect(p, 'minecraft:strength', 40, 0); debug(p, 'Riposte: Strength I') }
  if (hasTag(p, 'oowwo_bulwark')) {
    var src = e.getDamageSource(), atk = src.getActual()
    var amount = (typeof e.getBlockedDamage === 'function') ? e.getBlockedDamage() : e.getOriginalBlockedDamage()
    if (atk != null && (atk instanceof LivingEntity) && !atk.equals(p) && amount > 0) {
      atk.attack(p.damageSources().thorns(p), amount * 0.75)
      debug(p, 'Bulwark: reflected ' + (amount * 0.75).toFixed(1))
    }
  }
}))

// Juggernaut: immune to knockback below half health
NativeEvents.onEvent(LivingKnockBack, safe('juggernaut_kb', function (e) {
  var p = e.getEntity()
  if (isPlayer(p) && hasTag(p, 'oowwo_juggernaut') && lowHealth(p, 0.5)) e.setCanceled(true)
}))

// Shadowstep (+ Unseen): while sneaking, mobs notice you at 50% (30%) range
NativeEvents.onEvent(Visibility, safe('shadowstep_visibility', function (e) {
  var p = e.getEntity()
  if (isPlayer(p) && hasTag(p, 'oowwo_shadowstep') && p.isCrouching()) e.modifyVisibility(hasTag(p, 'oowwo_unseen') ? 0.3 : 0.5)
}))
