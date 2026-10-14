// oowwo_bow_hunting.js — bows are a hunting tool. Derek 2026-10-02: "Bonus damage + extra meat".
//
//   1. DAMAGE: an arrow shot by a player does x2 damage to passive animals (mob category CREATURE:
//      cows, pigs, deer, elk, goats, wolves, modded animals...). Tamed pets are excluded.
//   2. MEAT: when the killing blow on such an animal was a player's arrow, every raw (or fire-arrow
//      cooked) meat stack it drops gets +1.
//
// How it works (all read from the jars, KubeJS 2101.7.2 / LootJS 3.7.0):
//   - EntityEvents.beforeHurt = NeoForge LivingDamageEvent.Pre (getSource / getDamage / setDamage).
//   - "Was it an arrow?" = damage type msgId "arrow". Every AbstractArrow (vanilla, tipped, spectral,
//     and modded arrows that use the vanilla arrow damage source) reports it; tridents report "trident".
//   - The hurt event writes persistentData.oowwo_arrow_kill on the animal (true for a player arrow,
//     false for anything else), so the last hit before death decides. The LootJS modifier reads it.
//   - Meat is an explicit list (the #c:foods/raw_meat tag misses Critters n' Crawlers, Reanimal and
//     owlbear meat and includes sausage/innards). Every id is checked against its mod's jar/loot table.
// 2026-10-02 fix: entity.getType() is a string in KubeJS (getCategory failed); addTypeModifier -> addTableModifier.
// 2026-10-02 fix 2: DamageSource.getMsgId/getEntity are renamed in KubeJS to getType/getActual.
// Change MULT to tune (1.5 at first; Derek raised it to 2 on 2026-10-02). To revert: delete this file.

const OOWWO_BOW_MULT = 2
const $BowBuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
const $BowResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')

EntityEvents.beforeHurt(event => {
  var victim = event.entity
  var source = event.source
  try {
    // KubeJS remaps entity.getType() to the id STRING, so look the EntityType up in the registry
    var tid = String(victim.type)
    // 2026-10-14: some modded mobs (Creeper Overhaul creepers) report a type string like
    // 'minecraft:CreeperType[texture=...]', which is not a valid id and threw ~330 errors a day. Those are
    // monsters, not passive animals, so skip anything that is not a plain 'namespace:path' id.
    if (!/^[a-z0-9_.-]+:[a-z0-9\/._-]+$/.test(tid)) return
    var etype = $BowBuiltInRegistries.ENTITY_TYPE.get($BowResourceLocation.parse(tid))
    if (String(etype.getCategory().getName()) !== 'creature') return
    // KubeJS renames DamageSource methods for JS (DamageSourceMixin @RemapForJS):
    //   getMsgId() -> getType(), getEntity() -> getActual(), getDirectEntity() -> getImmediate()
    var arrow = String(source.getType()) === 'arrow'
    var shooter = source.getActual()
    var byPlayer = arrow && shooter != null && shooter.isPlayer()
    victim.persistentData.putBoolean('oowwo_arrow_kill', byPlayer)
    if (!byPlayer) return
    var tame = false
    try { if (victim.isTame) tame = victim.isTame() } catch (e) { }
    try { if (!tame && victim.isTamed) tame = victim.isTamed() } catch (e) { }
    if (tame) return
    event.setDamage(event.getDamage() * OOWWO_BOW_MULT)
  } catch (e) {
    console.warn('[oowwo_bow_hunting] ' + e)
  }
})

LootJS.modifiers(event => {
  const MEAT = [
    // vanilla
    'minecraft:beef', 'minecraft:porkchop', 'minecraft:chicken', 'minecraft:rabbit', 'minecraft:mutton',
    'minecraft:cooked_beef', 'minecraft:cooked_porkchop', 'minecraft:cooked_chicken', 'minecraft:cooked_rabbit',
    'minecraft:cooked_mutton',
    // No Man's Land, Goated
    'nomansland:raw_venison', 'nomansland:cooked_venison', 'nomansland:raw_horse', 'nomansland:horse_steak',
    'goated:chevon', 'goated:cooked_chevon',
    // Critters n' Crawlers
    'cnc:raw_venison', 'cnc:cooked_venison', 'cnc:raw_game', 'cnc:raw_turkey', 'cnc:raw_waterfowl',
    // Fangs & Claws
    'fangs_n_claws:owlbear_meat', 'fangs_n_claws:cooked_owlbear_meat'
  ]
  ;['capybara', 'crocodile', 'giraffe', 'hedgehog', 'hippopotamus', 'kiwi', 'ostrich', 'pigeon', 'seal'].forEach(m => {
    MEAT.push('reanimal:raw_' + m + '_meat', 'reanimal:cooked_' + m + '_meat')
  })

  event.addTableModifier(LootType.ENTITY)   // addTypeModifier is deprecated in LootJS 3.7 (logs an error)
    .matchEntityCustom(e => e.persistentData.getBoolean('oowwo_arrow_kill'))
    .modifyLoot(MEAT, item => { item.grow(1); return item })
})
