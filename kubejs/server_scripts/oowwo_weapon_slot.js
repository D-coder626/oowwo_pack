// oowwo_weapon_slot.js — what Better Inventory's weapon slot accepts (Derek 2026-10-03, option A: knives only).
// Read from betterinventory-1.1.4 ItemKinds.isMeleeWeapon: accepted if SwordItem/TridentItem/MaceItem or in
// #minecraft:swords, #c:tools/melee_weapon, #c:tools/spear, #c:tools/mace — checked BEFORE the "mining tool
// = not a weapon" exclusion, so tagging knives into #c:tools/melee_weapon is enough (FD knives are diggers).
// Behaviour (CombatService.resolve): with a NON-weapon in hand, attacks use the slot weapon's damage AND speed.
// WHY ONLY KNIVES: with an empty hand, Better Inventory hands the slot weapon to Better Combat's attribute
// lookup, so Better Combat plays that weapon's animation but draws the real (empty) hand -> the weapon is
// invisible while attacking (seen with an Archers spear). Knives have no Better Combat animation, so they swing
// visibly. Rogues glaives/double axes and Archers spears were tried and REMOVED for this reason.
// Only other reader of #c:tools/melee_weapon in the pack: Galosphere's weapon rack (display).
ServerEvents.tags('item', event => {
  // Knives: harvesting animals (oowwo_animal_drops) and straw. FD, Wayfarer bronze/silver/ruined knives,
  // Dungeons Delight knives + cleavers (via #c:tools/knife / #farmersdelight:tools/knives).
  event.add('c:tools/melee_weapon', '#c:tools/knife')
  event.add('c:tools/melee_weapon', '#farmersdelight:tools/knives')
})
