// oowwo: Toxony mortar recipes use wayfarer_core:wax instead of honeycomb (Derek, 2026-09-27),
// matching the pack-wide honeycomb -> wax swap (candles, copper waxing, Ragdoll embalming).
// Each recipe below is Toxony 0.10.7's own JSON, copied from the jar with only honeycomb -> wax
// changed, re-added under an oowwo id after removing the original. (Rewritten rather than
// replaceInput, because toxony:mortar_pestle is a custom recipe type.)
// Skipped: toxony:mortar/oil_base_activated_oil (only loads with Vampirism, not installed).
// To revert: delete this file.

ServerEvents.recipes(event => {
  const R = fn => { try { fn(); } catch (e) { console.warn('[toxony_wax] skipped: ' + e); } };
  const RM = id => event.remove({ id: id });
  RM('toxony:mortar/acid_oil_pot');
  R(() => event.custom({"type": "toxony:mortar_pestle", "ingredients": [{"item": "wayfarer_core:wax"}, {"item": "toxony:toxic_paste"}, {"item": "toxony:acid_slimeball"}, {"item": "toxony:acid_slimeball"}], "result": {"count": 1, "id": "toxony:acid_oil_pot"}, "use": {"id": "toxony:empty_oil_pot"}}).id('oowwo:toxony_wax/acid_oil_pot'));
  RM('toxony:mortar/acid_tox_pot');
  R(() => event.custom({"type": "toxony:mortar_pestle", "ingredients": [{"item": "wayfarer_core:wax"}, {"item": "toxony:warproot"}, {"item": "toxony:acid_slimeball"}, {"item": "toxony:bog_bone"}], "result": {"count": 1, "id": "toxony:acid_tox_pot"}, "use": {"id": "toxony:empty_tox_pot"}}).id('oowwo:toxony_wax/acid_tox_pot'));
  RM('toxony:mortar/fatigue_oil_pot');
  R(() => event.custom({"type": "toxony:mortar_pestle", "ingredients": [{"item": "wayfarer_core:wax"}, {"item": "minecraft:fermented_spider_eye"}, {"item": "toxony:water_hemlock"}], "result": {"count": 1, "id": "toxony:fatigue_oil_pot"}, "use": {"id": "toxony:empty_oil_pot"}}).id('oowwo:toxony_wax/fatigue_oil_pot'));
  RM('toxony:mortar/fire_resistance_oil_pot');
  R(() => event.custom({"type": "toxony:mortar_pestle", "ingredients": [{"item": "wayfarer_core:wax"}, {"item": "minecraft:magma_cream"}], "result": {"count": 1, "id": "toxony:fire_resistance_oil_pot"}, "use": {"id": "toxony:empty_oil_pot"}}).id('oowwo:toxony_wax/fire_resistance_oil_pot'));
  RM('toxony:mortar/glowing_oil_pot');
  R(() => event.custom({"type": "toxony:mortar_pestle", "ingredients": [{"item": "wayfarer_core:wax"}, {"item": "minecraft:glow_ink_sac"}], "result": {"count": 1, "id": "toxony:glowing_oil_pot"}, "use": {"id": "toxony:empty_oil_pot"}}).id('oowwo:toxony_wax/glowing_oil_pot'));
  RM('toxony:mortar/mending_oil_pot');
  R(() => event.custom({"type": "toxony:mortar_pestle", "ingredients": [{"item": "wayfarer_core:wax"}, {"item": "toxony:toxic_paste"}, {"item": "toxony:toxic_spit"}, {"item": "toxony:ocelot_mint"}], "result": {"count": 1, "id": "toxony:mending_oil_pot"}, "use": {"id": "toxony:empty_oil_pot"}}).id('oowwo:toxony_wax/mending_oil_pot'));
  RM('toxony:mortar/oil_base');
  R(() => event.custom({"type": "toxony:mortar_pestle", "ingredients": [{"item": "wayfarer_core:wax"}, {"item": "toxony:toxic_paste"}], "result": {"count": 2, "id": "toxony:oil_base"}}).id('oowwo:toxony_wax/oil_base'));
  RM('toxony:mortar/poison_oil_pot');
  R(() => event.custom({"type": "toxony:mortar_pestle", "ingredients": [{"item": "wayfarer_core:wax"}, {"item": "toxony:poison_paste"}], "result": {"count": 1, "id": "toxony:poison_oil_pot"}, "use": {"id": "toxony:empty_oil_pot"}}).id('oowwo:toxony_wax/poison_oil_pot'));
  RM('toxony:mortar/regeneration_tox_pot');
  R(() => event.custom({"type": "toxony:mortar_pestle", "ingredients": [{"item": "wayfarer_core:wax"}, {"item": "minecraft:ghast_tear"}, {"item": "toxony:sunspot"}], "result": {"count": 1, "id": "toxony:regeneration_tox_pot"}, "use": {"id": "toxony:empty_tox_pot"}}).id('oowwo:toxony_wax/regeneration_tox_pot'));
  RM('toxony:mortar/smoke_tox_pot');
  R(() => event.custom({"type": "toxony:mortar_pestle", "ingredients": [{"item": "wayfarer_core:wax"}, {"item": "minecraft:fermented_spider_eye"}, {"item": "toxony:moonlight_hemlock"}], "result": {"count": 1, "id": "toxony:smoke_tox_pot"}, "use": {"id": "toxony:empty_tox_pot"}}).id('oowwo:toxony_wax/smoke_tox_pot'));
  RM('toxony:mortar/toxin_tox_pot');
  R(() => event.custom({"type": "toxony:mortar_pestle", "ingredients": [{"item": "wayfarer_core:wax"}, {"item": "toxony:toxin"}, {"item": "toxony:toxic_paste"}], "result": {"count": 1, "id": "toxony:toxin_tox_pot"}, "use": {"id": "toxony:empty_tox_pot"}}).id('oowwo:toxony_wax/toxin_tox_pot'));
  RM('toxony:mortar/witchfire_tox_pot');
  R(() => event.custom({"type": "toxony:mortar_pestle", "ingredients": [{"item": "wayfarer_core:wax"}, {"item": "minecraft:blaze_powder"}, {"item": "toxony:warproot"}], "result": {"count": 1, "id": "toxony:witchfire_tox_pot"}, "use": {"id": "toxony:empty_tox_pot"}}).id('oowwo:toxony_wax/witchfire_tox_pot'));
});
