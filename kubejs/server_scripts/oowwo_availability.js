// oowwo_availability.js — Task 5 availability fixes (claude/oowwo-availability-audit-build.md).
// Each section is one approved gap row. Recipe ids: oowwo:avail/<name>.
// Top-level names are prefixed OAVF_ (KubeJS server scripts share one global scope).

ServerEvents.recipes(function (event) {
  var OAVF_R = function (fn) { try { fn() } catch (e) { console.warn('[oowwo_availability] skipped: ' + e) } }

  // ---------- G4 — aqua regia (Wayfarer miscellaneous.js: global.cooking, FD cooking pot) ----------
  // orpiment + mercury droplet + sulfur + ghast tear -> 4 aqua regia, served in glass bottles, 500 ticks, 0.3 xp.
  // Unblocks oowwo's own recipes that need it: wayfarer_core amethyst/quartz crystal -> audio/video circuits.
  OAVF_R(function () {
    event.custom({
      type: 'farmersdelight:cooking',
      cookingtime: 500,
      experience: 0.3,
      recipe_book_tab: 'misc',
      ingredients: [
        { item: 'nomansland:orpiment' },
        { item: 'wayfarer_core:mercury_droplet' },
        { item: 'nomansland:sulfur' },
        { item: 'minecraft:ghast_tear' }
      ],
      result: { id: 'nomansland:aqua_regia', count: 4 },
      container: { id: 'minecraft:glass_bottle', count: 1 }
    }).id('oowwo:avail/aqua_regia')
  })

  // ---------- G1 — silver building blocks (Wayfarer building.js, 2026-10-04) ----------
  // 4 silver ingots (diamond) -> 4 chiseled silver; 2x2 chiseled -> 4 silver tiles; 2x2 tiles -> 4 silver bricks.
  // Silver by #c:ingots/silver (Almost Unified rule). Silver brick slab/stairs come with G5 (Clutter No More).
  OAVF_R(function () {
    event.shaped('4x wayfarer_core:chiseled_silver', [' S ', 'S S', ' S '], { S: '#c:ingots/silver' }).id('oowwo:avail/chiseled_silver')
  })
  OAVF_R(function () {
    event.shaped('4x wayfarer_core:silver_tiles', ['SS', 'SS'], { S: 'wayfarer_core:chiseled_silver' }).id('oowwo:avail/silver_tiles')
  })
  OAVF_R(function () {
    event.shaped('4x wayfarer_core:silver_bricks', ['SS', 'SS'], { S: 'wayfarer_core:silver_tiles' }).id('oowwo:avail/silver_bricks')
  })

  // ---------- G2 — braziers (Wayfarer building.js, 2026-10-04) ----------
  // Hanging: chain . chain / ingot R ingot / . ingot .   Stone: ingot R ingot / 3 stone tool materials.
  // R = patina (cupric) or rift sediment (rift). Ingots = #wayfarer:generic_metal_ingot (defined in oowwo_building.js).
  // Cupric braziers need patina -> craftable once G9 (patina sources) is in.
  var OAVF_BRAZIER = function (name, mat) {
    OAVF_R(function () {
      event.shaped('wayfarer_core:' + name + '_brazier', ['C C', 'IRI', ' I '], {
        C: 'minecraft:chain', I: '#wayfarer:generic_metal_ingot', R: mat
      }).id('oowwo:avail/' + name + '_brazier')
    })
    OAVF_R(function () {
      event.shaped('wayfarer_core:' + name + '_stone_brazier', ['IRI', 'CCC'], {
        C: '#minecraft:stone_tool_materials', I: '#wayfarer:generic_metal_ingot', R: mat
      }).id('oowwo:avail/' + name + '_stone_brazier')
    })
  }
  OAVF_BRAZIER('cupric', 'wayfarer_core:patina')
  OAVF_BRAZIER('rift', 'wayfarer_core:rift_sediment')

  // ---------- G3 — sconce torch levers (Wayfarer redstone_circuitry.js, 2026-10-04) ----------
  // sconce torch over a lever -> the matching sconce torch lever.
  ;[['sconce_soul_torch_lever', 'nomansland:sconce_soul_torch'],
    ['sconce_cupric_torch_lever', 'wayfarer_core:sconce_cupric_torch'],
    ['sconce_rift_torch_lever', 'wayfarer_core:sconce_rift_torch']].forEach(function (p) {
    OAVF_R(function () {
      event.shaped('wayfarer_core:' + p[0], [' S ', ' L '], { S: p[1], L: 'minecraft:lever' }).id('oowwo:avail/' + p[0])
    })
  })

  // ---------- G9a — patina from the Toxony mortar (oowwo-own; Derek 2026-10-04: more patina, consumes the block) ----------
  // Unwaxed exposed / weathered / oxidized copper, cut copper and chiseled copper -> 2 / 4 / 6 patina.
  // (Axe or sandpaper scraping gives 1 per oxidation step and keeps the block — see G9b below.)
  ;[['exposed', 2], ['weathered', 4], ['oxidized', 6]].forEach(function (st) {
    ;[st[0] + '_copper', st[0] + '_cut_copper', st[0] + '_chiseled_copper'].forEach(function (b) {
      OAVF_R(function () {
        event.custom({
          type: 'toxony:mortar_pestle',
          ingredients: [{ item: 'minecraft:' + b }],
          result: { id: 'wayfarer_core:patina', count: st[1] }
        }).id('oowwo:avail/patina_from_' + b)
      })
    })
  })

  // ---------- G7 — NML chiseled limestone / chiseled ivory limestone (no recipe in NML, Wayfarer or oowwo) ----------
  // Same as NML's own chiseled siltstone recipe when Clutter No More is loaded (chiseled_siltstone_cnm.json, read from
  // the jar): 4 polished in a diamond -> 4 chiseled. Plus a 1:1 stonecutter recipe.
  ;[['polished_limestone', 'chiseled_limestone'], ['polished_ivory_limestone', 'chiseled_ivory_limestone']].forEach(function (p) {
    OAVF_R(function () {
      event.shaped('4x nomansland:' + p[1], [' # ', '# #', ' # '], { '#': 'nomansland:' + p[0] }).id('oowwo:avail/' + p[1])
    })
    OAVF_R(function () {
      event.stonecutting('nomansland:' + p[1], 'nomansland:' + p[0]).id('oowwo:avail/' + p[1] + '_stonecutting')
    })
  })
})

