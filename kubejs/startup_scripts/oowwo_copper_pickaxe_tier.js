// oowwo: Caverns & Chasms copper pickaxe = BONE PICK tier, horizontal upgrade (Derek, 2026-10-07).
// Startup script: needs a full game restart (server AND client) to change.
//
// Bone pick (wayfarer_core WayfarerTiers.BONE, read from the jar): incorrect_for_wooden_tool, 150 uses, speed 3.0,
// attack bonus 0, enchantability 3. C&C COPPER tier (CCTiers, read from the jar): incorrect_for_copper_tool
// (= #minecraft:incorrect_for_iron_tool, i.e. IRON mining level - the reason it was removed), 3191 uses, speed 5.0,
// attack bonus 1, enchantability 13, repaired with copper BLOCKS.
//
// Here every copper pickaxe variant (all 4 oxidation stages + waxed) gets the bone pick's tier exactly, except:
//   - 750 uses (bone pick 150; bronze 275; iron 540) - the only advantage (Derek, 2026-10-07: was 250)
//   (recipe and repair stay C&C's own: 3 copper BLOCKS, repaired with copper blocks, like all C&C copper gear)
// Only the PICKAXES change. C&C copper axe/shovel/sword keep their own tier. Copper and tin stay minable at this
// tier because bone_pick_copper_tin.js removed them from every needs_*_tool tag.
// KubeJS setTier rebuilds the tool component, max damage and attack modifiers from the edited tier.
// Top-level prefix OCP_. To revert: delete this file (the pickaxe returns to C&C's iron-level tier).

ItemEvents.modification(function (event) {
  var OCP_AGES = ['', 'exposed_', 'weathered_', 'oxidized_', 'waxed_', 'waxed_exposed_', 'waxed_weathered_', 'waxed_oxidized_']
  var OCP_done = 0
  OCP_AGES.forEach(function (age) {
    var id = 'caverns_and_chasms:' + age + 'copper_pickaxe'
    try {
      event.modify(id, function (item) {
        item.setTier(function (tier) {
          tier.setIncorrectBlocksForDropsTag('minecraft:incorrect_for_wooden_tool')
          tier.setSpeed(3.0)
          tier.setAttackDamageBonus(0.0)
          tier.setEnchantmentValue(3)
          tier.setUses(750)
        })
      })
      OCP_done++
    } catch (err) {
      console.error('[oowwo_copper_pickaxe_tier] ' + id + ': ' + err)
    }
  })
  console.info('[oowwo_copper_pickaxe_tier] retiered ' + OCP_done + ' copper pickaxes to bone tier (750 uses)')
})
