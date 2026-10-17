// oowwo: alchemical ring crafting — recipes (2026-10-09; step 3 = all 8 tinctures, 18 rings).
// Items/fluids: startup_scripts/oowwo_alchemy_items.js. Bonuses: oowwo_alchemy_power.js. Forge sound: oowwo_alchemy_sound.js.
// Crafted rings carry custom_data {oowwo_alchemical:1} + gold lore, so the power layer can tell them from loot rings.
// Apotheosis gem settings: Derek chose "Epic or better" = purity Normal, Flawless or Perfect (apotheosis:gem ingredient
// matches ONE exact purity, so the ingredient is a neoforge:compound of the three).
// Ring flow: FILL cauldron with 1 primary tincture (250 mB) -> drop the setting into the BOILING cauldron (brew, ~5 s,
// byproduct = infused setting, take it out by hand) -> crafting: hammer + Hermetic Band + infused setting + 1 secondary
// tincture. (Rings with the same tincture twice use it for both.) Unified metals by #c: tags (Almost Unified rule).

function oalGem(gemId) {
  return {
    type: 'neoforge:compound',
    children: ['normal', 'flawless', 'perfect'].map(function (p) {
      return { type: 'apotheosis:gem', gems: [gemId], purity: p }
    })
  }
}

function oalIng(s) { return s.charAt(0) === '#' ? { tag: s.substring(1) } : { item: s } }

// bonus: extra lore lines describing the crafted bonus (keep in sync with OAL_POWER in oowwo_alchemy_power.js)
function oalRingResult(ringId, bonus) {
  var lore = ['{"text":"Alchemically Forged","color":"gold","italic":false}']
  ;(bonus || []).forEach(function (b) { lore.push(JSON.stringify({ text: b, color: 'yellow', italic: false })) })
  return {
    id: ringId,
    count: 1,
    components: {
      'minecraft:custom_data': { oowwo_alchemical: 1 },
      'minecraft:lore': lore
    }
  }
}

// key -> grind (Toxony mortar, up to 4), pot type, pot extras (with the calx)
var OAL_TINCTURE_RECIPES = {
  sol: { grind: ['#c:ingots/gold', 'minecraft:blaze_powder', 'jewelry:topaz', 'minecraft:glowstone_dust'],
    pot: 'farmersdelight:cooking', extra: ['minecraft:blaze_powder', 'minecraft:glowstone_dust'] },
  // 2026-10-17: Hexerei removed - selenite shard + moon dust (x2) replaced with amethyst shards. PLACEHOLDER until
  // the Eidolon / Enchanted entry point decides where moonlight comes from.
  luna: { grind: ['#c:ingots/silver', 'minecraft:amethyst_shard', 'minecraft:amethyst_shard', 'minecraft:phantom_membrane'],
    pot: 'farmersdelight:cooking', extra: ['minecraft:amethyst_shard', 'minecraft:phantom_membrane'] },
  sulfur: { grind: ['nomansland:sulfur', 'nomansland:sulfur', 'jewelry:ruby', 'irons_spellbooks:cinder_essence'],
    pot: 'farmersdelight:cooking', extra: ['minecraft:blaze_powder', 'nomansland:sulfur'] },
  mercury: { grind: ['wayfarer_core:mercury_droplet', 'wayfarer_core:mercury_droplet', 'irons_spellbooks:ice_venom_vial', 'minecraft:ender_pearl'],
    pot: 'farmersdelight:cooking', extra: ['wayfarer_core:mercury_droplet', 'minecraft:ghast_tear'] },
  salt: { grind: ['spelunkery:rock_salt', 'spelunkery:rock_salt', 'caverns_and_chasms:turquoise', 'minecraft:bone_meal'],
    pot: 'farmersdelight:cooking', extra: ['#c:salt', 'minecraft:quartz'] },
  arcane: { grind: ['irons_spellbooks:arcane_essence', 'irons_spellbooks:arcane_essence', 'irons_spellbooks:mithril_scrap', 'jewelry:tanzanite'],
    pot: 'farmersdelight:cooking', extra: ['irons_spellbooks:arcane_essence', '#c:gems/lapis'] },
  ether: { grind: ['sons_of_sins:ether_ashes', 'sons_of_sins:ether_ashes', 'sons_of_sins:crystallized_ether', 'minecraft:soul_sand'],
    pot: 'dungeonsdelight:monster_cooking', extra: ['sons_of_sins:ether_ashes', 'minecraft:ghast_tear'] },
  flesh: { grind: ['evilcraft:flesh_humanoid', 'sons_of_sins:heart', 'minecraft:rotten_flesh', 'minecraft:bone_meal'],
    pot: 'dungeonsdelight:monster_cooking', extra: ['irons_spellbooks:blood_vial', 'minecraft:rotten_flesh'] }
}
var OAL_TINCTURE_KEYS = Object.keys(OAL_TINCTURE_RECIPES)

