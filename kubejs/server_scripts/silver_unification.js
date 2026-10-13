// Both Caverns & Chasms and wayfarer_core register their own silver line. C&C already tags its
// silver into the shared c: tags (ingots/silver, nuggets/silver, raw_materials/silver,
// storage_blocks/silver, storage_blocks/raw_silver) - that's how Almost Unified finds
// duplicates automatically. wayfarer_core does NOT tag its silver into those shared tags at all
// (checked the jar directly - no data/c/tags/item/*/silver.json in it). Without this, AU has no
// way to know the two silvers are "the same material" and won't unify them.
//
// This just adds wayfarer_core's silver items to the same c: tags C&C's silver already uses.
// Once both sides share a tag, Almost Unified's normal automatic duplicate-resolution takes over
// the same way it already handles every other multi-mod metal in this pack - no need to touch
// config/almostunified/ directly. If AU's priority order doesn't already favor C&C (the
// incumbent, tuned into skill_locks/tiers already), that's a one-line change in
// config/almostunified/priorities.json, not something this script needs to do.

ServerEvents.tags('item', (event) => {
  event.add('c:ingots/silver', 'wayfarer_core:silver_ingot');
  event.add('c:nuggets/silver', 'wayfarer_core:silver_nugget');
  event.add('c:raw_materials/silver', 'wayfarer_core:raw_silver');
  event.add('c:storage_blocks/silver', 'wayfarer_core:silver_block');
  event.add('c:storage_blocks/raw_silver', 'wayfarer_core:raw_silver_block');
});
