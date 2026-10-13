// oowwo: alchemical ring crafting — items + cauldron fluids (2026-10-09; step 3 = all 8 tinctures, 18 rings).
// Design + build log: project doc claude/oowwo-rings-bronze-design.md. Recipes: server_scripts/oowwo_alchemy.js.
// Startup script: needs a full restart.
// Chain per tincture: grind (Toxony mortar) -> calx; cook (Cooking Pot / Monster Pot) -> solution;
//   ferment (Keg, vodka + salt) -> tincture.
// Ring: pour 1 tincture (primary) into a BOILING Alchemist Cauldron, drop the setting in -> infused setting;
//   then hammer + Hermetic Band + infused setting + 1 tincture (secondary) in a crafting table / workbench -> ring.
// Fluids are cauldron-only: no bucket, no placeable block. They use the (greyscale) vanilla water texture tinted with
// the tincture colour (KubeJS's default oowwo:block/<id>_still texture does not exist -> missing texture, fixed 2026-10-09). The <ring>_elixir fluid is from the first cauldron version -
// unused, kept registered so any cauldron that still holds some loads cleanly.

// tinctures: [key, display word, tint]
var OAL_TINCTURES = [
  ['sol', 'Sol', 0xF5C542],
  ['luna', 'Luna', 0xC9D6E8],
  ['sulfur', 'Sulfur', 0xD9B02B],
  ['mercury', 'Mercury', 0xA9B3BD],
  ['salt', 'Salt', 0xEDE7DA],
  ['arcane', 'Arcane', 0x8A5CF5],
  ['ether', 'Ether', 0x5FD3C9],
  ['flesh', 'Flesh', 0xA8323E]
]

// infused settings: [item key, display name, texture]
var OAL_INFUSED = [
  ['infused_brimstone', 'Infused Brimstone', 'irons_apothic:items/gems/effervescent_brimstone'],
  ['infused_solar_gem', 'Infused Solar Gem', 'apotheosis:items/gems/solar'],
  ['infused_lunar_gem', 'Infused Lunar Gem', 'apotheosis:items/gems/lunar'],
  ['infused_inferno_gem', 'Infused Inferno Gem', 'apotheosis:items/gems/inferno'],
  ['infused_citrine', 'Infused Citrine', 'jewelry:item/citrine'],
  ['infused_mageslayer_gem', 'Infused Mageslayer Gem', 'apotheosis:items/gems/mageslayer'],
  ['infused_mossy_agate', 'Infused Mossy Agate', 'irons_apothic:items/gems/mossy_agate'],
  ['infused_guardian_gem', 'Infused Guardian Gem', 'apotheosis:items/gems/guardian'],
  ['infused_sapphire', 'Infused Sapphire', 'jewelry:item/sapphire'],
  ['infused_venom_tooth', 'Infused Venom Tooth', 'toxony:item/venom_tooth'],
  ['infused_silver_briar', 'Infused Silver Briar', 'wayfarer:item/silver_briar'],
  ['infused_silverfish_eggs', 'Infused Silverfish Eggs', 'wayfarer:item/silverfish_eggs'],
  ['infused_void_umbalite', 'Infused Void Umbalite', 'irons_apothic:items/gems/void_umbalite'],
  ['infused_blood_lord_gem', 'Infused Blood Lord Gem', 'apotheosis:items/gems/blood_lord'],
  ['infused_soul_steel', 'Infused Soul Steel', 'sons_of_sins:item/soul_steel'],
  ['infused_bloody_pearl', 'Infused Bloody Pearl', 'irons_apothic:items/gems/bloody_pearl'],
  ['infused_quartz', 'Infused Quartz', 'minecraft:item/quartz'],
  ['infused_luminous_opal', 'Infused Luminous Opal', 'irons_apothic:items/gems/luminous_opal']
]

var OAL_ELIXIRS = [
  ['sulfur_gemstone_ring', 'Sulfur Ring Elixir', 0xF2C94C]
]

StartupEvents.registry('item', function (event) {
  OAL_INFUSED.forEach(function (g) {
    event.create('oowwo:' + g[0])
      .displayName(g[1])
      .tooltip(Text.gold('Craft with a hammer, a Hermetic Band and a tincture to forge a ring.'))
      .texture(g[2])
      .rarity('rare')
      .glow(true)
      .maxStackSize(16)
  })

  event.create('oowwo:hermetic_band')
    .displayName('Hermetic Band')
    .tooltip(Text.gray('Ring blank. Forge with a hammer, an infused setting and a tincture.'))
    .texture('oowwo:item/hermetic_band')
    .maxStackSize(16)

  OAL_TINCTURES.forEach(function (t) {
    var key = t[0], word = t[1], tint = t[2]
    event.create('oowwo:' + key + '_calx')
      .displayName(word + ' Calx')
      .tooltip(Text.gray('Calcined. Dissolve it in a pot.'))
      .texture('minecraft:item/sugar')
      .color(0, tint)

    event.create('oowwo:' + key + '_solution')
      .displayName(word + ' Solution')
      .tooltip(Text.gray('Dissolved. Fix it in a Keg of vodka with salt.'))
      .textures({ layer0: 'minecraft:item/potion_overlay', layer1: 'minecraft:item/potion' })
      .color(0, tint)
      .maxStackSize(16)

    event.create('oowwo:tincture_of_' + key)
      .displayName('Tincture of ' + word)
      .tooltip(Text.gold('Fixed alchemical principle for ring crafting.'))
      .textures({ layer0: 'minecraft:item/potion_overlay', layer1: 'minecraft:item/lingering_potion' })
      .color(0, tint)
      .rarity('uncommon')
      .glow(true)
      .maxStackSize(16)
  })
})

StartupEvents.registry('fluid', function (event) {
  OAL_TINCTURES.forEach(function (t) {
    event.create('oowwo:' + t[0] + '_tincture')
      .displayName(t[1] + ' Tincture')
      .tint(t[2])
      .stillTexture('minecraft:block/water_still')
      .flowingTexture('minecraft:block/water_flow')
      .noBucket()
      .noBlock()
  })
  OAL_ELIXIRS.forEach(function (x) {
    event.create('oowwo:' + x[0] + '_elixir')
      .displayName(x[1])
      .tint(x[2])
      .stillTexture('minecraft:block/water_still')
      .flowingTexture('minecraft:block/water_flow')
      .noBucket()
      .noBlock()
  })
})