// rings: primary tincture goes in the cauldron, secondary goes in the forge recipe.
// gem = Apotheosis gem id (Normal+), or setting = item id. infused = item made in the cauldron.
// bonus = lore lines; only rings with an approved power entry have them (see oowwo_alchemy_power.js).
var OAL_RINGS = [
  { ring: 'wayfarer_core:sulfur_gemstone_ring', primary: 'sulfur', secondary: 'sulfur', gem: 'irons_apothic:core/effervescent_brimstone',
    infused: 'oowwo:infused_brimstone', bonus: ['Immune to Corrosion', '-40% Fire damage taken'] },
  { ring: 'wayfarer_core:sunlight_ring', primary: 'sol', secondary: 'salt', gem: 'apotheosis:core/solar', infused: 'oowwo:infused_solar_gem' , bonus: ['Regeneration II in daylight', '+2 Armor'] },
  { ring: 'wayfarer_core:moonlight_ring', primary: 'luna', secondary: 'mercury', gem: 'apotheosis:core/lunar', infused: 'oowwo:infused_lunar_gem' , bonus: ['Night Vision at night', '+6 Max Health'] },
  { ring: 'wayfarer_core:fireward_ring', primary: 'sulfur', secondary: 'sol', gem: 'apotheosis:the_nether/inferno', infused: 'oowwo:infused_inferno_gem' , bonus: ['Immune to burning and lava'] },
  { ring: 'wayfarer_core:ring_of_warmth', primary: 'sulfur', secondary: 'salt', setting: 'jewelry:citrine', infused: 'oowwo:infused_citrine' , bonus: ['Immune to freezing', '-25% Hunger drain'] },
  { ring: 'wayfarer_core:spellward_ring', primary: 'arcane', secondary: 'salt', gem: 'apotheosis:the_end/mageslayer', infused: 'oowwo:infused_mageslayer_gem' , bonus: ['+30% Spell Resistance'] },
  { ring: 'wayfarer_core:ailward_ring', primary: 'salt', secondary: 'luna', gem: 'irons_apothic:core/mossy_agate', infused: 'oowwo:infused_mossy_agate' , bonus: ['Immune to Hunger, Nausea, Blindness, Darkness, Slowness, Mining Fatigue'] },
  { ring: 'wayfarer_core:bulwark_ring', primary: 'salt', secondary: 'sulfur', gem: 'apotheosis:core/guardian', infused: 'oowwo:infused_guardian_gem' , bonus: ['-75% Explosion damage taken', '+4 Armor, +2 Armor Toughness'] },
  { ring: 'wayfarer_core:silvercat_ring', primary: 'luna', secondary: 'mercury', setting: 'jewelry:sapphire', infused: 'oowwo:infused_sapphire' , bonus: ['Immune to fall damage'] },
  { ring: 'wayfarer_core:ring_of_the_afflicted', primary: 'mercury', secondary: 'flesh', setting: 'toxony:venom_tooth', infused: 'oowwo:infused_venom_tooth' , bonus: ['Immune to Poison, Weakness and Wither'] },
  { ring: 'wayfarer_core:thorn_ring', primary: 'sulfur', secondary: 'flesh', setting: 'wayfarer_core:silver_briar', infused: 'oowwo:infused_silver_briar' , bonus: ['Reflects 50% of melee damage taken'] },
  { ring: 'wayfarer_core:ring_of_the_rat', primary: 'ether', secondary: 'mercury', setting: 'wayfarer_core:silverfish_eggs', infused: 'oowwo:infused_silverfish_eggs' , bonus: ['+20% Movement Speed'] },
  { ring: 'wayfarer_core:ring_of_silence', primary: 'ether', secondary: 'luna', gem: 'irons_apothic:core/void_umbalite', infused: 'oowwo:infused_void_umbalite' , bonus: ['Invisible while sneaking', '+15% Sneaking Speed'] },
  { ring: 'wayfarer_core:malevolent_ring', primary: 'flesh', secondary: 'ether', gem: 'apotheosis:the_nether/blood_lord', infused: 'oowwo:infused_blood_lord_gem' , bonus: ['+8 Max Health'] },
  { ring: 'wayfarer_core:ring_of_torment', primary: 'ether', secondary: 'ether', setting: 'sons_of_sins:soul_steel', infused: 'oowwo:infused_soul_steel' , bonus: ['+30% Melee damage dealt'] },
  { ring: 'wayfarer_core:visceral_ring', primary: 'flesh', secondary: 'flesh', gem: 'irons_apothic:core/bloody_pearl', infused: 'oowwo:infused_bloody_pearl' , bonus: ['Regeneration II below half health'] },
  { ring: 'wayfarer_core:salt_gemstone_ring', primary: 'salt', secondary: 'salt', setting: 'minecraft:quartz', infused: 'oowwo:infused_quartz' , bonus: ['Immune to Poison', '-25% Hunger drain'] },
  { ring: 'wayfarer_core:mercury_gemstone_ring', primary: 'mercury', secondary: 'mercury', gem: 'irons_apothic:core/luminous_opal', infused: 'oowwo:infused_luminous_opal' , bonus: ['Immune to Wither', '-25% Magic damage taken'] }
]

