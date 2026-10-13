// oowwo: the lead tier, ported from the Wayfarer modpack.
//
// SOURCE: Wayfarer kubejs/server_scripts/metallurgy_and_progression/lead.js (3255 bytes, dated 2026-08-29,
//         unchanged by Wayfarer's 2026-09-22 update).
//
// WHAT THIS DOES
//   - Lead takes over Create's logistics tier: hopper, basin, chute, item vault, item hatch, plus
//     C&C's packing container and Supplementaries' cannon + cannonball.
//   - The four CRAFTING/MIXING routes to create:andesite_alloy are removed. The ITEM IS NOT DELETED:
//     wayfarer_core ships data/wayfarer_core/recipe/alloying/leaden_alloy.json, a blast-furnace
//     alloying recipe: 125 mB molten iron + 125 mB molten lead -> 1 create:andesite_alloy
//     (so 1 iron ingot + 1 lead ingot -> 2 alloy). That is the "leaden alloy". Every Create / addon
//     recipe that consumes andesite alloy keeps working; the alloy just moves behind the blast furnace.
//     Consequence: shafts and everything else made from alloy are now post-blast-furnace.
//   - Lead ore (plain + deepslate) leaves minecraft:needs_iron_tool, so any pickaxe can mine it.
//     The DENSE lead ores stay iron-gated - Wayfarer removes only the two plain ores, and this keeps that.
//
// ALREADY DONE ELSEWHERE (not duplicated): wayfarer_port.js already has lead nugget, lead block,
// raw lead block <-> raw lead, wrench, sledgehammer, item gauge and item pipe.
//
// DELIBERATE DEVIATIONS from Wayfarer, each flagged inline:
//   1. Hopper, basin, chute, vault, hatch, cannonball and cannon are removed by OUTPUT, not recipe id
//      (same lesson as primitive_tools.js / oowwo_steel_tier.js). Measured leaks this closes in oowwo:
//      Quark's easy_hopper (iron + logs), Create SA's vault_component -> item_vault, and
//      Supplementaries' cannonball_2 (the lead-block variant, live whenever c:storage_blocks/lead is
//      non-empty - and wayfarer_core:lead_block is in that tag).
//   2. Andesite alloy is removed by ID ONLY. Removing it by output would also delete the leaden_alloy
//      blast-furnace recipe, which is the only route left.
//   3. The cannon is removed and REBUILT rather than replaceInput'd. Its recipe uses the TAG
//      c:ingots/iron, not the item minecraft:iron_ingot, so Wayfarer's replaceInput is not guaranteed
//      to match it here. Shape is copied from supplementaries:cannon in 3.8.10 (iron -> lead).
//
// NOT INCLUDED: technology/treated_wood_and_leaden_alloy.js (8 andesite casing from planks + wax, and
// cogwheels / large cogwheels / andesite door rebuilt from casing). It is Wayfarer's companion to this
// file, but nothing here depends on it now that the alloy survives. Port it as the next, separate step.
//
// To revert: delete this file. Nothing here touches world data.

const LEAD = 'wayfarer_core:lead_ingot';

ServerEvents.recipes(event => {
  const R = fn => { try { fn(); } catch (e) { console.warn('[lead_tier] skipped: ' + e); } };

  // ---------------------------------------------------------------------------
  // 1. Lead conversions missing from wayfarer_port.js (it has ingot->nugget and ingot->block,
  //    not the reverses - same gap the steel port found)
  // ---------------------------------------------------------------------------
  R(() => event.shapeless(LEAD, ['9x wayfarer_core:lead_nugget']).id('oowwo:lead_ingot_from_nuggets'));
  R(() => event.shapeless('9x ' + LEAD, ['wayfarer_core:lead_block']).id('oowwo:lead_ingots_from_block'));

  // ---------------------------------------------------------------------------
  // 2. Andesite alloy: crafting + mixing routes removed BY ID (see deviation 2)
  // ---------------------------------------------------------------------------
  [
    'create:crafting/materials/andesite_alloy',
    'create:crafting/materials/andesite_alloy_from_zinc',
    'create:mixing/andesite_alloy',
    'create:mixing/andesite_alloy_from_zinc'
  ].forEach(id => event.remove({ id: id }));

  // ---------------------------------------------------------------------------
  // 3. Logistics tier moves to lead (removed by OUTPUT - deviation 1)
  // ---------------------------------------------------------------------------
  event.remove({ output: 'minecraft:hopper' });
  R(() => event.shaped('minecraft:hopper', [
    'L L',
    ' L '
  ], { L: LEAD }).id('oowwo:lead_hopper'));

  event.remove({ output: 'create:basin' });
  R(() => event.shaped('create:basin', [
    'L L',
    'L L',
    'LLL'
  ], { L: LEAD }).id('oowwo:lead_basin'));

  event.remove({ output: 'create:chute' });
  R(() => event.shaped('2x create:chute', [
    'L L',
    'L L'
  ], { L: LEAD }).id('oowwo:lead_chute'));

  event.remove({ output: 'create:item_vault' });
  R(() => event.shaped('3x create:item_vault', [
    'LLL',
    'P P',
    'LLL'
  ], { L: LEAD, P: 'create:iron_sheet' }).id('oowwo:lead_item_vault'));

  event.remove({ output: 'create:item_hatch' });
  R(() => event.shaped('create:item_hatch', [
    'LTL'
  ], { L: LEAD, T: 'blocksabound:hatch' }).id('oowwo:lead_item_hatch'));

  event.remove({ output: 'caverns_and_chasms:packing_container' });
  R(() => event.shaped('caverns_and_chasms:packing_container', [
    'LSL',
    'LHL',
    'LLL'
  ], { L: LEAD, S: 'minecraft:string', H: 'minecraft:leather' }).id('oowwo:lead_packing_container'));

  // ---------------------------------------------------------------------------
  // 4. Supplementaries artillery
  // ---------------------------------------------------------------------------
  event.remove({ output: 'supplementaries:cannonball' });
  R(() => event.shaped('3x supplementaries:cannonball', [
    ' I ',
    'IGI',
    ' I '
  ], { I: LEAD, G: 'minecraft:gunpowder' }).id('oowwo:lead_cannonball'));

  // Wayfarer: remove cannon_2 (the slingshot variant), replaceInput iron -> lead on cannon.
  // Here: remove both, rebuild cannon's own shape with lead (deviation 3).
  event.remove({ output: 'supplementaries:cannon' });
  R(() => event.shaped('supplementaries:cannon', [
    'LLL',
    'LDL',
    'PPP'
  ], { L: LEAD, D: 'minecraft:dispenser', P: '#minecraft:planks' }).id('oowwo:lead_cannon'));
});

ServerEvents.tags('block', event => {
  // Lead reachable below iron tier. Dense lead ores deliberately left iron-gated (as Wayfarer does).
  event.remove('minecraft:needs_iron_tool', 'wayfarer_core:lead_ore');
  event.remove('minecraft:needs_iron_tool', 'wayfarer_core:deepslate_lead_ore');
});
