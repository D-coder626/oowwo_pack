// oowwo: Saint's Dragons — Raevyx and Ignivorus binders use steel instead of netherite (2026-10-04, Derek approved).
// Netherite ingots are uncraftable in oowwo (oowwo_steel_tier.js), so these two binders were unobtainable.
// PARKED: rename to .js after oowwo_saintsdragons_tiers.js is verified in play.
// Revert: delete this file.
ServerEvents.recipes(event => {
  ['saintsdragons:raevyx_binder', 'saintsdragons:ignivorus_binder'].forEach(id => {
    event.replaceInput({ id: id }, 'minecraft:netherite_ingot', 'wayfarer_core:steel_ingot');
  });
});
