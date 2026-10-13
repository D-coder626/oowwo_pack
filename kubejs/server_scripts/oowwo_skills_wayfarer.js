// oowwo skill trees, Wayfarer script: XP sources + special effects of the tagged Wayfarer nodes (2026-10-03)
// Same rules as the other skill scripts: every handler wrapped in safe(); KubeJS 2101 remaps respected
// (DamageSource getActual, Entity getUuid/attack, e.level property, Level getTime, .equals() for entities).
// NeoForge event classes confirmed by references in other mods' bytecode in this instance
// (Tide references ItemFishedEvent; KubeJS references ItemSmeltedEvent).
// Testing aid: `/tag @s add oowwo_debug` prints [skills] lines in chat.

function safe(name, fn) {
  return function (e) {
    try { fn(e) } catch (err) { console.error('[oowwo_skills_wayfarer] ' + name + ': ' + err) }
  }
}

var BuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
var Registries = Java.loadClass('net.minecraft.core.registries.Registries')
var ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')
var TagKey = Java.loadClass('net.minecraft.tags.TagKey')
var BlockPos = Java.loadClass('net.minecraft.core.BlockPos')
var Component = Java.loadClass('net.minecraft.network.chat.Component')
var ParticleTypes = Java.loadClass('net.minecraft.core.particles.ParticleTypes')
var DamageTypes = Java.loadClass('net.minecraft.world.damagesource.DamageTypes')
var ServerPlayer = Java.loadClass('net.minecraft.server.level.ServerPlayer')
var Animal = Java.loadClass('net.minecraft.world.entity.animal.Animal')
var AgeableMob = Java.loadClass('net.minecraft.world.entity.AgeableMob')
var TamableAnimal = Java.loadClass('net.minecraft.world.entity.TamableAnimal')
var Boat = Java.loadClass('net.minecraft.world.entity.vehicle.Boat')
var ItemEntity = Java.loadClass('net.minecraft.world.entity.item.ItemEntity')
var CropBlock = Java.loadClass('net.minecraft.world.level.block.CropBlock')
var StemBlock = Java.loadClass('net.minecraft.world.level.block.StemBlock')
var SweetBerryBushBlock = Java.loadClass('net.minecraft.world.level.block.SweetBerryBushBlock')
var CampfireBlock = Java.loadClass('net.minecraft.world.level.block.CampfireBlock')
var SmokerBlockEntity = Java.loadClass('net.minecraft.world.level.block.entity.SmokerBlockEntity')
var AbstractFurnaceBlockEntity = Java.loadClass('net.minecraft.world.level.block.entity.AbstractFurnaceBlockEntity')
var CampfireBlockEntity = Java.loadClass('net.minecraft.world.level.block.entity.CampfireBlockEntity')
var ItemAbilities = Java.loadClass('net.neoforged.neoforge.common.ItemAbilities')

var AnimalTame = Java.loadClass('net.neoforged.neoforge.event.entity.living.AnimalTameEvent')
var BabySpawn = Java.loadClass('net.neoforged.neoforge.event.entity.living.BabyEntitySpawnEvent')
var UseItemFinish = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingEntityUseItemEvent$Finish')
var UseItemStart = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingEntityUseItemEvent$Start')
var LivingFall = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingFallEvent')
var LivingIncoming = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingIncomingDamageEvent')
var LivingDamagePre = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingDamageEvent$Pre')
var LivingDrops = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingDropsEvent')
var Bonemeal = Java.loadClass('net.neoforged.neoforge.event.entity.player.BonemealEvent')
var ItemFished = Java.loadClass('net.neoforged.neoforge.event.entity.player.ItemFishedEvent')
var ItemSmelted = Java.loadClass('net.neoforged.neoforge.event.entity.player.PlayerEvent$ItemSmeltedEvent')
var EntityInteract = Java.loadClass('net.neoforged.neoforge.event.entity.player.PlayerInteractEvent$EntityInteract')
var BreakEvent = Java.loadClass('net.neoforged.neoforge.event.level.BlockEvent$BreakEvent')
var ToolModify = Java.loadClass('net.neoforged.neoforge.event.level.BlockEvent$BlockToolModificationEvent')
var FarmlandTrample = Java.loadClass('net.neoforged.neoforge.event.level.BlockEvent$FarmlandTrampleEvent')
var SaplingBlock = Java.loadClass('net.minecraft.world.level.block.SaplingBlock')
var EntityPlace = Java.loadClass('net.neoforged.neoforge.event.level.BlockEvent$EntityPlaceEvent')
var ItemCrafted = Java.loadClass('net.neoforged.neoforge.event.entity.player.PlayerEvent$ItemCraftedEvent')
var BacktankUtil = Java.loadClass('com.simibubi.create.content.equipment.armor.BacktankUtil')
var ContraptionEntity = Java.loadClass('com.simibubi.create.content.contraptions.AbstractContraptionEntity')
var SeatEntity = Java.loadClass('com.simibubi.create.content.contraptions.actors.seat.SeatEntity')
var CuriosApi = Java.loadClass('top.theillusivec4.curios.api.CuriosApi')
var EquipmentSlot = Java.loadClass('net.minecraft.world.entity.EquipmentSlot')
var MobEffectCategory = Java.loadClass('net.minecraft.world.effect.MobEffectCategory')
var AttributeModifier = Java.loadClass('net.minecraft.world.entity.ai.attributes.AttributeModifier')
var Operation = Java.loadClass('net.minecraft.world.entity.ai.attributes.AttributeModifier$Operation')

var CATEGORY = 'oowwo:wayfarer'
var ORES = TagKey.create(Registries.BLOCK, ResourceLocation.parse('c:ores'))
var CLIMBABLE = TagKey.create(Registries.BLOCK, ResourceLocation.parse('minecraft:climbable'))
var KNIVES = TagKey.create(Registries.ITEM, ResourceLocation.parse('c:tools/knife'))

