// oowwo: dyes — ported from Wayfarer kubejs/server_scripts/materials/dyes.js.
//
// WHAT THIS DOES (same as Wayfarer)
//   Flowers (and bone meal, ink sac, cocoa beans, lapis) no longer craft straight into dye, and the
//   Farmer's Delight cutting-board flower recipes are removed. Dyes are made by grinding in a mortar:
//   1 item -> 1 dye (2 for tall flowers: sunflower, lilac, peony, pitcher plant; and the Abundant
//   Atmosphere bushbuds). Create milling of flowers is untouched (Create processing removals are
//   deferred for playtesting, see the gap map).
//
// DEVIATIONS from Wayfarer:
//   - Grinding uses Toxony's mortar (toxony:mortar_pestle), per the 2026-09-27 mortar consolidation,
//     instead of wayfarer_core:grinding. Counts identical (no bonus chance in Wayfarer's dye recipes).
//   - Beetroot -> red dye crafting is removed with no grinding replacement, exactly as Wayfarer
//     (its grinding line is commented out there).
//   - CATCH-ALL (Derek, 2026-09-27): Wayfarer's list only covers Wayfarer's mods. Every remaining
//     single-ingredient crafting recipe whose result is a dye (#c:dyes) and whose ingredient is not
//     itself a dye (and is not a Dye Depot dye basket, which is storage) is turned into a Toxony mortar recipe with the same result, and the crafting recipe
//     removed. Farmer's Delight cutting-board recipes that output a dye are removed. Each one is logged
//     as '[dyes] converted ...' / '[dyes] removed cutting ...' in logs/kubejs/server.log.
//   - Recipe ids added (oowwo:dyes/...). Helper inlined.
//
// To revert: delete this file.

