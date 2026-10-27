// oowwo: Create processing cut, Wayfarer style (step 5, 2026-10-26, deep-test first).
// Removes every recipe of 8 Create processing types (crushing, milling, mixing, deploying, cutting,
// item_application, splashing, haunting), as Wayfarer does. Potion mixing is already off in create-server.toml.
// Review page: "Create Recipe Cut" artifact. Server script: /reload applies it.
//
// KEPT (exceptions):
//   - every recipe whose id is in the oowwo / oowwo_port namespace (our own deliberate recipes, e.g. brass blend)
//   - create:mixing/brass_ingot (copper + zinc heated mixing, Derek 2026-10-23)
//   - every createlowheated recipe (low-heat meals, honey, chocolate)
//   - aeronautics levitite blend (mixing) and end stone powder (crushing)
//   - saw lumber only: log -> stripped log -> planks (173 ids, listed below)
// MOVED (re-added here with oowwo:create_cut/* ids):
//   - Create Deep Dark sculk crushing + powdered obsidian -> Wayfarer millstone (wayfarer_core:grinding)
//   - Create Deep Dark molten echo -> Wayfarer blast furnace melting (1 echo shard -> 50 mB)
//   - Dragons Plus dye fluids -> blast furnace: dye item melts to 250 mB fluid; 250 mB fluid alloys back to 1 dye
//   - copper casing -> 8 planks around 1 copper ingot = 8 casing (same as the treated-wood andesite casing)
//   - train casing (brass casing + sturdy sheet) -> shapeless crafting, same ingredients
//   - Windswept glazed gingerbread block / bricks -> shapeless crafting (gingerbread + sugar); the slab/stairs/wall
//     already craft from glazed bricks
// To revert: delete this file and /reload.

var OOWWO_CUT_TYPES = ['create:crushing', 'create:milling', 'create:mixing', 'create:deploying', 'create:cutting',
  'create:item_application', 'create:splashing', 'create:haunting']