function hasTag(p, t) { return p.getTags().contains(t) }
function isPlayer(e) { return e != null && (e instanceof ServerPlayer) }
function debug(p, msg) { if (hasTag(p, 'oowwo_debug')) p.tell('[skills] ' + msg) }
function bar(p, msg) { p.displayClientMessage(Component.literal(msg), true) }
function now(p) { return p.level.getTime() }
function posOf(e) { return BlockPos.containing(e.getX(), e.getY(), e.getZ()) }
function blockId(state) { return String(BuiltInRegistries.BLOCK.getKey(state.getBlock())) }
function itemId(stack) { return String(BuiltInRegistries.ITEM.getKey(stack.getItem())) }

var EFFECTS = {}
function effHolder(id) {
  if (!EFFECTS[id]) {
    var opt = BuiltInRegistries.MOB_EFFECT.getHolder(ResourceLocation.parse(id))
    EFFECTS[id] = opt.isPresent() ? opt.get() : 'missing'
  }
  return EFFECTS[id] === 'missing' ? null : EFFECTS[id]
}
function effect(e, id, ticks, amp) {
  var h = effHolder(id); if (h == null) return
  e.potionEffects.add(h, ticks, amp, true, true)
}

// ---------------- XP ----------------
// Rolling budget per player per source so farms can't flood the tree: at most `max` XP per `windowTicks`.
var BUDGET = {}
function budget(p, key, amount, max, windowTicks) {
  var k = String(p.getUuid()) + key, t = now(p), b = BUDGET[k]
  if (b == null || t - b.start >= windowTicks) { b = { start: t, used: 0 }; BUDGET[k] = b }
  var allowed = Math.max(0, Math.min(amount, max - b.used))
  b.used += allowed
  return allowed
}
function giveXp(p, amount, why) {
  if (hasTag(p, 'oowwo_legendary_wayfarer')) amount *= 1.5
  amount = Math.floor(amount)
  if (amount <= 0) return
  p.getServer().runCommandSilent('puffish_skills experience add ' + p.getScoreboardName() + ' ' + CATEGORY + ' ' + amount)
  debug(p, why + ': +' + amount + ' Wayfarer XP')
}
var FIVE_MIN = 6000
var CD = {}
function ready(key, t, ticks) { if (CD[key] != null && t - CD[key] < ticks) return false; CD[key] = t; return true }
var ATTRS = {}
function setMod(p, attrId, modId, amount, on) {
  if (!ATTRS[attrId]) { var o = BuiltInRegistries.ATTRIBUTE.getHolder(ResourceLocation.parse(attrId)); ATTRS[attrId] = o.isPresent() ? o.get() : 'missing' }
  if (ATTRS[attrId] === 'missing') return
  var inst = p.getAttribute(ATTRS[attrId]); if (inst == null) return
  var rl = ResourceLocation.parse(modId)
  if (on) inst.addOrUpdateTransientModifier(new AttributeModifier(rl, amount, Operation.ADD_VALUE))
  else if (inst.getModifier(rl) != null) inst['removeModifier(net.minecraft.resources.ResourceLocation)'](rl)
}

// World-saved per-player data (survives death and restarts): foods tasted, play time counter
function pdata(p) {
  var pd = p.getServer().persistentData
  var root = pd.getCompound('oowwo_wayfarer')
  var uuid = String(p.getUuid())
  return {
    get: function () { return root.getCompound(uuid) },
    save: function (mine) { root.put(uuid, mine); pd.put('oowwo_wayfarer', root) }
  }
}

// ---------------- food helpers ----------------
function foodOf(stack, p) {
  if (stack == null || stack.isEmpty()) return null
  return stack.getFoodProperties(p)
}
function foodEffects(food) { // [{id, holder, duration, amp}]
  var out = []
  if (food == null) return out
  var it = food.effects().iterator()
  while (it.hasNext()) {
    var inst = it.next().effect()
    var key = inst.getEffect().unwrapKey()
    out.push({ id: key.isPresent() ? String(key.get().location()) : '', holder: inst.getEffect(), duration: inst.getDuration(), amp: inst.getAmplifier() })
  }
  return out
}
function isMeal(effs) {
  for (var i = 0; i < effs.length; i++) if (effs[i].id === 'farmersdelight:nourishment' || effs[i].id === 'farmersdelight:comfort') return true
  return false
}
var COOKED_WORDS = ['cooked', 'baked', 'roast', 'grilled', 'fried', 'smoked', 'stew', 'soup', 'pie', 'bread', 'meal', 'sandwich', 'burger', 'wrap', 'pasta', 'rice', 'curry', 'porridge', 'skewer', 'kebab', 'cake', 'cookie']
function isCooked(stack, effs) {
  if (isMeal(effs)) return true
  var id = itemId(stack)
  for (var i = 0; i < COOKED_WORDS.length; i++) if (id.indexOf(COOKED_WORDS[i]) >= 0) return true
  return false
}

// ================= XP sources =================
// Taming
NativeEvents.onEvent(AnimalTame, safe('xp_tame', function (e) {
  var p = e.getTamer()
  if (isPlayer(p)) giveXp(p, budget(p, 'tame', 15, 60, FIVE_MIN), 'Tamed an animal')
}))

// Breeding (+ Beast Whisperer breeding/growth speed)
NativeEvents.onEvent(BabySpawn, safe('xp_breed', function (e) {
  var p = e.getCausedByPlayer()
  if (!isPlayer(p)) return
  giveXp(p, budget(p, 'breed', 5, 40, FIVE_MIN), 'Bred animals')
  var a = e.getParentA(), b = e.getParentB(), child = e.getChild()
  p.getServer().scheduleInTicks(1, safe('bw_ages', function () {
    if (hasTag(p, 'oowwo_bw_breed')) {
      ;[a, b].forEach(function (m) { if (m != null && (m instanceof AgeableMob) && m.getAge() > 3000) m.setAge(3000) })
    }
    if (hasTag(p, 'oowwo_bw_grow') && child != null && (child instanceof AgeableMob) && child.getAge() < -12000) child.setAge(-12000)
  }))
}))

