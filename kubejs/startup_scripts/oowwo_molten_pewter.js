// oowwo: molten pewter (2026-10-17). Eidolon pewter blend no longer smelts in a furnace; it melts in Wayfarer's blast
// furnace into this fluid and is cast in an ingot mould (recipes: server_scripts/oowwo_furnace_limits.js).
// Fluid only lives in the blast furnace / casting - no bucket, no block. Startup script: needs a full restart.
StartupEvents.registry('fluid', function (event) {
  event.create('oowwo:molten_pewter')
    .displayName('Molten Pewter')
    .tint(0x8F98A6)
    .stillTexture('minecraft:block/lava_still')
    .flowingTexture('minecraft:block/lava_flow')
    .noBucket()
    .noBlock()
})