ServerEvents.recipes(event => {
  const R = fn => { try { fn(); } catch (e) { console.warn('[dyes] skipped: ' + e); } };
  // Wayfarer-mortar twin of a Toxony grind (Derek 2026-10-17): same output + 25% chance of 1 extra, one input item, 60 ticks. Helper inlined (global cannot be assigned in server scripts).
  const WF = (ing, result, key) => event.custom({ type: 'wayfarer_core:grinding', ingredient: ing, input_count: 1, result: { id: result.id || result.item, count: result.count || 1 }, duration: 60, bonus_chance: 0.25, bonus_count: 1 }).id('oowwo:wf_grinding/' + String(key).toLowerCase().replace(/[^a-z0-9_.\/-]/g, '/'));
  const G = (input, dye, count) => {
    R(() => WF({ item: input }, { id: 'minecraft:' + dye, count: count }, 'dyes/' + input.split(':')[1] + '_to_' + dye));
    return R(() => event.custom({
      type: 'toxony:mortar_pestle',
      ingredients: [{ item: input }],
      result: { id: 'minecraft:' + dye, count: count }
    }).id('oowwo:dyes/' + input.split(':')[1] + '_to_' + dye));
  };

  var WF_REMOVED = [
    'nomansland:light_gray_dye_from_white_tulip',
    'minecraft:white_dye_from_lily_of_the_valley',
    'nomansland:white_dye_from_starflower',
    'upgrade_aquatic:white_dye_from_white_searocket',
    'nomansland:white_dye_from_flowerbed',
    'minecraft:white_dye',
    'minecraft:light_gray_dye_from_azure_bluet',
    'minecraft:light_gray_dye_from_oxeye_daisy',
    'nomansland:light_gray_dye_from_wild_mint',
    'minecraft:black_dye_from_wither_rose',
    'abundant_atmosphere:black_dye_from_umbra_bushbuds',
    'minecraft:black_dye',
    'nomansland:brown_dye_from_pickleweed',
    'minecraft:brown_dye',
    'minecraft:red_dye_from_poppy',
    'minecraft:red_dye_from_tulip',
    'nomansland:red_dye_from_lupine',
    'nomansland:red_dye_from_flowerbed',
    'nomansland:red_dye_from_rafflesia',
    'nomansland:red_dye_from_rose_vines',
    'nomansland:red_dye_from_water_mosaic',
    'snowyspirit:red_dye_from_ginger_flower',
    'minecraft:red_dye_from_beetroot',
    'minecraft:orange_dye_from_orange_tulip',
    'minecraft:orange_dye_from_torchflower',
    'minecraft:yellow_dye_from_dandelion',
    'nomansland:yellow_dye_from_lupine',
    'caverns_and_chasms:yellow_dye_from_false_hope',
    'abundant_atmosphere:yellow_dye_from_saffron_bushbuds',
    'nomansland:yellow_dye_from_flowerbed',
    'minecraft:yellow_dye_from_sunflower',
    'caverns_and_chasms:green_dye_from_moschatel',
    'nomansland:green_dye_from_clovers',
    'nomansland:light_blue_dye_from_blue_orchid',
    'minecraft:cyan_dye_from_pitcher_plant',
    'upgrade_aquatic:cyan_dye_from_pickerelweed',
    'nomansland:light_blue_dye_from_lupine',
    'minecraft:blue_dye_from_cornflower',
    'nomansland:blue_dye_from_aconite',
    'minecraft:blue_dye',
    'nomansland:purple_dye_from_thistle',
    'nomansland:light_blue_dye_from_flowerbed',
    'abundant_atmosphere:purple_dye_from_midnight_lily',
    'minecraft:magenta_dye_from_allium',
    'nomansland:magenta_dye_from_autumn_crocus',
    'nomansland:magenta_dye_from_flowerbed',
    'minecraft:magenta_dye_from_lilac',
    'minecraft:pink_dye_from_pink_tulip',
    'nomansland:pink_dye_from_lupine',
    'upgrade_aquatic:pink_dye_from_pink_searocket',
    'abundant_atmosphere:pink_dye_from_cherry_bushbuds',
    'minecraft:pink_dye_from_pink_petals',
    'minecraft:pink_dye_from_peony',
    'farmersdelight:cutting/dandelion',
    'farmersdelight:cutting/poppy',
    'farmersdelight:cutting/blue_orchid',
    'farmersdelight:cutting/allium',
    'farmersdelight:cutting/azure_bluet',
    'farmersdelight:cutting/red_tulip',
    'farmersdelight:cutting/orange_tulip',
    'farmersdelight:cutting/white_tulip',
    'farmersdelight:cutting/pink_tulip',
    'farmersdelight:cutting/oxeye_daisy',
    'farmersdelight:cutting/cornflower',
    'farmersdelight:cutting/lily_of_the_valley',
    'farmersdelight:cutting/torchflower',
    'farmersdelight:cutting/wither_rose',
    'farmersdelight:cutting/ink_sac',
    'abundant_atmosphere:integration/farmersdelight/cutting/saffron_bushbuds',
    'abundant_atmosphere:integration/farmersdelight/cutting/cherry_bushbuds',
    'abundant_atmosphere:integration/farmersdelight/cutting/umbra_bushbuds',
    'abundant_atmosphere:integration/farmersdelight/cutting/midnight_lily'
  ];
  WF_REMOVED.forEach(id => R(() => event.remove({ id: id })));


  // white dye
  G('minecraft:white_tulip', 'white_dye', 1);
  G('minecraft:lily_of_the_valley', 'white_dye', 1);
  G('nomansland:starflower', 'white_dye', 1);
  G('upgrade_aquatic:white_searocket', 'white_dye', 1);
  G('nomansland:white_flowerbed', 'white_dye', 1);
  G('minecraft:bone_meal', 'white_dye', 1);

  // light gray dye
  G('minecraft:azure_bluet', 'light_gray_dye', 1);
  G('minecraft:oxeye_daisy', 'light_gray_dye', 1);
  G('nomansland:wild_mint', 'light_gray_dye', 1);

  // black dye
  G('minecraft:wither_rose', 'black_dye', 1);
  G('abundant_atmosphere:umbra_bushbuds', 'black_dye', 2);
  G('minecraft:ink_sac', 'black_dye', 1);

  // brown dye
  G('nomansland:pickleweed', 'brown_dye', 1);
  G('minecraft:cocoa_beans', 'brown_dye', 1);

  // red dye
  G('minecraft:poppy', 'red_dye', 1);
  G('minecraft:red_tulip', 'red_dye', 1);
  G('nomansland:red_lupine', 'red_dye', 1);
  G('nomansland:red_flowerbed', 'red_dye', 1);
  G('nomansland:rafflesia', 'red_dye', 1);
  G('nomansland:rose_vines', 'red_dye', 1);
  G('nomansland:water_mosaic', 'red_dye', 1);

  // orange dye
  G('minecraft:orange_tulip', 'orange_dye', 1);
  G('minecraft:torchflower', 'orange_dye', 1);

  // yellow dye
  G('minecraft:dandelion', 'yellow_dye', 1);
  G('nomansland:yellow_lupine', 'yellow_dye', 1);
  G('caverns_and_chasms:false_hope', 'yellow_dye', 1);
  G('abundant_atmosphere:saffron_bushbuds', 'yellow_dye', 2);
  G('nomansland:yellow_flowerbed', 'yellow_dye', 1);
  G('minecraft:sunflower', 'yellow_dye', 2);

  // green dye
  G('caverns_and_chasms:moschatel', 'green_dye', 1);
  G('nomansland:clover_patch', 'green_dye', 1);

  // cyan dye
  G('minecraft:blue_orchid', 'cyan_dye', 1);
  G('minecraft:pitcher_plant', 'cyan_dye', 2);
  G('upgrade_aquatic:pickerelweed', 'cyan_dye', 1);

  // light blue dye
  G('nomansland:blue_lupine', 'light_blue_dye', 1);
  G('nomansland:blue_flowerbed', 'light_blue_dye', 1);

  // blue dye
  G('minecraft:cornflower', 'blue_dye', 1);
  G('nomansland:aconite', 'blue_dye', 1);
  G('minecraft:lapis_lazuli', 'blue_dye', 1);

  // purple dye
  G('nomansland:thistle', 'purple_dye', 1);
  G('nomansland:lavender_bush', 'purple_dye', 1);
  G('abundant_atmosphere:midnight_lily', 'purple_dye', 1);

  // magenta dye
  G('minecraft:allium', 'magenta_dye', 1);
  G('nomansland:autumn_crocus', 'magenta_dye', 1);
  G('nomansland:violet_flowerbed', 'magenta_dye', 1);
  G('minecraft:lilac', 'magenta_dye', 2);

  // pink dye
  G('minecraft:pink_tulip', 'pink_dye', 1);
  G('nomansland:pink_lupine', 'pink_dye', 1);
  G('upgrade_aquatic:pink_searocket', 'pink_dye', 1);
  G('abundant_atmosphere:cherry_bushbuds', 'pink_dye', 2);
  G('minecraft:pink_petals', 'pink_dye', 1);
  G('minecraft:peony', 'pink_dye', 2);

  // ---------- catch-all for mods Wayfarer does not have (Spawn, Windswept, ...)
  // Rhino: no const/let inside the per-recipe callbacks; functions with var only.
  var toConvert = [];
  var toRemove = [];
  function isDyeIngredient(ing) {
    if (ing.tag) return ing.tag.indexOf('dyes') >= 0;
    if (ing.item) return Ingredient.of('#c:dyes').test(Item.of(ing.item));
    return true; // unknown ingredient shape: leave the recipe alone
  }
  function collect(r) {
    if (WF_REMOVED.indexOf(String(r.getId())) >= 0) return;
    if (String(r.getId()).indexOf('basket') >= 0) return; // Dye Depot dye baskets = storage unpacking, keep
    var j = JSON.parse(String(r.json));
    if (!j.ingredients || j.ingredients.length != 1) return;
    var ing = j.ingredients[0];
    if (Array.isArray(ing) || isDyeIngredient(ing)) return;
    toConvert.push({ id: String(r.getId()), ing: ing, result: j.result });
  }
  R(() => event.forEachRecipe({ type: 'minecraft:crafting_shapeless', output: '#c:dyes' }, r => R(() => collect(r))));
  toConvert.forEach(c => R(() => {
    event.custom({ type: 'toxony:mortar_pestle', ingredients: [c.ing], result: c.result })
      .id('oowwo:dyes/auto/' + c.id.replace(':', '/'));
    WF(c.ing, c.result, 'dyes/auto/' + c.id);
    event.remove({ id: c.id });
    console.info('[dyes] converted ' + c.id + ' -> mortar');
  }));
  R(() => event.forEachRecipe({ type: 'farmersdelight:cutting', output: '#c:dyes' }, r => toRemove.push(String(r.getId()))));
  toRemove.forEach(id => R(() => { event.remove({ id: id }); console.info('[dyes] removed cutting ' + id); }));
});