// Harvesting grown crops, mining ores (+ Green Thumb: Bountiful replant)
NativeEvents.onEvent(BreakEvent, safe('xp_break', function (e) {
  var p = e.getPlayer()
  if (!isPlayer(p) || p.isCreative()) return
  var state = e.getState(), block = state.getBlock()
  if ((block instanceof CropBlock) && block.isMaxAge(state)) {
    giveXp(p, budget(p, 'crop', 1, 30, FIVE_MIN), 'Harvested a crop')
    if (hasTag(p, 'oowwo_gt_harvest_song') && Math.random() < 0.10) { effect(p, 'minecraft:saturation', 2, 0); debug(p, 'Harvest Song: Saturation') }
    if (hasTag(p, 'oowwo_gt_replant')) {
      var level = e.getLevel(), pos = e.getPos()
      var seed = block.asItem()
      p.getServer().scheduleInTicks(1, safe('replant', function () {
        if (!level.getBlockState(pos).isAir()) return
        var fresh = block.defaultBlockState()
        if (!fresh.canSurvive(level, pos)) return
        var inv = p.getInventory()
        for (var i = 0; i < inv.getContainerSize(); i++) {
          var st = inv.getItem(i)
          if (!st.isEmpty() && st.getItem() === seed) {
            st.shrink(1)
            level.setBlockAndUpdate(pos, fresh)
            debug(p, 'Bountiful: replanted')
            return
          }
        }
      }))
    }
    return
  }
  if (state.is(ORES)) giveXp(p, budget(p, 'ore', 1, 40, FIVE_MIN), 'Mined ore')
}))

// Fishing
NativeEvents.onEvent(ItemFished, safe('xp_fish', function (e) {
  var p = e.getEntity()
  if (!isPlayer(p)) return
  var kraken = hasTag(p, 'oowwo_krakens_favor')
  giveXp(p, budget(p, 'fish', kraken ? 12 : 6, kraken ? 120 : 60, FIVE_MIN), 'Caught a fish')
  if (kraken && Math.random() < 0.30) {
    var drops = e.getDrops()
    for (var i = 0; i < drops.size(); i++) p.give(drops.get(i).copy())
    debug(p, "Kraken's Favor: catch doubled")
  }
}))

// Cooking food (taking cooked food out of a furnace, smoker or campfire-style furnace)
NativeEvents.onEvent(ItemSmelted, safe('xp_smelt', function (e) {
  var p = e.getEntity(), st = e.getSmelting()
  if (!isPlayer(p) || foodOf(st, p) == null) return
  giveXp(p, budget(p, 'cook', Math.max(1, Math.floor(st.getCount() / 2)), 30, FIVE_MIN), 'Cooked food')
}))

// Eating: first taste of each food, plus Trail Rations / Hearthkeeper / Gourmand
NativeEvents.onEvent(UseItemFinish, safe('eat', function (e) {
  var p = e.getEntity()
  if (!isPlayer(p)) return
  var stack = e.getItem()
  var food = foodOf(stack, p)
  if (food == null) return
  var id = itemId(stack)
  var effs = foodEffects(food)
  var fd = p.getFoodData()

  // first taste
  var store = pdata(p), mine = store.get(), eaten = mine.getCompound('eaten')
  if (!eaten.getBoolean(id)) {
    eaten.putBoolean(id, true); mine.put('eaten', eaten); store.save(mine)
    giveXp(p, 10, 'New food tasted (' + id + ')')
    bar(p, 'New taste! +10 Wayfarer XP')
  }

  if (hasTag(p, 'oowwo_trail_rations')) {
    var spawn = p.level.getSharedSpawnPos()
    var dx = p.getX() - spawn.getX(), dz = p.getZ() - spawn.getZ()
    if (dx * dx + dz * dz > 500 * 500) { fd.setFoodLevel(Math.min(20, fd.getFoodLevel() + 1)); debug(p, 'Trail Rations: +1 hunger') }
  }
  if (hasTag(p, 'oowwo_hk_saturation') && isCooked(stack, effs)) {
    fd.setSaturation(Math.min(fd.getFoodLevel(), fd.getSaturationLevel() + 1)); debug(p, 'Hearthkeeper: +1 saturation')
  }
  if (isMeal(effs)) {
    if (hasTag(p, 'oowwo_hk_meals')) { effect(p, 'minecraft:regeneration', hasTag(p, 'oowwo_hk_long_regen') ? 200 : 100, 0); debug(p, 'Hearty Meals: Regeneration') }
    if (hasTag(p, 'oowwo_comfort_food')) {
      var it = p.getActiveEffects().iterator()
      while (it.hasNext()) {
        var inst = it.next()
        if (inst.getEffect().value().getCategory().equals(MobEffectCategory.HARMFUL)) {
          var bad = inst.getEffect()
          p.getServer().scheduleInTicks(1, safe('comfort_food', function () { p.removeEffect(bad) }))
          debug(p, 'Comfort Food: cleared a harmful effect'); break
        }
      }
    }
    var gourmand = hasTag(p, 'oowwo_gourmand'), feast = hasTag(p, 'oowwo_feast_host')
    if (gourmand || feast) {
      p.getServer().scheduleInTicks(1, safe('meal_effects', function () {
        effs.forEach(function (fx) {
          if (fx.id !== 'farmersdelight:nourishment' && fx.id !== 'farmersdelight:comfort') return
          if (gourmand) { p.potionEffects.add(fx.holder, Math.round(fx.duration * 1.25), fx.amp, false, true); debug(p, 'Gourmand: ' + fx.id + ' +25%') }
          if (feast) {
            var others = p.level.getEntitiesOfClass(ServerPlayer, p.getBoundingBox().inflate(8))
            for (var i = 0; i < others.size(); i++) {
              var o = others.get(i)
              if (o.equals(p)) continue
              o.potionEffects.add(fx.holder, fx.duration, fx.amp, false, true)
              effect(o, 'minecraft:regeneration', 200, 0)
              debug(p, 'Feast Host: shared ' + fx.id + ' with ' + o.getScoreboardName())
            }
          }
        })
      }))
    }
  }
}))

