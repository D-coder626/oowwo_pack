// oowwo — overworld mobs sometimes spawn wearing copper
// ---------------------------------------------------------------------------
// RENAME TO oowwo_copper_mobs.js TO ENABLE. KubeJS only loads *.js, so this
// file does nothing until you drop the .off. Install it AFTER the chest script
// has been confirmed working - one change at a time.
//
// Fills EMPTY armour slots only. A zombie that spawned in iron keeps its iron;
// this never replaces or removes anything.
//
// UNVERIFIED IN GAME. Read logs/kubejs/server.txt after the first /reload.
// ---------------------------------------------------------------------------

const $EquipmentSlot = Java.loadClass('net.minecraft.world.entity.EquipmentSlot')

// Per empty armour slot. Four slots, so at 0.12 roughly 40% of these mobs
// end up wearing at least one piece of copper.
const PIECE_CHANCE = 0.12

// Off by default on purpose: a zombie with a copper sword hits meaningfully
// harder than a bare-handed one, and that is a difficulty change, not a
// loot change. Turn it on deliberately if you want it.
const GIVE_WEAPONS  = false
const WEAPON_CHANCE = 0.08

const MOBS = [
  'minecraft:zombie',
  'minecraft:husk',
  'minecraft:drowned',
  'minecraft:zombie_villager',
  'minecraft:skeleton',
  'minecraft:stray'
]

const SLOTS = [
  [$EquipmentSlot.HEAD,  'helmet'],
  [$EquipmentSlot.CHEST, 'chestplate'],
  [$EquipmentSlot.LEGS,  'leggings'],
  [$EquipmentSlot.FEET,  'boots']
]

// Weighted toward aged copper - most of what wanders the overworld has been
// out in the weather a long time.
const AGES = ['', 'exposed_', 'exposed_', 'weathered_', 'weathered_', 'oxidized_']

function randomAge() {
  return AGES[Math.floor(Math.random() * AGES.length)]
}

MOBS.forEach(id => {
  EntityEvents.spawned(id, event => {
    const mob = event.entity
    if (!mob) return
    if (event.level.isClientSide()) return

    // EntityEvents.spawned is EntityJoinLevelEvent - it ALSO fires every time
    // the chunk reloads. Without this guard a mob with empty slots would get a
    // fresh roll on every load and the real rate would drift upward forever.
    if (mob.persistentData.getBoolean('oowwoCopper')) return
    mob.persistentData.putBoolean('oowwoCopper', true)

    SLOTS.forEach(([slot, piece]) => {
      if (!mob.getItemBySlot(slot).isEmpty()) return   // never touch existing gear
      if (Math.random() >= PIECE_CHANCE) return
      mob.setItemSlot(slot, Item.of(`caverns_and_chasms:${randomAge()}copper_${piece}`))
    })

    if (GIVE_WEAPONS
        && mob.getItemBySlot($EquipmentSlot.MAINHAND).isEmpty()
        && Math.random() < WEAPON_CHANCE) {
      mob.setItemSlot($EquipmentSlot.MAINHAND, Item.of(`caverns_and_chasms:${randomAge()}copper_sword`))
    }
  })
})

// ---------------------------------------------------------------------------
// NOTES
//
// Why this is not a LootJS rule:
//   Mob-worn gear drops through Mob#dropCustomDeathLoot -> dropEquipment(),
//   which never touches a loot table. LootJS's addEntityModifier cannot see it
//   in either direction - it can neither add nor remove worn equipment. The
//   only place to intervene is at spawn.
//
// Drop rate:
//   Left at the vanilla default (armorDropChances = 0.085 per slot), so a
//   copper-wearing zombie drops its gear about as often as an iron one would.
//   To make copper genuinely common in the world rather than just visible,
//   add inside the slot loop:
//       mob.setDropChance(slot, 0.35)
//
// Mobs deliberately not covered:
//   wither_skeleton and piglins are nether-side. Pillagers, vindicators and
//   evokers do not use armour slots in vanilla. Modded mobs are untouched -
//   many set their own equipment in their spawn logic and would fight this.
// ---------------------------------------------------------------------------