// ---------- G9b — patina from scraping (axe AND Create sandpaper) ----------
// Both fire NeoForge's BlockToolModificationEvent with ability "axe_scrape" (Create's SandPaperItem.useOn calls
// getToolModifiedState(AXE_SCRAPE) — read from the jar). One patina drops each time an unwaxed exposed/weathered/oxidized
// block (any mod: id contains exposed_/weathered_/oxidized_, not waxed) is scraped one stage down.
// Polishing a copper ITEM in hand with sandpaper cannot give patina (Create caps polishing at 1 output).
var OAVF_ToolModify = Java.loadClass('net.neoforged.neoforge.event.level.BlockEvent$BlockToolModificationEvent')
var OAVF_Block = Java.loadClass('net.minecraft.world.level.block.Block')
NativeEvents.onEvent(OAVF_ToolModify, function (e) {
  try {
    if (e.isSimulated() || String(e.getItemAbility().name()) !== 'axe_scrape') return
    var level = e.getLevel()
    if (level.isClientSide()) return
    var fin = e.getFinalState(), st = e.getState()
    if (fin == null || fin === st) return
    var id = String(st.getBlock().getId ? st.getBlock().getId() : st.getBlock())
    if (id.indexOf('waxed') >= 0 || !/(exposed|weathered|oxidized)/.test(id)) return
    OAVF_Block.popResource(level, e.getPos(), Item.of('wayfarer_core:patina'))
  } catch (err) { console.warn('[oowwo_availability] patina scrape: ' + err) }
})

// ---------- G8 — wild grapes block from shears ----------
// brewinandchewin:wild_grapes has a block item but no way to get it: its loot table (read from the BnC jar) only drops
// red grapes. With shears (#c:tools/shear) the grapes are replaced by the block item. Other tools are unchanged.
LootJS.modifiers(function (event) {
  try {
    event.addBlockModifier('brewinandchewin:wild_grapes')
      .matchMainHand('#c:tools/shear')
      .replaceLoot('brewinandchewin:red_grapes', LootEntry.of('brewinandchewin:wild_grapes'))
  } catch (err) { console.warn('[oowwo_availability] wild grapes shears: ' + err) }
})