// ================= Tinkerer (Create) =================
var CREATE_MACHINES = { 'create:crush': 1, 'create:mechanical_saw': 1, 'create:mechanical_drill': 1, 'create:mechanical_roller': 1, 'create:fan_fire': 1, 'create:fan_lava': 1 }
function dmgTypeId(src) { var k = src.typeHolder().unwrapKey(); return k.isPresent() ? String(k.get().location()) : '' }
function isCreateId(id) { return id.indexOf('create') === 0 }
function wearsGoggles(p) {
  if (itemId(p.getItemBySlot(EquipmentSlot.HEAD)) === 'create:goggles') return true
  var opt = CuriosApi.getCuriosInventory(p)
  if (!opt.isPresent()) return false
  var item = BuiltInRegistries.ITEM.get(ResourceLocation.parse('create:goggles'))
  return item != null && opt.get().isEquipped(item)
}
var GLOWING = {}   // contraption entity uuid -> { e, t }
var TANK = {}      // player uuid -> air last second
function tinkererTick(p, level, t, uuid) {
  // Wrench Wizard: +1 reach holding a wrench
  setMod(p, 'minecraft:player.block_interaction_range', 'oowwo:tk_wrench', 1.0, hasTag(p, 'oowwo_tk_wrench') && itemId(p.getMainHandItem()) === 'create:wrench')
  // Engineer's Eye (+ Lamp Lenses)
  if (hasTag(p, 'oowwo_tk_eye') && wearsGoggles(p)) {
    effect(p, 'minecraft:haste', 40, 0)
    var cs = level.getEntitiesOfClass(ContraptionEntity, p.getBoundingBox().inflate(32))
    for (var i = 0; i < cs.size(); i++) { var c = cs.get(i); c.setGlowingTag(true); GLOWING[String(c.getUuid())] = { e: c, t: t } }
    if (hasTag(p, 'oowwo_tk_lenses') && p.getY() < 50 && !level.canSeeSky(p.blockPosition())) effect(p, 'minecraft:night_vision', 260, 0)
  }
  // Efficient Tanks: give back 25% of the backtank air used since last second
  if (hasTag(p, 'oowwo_tk_tanks')) {
    var tanks = BacktankUtil.getAllWithAir(p)
    if (tanks.size() > 0) {
      var tank = tanks.get(0), air = BacktankUtil.getAir(tank), last = TANK[uuid]
      if (last != null && air < last) {
        var refund = Math.round((last - air) * 0.25)
        if (refund > 0) { BacktankUtil.consumeAir(p, tank, -refund); air = BacktankUtil.getAir(tank) }
      }
      TANK[uuid] = air
    } else delete TANK[uuid]
  }
  // stop contraptions glowing once no goggled Tinkerer has refreshed them for 2 seconds
  for (var gk in GLOWING) {
    var g = GLOWING[gk]
    if (!g.e.isAlive() || t - g.t > 40 || t < g.t) { try { g.e.setGlowingTag(false) } catch (err) {} delete GLOWING[gk] }
  }
  // Clockwork Body: Speed II while riding a train or contraption
  var veh = p.getVehicle()
  if (hasTag(p, 'oowwo_tk_clockwork') && veh != null && ((veh instanceof ContraptionEntity) || (veh instanceof SeatEntity))) effect(p, 'minecraft:speed', 40, 1)
}
// Spud Gunner: Potato Cannon +50%
NativeEvents.onEvent(LivingDamagePre, safe('tk_spud', function (e) {
  var src = e.getSource(), a = src.getActual()
  if (isPlayer(a) && hasTag(a, 'oowwo_tk_spud') && dmgTypeId(src) === 'create:potato_cannon') e.setNewDamage(e.getNewDamage() * 1.5)
}))
// XP: first time placing each kind of Create block (+5)
NativeEvents.onEvent(EntityPlace, safe('tk_place', function (e) {
  var p = e.getEntity()
  if (!isPlayer(p) || p.isCreative()) return
  var id = blockId(e.getPlacedBlock())
  if (!isCreateId(id)) return
  var store = pdata(p), mine = store.get(), placed = mine.getCompound('placed')
  if (placed.getBoolean(id)) return
  placed.putBoolean(id, true); mine.put('placed', placed); store.save(mine)
  giveXp(p, 5, 'New Create block placed (' + id + ')')
  bar(p, 'New contraption part! +5 Wayfarer XP')
}))
// XP: crafting Create items (+1, capped) and Salvage (10%, Clockwork Body 25%)
NativeEvents.onEvent(ItemCrafted, safe('tk_craft', function (e) {
  var p = e.getEntity(), out = e.getCrafting()
  if (!isPlayer(p) || out == null || out.isEmpty() || !isCreateId(itemId(out))) return
  giveXp(p, budget(p, 'tk_craft', 1, 30, FIVE_MIN), 'Crafted ' + itemId(out))
  if (!hasTag(p, 'oowwo_tk_salvage')) return
  if (Math.random() >= (hasTag(p, 'oowwo_tk_clockwork') ? 0.25 : 0.10)) return
  var inv = e.getInventory(), picks = []
  for (var i = 0; i < inv.getContainerSize(); i++) { var st = inv.getItem(i); if (!st.isEmpty()) picks.push(st) }
  if (picks.length === 0) return
  var back = picks[Math.floor(Math.random() * picks.length)].copyWithCount(1)
  p.getServer().scheduleInTicks(1, safe('tk_salvage', function () { p.give(back); debug(p, 'Salvage: got back ' + itemId(back)) }))
}))

