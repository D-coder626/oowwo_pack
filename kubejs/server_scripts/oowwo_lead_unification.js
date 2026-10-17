// oowwo: put wayfarer_core's lead into the shared c: lead tags (Derek 2026-10-17, for Eidolon: Repraised).
//
// WHY: Eidolon ships its own silver + lead (ingot, nugget, raw, blocks) and tags them into c:ingots/lead etc.
// wayfarer_core tags none of its lead, so c:ingots/lead had only Eidolon's lead - Almost Unified could not tell the
// two leads were the same metal. This is the same fix silver_unification.js applies to silver.
// With both leads in the tag, config/almostunified/unification/materials.json pins every c:*lead* tag to
// wayfarer_core, so Eidolon recipes and Almost Unified hide/replace Eidolon's lead with wayfarer_core:lead_*.
// Silver is already handled by silver_unification.js + the existing silver pins.
// Ores are deliberately NOT tagged/pinned: Eidolon's silver + lead ore worldgen is switched off instead
// (kubejs/data/eidolon_repraised/neoforge/biome_modifier/{silver_ore,lead_ore}.json = neoforge:none).
ServerEvents.tags('item', (event) => {
  event.add('c:ingots/lead', 'wayfarer_core:lead_ingot');
  event.add('c:nuggets/lead', 'wayfarer_core:lead_nugget');
  event.add('c:raw_materials/lead', 'wayfarer_core:raw_lead');
  event.add('c:storage_blocks/lead', 'wayfarer_core:lead_block');
  event.add('c:storage_blocks/raw_lead', 'wayfarer_core:raw_lead_block');
});