var OOWWO_CUT_KEEP_IDS = [
  'create:mixing/brass_ingot', 'aeronautics:mixing/levitite_blend', 'aeronautics:crushing/end_stone_powder',
  'create:cutting/compat/ars_elemental/stripped_yellow_archwood',
  'create:cutting/compat/ars_elemental/stripped_yellow_archwood_log',
  'create:cutting/compat/ars_nouveau/stripped_green_archwood_log',
  'create:cutting/compat/ars_nouveau/stripped_green_archwood_wood',
  'create:cutting/compat/ars_nouveau/stripped_purple_archwood_log',
  'create:cutting/compat/ars_nouveau/stripped_purple_archwood_wood',
  'create:cutting/compat/ars_nouveau/stripped_red_archwood_log',
  'create:cutting/compat/ars_nouveau/stripped_red_archwood_wood',
  'create:cutting/runtime_generated/compat/abundant_atmosphere/ashroot_log_to_stripped_ashroot_log',
  'create:cutting/runtime_generated/compat/abundant_atmosphere/ashroot_wood_to_stripped_ashroot_wood',
  'create:cutting/runtime_generated/compat/abundant_atmosphere/gourdrot_log_to_stripped_gourdrot_log',
  'create:cutting/runtime_generated/compat/abundant_atmosphere/gourdrot_wood_to_stripped_gourdrot_wood',
  'create:cutting/runtime_generated/compat/abundant_atmosphere/stripped_ashroot_log_to_ashroot_planks',
  'create:cutting/runtime_generated/compat/abundant_atmosphere/stripped_ashroot_wood_to_ashroot_planks',
  'create:cutting/runtime_generated/compat/abundant_atmosphere/stripped_gourdrot_log_to_gourdrot_planks',
  'create:cutting/runtime_generated/compat/abundant_atmosphere/stripped_gourdrot_wood_to_gourdrot_planks',
  'create:cutting/runtime_generated/compat/abundant_atmosphere/stripped_red_bamboo_block_to_red_bamboo_planks',
  'create:cutting/runtime_generated/compat/aether/skyroot_log_to_stripped_skyroot_log',
  'create:cutting/runtime_generated/compat/aether/skyroot_wood_to_stripped_skyroot_wood',
  'create:cutting/runtime_generated/compat/aether/stripped_skyroot_log_to_skyroot_planks',
  'create:cutting/runtime_generated/compat/aether/stripped_skyroot_wood_to_skyroot_planks',
  'create:cutting/runtime_generated/compat/ars_elemental/yellow_archwood_log_to_stripped_yellow_archwood_log',
  'create:cutting/runtime_generated/compat/ars_elemental/yellow_archwood_to_stripped_yellow_archwood',
  'create:cutting/runtime_generated/compat/ars_nouveau/blue_archwood_log_to_stripped_blue_archwood_log',
  'create:cutting/runtime_generated/compat/ars_nouveau/blue_archwood_wood_to_stripped_blue_archwood_wood',
  'create:cutting/runtime_generated/compat/ars_nouveau/green_archwood_log_to_stripped_green_archwood_log',
  'create:cutting/runtime_generated/compat/ars_nouveau/green_archwood_wood_to_stripped_green_archwood_wood',
  'create:cutting/runtime_generated/compat/ars_nouveau/purple_archwood_log_to_stripped_purple_archwood_log',
  'create:cutting/runtime_generated/compat/ars_nouveau/purple_archwood_wood_to_stripped_purple_archwood_wood',
  'create:cutting/runtime_generated/compat/ars_nouveau/red_archwood_log_to_stripped_red_archwood_log',
  'create:cutting/runtime_generated/compat/ars_nouveau/red_archwood_wood_to_stripped_red_archwood_wood',
  'create:cutting/runtime_generated/compat/ars_nouveau/stripped_blue_archwood_log_to_archwood_planks',
  'create:cutting/runtime_generated/compat/ars_nouveau/stripped_blue_archwood_wood_to_archwood_planks',
  'create:cutting/runtime_generated/compat/born_in_chaos_v1/scorched_log_to_stripped_scorched_log',
  'create:cutting/runtime_generated/compat/born_in_chaos_v1/scorched_wood_to_stripped_scorched_wood',
  'create:cutting/runtime_generated/compat/born_in_chaos_v1/stripped_scorched_log_to_scorched_planks',
  'create:cutting/runtime_generated/compat/born_in_chaos_v1/stripped_scorched_wood_to_scorched_planks',
  'create:cutting/runtime_generated/compat/caverns_and_chasms/azalea_log_to_stripped_azalea_log',
  'create:cutting/runtime_generated/compat/caverns_and_chasms/azalea_wood_to_stripped_azalea_wood',
  'create:cutting/runtime_generated/compat/caverns_and_chasms/stripped_azalea_log_to_azalea_planks',
  'create:cutting/runtime_generated/compat/caverns_and_chasms/stripped_azalea_wood_to_azalea_planks',
  'create:cutting/runtime_generated/compat/create/tag_runtime_generated/compat/betterarcheology/rotten_to_rotten_planks',
  'create:cutting/runtime_generated/compat/create/tag_runtime_generated/compat/eidolon_repraised/polished_to_polished_planks',
  'create:cutting/runtime_generated/compat/create/tag_runtime_generated/compat/spawn/rotten_to_rotten_planks',
  'create:cutting/runtime_generated/compat/eidolon_repraised/illwood_log_to_stripped_illwood_log',
  'create:cutting/runtime_generated/compat/eidolon_repraised/stripped_illwood_log_to_illwood_planks',
  'create:cutting/runtime_generated/compat/enchanted/alder_log_to_stripped_alder_log',
  'create:cutting/runtime_generated/compat/enchanted/hawthorn_log_to_stripped_hawthorn_log',
  'create:cutting/runtime_generated/compat/enchanted/rowan_log_to_stripped_rowan_log',
  'create:cutting/runtime_generated/compat/enchanted/stripped_alder_log_to_alder_planks',
  'create:cutting/runtime_generated/compat/enchanted/stripped_hawthorn_log_to_hawthorn_planks',
  'create:cutting/runtime_generated/compat/enchanted/stripped_rowan_log_to_rowan_planks',
  'create:cutting/runtime_generated/compat/evilcraft/undead_log_stripped_to_undead_planks',
  'create:cutting/runtime_generated/compat/evilcraft/undead_wood_stripped_to_undead_planks',
  'create:cutting/runtime_generated/compat/ghosts/haunted_log_to_stripped_haunted_log',
  'create:cutting/runtime_generated/compat/ghosts/stripped_haunted_log_to_haunted_planks',
  'create:cutting/runtime_generated/compat/minecraft/acacia_log_to_stripped_acacia_log',
  'create:cutting/runtime_generated/compat/minecraft/acacia_wood_to_stripped_acacia_wood',
  'create:cutting/runtime_generated/compat/minecraft/birch_log_to_stripped_birch_log',
  'create:cutting/runtime_generated/compat/minecraft/birch_wood_to_stripped_birch_wood',
  'create:cutting/runtime_generated/compat/minecraft/cherry_log_to_stripped_cherry_log',
  'create:cutting/runtime_generated/compat/minecraft/cherry_wood_to_stripped_cherry_wood',
  'create:cutting/runtime_generated/compat/minecraft/crimson_hyphae_to_stripped_crimson_hyphae',
  'create:cutting/runtime_generated/compat/minecraft/crimson_stem_to_stripped_crimson_stem',
  'create:cutting/runtime_generated/compat/minecraft/dark_oak_log_to_stripped_dark_oak_log',
  'create:cutting/runtime_generated/compat/minecraft/dark_oak_wood_to_stripped_dark_oak_wood',
  'create:cutting/runtime_generated/compat/minecraft/jungle_log_to_stripped_jungle_log',
  'create:cutting/runtime_generated/compat/minecraft/jungle_wood_to_stripped_jungle_wood',
  'create:cutting/runtime_generated/compat/minecraft/mangrove_log_to_stripped_mangrove_log',
  'create:cutting/runtime_generated/compat/minecraft/mangrove_wood_to_stripped_mangrove_wood',
  'create:cutting/runtime_generated/compat/minecraft/oak_log_to_stripped_oak_log',
  'create:cutting/runtime_generated/compat/minecraft/oak_wood_to_stripped_oak_wood',
  'create:cutting/runtime_generated/compat/minecraft/spruce_log_to_stripped_spruce_log',
  'create:cutting/runtime_generated/compat/minecraft/spruce_wood_to_stripped_spruce_wood',
  'create:cutting/runtime_generated/compat/minecraft/stripped_acacia_log_to_acacia_planks',
  'create:cutting/runtime_generated/compat/minecraft/stripped_acacia_wood_to_acacia_planks',
  'create:cutting/runtime_generated/compat/minecraft/stripped_bamboo_block_to_bamboo_planks',
  'create:cutting/runtime_generated/compat/minecraft/stripped_birch_log_to_birch_planks',
  'create:cutting/runtime_generated/compat/minecraft/stripped_birch_wood_to_birch_planks',
  'create:cutting/runtime_generated/compat/minecraft/stripped_cherry_log_to_cherry_planks',
  'create:cutting/runtime_generated/compat/minecraft/stripped_cherry_wood_to_cherry_planks',
  'create:cutting/runtime_generated/compat/minecraft/stripped_crimson_hyphae_to_crimson_planks',
  'create:cutting/runtime_generated/compat/minecraft/stripped_crimson_stem_to_crimson_planks',
  'create:cutting/runtime_generated/compat/minecraft/stripped_dark_oak_log_to_dark_oak_planks',
  'create:cutting/runtime_generated/compat/minecraft/stripped_dark_oak_wood_to_dark_oak_planks',
  'create:cutting/runtime_generated/compat/minecraft/stripped_jungle_log_to_jungle_planks',
  'create:cutting/runtime_generated/compat/minecraft/stripped_jungle_wood_to_jungle_planks',
  'create:cutting/runtime_generated/compat/minecraft/stripped_mangrove_log_to_mangrove_planks',
  'create:cutting/runtime_generated/compat/minecraft/stripped_mangrove_wood_to_mangrove_planks',
  'create:cutting/runtime_generated/compat/minecraft/stripped_oak_log_to_oak_planks',
  'create:cutting/runtime_generated/compat/minecraft/stripped_oak_wood_to_oak_planks',
  'create:cutting/runtime_generated/compat/minecraft/stripped_spruce_log_to_spruce_planks',
  'create:cutting/runtime_generated/compat/minecraft/stripped_spruce_wood_to_spruce_planks',
  'create:cutting/runtime_generated/compat/minecraft/stripped_warped_hyphae_to_warped_planks',
  'create:cutting/runtime_generated/compat/minecraft/stripped_warped_stem_to_warped_planks',
  'create:cutting/runtime_generated/compat/minecraft/warped_hyphae_to_stripped_warped_hyphae',
  'create:cutting/runtime_generated/compat/minecraft/warped_stem_to_stripped_warped_stem',
  'create:cutting/runtime_generated/compat/netherdescent/arisian_log_to_stripped_arisian_log',
  'create:cutting/runtime_generated/compat/netherdescent/arisian_wood_to_stripped_arisian_wood',
  'create:cutting/runtime_generated/compat/netherdescent/embur_hyphae_to_stripped_embur_hyphae',
  'create:cutting/runtime_generated/compat/netherdescent/stripped_arisian_log_to_arisian_planks',
  'create:cutting/runtime_generated/compat/netherdescent/stripped_arisian_wood_to_arisian_planks',
  'create:cutting/runtime_generated/compat/netherdescent/stripped_embur_hyphae_to_embur_planks',
  'create:cutting/runtime_generated/compat/netherdescent/stripped_sythian_hyphae_to_sythian_planks',
  'create:cutting/runtime_generated/compat/netherdescent/stripped_sythian_stem_to_sythian_planks',
  'create:cutting/runtime_generated/compat/netherdescent/stripped_wailing_hyphae_to_wailing_planks',
  'create:cutting/runtime_generated/compat/netherdescent/stripped_wailing_stem_to_wailing_planks',
  'create:cutting/runtime_generated/compat/netherdescent/sythian_hyphae_to_stripped_sythian_hyphae',
  'create:cutting/runtime_generated/compat/netherdescent/sythian_stem_to_stripped_sythian_stem',
  'create:cutting/runtime_generated/compat/netherdescent/wailing_hyphae_to_stripped_wailing_hyphae',
  'create:cutting/runtime_generated/compat/netherdescent/wailing_stem_to_stripped_wailing_stem',
  'create:cutting/runtime_generated/compat/newworld/fir_log_to_stripped_fir_log',
  'create:cutting/runtime_generated/compat/newworld/fir_wood_to_stripped_fir_wood',
  'create:cutting/runtime_generated/compat/newworld/stripped_fir_log_to_fir_planks',
  'create:cutting/runtime_generated/compat/newworld/stripped_fir_wood_to_fir_planks',
  'create:cutting/runtime_generated/compat/nomansland/maple_log_to_stripped_maple_log',
  'create:cutting/runtime_generated/compat/nomansland/maple_wood_to_stripped_maple_wood',
  'create:cutting/runtime_generated/compat/nomansland/pine_log_to_stripped_pine_log',
  'create:cutting/runtime_generated/compat/nomansland/pine_wood_to_stripped_pine_wood',
  'create:cutting/runtime_generated/compat/nomansland/stripped_maple_log_to_maple_planks',
  'create:cutting/runtime_generated/compat/nomansland/stripped_maple_wood_to_maple_planks',
  'create:cutting/runtime_generated/compat/nomansland/stripped_pine_log_to_pine_planks',
  'create:cutting/runtime_generated/compat/nomansland/stripped_pine_wood_to_pine_planks',
  'create:cutting/runtime_generated/compat/nomansland/stripped_walnut_log_to_walnut_planks',
  'create:cutting/runtime_generated/compat/nomansland/stripped_walnut_wood_to_walnut_planks',
  'create:cutting/runtime_generated/compat/nomansland/stripped_willow_log_to_willow_planks',
  'create:cutting/runtime_generated/compat/nomansland/stripped_willow_wood_to_willow_planks',
  'create:cutting/runtime_generated/compat/nomansland/walnut_log_to_stripped_walnut_log',
  'create:cutting/runtime_generated/compat/nomansland/walnut_wood_to_stripped_walnut_wood',
  'create:cutting/runtime_generated/compat/nomansland/willow_log_to_stripped_willow_log',
  'create:cutting/runtime_generated/compat/nomansland/willow_wood_to_stripped_willow_wood',
  'create:cutting/runtime_generated/compat/quark/ancient_log_to_stripped_ancient_log',
  'create:cutting/runtime_generated/compat/quark/ancient_wood_to_stripped_ancient_wood',
  'create:cutting/runtime_generated/compat/quark/azalea_log_to_stripped_azalea_log',
  'create:cutting/runtime_generated/compat/quark/azalea_wood_to_stripped_azalea_wood',
  'create:cutting/runtime_generated/compat/quark/blossom_log_to_stripped_blossom_log',
  'create:cutting/runtime_generated/compat/quark/blossom_wood_to_stripped_blossom_wood',
  'create:cutting/runtime_generated/compat/quark/stripped_ancient_log_to_ancient_planks',
  'create:cutting/runtime_generated/compat/quark/stripped_ancient_wood_to_ancient_planks',
  'create:cutting/runtime_generated/compat/quark/stripped_azalea_log_to_azalea_planks',
  'create:cutting/runtime_generated/compat/quark/stripped_azalea_wood_to_azalea_planks',
  'create:cutting/runtime_generated/compat/quark/stripped_blossom_log_to_blossom_planks',
  'create:cutting/runtime_generated/compat/quark/stripped_blossom_wood_to_blossom_planks',
  'create:cutting/runtime_generated/compat/spawn/date_log_to_stripped_date_log',
  'create:cutting/runtime_generated/compat/spawn/rotten_log_to_stripped_rotten_log',
  'create:cutting/runtime_generated/compat/spawn/rotten_wood_to_stripped_rotten_wood',
  'create:cutting/runtime_generated/compat/spawn/stripped_date_log_to_date_planks',
  'create:cutting/runtime_generated/compat/spawn/stripped_rotten_log_to_rotten_planks',
  'create:cutting/runtime_generated/compat/spawn/stripped_rotten_wood_to_rotten_planks',
  'create:cutting/runtime_generated/compat/upgrade_aquatic/driftwood_log_to_stripped_driftwood_log',
  'create:cutting/runtime_generated/compat/upgrade_aquatic/driftwood_to_stripped_driftwood',
  'create:cutting/runtime_generated/compat/upgrade_aquatic/river_log_to_stripped_river_log',
  'create:cutting/runtime_generated/compat/upgrade_aquatic/river_wood_to_stripped_river_wood',
  'create:cutting/runtime_generated/compat/upgrade_aquatic/stripped_driftwood_log_to_driftwood_planks',
  'create:cutting/runtime_generated/compat/upgrade_aquatic/stripped_driftwood_to_driftwood_planks',
  'create:cutting/runtime_generated/compat/upgrade_aquatic/stripped_river_log_to_river_planks',
  'create:cutting/runtime_generated/compat/upgrade_aquatic/stripped_river_wood_to_river_planks',
  'create:cutting/runtime_generated/compat/wetland_whimsy/bald_cypress_log_to_stripped_bald_cypress_log',
  'create:cutting/runtime_generated/compat/wetland_whimsy/bald_cypress_wood_to_stripped_bald_cypress_wood',
  'create:cutting/runtime_generated/compat/wetland_whimsy/stripped_bald_cypress_log_to_bald_cypress_planks',
  'create:cutting/runtime_generated/compat/wetland_whimsy/stripped_bald_cypress_wood_to_bald_cypress_planks',
  'create:cutting/runtime_generated/compat/windswept/chestnut_log_to_stripped_chestnut_log',
  'create:cutting/runtime_generated/compat/windswept/chestnut_wood_to_stripped_chestnut_wood',
  'create:cutting/runtime_generated/compat/windswept/holly_log_to_stripped_holly_log',
  'create:cutting/runtime_generated/compat/windswept/holly_wood_to_stripped_holly_wood',
  'create:cutting/runtime_generated/compat/windswept/pine_log_to_stripped_pine_log',
  'create:cutting/runtime_generated/compat/windswept/pine_wood_to_stripped_pine_wood',
  'create:cutting/runtime_generated/compat/windswept/stripped_chestnut_log_to_chestnut_planks',
  'create:cutting/runtime_generated/compat/windswept/stripped_chestnut_wood_to_chestnut_planks',
  'create:cutting/runtime_generated/compat/windswept/stripped_holly_log_to_holly_planks',
  'create:cutting/runtime_generated/compat/windswept/stripped_holly_wood_to_holly_planks',
  'create:cutting/runtime_generated/compat/windswept/stripped_pine_log_to_pine_planks',
  'create:cutting/runtime_generated/compat/windswept/stripped_pine_wood_to_pine_planks',
]

