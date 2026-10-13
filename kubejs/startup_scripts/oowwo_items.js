// oowwo custom items (startup script, needs a full restart to change)
// Draught of Unlearning: drink to refund every skill point in the oowwo skill trees (Pufferfish's Skills).
// Brewed in Iron's Alchemist Cauldron: Water (250 mB) + Mercurial Salt. Mercurial Salt = 2 sulfur + 1 mercury ingot.
// Recipes + sulfur tag live in server_scripts/oowwo_skills_respec.js
var SKILL_CATEGORIES = ['oowwo:arcane', 'oowwo:martial', 'oowwo:wayfarer']

StartupEvents.registry('item', function (event) {
  event.create('oowwo:mercurial_salt')
    .displayName('Mercurial Salt')
    .tooltip('Brew in an Alchemist Cauldron of water to make a Draught of Unlearning.')
    .texture('minecraft:item/glowstone_dust')

  event.create('oowwo:draught_of_unlearning')
    .displayName('Draught of Unlearning')
    .tooltip('Drink to refund all of your skill points.')
    .texture('minecraft:item/dragon_breath')
    .rarity('rare')
    .glow(true)
    .maxStackSize(16)
    .useAnimation('drink')
    .useDuration(function (stack, entity) { return 32 })
    .use(function (level, player, hand) { return true })
    .finishUsing(function (stack, level, entity) {
      try {
        if (!level.isClientSide() && entity.isPlayer()) {
          var name = entity.getScoreboardName()
          var server = entity.getServer()
          for (var i = 0; i < SKILL_CATEGORIES.length; i++) {
            server.runCommandSilent('puffish_skills skills reset ' + name + ' ' + SKILL_CATEGORIES[i])
          }
          entity.tell('Your mind clears. All skill points have been refunded.')
          if (!entity.isCreative()) stack.shrink(1)
        }
      } catch (err) {
        console.error('[oowwo_items] draught_of_unlearning: ' + err)
      }
      return stack
    })
})
