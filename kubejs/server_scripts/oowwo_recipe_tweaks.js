// oowwo: small recipe swaps. Home for one-line retiering that has no better file.
//
// --- TRIPWIRE HOOK: iron ingot -> tin ingot ---
// Vanilla is ["I","S","#"] with I = iron ingot, S = stick, # = #minecraft:planks, making 2 hooks.
// Shape and count of 2 are kept; only the metal changes.
// Wayfarer does NOT do this — it leaves the vanilla recipe alone and only consumes hooks
// (repeating crossbow, arbalest). This is an oowwo choice.
//
// --- GAG ESCAPE ROPE: iron chains -> C&C copper chains ---
// GAG's own recipe is 3 minecraft:chain (each 1 iron ingot + 2 iron nuggets), which kept escape
// ropes iron-gated no matter what the hook cost. Caverns & Chasms adds copper_chain (3 copper
// nuggets each), so the rope now sits in the copper/tin era where it is actually wanted.
// Shape is unchanged from GAG's recipe; only the link metal moves.
// Vanilla chain crafting is untouched — only this recipe changes.
//
// Cost per rope: 3 copper chains (= 9 copper nuggets, about 1 copper ingot) + 1 tin tripwire hook
// (half a tin ingot) + 1 lead. Paired with config/gag.cfg durability 512 -> 32.
// Only the un-weathered caverns_and_chasms:copper_chain is accepted; C&C also has exposed,
// weathered, oxidized and waxed variants if you ever want those to count too.
//
// Tin entries use the #c:ingots/tin tag rather than the wayfarer item directly, so any tin ingot
// works; Almost Unified pins that tag to wayfarer_core, so the wayfarer ingot is what shows in EMI.
//
// --- HAMMERS LOSE DURABILITY INSTEAD OF BEING USED UP ---
// wayfarer_core has this built in: any damageable item in the tag wayfarer_core:durability_crafting
// comes back from the crafting grid with 1 damage instead of being consumed (its
// DurabilityCraftingMixin; the item breaks when it runs out of durability). Wayfarer fills that tag
// in its miscellaneous.js with #c:tools/hammers (hammer, sledgehammer, silver mallet, mace) plus
// Newworld's ancient mattock, Create super glue and Simulated honey glue. oowwo only adds the
// hammers, so the sheet-pressing recipes in wayfarer_port.js keep the hammer.
// NOTE: the tag's namespace is wayfarer_core in the installed jar; newer Wayfarer builds renamed it
// to wayfarer:durability_crafting, so this line needs updating if wayfarer_core is ever updated.
//
// --- CANDLE: honeycomb -> wax (Wayfarer materials/wax.js) ---
// Vanilla candle is string + honeycomb; Wayfarer swaps the honeycomb for wayfarer_core:wax.
//
// --- RECOVERY COMPASS: Wayfarer's recipe (metallurgy_and_progression/magnetite.js) ---
// Compass in the middle, echo shard on top, magnetite either side, bone ash below.
// The vanilla recipe (8 echo shards around a compass) is removed.
// MAGNETITE SOURCE: oowwo had none (no worldgen, no drop), so Wayfarer's LootJS rule is ported too:
// iron ore and deepslate iron ore have a 5% chance to drop 1 magnetite instead of raw iron.
// Wayfarer's other magnetite.js changes (compass, lodestone, Create redstone contact, Simulated
// magnet) are NOT ported - the plain compass recipe is unchanged.
//
// To revert: delete this file (gag.cfg durability must be put back to 512 separately).

ServerEvents.recipes(event => {
  // tripwire hook from tin
  event.remove({ output: 'minecraft:tripwire_hook' });

  event.shaped('2x minecraft:tripwire_hook', [
    'I',
    'S',
    'P'
  ], {
    I: '#c:ingots/tin',
    S: 'minecraft:stick',
    P: '#minecraft:planks'
  }).id('oowwo:tripwire_hook_from_tin');

  // GAG escape rope: GAG's own shape, iron chains swapped for C&C copper chains
  event.remove({ output: 'gag:escape_rope' });

  event.shaped('gag:escape_rope', [
    'MT',
    'M ',
    'ML'
  ], {
    M: 'caverns_and_chasms:copper_chain',
    T: 'minecraft:tripwire_hook',
    L: 'minecraft:lead'
  }).id('oowwo:escape_rope_copper_chain');
});

ServerEvents.tags('item', event => {
  event.add('wayfarer:durability_crafting', '#c:tools/hammers');
});

ServerEvents.recipes(event => {
  const R = fn => { try { fn(); } catch (e) { console.warn('[recipe_tweaks] skipped: ' + e); } };

  // candle: honeycomb -> wax
  R(() => event.replaceInput({ id: 'minecraft:candle' }, 'minecraft:honeycomb', 'wayfarer_core:wax'));

  // recovery compass, Wayfarer's shape
  event.remove({ id: 'minecraft:recovery_compass' });
  R(() => event.shaped('minecraft:recovery_compass', [
    ' D ',
    'MTM',
    ' B '
  ], {
    T: 'minecraft:compass',
    D: 'minecraft:echo_shard',
    B: 'wayfarer_core:bone_ash',
    M: 'wayfarer_core:magnetite'
  }).id('oowwo:recovery_compass_wayfarer'));
});

// magnetite source (Wayfarer magnetite.js): 5% of iron ore drops are magnetite instead of raw iron
LootJS.modifiers(event => {
  event.addBlockModifier('minecraft:iron_ore').randomChance(0.05)
    .replaceLoot('minecraft:raw_iron', LootEntry.of('wayfarer_core:magnetite', [1]));
  event.addBlockModifier('minecraft:deepslate_iron_ore').randomChance(0.05)
    .replaceLoot('minecraft:raw_iron', LootEntry.of('wayfarer_core:magnetite', [1]));
});

// --- SPELUNKERY SLUICE GRATE: any chain (Derek 2026-10-02) ---
// Spelunkery's recipe is 3 wooden slabs over 3 minecraft:chain. It now takes any #c:chains item
// (C&C copper/tin/silver/gold chains, Windswept ice chain, Nether Descent pendorite chain, and the
// vanilla chain, added explicitly in case NeoForge's tag ever misses it), so copper chains from the
// copper era work. Shape and count unchanged.
ServerEvents.tags('item', event => {
  event.add('c:chains', 'minecraft:chain');
});

ServerEvents.recipes(event => {
  event.replaceInput({ id: 'spelunkery:sluice_grate' }, 'minecraft:chain', '#c:chains');
});