var OOWWO_CUT_DYES_MELT = [["black_dye", "create_dragons_plus:dyes/minecraft/black", "create_dragons_plus:black_dye", 250], ["blue_dye", "create_dragons_plus:dyes/minecraft/blue", "create_dragons_plus:blue_dye", 250], ["brown_dye", "create_dragons_plus:dyes/minecraft/brown", "create_dragons_plus:brown_dye", 250], ["cyan_dye", "create_dragons_plus:dyes/minecraft/cyan", "create_dragons_plus:cyan_dye", 250], ["dye_depot_amber_dye", "create_dragons_plus:dyes/dye_depot/amber", "create_dragons_plus:dye_depot_amber_dye", 250], ["dye_depot_aqua_dye", "create_dragons_plus:dyes/dye_depot/aqua", "create_dragons_plus:dye_depot_aqua_dye", 250], ["dye_depot_beige_dye", "create_dragons_plus:dyes/dye_depot/beige", "create_dragons_plus:dye_depot_beige_dye", 250], ["dye_depot_coral_dye", "create_dragons_plus:dyes/dye_depot/coral", "create_dragons_plus:dye_depot_coral_dye", 250], ["dye_depot_forest_dye", "create_dragons_plus:dyes/dye_depot/forest", "create_dragons_plus:dye_depot_forest_dye", 250], ["dye_depot_ginger_dye", "create_dragons_plus:dyes/dye_depot/ginger", "create_dragons_plus:dye_depot_ginger_dye", 250], ["dye_depot_indigo_dye", "create_dragons_plus:dyes/dye_depot/indigo", "create_dragons_plus:dye_depot_indigo_dye", 250], ["dye_depot_maroon_dye", "create_dragons_plus:dyes/dye_depot/maroon", "create_dragons_plus:dye_depot_maroon_dye", 250], ["dye_depot_mint_dye", "create_dragons_plus:dyes/dye_depot/mint", "create_dragons_plus:dye_depot_mint_dye", 250], ["dye_depot_navy_dye", "create_dragons_plus:dyes/dye_depot/navy", "create_dragons_plus:dye_depot_navy_dye", 250], ["dye_depot_olive_dye", "create_dragons_plus:dyes/dye_depot/olive", "create_dragons_plus:dye_depot_olive_dye", 250], ["dye_depot_rose_dye", "create_dragons_plus:dyes/dye_depot/rose", "create_dragons_plus:dye_depot_rose_dye", 250], ["dye_depot_slate_dye", "create_dragons_plus:dyes/dye_depot/slate", "create_dragons_plus:dye_depot_slate_dye", 250], ["dye_depot_tan_dye", "create_dragons_plus:dyes/dye_depot/tan", "create_dragons_plus:dye_depot_tan_dye", 250], ["dye_depot_teal_dye", "create_dragons_plus:dyes/dye_depot/teal", "create_dragons_plus:dye_depot_teal_dye", 250], ["dye_depot_verdant_dye", "create_dragons_plus:dyes/dye_depot/verdant", "create_dragons_plus:dye_depot_verdant_dye", 250], ["gray_dye", "create_dragons_plus:dyes/minecraft/gray", "create_dragons_plus:gray_dye", 250], ["green_dye", "create_dragons_plus:dyes/minecraft/green", "create_dragons_plus:green_dye", 250], ["light_blue_dye", "create_dragons_plus:dyes/minecraft/light_blue", "create_dragons_plus:light_blue_dye", 250], ["light_gray_dye", "create_dragons_plus:dyes/minecraft/light_gray", "create_dragons_plus:light_gray_dye", 250], ["lime_dye", "create_dragons_plus:dyes/minecraft/lime", "create_dragons_plus:lime_dye", 250], ["magenta_dye", "create_dragons_plus:dyes/minecraft/magenta", "create_dragons_plus:magenta_dye", 250], ["orange_dye", "create_dragons_plus:dyes/minecraft/orange", "create_dragons_plus:orange_dye", 250], ["pink_dye", "create_dragons_plus:dyes/minecraft/pink", "create_dragons_plus:pink_dye", 250], ["purple_dye", "create_dragons_plus:dyes/minecraft/purple", "create_dragons_plus:purple_dye", 250], ["red_dye", "create_dragons_plus:dyes/minecraft/red", "create_dragons_plus:red_dye", 250], ["white_dye", "create_dragons_plus:dyes/minecraft/white", "create_dragons_plus:white_dye", 250], ["yellow_dye", "create_dragons_plus:dyes/minecraft/yellow", "create_dragons_plus:yellow_dye", 250]]
var OOWWO_CUT_DYES_ALLOY = [["black_dye", "create_dragons_plus:black_dye", 250, "minecraft:black_dye"], ["blue_dye", "create_dragons_plus:blue_dye", 250, "minecraft:blue_dye"], ["brown_dye", "create_dragons_plus:brown_dye", 250, "minecraft:brown_dye"], ["cyan_dye", "create_dragons_plus:cyan_dye", 250, "minecraft:cyan_dye"], ["dye_depot_amber_dye", "create_dragons_plus:dye_depot_amber_dye", 250, "dye_depot:amber_dye"], ["dye_depot_aqua_dye", "create_dragons_plus:dye_depot_aqua_dye", 250, "dye_depot:aqua_dye"], ["dye_depot_beige_dye", "create_dragons_plus:dye_depot_beige_dye", 250, "dye_depot:beige_dye"], ["dye_depot_coral_dye", "create_dragons_plus:dye_depot_coral_dye", 250, "dye_depot:coral_dye"], ["dye_depot_forest_dye", "create_dragons_plus:dye_depot_forest_dye", 250, "dye_depot:forest_dye"], ["dye_depot_ginger_dye", "create_dragons_plus:dye_depot_ginger_dye", 250, "dye_depot:ginger_dye"], ["dye_depot_indigo_dye", "create_dragons_plus:dye_depot_indigo_dye", 250, "dye_depot:indigo_dye"], ["dye_depot_maroon_dye", "create_dragons_plus:dye_depot_maroon_dye", 250, "dye_depot:maroon_dye"], ["dye_depot_mint_dye", "create_dragons_plus:dye_depot_mint_dye", 250, "dye_depot:mint_dye"], ["dye_depot_navy_dye", "create_dragons_plus:dye_depot_navy_dye", 250, "dye_depot:navy_dye"], ["dye_depot_olive_dye", "create_dragons_plus:dye_depot_olive_dye", 250, "dye_depot:olive_dye"], ["dye_depot_rose_dye", "create_dragons_plus:dye_depot_rose_dye", 250, "dye_depot:rose_dye"], ["dye_depot_slate_dye", "create_dragons_plus:dye_depot_slate_dye", 250, "dye_depot:slate_dye"], ["dye_depot_tan_dye", "create_dragons_plus:dye_depot_tan_dye", 250, "dye_depot:tan_dye"], ["dye_depot_teal_dye", "create_dragons_plus:dye_depot_teal_dye", 250, "dye_depot:teal_dye"], ["dye_depot_verdant_dye", "create_dragons_plus:dye_depot_verdant_dye", 250, "dye_depot:verdant_dye"], ["gray_dye", "create_dragons_plus:gray_dye", 250, "minecraft:gray_dye"], ["green_dye", "create_dragons_plus:green_dye", 250, "minecraft:green_dye"], ["light_blue_dye", "create_dragons_plus:light_blue_dye", 250, "minecraft:light_blue_dye"], ["light_gray_dye", "create_dragons_plus:light_gray_dye", 250, "minecraft:light_gray_dye"], ["lime_dye", "create_dragons_plus:lime_dye", 250, "minecraft:lime_dye"], ["magenta_dye", "create_dragons_plus:magenta_dye", 250, "minecraft:magenta_dye"], ["orange_dye", "create_dragons_plus:orange_dye", 250, "minecraft:orange_dye"], ["pink_dye", "create_dragons_plus:pink_dye", 250, "minecraft:pink_dye"], ["purple_dye", "create_dragons_plus:purple_dye", 250, "minecraft:purple_dye"], ["red_dye", "create_dragons_plus:red_dye", 250, "minecraft:red_dye"], ["white_dye", "create_dragons_plus:white_dye", 250, "minecraft:white_dye"], ["yellow_dye", "create_dragons_plus:yellow_dye", 250, "minecraft:yellow_dye"]]

