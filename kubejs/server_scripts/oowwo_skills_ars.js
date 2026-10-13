// oowwo skill trees, Arcane script 1: Ars Nouveau integration (2026-10-03)
// - Ars casts give Arcane XP (Pufferfish's Skills experience command)
// - (removed 2026-10-04) Ars glyph damage now uses Ars Elemental's own school-power attributes from the tree
// - Ars Heal is boosted by Holy power; Ars summons by Summon Damage
// - Ars mana-cost reductions from skill tags (Glyph Economy, Technomancer, Archmage Cooldown I/II)
// Read from the jars: Ars 5.13.0 events (SpellCastEvent, EffectResolveEvent$Pre/$Post, SpellCostCalcEvent$Post),
// Ars damage types ars_nouveau:{spell,frost,flare,crush,windshear}; Ars 'n Spells' own scaling never matches
// these (it looks for msgId "magic"/"ars_nouveau"), so there is no double scaling.

// Every handler is wrapped: a script error must never escape into an entity tick (Neruina suspends the mob).
function safe(name, fn) {
  return function (e) {
    try { fn(e) } catch (err) { console.error('[oowwo_skills_ars] ' + name + ': ' + err) }
  }
}

var BuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
var ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')

var SpellCastEvent = Java.loadClass('com.hollingsworth.arsnouveau.api.event.SpellCastEvent')
var EffectResolvePre = Java.loadClass('com.hollingsworth.arsnouveau.api.event.EffectResolveEvent$Pre')
var EffectResolvePost = Java.loadClass('com.hollingsworth.arsnouveau.api.event.EffectResolveEvent$Post')
var SpellCostPost = Java.loadClass('com.hollingsworth.arsnouveau.api.event.SpellCostCalcEvent$Post')
var LivingDamagePre = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingDamageEvent$Pre')
var LivingHeal = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingHealEvent')

// Ars school id -> Iron's school power attribute
var SCHOOL_ATTR = {
  'fire': 'irons_spellbooks:fire_spell_power',
  'water': 'irons_spellbooks:ice_spell_power',
  'air': 'irons_spellbooks:lightning_spell_power',
  'earth': 'gtbcs_geomancy_plus:geo_spell_power',
  'abjuration': 'irons_spellbooks:holy_spell_power',
  'conjuration': 'irons_spellbooks:evocation_spell_power',
  'manipulation': 'irons_spellbooks:ender_spell_power',
  'necromancy': 'irons_spellbooks:blood_spell_power'
}
var ARS_POWER = { 'fire': 'ars_nouveau:sauce.perk.fire_power', 'water': 'ars_nouveau:sauce.perk.water_power', 'air': 'ars_nouveau:sauce.perk.air_power',
  'earth': 'ars_nouveau:sauce.perk.earth_power', 'abjuration': 'ars_nouveau:sauce.perk.abjuration_power', 'manipulation': 'ars_nouveau:sauce.perk.manipulation_power',
  'necromancy': 'ars_nouveau:sauce.perk.necromancy_power', 'conjuration': 'ars_nouveau:sauce.perk.summon_power' }
var ARS_NS = { 'ars_nouveau': true, 'ars_elemental': true, 'ars_elemancy': true, 'ars_technica': true }
var POWER_CAP = 3.0
var CATEGORY = 'oowwo:arcane'

var HOLDERS = {}
function holder(id) {
  if (!HOLDERS[id]) {
    var opt = BuiltInRegistries.ATTRIBUTE.getHolder(ResourceLocation.parse(id))
    HOLDERS[id] = opt.isPresent() ? opt.get() : 'missing'
  }
  return HOLDERS[id] === 'missing' ? null : HOLDERS[id]
}
function attr(entity, id, fallback) {
  var h = holder(id)
  if (h == null || !entity.getAttributes().hasAttribute(h)) return fallback
  return entity.getAttributeValue(h)
}
// KubeJS remaps Entity.getUUID -> getUuid, DamageSource.getEntity -> getActual
var ServerPlayer = Java.loadClass('net.minecraft.server.level.ServerPlayer')
// (Entity.level() is exposed as a JS property, not a function, in KubeJS 2101 -> use a class check instead)
function isServerPlayer(e) {
  return e != null && (e instanceof ServerPlayer)
}
function hasTag(p, t) { return p.getTags().contains(t) }
// Testing aid: `/tag @s add oowwo_debug` prints what the script did in chat; `/tag @s remove oowwo_debug` to stop.
function debug(p, msg) { if (hasTag(p, 'oowwo_debug')) p.tell('[skills] ' + msg) }

function arsSchool(part) {
  if (part == null || part.spellSchools == null) return null
  var it = part.spellSchools.iterator()
  while (it.hasNext()) {
    var id = String(it.next().getId())
    if (SCHOOL_ATTR[id]) return id
  }
  return null
}
// same shape Ars 'n Spells uses: generic spell power + (school power - 1), capped
function powerFactor(p, school) {
  var f = attr(p, 'irons_spellbooks:spell_power', 1.0)
  if (school && SCHOOL_ATTR[school]) f += attr(p, SCHOOL_ATTR[school], 1.0) - 1.0
  return Math.max(0.1, Math.min(POWER_CAP, f))
}