// ================= Iron Gut: food can't give you harmful effects =================
// Remember which harmful effects you had when you started eating; after eating, remove any new harmful ones.
var BEFORE_EAT = {}
function harmfulIds(p) {
  var out = {}, it = p.getActiveEffects().iterator()
  while (it.hasNext()) {
    var inst = it.next()
    if (inst.getEffect().value().getCategory().equals(MobEffectCategory.HARMFUL)) out[String(inst.getEffect().unwrapKey().get().location())] = inst.getEffect()
  }
  return out
}
function isEdible(stack, p) { return foodOf(stack, p) != null || /stew|soup/.test(itemId(stack)) }
NativeEvents.onEvent(UseItemStart, safe('iron_gut_start', function (e) {
  var p = e.getEntity()
  if (isPlayer(p) && hasTag(p, 'oowwo_iron_gut') && isEdible(e.getItem(), p)) BEFORE_EAT[String(p.getUuid())] = harmfulIds(p)
}))
NativeEvents.onEvent(UseItemFinish, safe('iron_gut_finish', function (e) {
  var p = e.getEntity()
  if (!isPlayer(p) || !hasTag(p, 'oowwo_iron_gut') || !isEdible(e.getItem(), p)) return
  var before = BEFORE_EAT[String(p.getUuid())] || {}
  p.getServer().scheduleInTicks(1, safe('iron_gut_clear', function () {
    var now = harmfulIds(p)
    for (var id in now) if (!before[id]) { p.removeEffect(now[id]); debug(p, 'Iron Gut: blocked ' + id) }
  }))
}))

// ================= per-tick work =================
var LAST = {}       // uuid -> {x, z, dim}
var DIST = {}       // uuid -> blocks walked since last XP
var LASTEX = {}     // uuid -> exhaustion last second (Legendary Wayfarer)
var NV_SEEN = {}    // uuid -> night vision duration seen last second (detects a fresh potion)
var STILL = {}      // uuid -> {pos, n} for Deep Sight
var HEARTH_TICK = -1, HEARTH_DONE = {}

function nightVisionPotions(p) {
  var k = String(p.getUuid()), h = effHolder('minecraft:night_vision')
  var cur = h ? p.getEffect(h) : null
  if (cur == null) { NV_SEEN[k] = 0; return }
  var d = cur.getDuration(), prev = NV_SEEN[k] || 0
  if (d > prev + 25 && !cur.isInfiniteDuration()) { // a new application since last second
    var f = 1.0
    if (hasTag(p, 'oowwo_dark_adaptation')) f = 1.5
    if (hasTag(p, 'oowwo_deep_sight') && p.getY() < 0) f = Math.max(f, 2.0)
    if (f > 1.0 && d > 400) { // only potions (our own Deep Sight sets NV_SEEN itself, so it is not seen as new)
      d = Math.round(d * f)
      p.removeEffect(h); p.potionEffects.add(h, d, cur.getAmplifier(), cur.isAmbient(), cur.isVisible())
      debug(p, 'Night Vision potion extended x' + f)
    }
  }
  NV_SEEN[k] = d
}
function deepSight(p, level, t) {
  var k = String(p.getUuid())
  var pos = Math.floor(p.getX() * 10) + ',' + Math.floor(p.getY() * 10) + ',' + Math.floor(p.getZ() * 10)
  var dark = level.getMaxLocalRawBrightness(BlockPos.containing(p.getX(), p.getEyeY(), p.getZ())) === 0
  var still = p.getY() < 0 && dark && p.isCrouching() && STILL[k] && STILL[k].pos === pos
  STILL[k] = { pos: pos, n: still ? STILL[k].n + 1 : 0 }
  if (still && STILL[k].n >= 2 && ready(k + 'deep_sight', t, 600)) {
    effect(p, 'minecraft:night_vision', 1200, 0); NV_SEEN[k] = 1200
    bar(p, 'Deep Sight'); debug(p, 'Deep Sight: Night Vision 60s')
  }
}

