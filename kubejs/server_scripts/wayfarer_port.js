// =====================================================================================
// INSTALLED 2026-09-21 (was review draft). Port of Wayfarer recipes for wayfarer_core items that have no
// recipe in oowwo. Generated mechanically from Wayfarer's own KubeJS scripts (every recipe
// keeps its source file and result), so nothing here is a re-design.
//
// To install: copy to kubejs/server_scripts/ after reading it. To revert: delete the file.
// Recipe ids are 'oowwo_port:<result>' so they are easy to find in EMI / logs.
//
// clayworks 4.0.3 and abundant_atmosphere 2.0.0-beta2 were added 2026-09-21; the recipes that use them
// (clinker_tile, baked bone_ash, puffball_pasta) are enabled. Each recipe is wrapped in R() so one bad
// recipe is logged as '[wayfarer_port] skipped' instead of aborting the script.
//
// Deliberately NOT included:
//   - wayfarer_core:crucible  (already added, barrel-style, in wayfarer_crucible_recipe.js)
//   - Most of Wayfarer's remove()/replaceInput() edits to vanilla and third-party recipes (96 replaceInputs,
//     401 removes). Only the ones on Derek's path to iron are included, in the PATH-CRITICAL block at the end.
//   - Bronze/tin/copper unification. See wayfarer_metals_REVIEW.js.
// =====================================================================================

ServerEvents.tags('item', event => {
  // Tags that Wayfarer defines in its own scripts and that ported recipes below depend on.
  event.add('kubejs:generic_metal_nugget', ['minecraft:iron_nugget', 'wayfarer_core:lead_nugget', 'wayfarer_core:tin_nugget']);
  event.add('kubejs:water_crafting', ['minecraft:potion', 'minecraft:water_bucket']);
  // oowwo 2026-10-11: black pigments accepted (mixed freely) in the scribing tools recipe.
  event.add('oowwo:scribing_pigment', ['minecraft:ink_sac', 'minecraft:charcoal', 'minecraft:black_dye']);
});

