// oowwo: Tolerable Creepers coverage for Creeper Overhaul (2026-10-24).
// Tolerable Creepers 2.3.0 clears an explosion's block list only when the exploding mob is a Creeper AND is
// minecraft:creeper, its creepie, or in #tolerable_creepers:explosion_immune (checked in its
// ExplosionEvent.Detonate handler). Creeper Overhaul's 16 creepers extend vanilla Creeper and explode with
// themselves as the source, so tagging them here makes their explosions skip blocks too.
// Spores/creepies on death stay vanilla-creeper only (hardcoded in Tolerable Creepers).
// Server script: /reload applies it.
ServerEvents.tags('entity_type', event => {
  const types = ['badlands', 'bamboo', 'beach', 'birch', 'cave', 'dark_oak', 'desert', 'dripstone',
    'hills', 'jungle', 'mushroom', 'ocean', 'savannah', 'snowy', 'spruce', 'swamp']
  event.add('tolerable_creepers:explosion_immune', types.map(t => 'creeperoverhaul:' + t + '_creeper'))
})