PlayerEvents.tick(safe('wayfarer_tick', function (e) {
  var p = e.player
  if (!isPlayer(p)) return
  var level = p.level, t = level.getTime()

  // Busy Hearth runs every tick: one extra cook tick for smokers and lit campfires within 4 blocks
  if (hasTag(p, 'oowwo_hk_cooking')) busyHearth(p, level, t)

  if (t % 20 !== 0) return
  var uuid = String(p.getUuid())

  // ---- travel XP: 2 per 100 horizontal blocks (doubled by Seasoned Traveler); teleports ignored
  var dim = ''
  try { dim = String(level.dimension().location()) } catch (err) { dim = String(level.getDimension()) }
  var last = LAST[uuid]
  if (last != null && last.dim === dim) {
    var dx = p.getX() - last.x, dz = p.getZ() - last.z, d = Math.sqrt(dx * dx + dz * dz)
    if (d < 45) {
      DIST[uuid] = (DIST[uuid] || 0) + d
      if (DIST[uuid] >= 100) {
        DIST[uuid] -= 100
        giveXp(p, hasTag(p, 'oowwo_seasoned') ? 4 : 2, 'Travelled 100 blocks')
      }
    }
  }
  LAST[uuid] = { x: p.getX(), z: p.getZ(), dim: dim }

  // ---- days spent in the world: each new world day (dawn) that passes while you're online = +40 XP.
  // Follows the world clock, so it respects Better Days' day/night length. Only a +1 day step counts
  // (a /time set jump of several days gives nothing).
  var store = pdata(p), mine = store.get()
  var day = Math.floor(Number(p.getServer().overworld().getLevelData().getDayTime()) / 24000)
  if (mine.contains('last_day')) {
    var lastDay = Number(mine.getLong('last_day'))
    if (day === lastDay + 1) { giveXp(p, 40, 'A day on the road'); bar(p, 'Another day on the road: +40 Wayfarer XP') }
  }
  if (!mine.contains('last_day') || Number(mine.getLong('last_day')) !== day) { mine.putLong('last_day', day); store.save(mine) }

  var pos = posOf(p)
  var feet = level.getBlockState(pos)
  var below = level.getBlockState(BlockPos.containing(p.getX(), p.getY() - 0.2, p.getZ()))
  var feetId = blockId(feet), belowId = blockId(below)

  // ---- Pathfinder: Speed I on soul sand / soul soil / mud / snow
  if (hasTag(p, 'oowwo_pathfinder') && p.onGround()) {
    var slow = { 'minecraft:soul_sand': 1, 'minecraft:soul_soil': 1, 'minecraft:mud': 1, 'minecraft:snow_block': 1, 'minecraft:snow': 1, 'minecraft:powder_snow': 1 }
    if (slow[feetId] || slow[belowId]) effect(p, 'minecraft:speed', 40, 0)
  }
  // ---- Roadwise: Speed I on paths and roads
  if (hasTag(p, 'oowwo_roadwise') && p.onGround() && (belowId.indexOf('path') >= 0 || belowId.indexOf('road') >= 0 || feetId.indexOf('path') >= 0)) {
    effect(p, 'minecraft:speed', 40, 0)
  }
  // ---- Dark Adaptation: Blindness and Darkness wear off twice as fast (one extra second per second)
  if (hasTag(p, 'oowwo_dark_adaptation')) {
    ;['minecraft:blindness', 'minecraft:darkness'].forEach(function (id) {
      var h = effHolder(id), cur = h ? p.getEffect(h) : null
      if (cur == null || cur.isInfiniteDuration()) return
      var left = cur.getDuration() - 20, amp = cur.getAmplifier()
      p.removeEffect(h)
      if (left > 0) p.potionEffects.add(h, left, amp, cur.isAmbient(), cur.isVisible())
    })
  }
  // ---- Night Vision potions last longer: Dark Adaptation x1.5, Deep Sight x2 below y=0
  nightVisionPotions(p)
  // ---- Deep Sight: below y=0, light 0, sneak still 2 seconds -> Night Vision 15s (60s cooldown)
  if (hasTag(p, 'oowwo_deep_sight')) deepSight(p, level, t)
  // ---- Well Fed: +5% healing received while Nourishment is active
  var nour = effHolder('farmersdelight:nourishment')
  setMod(p, 'apothic_attributes:healing_received', 'oowwo:well_fed', 0.05, hasTag(p, 'oowwo_well_fed') && nour != null && p.hasEffect(nour))
  // ---- Beast Whisperer: Loyal (pets regenerate 1 health every 5 seconds)
  if (hasTag(p, 'oowwo_bw_loyal') && t % 100 === 0) {
    var pets = level.getEntitiesOfClass(TamableAnimal, p.getBoundingBox().inflate(32))
    for (var j = 0; j < pets.size(); j++) {
      var pet = pets.get(j), own = pet.isTame() ? pet.getOwner() : null
      if (own != null && own.equals(p) && pet.getHealth() < pet.getMaxHealth()) pet.heal(1.0)
    }
  }

  // ---- Keen Nose: animals within 24 glow while sneaking
  if (hasTag(p, 'oowwo_keen_nose') && p.isCrouching()) {
    var animals = level.getEntitiesOfClass(Animal, p.getBoundingBox().inflate(24))
    for (var i = 0; i < animals.size(); i++) effect(animals.get(i), 'minecraft:glowing', 40, 0)
  }
  // ---- Angler: Sea Legs (no hunger drain in a boat), Old Salt (water breathing + dolphin's grace)
  if (hasTag(p, 'oowwo_angler_boat') && p.getVehicle() != null && (p.getVehicle() instanceof Boat)) p.getFoodData().setExhaustion(0)
  if (hasTag(p, 'oowwo_old_salt') && (p.isInWater() || (hasTag(p, 'oowwo_tidecaller') && level.isRainingAt(p.blockPosition())))) {
    effect(p, 'minecraft:water_breathing', 60, 0)
    effect(p, 'minecraft:dolphins_grace', 60, 0)
    if (hasTag(p, 'oowwo_conduit_heart')) effect(p, 'minecraft:conduit_power', 60, 0)
  }
  // ---- Tinkerer
  tinkererTick(p, level, t, uuid)
  // ---- Green Thumb: crops within 5 blocks get extra growth ticks (~3x growth)
  if (hasTag(p, 'oowwo_gt_aura') && t % 40 === 0) greenThumb(p, level, pos, hasTag(p, 'oowwo_gt_wide') ? 8 : 5, hasTag(p, 'oowwo_gt_saplings'))
  if (hasTag(p, 'oowwo_fertile_ground') && t % 40 === 20) greenThumb(p, level, pos, 8, hasTag(p, 'oowwo_gt_saplings'))
  // ---- Legendary Wayfarer: hunger drains 50% slower (halve the exhaustion gained each second)
  if (hasTag(p, 'oowwo_legendary_wayfarer')) {
    var fdl = p.getFoodData(), ex = fdl.getExhaustionLevel(), lastEx = LASTEX[uuid]
    if (lastEx != null && ex > lastEx) { ex = lastEx + (ex - lastEx) * 0.5; fdl.setExhaustion(ex) }
    LASTEX[uuid] = ex
  }
  // ---- Delver: Ore Sense
  if (hasTag(p, 'oowwo_delver_ore') && p.isCrouching() && t % 40 === 0) oreSense(p, level, pos, hasTag(p, 'oowwo_ore_range') ? 10 : 6, hasTag(p, 'oowwo_ore_count'))
}))