ServerEvents.recipes(event => {
  // A recipe that names an item that does not exist is logged and skipped instead of aborting the
  // whole script (that is what happened on the first launch).
  const R = fn => { try { fn(); } catch (e) { console.warn('[wayfarer_port] skipped: ' + e); } };
  // Wayfarer-mortar twin of a Toxony grind (Derek 2026-10-17): same output + 25% chance of 1 extra, one input item, 60 ticks. Helper inlined (global cannot be assigned in server scripts).
  const WF = (ing, result, key) => event.custom({ type: 'wayfarer_core:grinding', ingredient: ing, input_count: 1, result: { id: result.id || result.item, count: result.count || 1 }, duration: 60, bonus_chance: 0.25, bonus_count: 1 }).id('oowwo:wf_grinding/' + String(key).toLowerCase().replace(/[^a-z0-9_.\/-]/g, '/'));

  // ---------------- building/blast_furnace.js ----------------
  R(() => event.shaped('wayfarer_core:bloomery', ["MMM", "MFM", "AAA"], {A: "wayfarer_core:bone_ash", M: ["minecraft:packed_mud", "minecraft:mud_bricks"], F: "minecraft:furnace"}).id('oowwo_port:bloomery'));
  R(() => event.shaped('wayfarer_core:blast_furnace', ["CMC", "CFC", "IPI"], {C: "wayfarer_core:clinker_bricks", M: "supplementaries:slidy_block", F: "minecraft:furnace", I: "minecraft:iron_ingot", P: "create:iron_sheet"}).id('oowwo_port:blast_furnace'));
  R(() => event.smelting('wayfarer_core:clinker_tile', "clayworks:glazed_terracotta").id('oowwo_port:clinker_tile'));
  R(() => event.custom({"type": "clayworks:baking", "category": "blocks", "cookingtime": 100, "experience": 0, "ingredient": {"item": "clayworks:glazed_terracotta"}, "result": {"count": 1, "id": "wayfarer_core:clinker_tile"}}).id('oowwo_port:clinker_tile_2'));
  R(() => event.shaped('4x wayfarer_core:mosaic_clinker_tile', ["BB ", "CC "], {C: "wayfarer_core:clinker_tile", B: "wayfarer_core:clinker_bricks"}).id('oowwo_port:mosaic_clinker_tile'));

  // ---------------- building/building.js ----------------
  R(() => event.shaped('8x wayfarer_core:bronze_bricks', ["BBB", "BNB", "BBB"], {B: ["nomansland:cobblestone_bricks", "nomansland:cobbled_deepslate_bricks"], N: "wayfarer_core:bronze_nugget"}).id('oowwo_port:bronze_bricks'));
  R(() => event.shaped('4x wayfarer_core:chiseled_bronze_bricks', [" B ", "B B", " B "], {B: "wayfarer_core:bronze_bricks"}).id('oowwo_port:chiseled_bronze_bricks'));
  R(() => event.shaped('8x wayfarer_core:lead_bricks', ["BBB", "BNB", "BBB"], {B: ["nomansland:cobblestone_bricks", "nomansland:cobbled_deepslate_bricks"], N: "wayfarer_core:lead_nugget"}).id('oowwo_port:lead_bricks'));
  R(() => event.shaped('4x wayfarer_core:chiseled_lead_bricks', [" B ", "B B", " B "], {B: "wayfarer_core:lead_bricks"}).id('oowwo_port:chiseled_lead_bricks'));
  R(() => event.shaped('8x wayfarer_core:titanium_bricks', ["BBB", "BNB", "BBB"], {B: ["nomansland:cobblestone_bricks", "nomansland:cobbled_deepslate_bricks"], N: "wayfarer_core:titanium_nugget"}).id('oowwo_port:titanium_bricks'));
  R(() => event.shaped('4x wayfarer_core:chiseled_titanium_bricks', [" B ", "B B", " B "], {B: "wayfarer_core:titanium_bricks"}).id('oowwo_port:chiseled_titanium_bricks'));
  R(() => event.shaped('8x wayfarer_core:steel_bricks', ["BBB", "BNB", "BBB"], {B: ["nomansland:cobblestone_bricks", "nomansland:cobbled_deepslate_bricks"], N: "wayfarer_core:steel_nugget"}).id('oowwo_port:steel_bricks'));
  R(() => event.shaped('4x wayfarer_core:chiseled_steel_bricks', [" B ", "B B", " B "], {B: "wayfarer_core:steel_bricks"}).id('oowwo_port:chiseled_steel_bricks'));
  R(() => event.shaped('8x wayfarer_core:mercury_bricks', ["BBB", "BNB", "BBB"], {B: ["nomansland:cobblestone_bricks", "nomansland:cobbled_deepslate_bricks"], N: "wayfarer_core:mercury_droplet"}).id('oowwo_port:mercury_bricks'));
  R(() => event.shaped('wayfarer_core:sconce_cupric_torch', ["   ", " T ", " N "], {T: "caverns_and_chasms:cupric_torch", N: "#kubejs:generic_metal_nugget"}).id('oowwo_port:sconce_cupric_torch'));
  R(() => event.shaped('wayfarer_core:rift_lantern', [" N ", "NTN", " N "], {T: "wayfarer_core:rift_torch", N: "#kubejs:generic_metal_nugget"}).id('oowwo_port:rift_lantern'));
  R(() => event.shaped('wayfarer_core:sconce_rift_torch', ["   ", " T ", " N "], {T: "wayfarer_core:rift_torch", N: "#kubejs:generic_metal_nugget"}).id('oowwo_port:sconce_rift_torch'));
  R(() => event.shaped('wayfarer_core:rift_light_bulb', [" G ", "NTN"], {G: "minecraft:glass", N: "minecraft:iron_nugget", T: "wayfarer_core:rift_torch"}).id('oowwo_port:rift_light_bulb'));

  // ---------------- building/concrete.js ----------------
  R(() => event.shaped('8x wayfarer_core:concrete_powder', ["GSG", "SCS", "GSG"], {S: "minecraft:sand", G: "minecraft:gravel", C: "minecraft:clay_ball"}).id('oowwo_port:concrete_powder'));
  R(() => event.shaped('8x wayfarer_core:concrete', ["CCC", "CWC", "CCC"], {W: "#kubejs:water_crafting", C: "wayfarer_core:concrete_powder"}).id('oowwo_port:concrete'));
  R(() => event.shaped('8x wayfarer_core:concrete_powder', ["CCC", "CSC", "CCC"], {C: "#c:concrete_powders", S: "supplementaries:soap"}).id('oowwo_port:concrete_powder_2'));
  R(() => event.custom({"type": "create:splashing", "ingredients": [{"item": "wayfarer_core:concrete_powder"}], "results": [{"id": "wayfarer_core:concrete"}]}).id('oowwo_port:concrete_2'));
  R(() => event.shaped('6x wayfarer_core:concrete_slab', ["   ", "CCC", "   "], {C: "wayfarer_core:concrete"}).id('oowwo_port:concrete_slab'));
  R(() => event.shaped('4x wayfarer_core:concrete_stairs', ["C  ", "CC ", "CCC"], {C: "wayfarer_core:concrete"}).id('oowwo_port:concrete_stairs'));

  // ---------------- building/stonecutting.js ----------------
  R(() => event.stonecutting('1x wayfarer_core:stone_pillar', "minecraft:stone").id('oowwo_port:stone_pillar'));
  R(() => event.stonecutting('1x wayfarer_core:stone_pillar', "nomansland:polished_stone").id('oowwo_port:stone_pillar_2'));
  R(() => event.shaped('2x wayfarer_core:stone_pillar', [" S ", " S "], {S: "nomansland:polished_stone"}).id('oowwo_port:stone_pillar_3'));

  // ---------------- food/food.js ----------------
  R(() => event.custom({"type": "farmersdelight:cooking", "cookingtime": 100, "experience": 0.3, "ingredients": [{"item": "nomansland:cooked_venison"}, {"item": "minecraft:cooked_beef"}, {"item": "minecraft:cooked_porkchop"}, {"item": "minecraft:sugar"}], "recipe_book_tab": "misc", "result": {"id": "wayfarer_core:triple_meat_treat", "count": 4}}).id('oowwo_port:triple_meat_treat'));
  R(() => event.custom({"type": "farmersdelight:cooking", "cookingtime": 200, "experience": 0.3, "ingredients": [{"item": "minecraft:carrot"}, {"item": "snowyspirit:ginger"}, {"item": "farmersdelight:onion"}, {"tag": "c:drinks/milk"}], "recipe_book_tab": "misc", "result": {"id": "wayfarer_core:carrot_ginger_soup", "count": 1}}).id('oowwo_port:carrot_ginger_soup'));
  R(() => event.custom({"type": "farmersdelight:cooking", "cookingtime": 200, "experience": 0.3, "ingredients": [{"item": "abundant_atmosphere:puffball_slice"}, {"item": "farmersdelight:raw_pasta"}, {"item": "minecraft:egg"}, {"tag": "c:drinks/milk"}, {"item": "farmersdelight:onion"}], "recipe_book_tab": "misc", "result": {"id": "wayfarer_core:puffball_pasta", "count": 1}}).id('oowwo_port:puffball_pasta'));

  // ---------------- loot_and_combat/crossbows.js ----------------
  R(() => event.shaped('wayfarer_core:repeating_crossbow', ["RJR", "HTH", " S "], {S: "minecraft:stick", H: "minecraft:string", R: "minecraft:repeater", J: "wayfarer_core:steel_ingot", T: "minecraft:tripwire_hook"}).id('oowwo_port:repeating_crossbow'));
  R(() => event.shaped('wayfarer_core:arbalest', ["RJR", "HTH", " S "], {S: "#minecraft:planks", H: "minecraft:string", R: "#c:stripped_logs", J: "wayfarer_core:steel_ingot", T: "minecraft:tripwire_hook"}).id('oowwo_port:arbalest'));

  // ---------------- loot_and_combat/mattock.js ----------------
  R(() => event.shaped('wayfarer_core:mattock_mould', ["BBB", "BMB", "BBB"], {M: "newworld:ancient_mattock", B: "minecraft:brick"}).id('oowwo_port:mattock_mould'));
  R(() => event.shaped('wayfarer_core:bronze_mattock', [" B ", "BMB", " B "], {M: "wayfarer_core:mattock_mould", B: "wayfarer_core:bronze_ingot"}).id('oowwo_port:bronze_mattock'));

  // ---------------- loot_and_combat/rings.js ----------------
  R(() => event.shaped('wayfarer_core:sunlight_ring', [" Y ", "X X", " X "], {Y: "minecraft:emerald", X: "minecraft:gold_ingot"}).id('oowwo_port:sunlight_ring'));
  R(() => event.shaped('wayfarer_core:moonlight_ring', [" Y ", "X X", " X "], {Y: "minecraft:diamond", X: "#c:ingots/silver"}).id('oowwo_port:moonlight_ring'));
  R(() => event.shaped('wayfarer_core:thorn_ring', ["YXY", "X X", "YXY"], {Y: "wayfarer_core:silver_briar", X: "#c:ingots/silver"}).id('oowwo_port:thorn_ring'));

  // ---------------- materials/mortar_and_pestle.js ----------------
  // 2026-09-27: Wayfarer's mortar + pestle retired (Derek) — all grinding runs on Toxony's mortar,
  // whose recipe now uses Wayfarer's materials (see oowwo_mortars.js). Pestle/mortar recipes removed.
  R(() => event.custom({"type": "toxony:mortar_pestle", "ingredients": [{"item": "minecraft:ender_pearl"}], "result": {"id": "wayfarer_core:rift_sediment", "count": 3}}).id('oowwo_port:rift_sediment')); // was wayfarer grinding 3 +30% 1
  R(() => event.custom({"type": "toxony:mortar_pestle", "ingredients": [{"item": "wayfarer_core:lifegem"}], "result": {"id": "wayfarer_core:lifesalt", "count": 3}}).id('oowwo_port:lifesalt'));
  R(() => WF({ item: 'minecraft:ender_pearl' }, { id: 'wayfarer_core:rift_sediment', count: 3 }, 'rift_sediment'));
  R(() => WF({ item: 'wayfarer_core:lifegem' }, { id: 'wayfarer_core:lifesalt', count: 3 }, 'lifesalt'));

  // ---------------- materials/rubber.js ----------------
  R(() => event.smelting('wayfarer_core:rubber', "minecraft:nether_wart").id('oowwo_port:rubber'));

  // ---------------- materials/scribing_tools.js ----------------
  R(() => event.shapeless('wayfarer_core:scribing_tools', ["minecraft:glass_bottle", "minecraft:feather", "5x #oowwo:scribing_pigment"]).id('oowwo_port:scribing_tools'));
  R(() => event.shaped('wayfarer_core:scribing_table', ["CS ", "PP ", "PP "], {S: "wayfarer_core:scribing_tools", C: "minecraft:paper", P: "#minecraft:planks"}).id('oowwo_port:scribing_table'));

  // ---------------- materials/wax.js ----------------
  R(() => event.shapeless('wayfarer_core:wax_block', ["9x wayfarer_core:wax"]).id('oowwo_port:wax_block'));
  R(() => event.shapeless('9x wayfarer_core:wax', ["wayfarer_core:wax_block"]).id('oowwo_port:wax'));
  R(() => event.shaped('wayfarer_core:beekeeper_helmet', ["MMM", "MSM", " H "], {H: "wayfarer_core:wax", M: "farmersdelight:canvas", S: "farmersdelight:straw_bale"}).id('oowwo_port:beekeeper_helmet'));
  R(() => event.shaped('wayfarer_core:beekeeper_chestplate', ["MHM", "MMM", "MMM"], {H: "wayfarer_core:wax", M: "farmersdelight:canvas"}).id('oowwo_port:beekeeper_chestplate'));
  R(() => event.shaped('wayfarer_core:beekeeper_leggings', ["MMM", "MHM", "M M"], {H: "wayfarer_core:wax", M: "farmersdelight:canvas"}).id('oowwo_port:beekeeper_leggings'));
  R(() => event.shaped('wayfarer_core:beekeeper_boots', ["M M", "LHL", "   "], {H: "wayfarer_core:wax", M: "farmersdelight:canvas", L: "minecraft:leather"}).id('oowwo_port:beekeeper_boots'));
  R(() => event.custom({"type": "farmersdelight:cooking", "cookingtime": 100, "experience": 0.1, "ingredients": [{"item": "minecraft:porkchop"}], "recipe_book_tab": "misc", "result": {"id": "wayfarer_core:wax"}}).id('oowwo_port:wax_2'));
  R(() => event.custom({"type": "farmersdelight:cooking", "cookingtime": 50, "experience": 0.1, "ingredients": [{"item": "minecraft:honeycomb"}], "recipe_book_tab": "misc", "result": {"id": "wayfarer_core:wax", "count": 2}}).id('oowwo_port:wax_3'));
  R(() => event.shaped('wayfarer_core:bee_smoker', [" N ", "NFC", " N "], {C: "farmersdelight:canvas", F: "minecraft:campfire", N: "minecraft:iron_ingot"}).id('oowwo_port:bee_smoker'));

  // ---------------- metallurgy_and_progression/bronze.js ----------------
  R(() => event.shapeless('9x wayfarer_core:bronze_nugget', ["wayfarer_core:bronze_ingot"]).id('oowwo_port:bronze_nugget'));
  R(() => event.shapeless('wayfarer_core:bronze_block', ["9x wayfarer_core:bronze_ingot"]).id('oowwo_port:bronze_block'));
  R(() => event.shaped('wayfarer_core:bronze_sword', [" C ", " C ", " S "], {C: "wayfarer_core:bronze_ingot", S: "minecraft:stick"}).id('oowwo_port:bronze_sword'));
  R(() => event.shaped('wayfarer_core:bronze_shovel', [" C ", " S ", " S "], {C: "wayfarer_core:bronze_ingot", S: "minecraft:stick"}).id('oowwo_port:bronze_shovel'));
  R(() => event.shaped('wayfarer_core:bronze_pickaxe', ["CCC", " S ", " S "], {C: "wayfarer_core:bronze_ingot", S: "minecraft:stick"}).id('oowwo_port:bronze_pickaxe'));
  R(() => event.shaped('wayfarer_core:bronze_axe', [" CC", " SC", " S "], {C: "wayfarer_core:bronze_ingot", S: "minecraft:stick"}).id('oowwo_port:bronze_axe'));
  R(() => event.shaped('wayfarer_core:bronze_knife', ["   ", " C ", " S "], {C: "wayfarer_core:bronze_ingot", S: "minecraft:stick"}).id('oowwo_port:bronze_knife'));

  // ---------------- metallurgy_and_progression/lead.js ----------------
  R(() => event.shapeless('9x wayfarer_core:lead_nugget', ["wayfarer_core:lead_ingot"]).id('oowwo_port:lead_nugget'));
  R(() => event.shapeless('wayfarer_core:lead_block', ["9x wayfarer_core:lead_ingot"]).id('oowwo_port:lead_block'));
  R(() => event.shapeless('wayfarer_core:raw_lead_block', ["9x wayfarer_core:raw_lead"]).id('oowwo_port:raw_lead_block'));
  R(() => event.shapeless('9x wayfarer_core:raw_lead', ["wayfarer_core:raw_lead_block"]).id('oowwo_port:raw_lead'));
  R(() => event.shaped('wayfarer_core:wrench', [" LL", " R ", " S "], {L: "wayfarer_core:lead_ingot", R: "wayfarer_core:rubber", S: "minecraft:stick"}).id('oowwo_port:wrench'));
  R(() => event.shaped('wayfarer_core:sledgehammer', ["MLM", " T ", " S "], {L: "wayfarer_core:lead_block", T: "wayfarer_core:steel_ingot", S: "minecraft:stick", M: "supplementaries:slidy_block"}).id('oowwo_port:sledgehammer'));
  R(() => event.shaped('wayfarer_core:item_gauge', [" I ", "IPI", " I "], {I: "wayfarer_core:lead_ingot", P: "minecraft:paper"}).id('oowwo_port:item_gauge'));
  R(() => event.shaped('6x wayfarer_core:item_pipe', [" L ", "L L", " L "], {L: "wayfarer_core:lead_ingot"}).id('oowwo_port:item_pipe'));

  // ---------------- metallurgy_and_progression/magnetite.js ----------------
  R(() => event.shapeless('wayfarer_core:magnetite_block', ["9x wayfarer_core:magnetite"]).id('oowwo_port:magnetite_block'));
  R(() => event.shapeless('9x wayfarer_core:magnetite', ["wayfarer_core:magnetite_block"]).id('oowwo_port:magnetite'));

  // ---------------- metallurgy_and_progression/mercury.js ----------------
  R(() => event.smelting('wayfarer_core:mercury_droplet', "caverns_and_chasms:zirconia").id('oowwo_port:mercury_droplet'));
  R(() => event.smelting('wayfarer_core:mercury_droplet', "wayfarer_core:cinnabar").id('oowwo_port:mercury_droplet_2'));
  R(() => event.shapeless('wayfarer_core:mercury_ingot', ["9x wayfarer_core:mercury_droplet"]).id('oowwo_port:mercury_ingot'));
  R(() => event.shapeless('9x wayfarer_core:mercury_droplet', ["wayfarer_core:mercury_ingot"]).id('oowwo_port:mercury_droplet_3'));
  R(() => event.shapeless('wayfarer_core:cinnabar_block', ["9x wayfarer_core:cinnabar"]).id('oowwo_port:cinnabar_block'));
  R(() => event.shapeless('9x wayfarer_core:cinnabar', ["wayfarer_core:cinnabar_block"]).id('oowwo_port:cinnabar'));

  // ---------------- metallurgy_and_progression/metallurgy.js ----------------
  R(() => event.shaped('wayfarer_core:hammer', ["TTT", " S ", " S "], {S: "minecraft:stick", T: "supplementaries:slidy_block"}).id('oowwo_port:hammer'));

  // ---------------- metallurgy_and_progression/primitive_tools_and_workstations.js ----------------
  R(() => event.shaped('wayfarer_core:firestarter', ["  S", " SS", "S B"], {B: "farmersdelight:straw_bale", S: "minecraft:stick"}).id('oowwo_port:firestarter'));
  R(() => event.shaped('wayfarer_core:primitive_anvil', ["MMM", "MMM", "DDD"], {M: "supplementaries:slidy_block", D: "wayfarer_core:bronze_ingot"}).id('oowwo_port:primitive_anvil'));
  R(() => event.shaped('wayfarer_core:millstone', ["MSM", "MIM", "MPM"], {M: "supplementaries:slidy_block", I: "minecraft:iron_ingot", S: "create:shaft", P: "#minecraft:planks"}).id('oowwo_port:millstone'));
  R(() => event.shaped('wayfarer_core:raw_hide_helmet', ["CCC", "C C", "   "], {C: "minecraft:rabbit_hide"}).id('oowwo_port:raw_hide_helmet'));
  R(() => event.shaped('wayfarer_core:raw_hide_chestplate', ["C C", "CCC", "CCC"], {C: "minecraft:rabbit_hide"}).id('oowwo_port:raw_hide_chestplate'));
  R(() => event.shaped('wayfarer_core:raw_hide_leggings', ["CCC", "C C", "C C"], {C: "minecraft:rabbit_hide"}).id('oowwo_port:raw_hide_leggings'));

  // ---------------- metallurgy_and_progression/silver.js ----------------
  // oowwo 2026-09-27: silver taken by #c: tag. Almost Unified hides wayfarer_core silver in favour of
  // Caverns & Chasms and does not unify KubeJS recipes, so wayfarer_core:silver_* ids were uncraftable.
  // Wayfarer's ingot<->nugget/block/raw-block recipes dropped: C&C's own recipes cover them.
  R(() => event.shaped('wayfarer_core:silver_briar', [" N ", "N N", " N "], {N: "#c:nuggets/silver"}).id('oowwo_port:silver_briar'));
  R(() => event.shaped('wayfarer_core:silver_sword', [" C ", " C ", " S "], {C: "#c:ingots/silver", S: "minecraft:stick"}).id('oowwo_port:silver_sword'));
  R(() => event.shaped('wayfarer_core:silver_axe', [" CC", " SC", " S "], {C: "#c:ingots/silver", S: "minecraft:stick"}).id('oowwo_port:silver_axe'));
  R(() => event.shaped('wayfarer_core:silver_knife', ["   ", " C ", " S "], {C: "#c:ingots/silver", S: "minecraft:stick"}).id('oowwo_port:silver_knife'));
  R(() => event.shaped('wayfarer_core:silver_mallet', ["CSC", " S ", " S "], {C: "#c:ingots/silver", S: "minecraft:stick"}).id('oowwo_port:silver_mallet'));
  R(() => event.shaped('wayfarer_core:briar_helmet', ["MMM", "MHM", "   "], {H: "minecraft:chainmail_helmet", M: "wayfarer_core:silver_briar"}).id('oowwo_port:briar_helmet'));
  R(() => event.shaped('wayfarer_core:briar_chestplate', ["MHM", "MMM", "MMM"], {H: "minecraft:chainmail_chestplate", M: "wayfarer_core:silver_briar"}).id('oowwo_port:briar_chestplate'));
  R(() => event.shaped('wayfarer_core:briar_leggings', ["MMM", "MHM", "M M"], {H: "minecraft:chainmail_leggings", M: "wayfarer_core:silver_briar"}).id('oowwo_port:briar_leggings'));
  R(() => event.shaped('wayfarer_core:briar_boots', ["M M", "MHM", "   "], {H: "minecraft:chainmail_boots", M: "wayfarer_core:silver_briar"}).id('oowwo_port:briar_boots'));

  // ---------------- metallurgy_and_progression/smithing.js ----------------
  R(() => event.shaped('wayfarer_core:anvil', ["BBB", " I ", "PIP"], {B: "minecraft:iron_block", I: "minecraft:iron_ingot", P: "create:iron_sheet"}).id('oowwo_port:anvil'));

  // ---------------- metallurgy_and_progression/steel.js ----------------
  R(() => event.shapeless('9x wayfarer_core:steel_nugget', ["wayfarer_core:steel_ingot"]).id('oowwo_port:steel_nugget'));
  R(() => event.shapeless('wayfarer_core:steel_block', ["9x wayfarer_core:steel_ingot"]).id('oowwo_port:steel_block'));
  R(() => event.shapeless('wayfarer_core:coke_coal_block', ["9x wayfarer_core:coke_coal"]).id('oowwo_port:coke_coal_block'));
  R(() => event.shapeless('9x wayfarer_core:coke_coal', ["wayfarer_core:coke_coal_block"]).id('oowwo_port:coke_coal'));

  // ---------------- metallurgy_and_progression/tin.js ----------------
  R(() => event.shapeless('9x wayfarer_core:tin_nugget', ["wayfarer_core:tin_ingot"]).id('oowwo_port:tin_nugget'));
  R(() => event.shapeless('wayfarer_core:tin_block', ["9x wayfarer_core:tin_ingot"]).id('oowwo_port:tin_block'));
  R(() => event.shapeless('9x wayfarer_core:raw_tin', ["wayfarer_core:raw_tin_block"]).id('oowwo_port:raw_tin'));
  R(() => event.shaped('wayfarer_core:raw_tin_block', ["RRR", "RRR", "RRR"], {R: "wayfarer_core:raw_tin"}).id('oowwo_port:raw_tin_block'));

  // ---------------- metallurgy_and_progression/titanium.js ----------------
  R(() => event.shapeless('9x wayfarer_core:titanium_shard', ["caverns_and_chasms:raw_tin"]).id('oowwo_port:titanium_shard'));

  // ---------------- miscellaneous.js ----------------
  R(() => event.shaped('wayfarer_core:mining_helmet', [" C ", "BBB", "GHG"], {G: "minecraft:leather", B: "create:iron_sheet", C: "#minecraft:candles", H: "minecraft:leather_helmet"}).id('oowwo_port:mining_helmet'));
  R(() => event.smelting('wayfarer_core:bone_ash', "minecraft:bone").id('oowwo_port:bone_ash'));
  R(() => event.custom({"type": "clayworks:baking", "category": "blocks", "cookingtime": 100, "experience": 0, "ingredient": {"item": "minecraft:bone"}, "result": {"count": 1, "id": "wayfarer_core:bone_ash"}}).id('oowwo_port:bone_ash_2'));
  R(() => event.shapeless('wayfarer_core:bone_ash_block', ["9x wayfarer_core:bone_ash"]).id('oowwo_port:bone_ash_block'));
  R(() => event.shapeless('9x wayfarer_core:bone_ash', ["wayfarer_core:bone_ash_block"]).id('oowwo_port:bone_ash_3'));
  R(() => event.shaped('wayfarer_core:rift_campfire', [" S ", " A ", "   "], {S: "wayfarer_core:rift_sediment", A: "minecraft:campfire"}).id('oowwo_port:rift_campfire'));
  R(() => event.shaped('wayfarer_core:rift_torch', [" S ", " A ", "   "], {S: "wayfarer_core:rift_sediment", A: "minecraft:torch"}).id('oowwo_port:rift_torch'));
  R(() => event.shaped('wayfarer_core:workbench', ["IRI", "CXC", "DDD"], {D: "minecraft:iron_ingot", X: "minecraft:chest", C: "minecraft:leather", I: "wayfarer_core:tin_ingot", R: "minecraft:crafting_table"}).id('oowwo_port:workbench'));
  R(() => event.custom({"type": "farmersdelight:cooking", "cookingtime": 1000, "experience": 0.3, "ingredients": [{"item": "wayfarer_core:lifegem"}, {"item": "wayfarer_core:bone_ash"}, {"item": "wayfarer_core:bone_ash"}, {"item": "raw_gold"}, {"item": "raw_gold"}, {"item": "raw_gold"}], "recipe_book_tab": "misc", "result": {"id": "wayfarer_core:heart_crystal"}}).id('oowwo_port:heart_crystal'));
  R(() => event.shaped('wayfarer_core:spoon', [" W ", " P ", " S "], {P: "#minecraft:planks", W: "wayfarer_core:wax", S: "minecraft:stick"}).id('oowwo_port:spoon'));

  // ---------------- technology/create.js ----------------
  R(() => event.shapeless('9x wayfarer_core:titanium_nugget', ["wayfarer_core:titanium_ingot"]).id('oowwo_port:titanium_nugget'));
  R(() => event.shaped('wayfarer_core:portable_engine', ["IHI", "IBI", "PSP"], {P: "#minecraft:planks", S: "wayfarer_core:steel_ingot", I: "minecraft:iron_ingot", B: "aeronautics:adjustable_burner", H: "create:iron_sheet"}).id('oowwo_port:portable_engine'));

  // ---------------- technology/fluid_logistics.js ----------------
  R(() => event.shaped('6x wayfarer_core:fluid_pipe', [" L ", "L L", " L "], {L: "wayfarer_core:hermetic_plating"}).id('oowwo_port:fluid_pipe'));
  R(() => event.shaped('wayfarer_core:fluid_barrel', ["PPP", "IWI", "PPP"], {W: "wayfarer_core:wax", P: "create:andesite_casing", I: "create:iron_sheet"}).id('oowwo_port:fluid_barrel'));
  R(() => event.shaped('wayfarer_core:fluid_gauge', [" I ", "IPI", " I "], {I: "wayfarer_core:hermetic_plating", P: "minecraft:paper"}).id('oowwo_port:fluid_gauge'));

  // ---------------- technology/redstone_circuitry.js ----------------
  R(() => event.shaped('2x wayfarer_core:redstone_circuit', ["   ", " DD", " IT"], {I: "minecraft:copper_ingot", T: "minecraft:redstone_torch", D: "minecraft:redstone"}).id('oowwo_port:redstone_circuit'));
  R(() => event.shaped('wayfarer_core:redstone_gauge', [" I ", "IPI", " I "], {I: "minecraft:copper_ingot", P: "minecraft:paper"}).id('oowwo_port:redstone_gauge'));

  // ---------------- technology/special_circuitry.js ----------------
  R(() => event.shaped('wayfarer_core:amethyst_crystal', ["GGG", "GAG", "GGG"], {A: "nomansland:aqua_regia", G: "minecraft:amethyst_shard"}).id('oowwo_port:amethyst_crystal'));
  R(() => event.shaped('wayfarer_core:quartz_crystal', ["GGG", "GAG", "GGG"], {A: "nomansland:aqua_regia", G: "minecraft:quartz"}).id('oowwo_port:quartz_crystal'));
  R(() => event.shaped('wayfarer_core:audio_circuit', ["   ", "RAR", "SCS"], {R: "minecraft:redstone", S: "minecraft:gold_ingot", C: "wayfarer_core:redstone_circuit", A: "wayfarer_core:amethyst_crystal"}).id('oowwo_port:audio_circuit'));
  R(() => event.shaped('wayfarer_core:video_circuit', ["   ", "RAR", "SCS"], {R: "minecraft:redstone", S: "#c:ingots/silver", C: "wayfarer_core:redstone_circuit", A: "wayfarer_core:quartz_crystal"}).id('oowwo_port:video_circuit'));
  R(() => event.shaped('wayfarer_core:radio_circuit', ["   ", "RAR", "SCS"], {R: "minecraft:redstone", S: "wayfarer_core:tin_ingot", C: "wayfarer_core:redstone_circuit", A: "caverns_and_chasms:zirconia"}).id('oowwo_port:radio_circuit'));


  // ---------------- PATH-CRITICAL: recipes whose RESULT is not a wayfarer_core item ----------------
  // The audit only looked at wayfarer_core items, so these were missed. Derek's intended path to iron
  // needs all of them: the hammer, blast furnace and mortar all need "sturdy mineral blocks"
  // (supplementaries:slidy_block), tin ingots must make buckets/shears, and the hammer presses sheets.
  // Copied from Wayfarer metallurgy_and_progression/metallurgy.js and tin.js, unchanged.
  event.remove({ id: 'supplementaries:slidy_block' });
  event.shaped('supplementaries:slidy_block', ['TDT', 'DBD', 'TDT'], {
    D: ['minecraft:deepslate', 'minecraft:tuff', 'caverns_and_chasms:schist', 'caverns_and_chasms:rhyolite'],
    T: ['minecraft:granite', 'minecraft:blackstone', 'caverns_and_chasms:cylindrite', 'caverns_and_chasms:cassiterite'],
    B: 'wayfarer_core:bone_ash'
  }).id('oowwo_port:slidy_block');

  [['create:iron_sheet', 'minecraft:iron_ingot'],
   ['create:copper_sheet', 'minecraft:copper_ingot'],
   ['create:golden_sheet', 'minecraft:gold_ingot']].forEach(p => {
    event.shaped(p[0], ['   ', 'HII', '   '], { H: '#c:tools/hammers', I: p[1] }).id('oowwo_port:hammer_' + p[0].split(':')[1]);
  });

  event.remove({ id: 'minecraft:bucket' });
  R(() => event.shaped('minecraft:bucket', ['   ', 'B B', ' B '], { B: ['wayfarer_core:tin_ingot', 'minecraft:iron_ingot'] }).id('oowwo_port:bucket'));
  event.remove({ id: 'minecraft:shears' });
  R(() => event.shaped('minecraft:shears', ['   ', ' LB', ' B '], { B: ['wayfarer_core:tin_ingot', 'minecraft:iron_ingot'], L: 'minecraft:leather' }).id('oowwo_port:shears'));

  // ---------------- Furnace bypass closed (Derek: yes, and no need to keep Create fans working) ----------------
  // Wayfarer's metallurgy.js removes every minecraft:blasting recipe and the furnace recipes for iron,
  // copper and gold ingots, so those metals can only come from the bloomery / blast furnace / crucible.
  // oowwo had not ported that, so raw iron still smelted in a plain furnace and the bloomery was optional.
  // Side effects: the vanilla Blast Furnace has no recipes left, and Create's lava fan can no longer
  // bulk-blast these metals (it falls back to these same recipes).
  event.remove({ type: 'minecraft:blasting' });
  event.remove({ type: 'minecraft:smelting', output: 'minecraft:iron_ingot' });
  event.remove({ type: 'minecraft:smelting', output: 'minecraft:copper_ingot' });
  event.remove({ type: 'minecraft:smelting', output: 'minecraft:gold_ingot' });
});
