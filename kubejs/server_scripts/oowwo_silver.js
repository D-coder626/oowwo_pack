// oowwo: silver — rest of Wayfarer kubejs/server_scripts/metallurgy_and_progression/silver.js.
// Already ported: silver storage blocks, raw silver block, silver briar, silver sword/axe/knife/
// mallet, briar armour (wayfarer_port.js).
//
// THIS FILE ADDS (Derek approved the brewing stand change 2026-09-26)
//   - Brewing stand: 2 blaze rods over 3 silver ingots (vanilla cobblestone recipe removed).
//   - Supplementaries goblet: 4 silver nuggets.
//   - Shield Expansion netherite shield: silver ingots + silver briar.
// DEVIATIONS: silver ingots/nuggets taken by the #c: tag, so either silver (wayfarer_core or
// Caverns & Chasms — both are in those tags, see silver_unification.js) works. vista:mirror
// skipped (Vista not installed). Recipe ids added. To revert: delete this file.
//
// oowwo addition (Derek, 2026-09-27): Wayfarer's silver sword/axe/knife/mallet count as werewolf bane
// for Fangs & Claws (its tag already lists the Caverns & Chasms silver tools and its own silver sword).

ServerEvents.tags('item', event => {
  event.add('fangs_n_claws:werewolf_bane', ['wayfarer_core:silver_sword', 'wayfarer_core:silver_axe',
    'wayfarer_core:silver_knife', 'wayfarer_core:silver_mallet']);
});

ServerEvents.recipes(event => {
  const R = fn => { try { fn(); } catch (e) { console.warn('[silver] skipped: ' + e); } };

  // oowwo (Derek, 2026-09-27): C&C's silver sword/axe share Wayfarer's exact shapes and, with silver
  // unified, shadowed Wayfarer's recipes. Removed so Wayfarer's craft. C&C silver pickaxe/shovel/hoe stay.
  event.remove({ id: 'caverns_and_chasms:silver_sword' });
  event.remove({ id: 'caverns_and_chasms:silver_axe' });

  event.remove({ id: 'minecraft:brewing_stand' });
  R(() => event.shaped('minecraft:brewing_stand', [' B ', ' B ', 'SSS'], {
    B: 'minecraft:blaze_rod', S: '#c:ingots/silver'
  }).id('oowwo:brewing_stand'));

  event.remove({ id: 'supplementaries:goblet' });
  R(() => event.shaped('supplementaries:goblet', ['N N', ' N ', ' N '], {
    N: '#c:nuggets/silver'
  }).id('oowwo:goblet'));

  event.remove({ id: 'shieldexp:netherite_shield' });
  R(() => event.shaped('shieldexp:netherite_shield', ['SLS', 'LLL', 'SLS'], {
    S: '#c:ingots/silver', L: 'wayfarer_core:silver_briar'
  }).id('oowwo:netherite_shield'));
});
