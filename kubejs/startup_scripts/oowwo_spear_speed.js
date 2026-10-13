// oowwo: MineColonies spear attack speed (2026-10-12).
//
// minecolonies:spear is built with no attribute modifiers, so in melee it has the bare player attack
// speed (4.0 = no cooldown) and Better Combat lets it stab as fast as the mouse can click.
// Give it trident-like pacing: tooltip 1.1 attack speed.
//
// KubeJS setAttackSpeed() takes the MODIFIER, which is added to the player's base 4.0 (the first try
// passed 1.1 and the tooltip showed 5.1). So the value is tooltip speed minus 4: -2.9 = 1.1.
//
// Startup script: needs a full game restart, not /reload.
// To tune: change SPEAR_MODIFIER (more negative = slower; iron sword is -2.4, trident -2.9).
// To revert: delete this file.

ItemEvents.modification(event => {
  const SPEAR_MODIFIER = -2.9;
  try {
    event.modify('minecolonies:spear', item => {
      item.setAttackSpeed(SPEAR_MODIFIER);
    });
    console.info('[oowwo_spear_speed] set minecolonies:spear attack speed modifier to ' + SPEAR_MODIFIER);
  } catch (e) {
    console.warn('[oowwo_spear_speed] skipped: ' + e);
  }
});
