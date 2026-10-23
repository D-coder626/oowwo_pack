// oowwo: molten zinc, molten brass and Brass Blend (2026-10-23). Recipes: server_scripts/oowwo_brass.js
// Fluids only live in the blast furnace / casting - no bucket, no block. Startup script: needs a full restart.
// Texture: kubejs/assets/oowwo/textures/item/brass_blend.png (Bronze mod blend recoloured).
StartupEvents.registry('fluid', function (event) {
  event.create('oowwo:molten_zinc')
    .displayName('Molten Zinc')
    .tint(0xB4C0C4)
    .stillTexture('minecraft:block/lava_still')
    .flowingTexture('minecraft:block/lava_flow')
    .noBucket()
    .noBlock()
  event.create('oowwo:molten_brass')
    .displayName('Molten Brass')
    .tint(0xD8A82E)
    .stillTexture('minecraft:block/lava_still')
    .flowingTexture('minecraft:block/lava_flow')
    .noBucket()
    .noBlock()
})
StartupEvents.registry('item', function (event) {
  event.create('oowwo:brass_blend')
    .displayName('Brass Blend')
    .tooltip('Melt in a blast furnace, or mix with heat in Create, to make brass.')
    .texture('oowwo:item/brass_blend')
})