ServerEvents.recipes(event => {
  const R = (name, fn) => { try { fn() } catch (e) { console.error('[oowwo_create_cut] ' + name + ': ' + e) } }
  const ID = s => 'oowwo:create_cut/' + s

  // ---- 1. removal by type, with exceptions
  const keep = OOWWO_CUT_KEEP_IDS.map(i => ({ id: i }))
  keep.push({ mod: 'oowwo' }, { mod: 'oowwo_port' }, { mod: 'createlowheated' })
  OOWWO_CUT_TYPES.forEach(t => R('remove ' + t, () => event.remove({ type: t, not: keep })))

  // ---- 2. Wayfarer millstone (wayfarer_core:grinding)
  const grind = (id, item, count, out, n, bonus, time) => R(id, () => event.custom({
    type: 'wayfarer_core:grinding', ingredient: { item: item }, input_count: count,
    result: { id: out, count: n }, duration: time, bonus_chance: bonus, bonus_count: bonus > 0 ? 1 : 0
  }).id(ID('grinding/' + id)))
  grind('sculk_flour_from_sculk', 'minecraft:sculk', 1, 'create_deep_dark:sculk_flour', 1, 0.25, 100)
  grind('sculk_flour_from_sensor', 'minecraft:sculk_sensor', 1, 'create_deep_dark:sculk_flour', 1, 0.75, 100)
  grind('sculk_flour_from_shrieker', 'minecraft:sculk_shrieker', 1, 'create_deep_dark:sculk_flour', 1, 0.25, 100)
  grind('sculk_from_catalyst', 'minecraft:sculk_catalyst', 1, 'minecraft:sculk', 1, 0.75, 100)
  grind('sculk_flour_from_veins', 'minecraft:sculk_vein', 4, 'create_deep_dark:sculk_flour', 1, 0, 100)
  grind('powdered_obsidian', 'minecraft:obsidian', 1, 'create:powdered_obsidian', 1, 0, 200)

  // ---- 3. Wayfarer blast furnace
  R('molten_echo', () => event.custom({
    type: 'wayfarer_core:blast_furnace_melting', ingredient: { item: 'minecraft:echo_shard' }, duration: 1600,
    result: { id: 'create_deep_dark:molten_echo', amount: 50 }
  }).id(ID('melting/molten_echo')))
  OOWWO_CUT_DYES_MELT.forEach(d => R('dye melt ' + d[0], () => event.custom({
    type: 'wayfarer_core:blast_furnace_melting', ingredient: { tag: d[1] }, duration: 400,
    result: { id: d[2], amount: d[3] }
  }).id(ID('melting/dye/' + d[0]))))
  OOWWO_CUT_DYES_ALLOY.forEach(d => R('dye alloy ' + d[0], () => event.custom({
    type: 'wayfarer_core:blast_furnace_alloying', ingredients: [{ id: d[1], amount: d[2] }], duration: 200,
    item_result: { count: 1, id: d[3] }
  }).id(ID('alloying/dye/' + d[0]))))

  // ---- 4. shapeless crafting replacements for item application
  // copper casing mirrors the treated-wood andesite casing (8 planks around wax -> 8): 8 planks around 1 copper ingot -> 8
  R('copper_casing', () => event.shaped('8x create:copper_casing', ['PPP', 'PCP', 'PPP'], { P: '#minecraft:planks', C: '#c:ingots/copper' }).id(ID('copper_casing')))
  R('railway_casing', () => event.shapeless('create:railway_casing', ['create:brass_casing', '#c:plates/obsidian']).id(ID('railway_casing')))
  R('glazed_gingerbread_block', () => event.shapeless('windswept:glazed_gingerbread_block', ['windswept:gingerbread_block', 'minecraft:sugar']).id(ID('glazed_gingerbread_block')))
  R('glazed_gingerbread_bricks', () => event.shapeless('windswept:glazed_gingerbread_bricks', ['windswept:gingerbread_bricks', 'minecraft:sugar']).id(ID('glazed_gingerbread_bricks')))
})