// ---------- XP for Ars casts ----------
NativeEvents.onEvent(SpellCastEvent, safe('SpellCastEvent', function (e) {
  if (e.isCanceled()) return
  var p = e.getEntity()
  if (!isServerPlayer(p) || e.spell == null) return
  var xp = 2 + Math.floor(e.spell.getCost() / 10)
  debug(p, 'Ars cast: +' + xp + ' Arcane XP')
  p.getServer().runCommandSilent('puffish_skills experience add ' + p.getScoreboardName() + ' ' + CATEGORY + ' ' + xp)
}))

// ---------- track which glyph is resolving right now ----------
var CTX = null
NativeEvents.onEvent(EffectResolvePre, safe('EffectResolvePre', function (e) {
  var p = e.shooter
  if (!isServerPlayer(p)) { CTX = null; return }
  CTX = { uuid: String(p.getUuid()), player: p, school: arsSchool(e.resolveEffect) }
}))
NativeEvents.onEvent(EffectResolvePost, safe('EffectResolvePost', function (e) { CTX = null }))

// ---------- damage: Ars summons ----------
// (v3 trees, 2026-10-04: the per-glyph school multiplier was REMOVED. Ars glyph damage now comes from Ars
// Elemental's own school-power attributes (ars_nouveau:sauce.perk.<school>_power, +1 = +1 damage per glyph),
// granted by the Arcane school nodes, so it is not counted twice.)
NativeEvents.onEvent(LivingDamagePre, safe('LivingDamagePre', function (e) {
  var src = e.getSource(), attacker = src.getActual()
  if (attacker == null) return
  // debug readout: Ars glyph hits by a player, with the player's Ars school power for the resolving glyph
  if (isServerPlayer(attacker) && hasTag(attacker, 'oowwo_debug')) {
    var key = src.typeHolder().unwrapKey()
    var ns = key.isPresent() ? String(key.get().location().getNamespace()) : ''
    if (ARS_NS[ns]) {
      var sch = (CTX != null && CTX.uuid === String(attacker.getUuid())) ? CTX.school : null
      var sauce = sch ? ARS_POWER[sch] : null
      var pw = sauce ? attr(attacker, sauce, 0) : 0
      debug(attacker, 'Ars hit: ' + e.getNewDamage().toFixed(2) + ' damage to ' + e.getEntity().getName().getString() + (sch ? ' (' + sch + ' glyph, Ars ' + sch + ' power +' + pw + ')' : ''))
    }
  }
  // Ars summons (wolves, undead, vexes...) implement ISummon -> getOwnerAlt()
  if (typeof attacker.getOwnerAlt === 'function') {
    var owner = attacker.getOwnerAlt()
    if (isServerPlayer(owner)) {
      e.setNewDamage(e.getNewDamage() * attr(owner, 'irons_spellbooks:summon_damage', 1.0))
    }
  }
}))

// ---------- healing: Ars Abjuration (Heal) uses Holy power ----------
NativeEvents.onEvent(LivingHeal, safe('LivingHeal', function (e) {
  if (CTX == null || CTX.school !== 'abjuration') return
  var before = e.getAmount(); var f = powerFactor(CTX.player, 'abjuration')
  e.setAmount(before * f)
  debug(CTX.player, 'Ars heal: ' + before.toFixed(2) + ' -> ' + (before * f).toFixed(2) + ' (x' + f.toFixed(2) + ')')
}))

// ---------- Ars mana cost reductions ----------
function hasTechnicaGlyph(spell) {
  if (spell == null) return false
  var it = spell.recipe().iterator()
  while (it.hasNext()) {
    var part = it.next()
    if (part != null && String(part.getRegistryName().getNamespace()) === 'ars_technica') return true
  }
  return false
}
NativeEvents.onEvent(SpellCostPost, safe('SpellCostPost', function (e) {
  if (e.context == null) return
  var p = e.context.getUnwrappedCaster()
  if (!isServerPlayer(p)) return
  var disc = 0
  if (hasTag(p, 'oowwo_glyph_economy')) disc += 0.10
  if (hasTag(p, 'oowwo_archmage_cd1')) disc += 0.03
  if (hasTag(p, 'oowwo_archmage_cd2')) disc += 0.03
  if (hasTag(p, 'oowwo_technomancer') && hasTechnicaGlyph(e.context.getSpell())) disc += 0.25
  if (disc <= 0) return
  var c0 = e.currentCost
  e.currentCost = Math.max(0, Math.round(c0 * (1 - Math.min(disc, 0.6))))
  debug(p, 'Ars mana cost: ' + c0 + ' -> ' + e.currentCost)
}))