ServerEvents.recipes(function (event) {
  var R = function (id, fn) { try { fn() } catch (e) { console.error('[oowwo_alchemy] ' + id + ': ' + e) } }

  // Hermetic Band: 4 hermetic plating (1000 mB of hermetic alloy)
  R('band', function () {
    event.custom({
      type: 'minecraft:crafting_shaped',
      category: 'misc',
      pattern: [' P ', 'P P', ' P '],
      key: { P: { item: 'wayfarer_core:hermetic_plating' } },
      result: { id: 'oowwo:hermetic_band', count: 1 }
    }).id('oowwo:alchemy/hermetic_band')
  })

  OAL_TINCTURE_KEYS.forEach(function (key) {
    var t = OAL_TINCTURE_RECIPES[key]
    // 1. Calcination: Toxony mortar & pestle
    R(key + '_calx', function () {
      event.custom({
        type: 'toxony:mortar_pestle',
        ingredients: t.grind.map(oalIng),
        result: { id: 'oowwo:' + key + '_calx', count: 1 }
      }).id('oowwo:alchemy/' + key + '_calx')
    })
    // 2. Dissolution: Cooking Pot (or Dungeons Delight Monster Pot), served into a glass bottle
    R(key + '_solution', function () {
      event.custom({
        type: t.pot,
        recipe_book_tab: t.pot === 'farmersdelight:cooking' ? 'misc' : 'monster_drinks',
        ingredients: [{ item: 'oowwo:' + key + '_calx' }].concat(t.extra.map(oalIng)),
        container: { id: 'minecraft:glass_bottle', count: 1 },
        experience: 1.0,
        cookingtime: 400,
        result: { id: 'oowwo:' + key + '_solution', count: 1 }
      }).id('oowwo:alchemy/' + key + '_solution')
    })
    // 3. Fixation: Keg, 250 mB vodka + 2 solutions + salt -> 2 tinctures
    R('tincture_of_' + key, function () {
      event.custom({
        type: 'brewinandchewin:fermenting',
        base_fluid: { amount: 250, ingredient: { tag: '#brewinandchewin:vodka' }, unit: 'millibuckets' },
        experience: 1.0,
        ingredients: [{ item: 'oowwo:' + key + '_solution' }, { item: 'oowwo:' + key + '_solution' }, { tag: 'c:salt' }, []],
        result: { id: 'oowwo:tincture_of_' + key, count: 2 },
        unit: 'millibuckets'
      }).id('oowwo:alchemy/tincture_of_' + key)
    })
    // 4. Cauldron fill: tincture -> 250 mB tincture fluid, bottle returned
    R('fill_' + key, function () {
      event.custom({
        type: 'irons_spellbooks:alchemist_cauldron_fill',
        fluid: { id: 'oowwo:' + key + '_tincture', amount: 250 },
        input: { item: 'oowwo:tincture_of_' + key },
        result: { id: 'minecraft:glass_bottle', count: 1 }
      }).id('oowwo:alchemy/cauldron_fill_' + key)
    })
  })

  OAL_RINGS.forEach(function (r) {
    var ringKey = r.ring.split(':')[1]
    // infuse: boiling cauldron, 250 mB primary tincture + setting -> infused setting (byproduct, no fluid result)
    R('brew_' + ringKey, function () {
      event.custom({
        type: 'irons_spellbooks:alchemist_cauldron_brew',
        base_fluid: { id: 'oowwo:' + r.primary + '_tincture', amount: 250 },
        input: r.gem ? oalGem(r.gem) : { item: r.setting },
        results: [],
        byproduct: { id: r.infused }
      }).id('oowwo:alchemy/cauldron_brew_' + ringKey)
    })
    // forge: hammer (keeps, loses 1 durability via wayfarer:durability_crafting) + band + infused + secondary tincture
    R('forge_' + ringKey, function () {
      event.custom({
        type: 'minecraft:crafting_shaped',
        category: 'equipment',
        pattern: ['HBG', ' T '],
        key: {
          H: { tag: 'c:tools/hammers' },
          B: { item: 'oowwo:hermetic_band' },
          G: { item: r.infused },
          T: { item: 'oowwo:tincture_of_' + r.secondary }
        },
        result: oalRingResult(r.ring, r.bonus)
      }).id('oowwo:alchemy/forge_' + ringKey)
    })
  })
})
