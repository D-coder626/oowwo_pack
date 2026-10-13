// oowwo_whereami.js — /whereami lists every structure the player is standing in, plus position,
// dimension and biome, with clickable buttons for sharing/recording the location.
// Uses the game's own structure data (StructureManager), so it covers every mod.
// "inside" = within one of the structure's pieces; "grounds" = only within its overall bounding box.
// 2026-09-29: KubeJS exposes level.dimension as a property (its dimension id), so level.dimension()
// threw "not a function"; now reads the property.
// 2026-10-02: clickable output (KubeJS ComponentKJS clickCopy / clickSuggestCommand / hover):
//   [Copy]  copies one line: "x y z | dimension | biome | inside: ... | grounds: ..." to the clipboard
//   [Chat]  puts the same line in the chat box so you can send it to other players
//   [TP]    puts "/tp @s x y z" in the chat box (for getting back later)

const $Registries = Java.loadClass('net.minecraft.core.registries.Registries')

ServerEvents.commandRegistry(event => {
  const Commands = event.commands

  event.register(
    Commands.literal('whereami').executes(ctx => {
      var player = ctx.source.player
      if (!player) return 0

      var level = player.level
      var pos = player.blockPosition()
      var mgr = level.structureManager()
      var reg = level.registryAccess().registryOrThrow($Registries.STRUCTURE)

      var inside = []
      var grounds = []
      mgr.getAllStructuresAt(pos).keySet().forEach(structure => {
        var id = String(reg.getKey(structure))
        if (mgr.getStructureWithPieceAt(pos, structure).isValid()) {
          inside.push(id)
        } else if (mgr.getStructureAt(pos, structure).isValid()) {
          grounds.push(id)
        }
      })

      var dim = String(level.dimension)
      var biome = '?'
      try { biome = String(level.getBiome(pos).unwrapKey().get().location()) } catch (e) { }

      var xyz = pos.x + ' ' + pos.y + ' ' + pos.z
      var line = xyz + ' | ' + dim + ' | ' + biome
      if (inside.length) line += ' | inside: ' + inside.join(', ')
      if (grounds.length) line += ' | grounds: ' + grounds.join(', ')

      player.tell(Text.gray('Position ' + xyz + ' in ' + dim + ' (' + biome + ') ')
        .append(Text.gold('[Copy]').clickCopy(line).hover(Text.of('Copy this location to the clipboard')))
        .append(Text.of(' '))
        .append(Text.aqua('[Chat]').clickSuggestCommand(line).hover(Text.of('Put this location in the chat box')))
        .append(Text.of(' '))
        .append(Text.green('[TP]').clickSuggestCommand('/tp @s ' + xyz).hover(Text.of('Put a /tp command for this spot in the chat box'))))
      if (inside.length == 0 && grounds.length == 0) {
        player.tell(Text.yellow('Not inside any structure.'))
      }
      inside.forEach(id => player.tell(Text.green('Inside: ').append(Text.white(id))))
      grounds.forEach(id => player.tell(Text.aqua('On the grounds of: ').append(Text.white(id))))
      return 1
    })
  )
})