function greenThumb(p, level, c, r, saplings) {
  var rnd = level.getRandom(), grown = 0
  for (var x = -r; x <= r; x++) for (var y = -2; y <= 2; y++) for (var z = -r; z <= r; z++) {
    var bp = c.offset(x, y, z), st = level.getBlockState(bp), b = st.getBlock()
    var crop = (b instanceof CropBlock) || (b instanceof StemBlock) || (saplings && ((b instanceof SweetBerryBushBlock) || (b instanceof SaplingBlock)))
    if (!crop) continue
    if ((b instanceof CropBlock) && b.isMaxAge(st)) continue
    if (Math.random() < 0.06) { st.randomTick(level, bp, rnd); grown++ }
  }
  if (grown > 0) debug(p, 'Green Thumb: ' + grown + ' growth ticks')
}

function oreSense(p, level, c, r, count) {
  var best = null, bestD = 9999, n = 0
  for (var x = -r; x <= r; x++) for (var y = -r; y <= r; y++) for (var z = -r; z <= r; z++) {
    var d = x * x + y * y + z * z
    if (d > r * r || (!count && d >= bestD)) continue
    var bp = c.offset(x, y, z), st = level.getBlockState(bp)
    if (st.is(ORES)) { n++; if (d < bestD) { best = { pos: bp, state: st }; bestD = d } }
  }
  if (best == null) { bar(p, 'Ore Sense: nothing nearby'); return }
  var ex = p.getX(), ey = p.getEyeY() - 0.4, ez = p.getZ()
  var tx = best.pos.getX() + 0.5 - ex, ty = best.pos.getY() + 0.5 - ey, tz = best.pos.getZ() + 0.5 - ez
  var len = Math.sqrt(tx * tx + ty * ty + tz * tz)
  for (var i = 1; i <= 4; i++) {
    var f = (0.35 * i) / len
    level.sendParticles(p, ParticleTypes.ELECTRIC_SPARK, true, ex + tx * f, ey + ty * f, ez + tz * f, 1, 0, 0, 0, 0)
  }
  var where = best.pos.getY() < Math.floor(p.getY()) ? 'below' : (best.pos.getY() > Math.floor(p.getY()) + 1 ? 'above' : 'level')
  bar(p, 'Ore Sense: ' + best.state.getBlock().getName().getString() + ', ' + Math.round(Math.sqrt(bestD)) + ' blocks, ' + where + (count ? ' (' + n + ' ores in range)' : ''))
}

function busyHearth(p, level, t) {
  if (t !== HEARTH_TICK) { HEARTH_TICK = t; HEARTH_DONE = {} }
  var cx = Math.floor(p.getX()), cy = Math.floor(p.getY()), cz = Math.floor(p.getZ())
  var seen = {}
  for (var ox = -4; ox <= 4; ox += 8) for (var oz = -4; oz <= 4; oz += 8) {
    var chunk = level.getChunkAt(BlockPos.containing(cx + ox, cy, cz + oz))
    var ck = String(chunk.getPos())
    if (seen[ck]) continue
    seen[ck] = true
    var it = chunk.getBlockEntities().values().iterator()
    while (it.hasNext()) {
      var be = it.next(), bp = be.getBlockPos()
      if (Math.abs(bp.getX() - cx) > 4 || Math.abs(bp.getY() - cy) > 4 || Math.abs(bp.getZ() - cz) > 4) continue
      var key = String(bp.asLong())
      if (HEARTH_DONE[key]) continue
      var st = be.getBlockState()
      if (be instanceof SmokerBlockEntity) { HEARTH_DONE[key] = true; AbstractFurnaceBlockEntity.serverTick(level, bp, st, be) }
      else if ((be instanceof CampfireBlockEntity) && CampfireBlock.isLitCampfire(st)) { HEARTH_DONE[key] = true; CampfireBlockEntity.cookTick(level, bp, st, be) }
    }
  }
}

// ================= Green Thumb: Thrifty / Broad Hoe =================
NativeEvents.onEvent(Bonemeal, safe('gt_bonemeal', function (e) {
  var p = (typeof e.getPlayer === 'function') ? e.getPlayer() : e.getEntity()
  if (!isPlayer(p) || !hasTag(p, 'oowwo_gt_bonemeal') || p.isCreative()) return
  if ((typeof e.isValidBonemealTarget === 'function' && !e.isValidBonemealTarget()) || Math.random() >= 0.25) return
  p.getServer().scheduleInTicks(1, safe('gt_refund', function () { p.give('minecraft:bone_meal'); debug(p, 'Thrifty: bone meal refunded') }))
}))

NativeEvents.onEvent(ToolModify, safe('gt_till', function (e) {
  // 2026-10-04: KubeJS cannot call .equals() on a NeoForge ItemAbility (threw on every tool action) - compare by name
  if (e.isSimulated() || String(e.getItemAbility().name()) !== 'till') return
  var p = e.getPlayer()
  if (!isPlayer(p) || !hasTag(p, 'oowwo_gt_till')) return
  var fin = e.getFinalState()
  if (fin == null || blockId(fin) !== 'minecraft:farmland') return
  var level = p.level, c = e.getPos()
  var tillable = { 'minecraft:dirt': 1, 'minecraft:grass_block': 1, 'minecraft:dirt_path': 1 }
  var n = 0
  for (var x = -1; x <= 1; x++) for (var z = -1; z <= 1; z++) {
    if (x === 0 && z === 0) continue
    var bp = c.offset(x, 0, z)
    if (tillable[blockId(level.getBlockState(bp))] && level.getBlockState(bp.above()).isAir()) {
      level.setBlockAndUpdate(bp, fin); n++
    }
  }
  if (n > 0) debug(p, 'Broad Hoe: tilled ' + n + ' more')
}))

