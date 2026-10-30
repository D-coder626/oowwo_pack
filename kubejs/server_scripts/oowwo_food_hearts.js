// oowwo_food_hearts.js — 2026-10-28
// Death costs exactly ONE heart in total, never below 5 hearts total. Breaking the Lost Heart gives it back.
//
// How it fits with wayfarer_core:
//   - wayfarer heart count above 5: wayfarer already takes the heart on respawn and spawns its own Lost Heart
//     on the corpse. This script does nothing.
//   - wayfarer count at its floor (5) but the player has Spice of Life bonus hearts: wayfarer does nothing,
//     so this script takes ONE Spice of Life heart (removes just enough eaten foods to drop one milestone)
//     and spawns a Lost Heart on the player's corpse exactly like wayfarer does.
//   - 5 hearts total (wayfarer 5, no food hearts): nothing is lost and no Lost Heart spawns.
// Breaking any Lost Heart gives +1 wayfarer heart (wayfarer's own code), so the total always comes back by 1.
// Removed foods can simply be eaten again; Heart Crystals still give wayfarer hearts.
// Requires solcarrot-server.toml heartsPerMilestone = 1 (one heart per milestone).
// Dying again before breaking the heart invalidates the old one (same rule as wayfarer: token bump).

var OFH_Hearts = Java.loadClass('dev.tazer.wayfarer.lifegem.Hearts')
var OFH_Tokens = Java.loadClass('dev.tazer.wayfarer.lifegem.LostHeartTokens')
var OFH_LostHeart = Java.loadClass('dev.tazer.wayfarer.lifegem.LostHeart')
var OFH_FoodList = Java.loadClass('com.cazsius.solcarrot.tracking.FoodList')
var OFH_SolConfig = Java.loadClass('com.cazsius.solcarrot.SOLCarrotConfig')
var OFH_ItemStack = Java.loadClass('net.minecraft.world.item.ItemStack')
var OFH_CompoundTag = Java.loadClass('net.minecraft.nbt.CompoundTag')
var OFH_ServerPlayer = Java.loadClass('net.minecraft.server.level.ServerPlayer')
var OFH_DeathEvent = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingDeathEvent')
var OFH_JoinEvent = Java.loadClass('net.neoforged.neoforge.event.entity.EntityJoinLevelEvent')
var OFH_Priority = Java.loadClass('net.neoforged.bus.api.EventPriority')
var OFH_Corpse = Java.loadClass('com.farcr.ragdoll.content.entity.CorpseEntity')

var OFH_WINDOW = 40          // ticks to wait for the corpse, same as wayfarer
var OFH_PENDING = {}         // owner uuid string -> { token, deadline }

// KubeJS renames some Minecraft methods for scripts (Entity.getUUID -> getUuid, Level.getGameTime -> getTime,
// Entity.level() -> property). call() tries each spelling so the script works either way.
function ofhCall(obj, names, args) {
  for (var i = 0; i < names.length; i++) {
    var n = names[i]
    if (obj == null || typeof obj[n] !== 'function') continue
    var a = args || []
    if (a.length === 0) return obj[n]()
    if (a.length === 1) return obj[n](a[0])
    if (a.length === 2) return obj[n](a[0], a[1])
    return obj[n](a[0], a[1], a[2])
  }
  throw 'none of ' + names.join('/') + ' on ' + obj
}
function ofhUuid(e) { return ofhCall(e, ['getUuid', 'getUUID']) }
function ofhLevel(e) { return typeof e.level === 'function' ? e.level() : e.level }
function ofhTime(lvl) { return ofhCall(lvl, ['getTime', 'getGameTime']) }

function ofhLog(msg) { console.info('[oowwo_food_hearts] ' + msg) }

// Remove just enough counted foods to drop exactly one milestone. Returns true if a heart was taken.
function ofhTakeFoodHeart(player) {
  var fl = OFH_FoodList.get(player)
  var info = fl.getProgressInfo()
  var m = info.milestonesAchieved()
  if (m <= 0) return false
  var threshold = OFH_SolConfig.milestone(m - 1)            // foods needed for the current milestone
  var toRemove = info.foodsEaten - threshold + 1             // drop to one below it
  if (toRemove <= 0) return false
  var all = []
  var counted = []
  var it = fl.getEatenFoods().iterator()
  while (it.hasNext()) {
    var fi = it.next()
    all.push(fi)
    if (OFH_SolConfig['shouldCount(net.minecraft.world.item.Item)'](fi.getItem())) counted.push(fi)   // explicit overload: Item vs ItemStack is ambiguous in KubeJS
  }
  // pick random counted foods to forget
  var forget = {}
  var removed = []
  for (var i = 0; i < toRemove && counted.length > 0; i++) {
    var idx = Math.floor(Math.random() * counted.length)
    var pick = counted.splice(idx, 1)[0]
    forget[pick.encode()] = true
    removed.push(pick.encode())
  }
  fl.clearFood()
  for (var j = 0; j < all.length; j++) {
    if (!forget[all[j].encode()]) fl.addFood(all[j].getItem().getDefaultInstance())
  }
  ofhLog(player.getGameProfile().getName() + ' lost a food heart (' + m + ' -> ' + fl.getProgressInfo().milestonesAchieved() +
    '), forgot: ' + removed.join(', '))
  return true
}

