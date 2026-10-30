// oowwo: seed pots — ported from Wayfarer's loot_and_combat/global_loot_rebalance
// (templates_and_injections.js defines lootjs:seed_pot; overworld.js wires it into pots/chests).
//
// Companion data files (kubejs/data), same port, 2026-09-26:
//   wayfarer/worldgen/...             Wayfarer's wild crop patches (copied verbatim)
//   wayfarer/neoforge/biome_modifier/wild_crops/   where each wild crop spawns
//   wayfarer/tags/worldgen/biome/     has_cabbage / has_carrots / has_rice
//   farmersdelight/.../wild_*.json    FD's own wild crops switched off (neoforge:none)
//   supplementaries/.../wild_flax.json  Supplementaries' wild flax switched off
//   oowwo/.../remove_vanilla_sugar_cane.json  sugar cane only via Wayfarer's lush-biome patch
//   minecraft/loot_table/gameplay/sniffer_digging.json  + caverns_and_chasms:false_hope
//
// DEVIATIONS from Wayfarer:
//   - #c:is_warm -> #c:is_hot (cabbage tag, tomato modifier). c:is_warm does not exist; Wayfarer's
//     own latest.log errors on it, so wild cabbage/tomatoes never generate there.
//   - Featurify is NOT used; the same features are disabled with data overrides instead.
//   - Seeds are ADDED to the existing loot. Wayfarer clears these tables and rebuilds them around
//     its whole loot rebalance; oowwo keeps each table's own loot and adds a seed roll on top.
//   - nova_structures:pots/pot_pillager_outpost is skipped (comes from a D&T addon oowwo lacks).
//   - Sniffer: Nirvana's hemp seeds / bliss bloom NOT added to the sniffer table (Nirvana now installed; optional).
//   - 2026-10-19: Rustic Delight cotton / bell pepper / coffee and Nirvana hemp added to the seed pot;
//     (Enchanted's witch seed table removed 2026-10-29 with the mod.)
//
// To revert: delete this file and the data folders listed above.

LootJS.lootTables(event => {
  const W = (msg) => console.warn('[seed_pots] ' + msg);

  event.create('lootjs:seed_pot')
    .createPool(pool => {
      pool.addEntry(LootEntry.of('minecraft:wheat_seeds').withWeight(20).setCount([5, 10]));
      pool.addEntry(LootEntry.of('minecraft:beetroot_seeds').withWeight(10).setCount([5, 10]));
      pool.addEntry(LootEntry.of('minecraft:pumpkin_seeds').withWeight(10).setCount([5, 10]));
      pool.addEntry(LootEntry.of('farmersdelight:cabbage_seeds').withWeight(10).setCount([5, 10]));
      pool.addEntry(LootEntry.of('farmersdelight:tomato_seeds').withWeight(5).setCount([5, 10]));
      pool.addEntry(LootEntry.of('snowyspirit:ginger_flower').withWeight(5).setCount([5, 10]));
      pool.addEntry(LootEntry.of('supplementaries:flax_seeds').withWeight(5).setCount([5, 10]));
      pool.addEntry(LootEntry.of('brewinandchewin:corn_kernels').withWeight(5).setCount([5, 10]));
      pool.addEntry(LootEntry.of('rusticdelight:cotton_seeds').withWeight(5).setCount([5, 10]));
      pool.addEntry(LootEntry.of('rusticdelight:bell_pepper_seeds').withWeight(5).setCount([5, 10]));
      pool.addEntry(LootEntry.of('nirvana:hemp_seeds').withWeight(5).setCount([5, 10]));
      pool.addEntry(LootEntry.of('rusticdelight:coffee_beans').withWeight(3).setCount([3, 6]));
      pool.addEntry(LootEntry.of('nomansland:trail_mix').withWeight(20).setCount([5, 10]));
      pool.addEntry(LootEntry.of('create:wheat_flour').withWeight(20).setCount([5, 10]));
      pool.addEntry(LootEntry.of('minecraft:bone_meal').withWeight(10).setCount([5, 10]));
      pool.addEntry(LootEntry.empty().withWeight(15));
    });

  // 2026-10-29: Enchanted removed — its witch herb seed table (lootjs:witch_seed_pot) and extra rolls are gone.

  // Pots: Wayfarer makes 10% (illager camp 20%) of these pots seed pots.
  const POTS = {
    'nova_structures:pots/pot_wild_ruin': 0.1,
    'nova_structures:pots/pot_generic_ruin': 0.1,
    'nova_structures:pots/pot_basic': 0.1,
    'nova_structures:pots/pot_illager_camp': 0.2,
    'nova_structures:pots/pot_bunker': 0.1,
    'minecraft:pots/trial_chambers/corridor': 0.1,
  };
  // Rhino note: no const/let inside these callbacks — KubeJS's Rhino threw
  // "redeclaration of var t" on 2026-09-26. The table is passed in as an argument instead.
  const withTable = (id, fn) => {
    try { fn(event.getLootTable(id)); } catch (e) { W(id + ': ' + e); }
  };

  Object.keys(POTS).forEach(id => withTable(id, tbl => {
    if (tbl == null) { W('missing table ' + id); return; }
    tbl.createPool(pool => {
      pool.addEntry(LootEntry.reference('lootjs:seed_pot').when(c => c.randomChance(POTS[id])));
    });
  }));

  // Chests: guaranteed seed rolls, as in Wayfarer.
  const CHESTS = {
    'nomansland:chests/dungeon_kitchen': 2,
    'minecraft:chests/ancient_city_ice_box': 3,
  };
  Object.keys(CHESTS).forEach(id => withTable(id, tbl => {
    if (tbl == null) { W('missing table ' + id); return; }
    tbl.createPool(pool => {
      pool.addEntry(LootEntry.reference('lootjs:seed_pot'));
      pool.rolls(CHESTS[id]);
    });
  }));
});
