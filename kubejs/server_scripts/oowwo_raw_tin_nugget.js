// oowwo: raw tin nuggets from river clay (Derek, 2026-10-07).
// spelunkery:raw_tin_nugget already exists in Spelunkery 0.4.3 (registered unconditionally, own texture + name) but
// has no recipes in this pack. The nugget drops from the sluice when washing CLAY in water in river biomes
// (kubejs/data/spelunkery/loot_table/gameplay/sluice/water/clay.json, entry weight 50 = ~4.8% of river clay washes).
// Here: 9 raw tin nuggets <-> 1 wayfarer_core:raw_tin (melt raw tin in the crucible as usual).
// Top-level prefix ORTN_. To revert: delete this file and the clay.json entry.
ServerEvents.recipes(event => {
  event.shaped('wayfarer_core:raw_tin', ['NNN', 'NNN', 'NNN'], {
    N: 'spelunkery:raw_tin_nugget'
  }).id('oowwo:raw_tin_from_nuggets')
  event.shapeless('9x spelunkery:raw_tin_nugget', ['wayfarer_core:raw_tin']).id('oowwo:raw_tin_nuggets_from_raw_tin')
})