// Ragdoll spawns the corpse INSIDE the death event (normal priority), so the claim must exist before that:
// HIGHEST registers the claim (same as wayfarer). The heart is only taken at LOWEST, after every other mod and
// our skill scripts had the chance to cancel the death. A cancelled death never reaches LOWEST, so no loss.
NativeEvents.onEvent(OFH_Priority.HIGHEST, OFH_DeathEvent, function (event) {
  try {
    var p = event.getEntity()
    if (!(p instanceof OFH_ServerPlayer) || p.isSpectator()) return
    if (OFH_Hearts.of(p) > OFH_Hearts.MIN_HEARTS) return       // wayfarer handles this death itself
    if (OFH_FoodList.get(p).getProgressInfo().milestonesAchieved() <= 0) return
    OFH_PENDING[String(ofhUuid(p))] = { token: null, deadline: ofhTime(ofhLevel(p)) + OFH_WINDOW }
  } catch (e) { console.warn('[oowwo_food_hearts] claim error: ' + e) }
})

NativeEvents.onEvent(OFH_Priority.LOWEST, OFH_DeathEvent, function (event) {
  try {
    var p = event.getEntity()
    if (!(p instanceof OFH_ServerPlayer) || p.isSpectator()) return
    if (OFH_Hearts.of(p) > OFH_Hearts.MIN_HEARTS) return
    var key = String(ofhUuid(p))
    if (!ofhTakeFoodHeart(p)) {
      delete OFH_PENDING[key]
      ofhLog(p.getGameProfile().getName() + ' died at the 5-heart floor; nothing lost')
      return
    }
    var token = OFH_Tokens.of(p.getServer()).bump(ofhUuid(p))   // also invalidates any older Lost Heart
    if (OFH_PENDING[key]) OFH_PENDING[key].token = token
  } catch (e) { console.warn('[oowwo_food_hearts] death handler error: ' + e) }
})

// The player's Ragdoll corpse joining the world -> put the Lost Heart on it next tick (same as wayfarer).
NativeEvents.onEvent(OFH_JoinEvent, function (event) {
  try {
    var lvl = event.getLevel()
    if (lvl.isClientSide()) return
    var corpse = event.getEntity()
    if (!(corpse instanceof OFH_Corpse)) return
    var owner = ofhCall(corpse, ['getOwnerUUID', 'getOwnerUuid'])
    if (owner == null) return
    var key = String(owner)
    var claim = OFH_PENDING[key]
    if (!claim) return
    // keep the claim in the map: the LOWEST death handler runs AFTER this (same event) and writes the token into it
    if (ofhTime(lvl) > claim.deadline) { delete OFH_PENDING[key]; ofhLog('corpse for ' + key + ' arrived too late, no Lost Heart'); return }
    ofhLog('corpse for ' + key + ' found, Lost Heart queued')
    lvl.getServer().scheduleInTicks(1, function () {
      try {
        if (OFH_PENDING[key] === claim) delete OFH_PENDING[key]
        if (claim.token == null) { ofhLog('no heart was taken for ' + key + ', no Lost Heart'); return }
        if (corpse.isRemoved()) { ofhLog('corpse for ' + key + ' gone before the heart spawned'); return }
        var heart = lvl.createEntity('wayfarer_core:lost_heart')
        var tag = new OFH_CompoundTag()
        ofhCall(tag, ['putUUID', 'putUuid'], ['owner', owner])
        ofhCall(tag, ['putUUID', 'putUuid'], ['corpse', ofhUuid(corpse)])
        tag.putInt('token', claim.token)
        tag.putInt('cracks', 0)
        heart.mergeNbt(tag)
        var head = OFH_LostHeart.headOf(corpse)
        ofhCall(heart, ['setPos', 'setPosition'], [head.x, head.y + 0.6 - heart.getBbHeight() * 0.5, head.z])
        heart.spawn()
        ofhLog('Lost Heart spawned on corpse for ' + key + ' (token ' + claim.token + ')')
      } catch (e2) { console.warn('[oowwo_food_hearts] heart spawn error: ' + e2) }
    })
  } catch (e) { console.warn('[oowwo_food_hearts] corpse handler error: ' + e) }
})