// ================= Beast Whisperer: Kinship (taming works on the first feeding) =================
NativeEvents.onEvent(EntityInteract, safe('bw_tame', function (e) {
  var p = e.getEntity(), a = e.getTarget()
  if (!isPlayer(p) || !hasTag(p, 'oowwo_bw_tame') || !(a instanceof TamableAnimal) || a.isTame()) return
  var stack = e.getItemStack()
  if (stack == null || stack.isEmpty()) return
  var item = stack.getItem(), before = stack.getCount(), hand = e.getHand()
  p.getServer().scheduleInTicks(1, safe('bw_tame_check', function () {
    if (!a.isAlive() || a.isTame()) return
    var held = p.getItemInHand(hand)
    var consumed = held.isEmpty() || held.getItem() !== item || held.getCount() < before
    if (!consumed) return
    a.tame(p)
    a.getNavigation().stop()
    a.setTarget(null)
    a.setOrderedToSit(true)
    a.level.broadcastEntityEvent(a, 7)
    giveXp(p, budget(p, 'tame', 15, 60, FIVE_MIN), 'Kinship: tamed on first feeding')
  }))
}))

// ================= damage =================
NativeEvents.onEvent(LivingIncoming, safe('incoming', function (e) {
  var v = e.getEntity(), src = e.getSource()
  if (!isPlayer(v)) return
  if (hasTag(v, 'oowwo_pathfinder') && src.is(DamageTypes.SWEET_BERRY_BUSH)) { e.setCanceled(true); return }
  var did = dmgTypeId(src)
  if (did.indexOf('create:') === 0 && (hasTag(v, 'oowwo_tk_clockwork') || (hasTag(v, 'oowwo_tk_safety') && CREATE_MACHINES[did]))) { e.setCanceled(true); debug(v, 'Tinkerer: no damage from ' + did); return }
  if (hasTag(v, 'oowwo_spelunker') && v.getY() < 0 && src.is(DamageTypes.IN_WALL)) { e.setCanceled(true); debug(v, 'Spelunker: no suffocation') }
}))

// Delver: Safe Descent
NativeEvents.onEvent(LivingFall, safe('safe_descent', function (e) {
  var p = e.getEntity()
  if (!isPlayer(p) || !hasTag(p, 'oowwo_delver_fall')) return
  var level = p.level
  var feet = level.getBlockState(posOf(p))
  var below = level.getBlockState(BlockPos.containing(p.getX(), p.getY() - 0.5, p.getZ()))
  if (feet.is(CLIMBABLE) || below.is(CLIMBABLE) || blockId(below) === 'minecraft:scaffolding') {
    e.setDamageMultiplier(0); debug(p, 'Safe Descent: no fall damage')
  }
}))

// Beast Whisperer: Alpha's Call (pets deal +20%), Bond (pets take -15%), Packmaster (death save)
function petOwnerWith(ent, tag) {
  if (ent == null || !(ent instanceof TamableAnimal) || !ent.isTame()) return null
  var o = ent.getOwner()
  return (isPlayer(o) && hasTag(o, tag)) ? o : null
}
NativeEvents.onEvent(LivingDamagePre, safe('pets', function (e) {
  var victim = e.getEntity(), attacker = e.getSource().getActual()
  if (petOwnerWith(attacker, 'oowwo_bw_alpha') != null) e.setNewDamage(e.getNewDamage() * 1.2)
  if (petOwnerWith(victim, 'oowwo_bw_bond') != null) e.setNewDamage(e.getNewDamage() * 0.85)
  var master = petOwnerWith(victim, 'oowwo_packmaster')
  if (master != null && e.getNewDamage() >= victim.getHealth() && ready(String(victim.getUuid()) + 'packmaster', victim.level.getTime(), 1200)) {
    e.setNewDamage(Math.max(0, victim.getHealth() - 1))
    var pet = victim
    master.getServer().scheduleInTicks(1, safe('packmaster_tp', function () {
      if (pet.isAlive() && pet.level.equals(master.level)) pet.teleportTo(master.getX(), master.getY(), master.getZ())
    }))
    master.tell('Packmaster: ' + victim.getName().getString() + ' was saved and returned to you.')
  }
}))

// Green Thumb: Fertile Ground (farmland within 8 blocks of you can't be trampled)
NativeEvents.onEvent(FarmlandTrample, safe('fertile_ground', function (e) {
  var level = e.getLevel(), pos = e.getPos()
  var players = level.players()
  for (var i = 0; i < players.size(); i++) {
    var p = players.get(i)
    if (hasTag(p, 'oowwo_fertile_ground') && p.distanceToSqr(pos.getX() + 0.5, pos.getY() + 0.5, pos.getZ() + 0.5) <= 64) { e.setCanceled(true); return }
  }
}))

// Forager's Knife: animals killed with a knife drop one extra food item
NativeEvents.onEvent(LivingDrops, safe('foragers_knife', function (e) {
  var victim = e.getEntity(), p = e.getSource().getActual()
  if (!isPlayer(p) || !hasTag(p, 'oowwo_foragers_knife') || !(victim instanceof Animal)) return
  var tool = p.getMainHandItem()
  if (tool.isEmpty() || !(tool.is(KNIVES) || itemId(tool).indexOf('knife') >= 0)) return
  var drops = e.getDrops(), it = drops.iterator(), pick = null
  while (it.hasNext()) {
    var ie = it.next()
    if (foodOf(ie.getItem(), p) != null) { pick = ie; break }
  }
  if (pick == null) return
  drops.add(new ItemEntity(victim.level, victim.getX(), victim.getY(), victim.getZ(), pick.getItem().copyWithCount(1)))
  debug(p, "Forager's Knife: +1 " + itemId(pick.getItem()))
}))
