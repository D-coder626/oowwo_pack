// oowwo (2026-11-03): Playable Dragons is installed ONLY as the engine for oowwo_wildshape's Terrible Terror Form spell.
// Its own progression (phylacteries, orbs, scales, charged amethyst, imbued diamonds) is not part of the pack:
// remove every recipe it adds. Config side: config/playabledragons-common.toml (Terror only, lives off, digging off,
// commands OP-only).
ServerEvents.recipes(event => {
  event.remove({ mod: 'playabledragons' })
  console.info('[oowwo] playabledragons recipes removed (spell-only mode)')
})
