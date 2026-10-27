// oowwo_ragdoll_no_mobs.js — 2026-10-27
// Keeps every mob out of Ragdoll so mobs can no longer freeze mid-air.
//
// Why: Ragdoll ragdolls ANY living entity after a 40-block fall or a hard fling, switches its AI off,
// and waits for the client to send the mob's model shape. When that never arrives the mob hangs in the
// air with no AI indefinitely (see claude/oowwo-frozen-mobs-diagnosis-2026-10-27.md).
//
// How: adds every registered entity type to `ragdoll:does_not_ragdoll`, EXCEPT the player and Ragdoll's
// own corpse entity. Ragdoll checks this tag in ragdollEntity (server) and, with our patched
// RagdollManager, in applyRagdoll (client render path). Player ragdolls, fall ragdolls for players,
// player corpses and Lost Hearts are untouched. Reads the live registry, so mods added later
// (e.g. Book of Dragons) are covered automatically. Non-living types in the tag are harmless.
//
// Does NOT free mobs that are already stuck (they keep a saved ragdoll reason) — separate cleanup step.

ServerEvents.tags('entity_type', event => {
  event.add('ragdoll:does_not_ragdoll', /^(?!minecraft:player$|ragdoll:corpse$).+$/)
})
