// oowwo — one-shot WEAPON CENSUS  (v3)
// Dumps every item carrying an attack-damage modifier, with tier where readable.
//
// USAGE:  /reload   then   /oowwo_dump_weapons
// OUTPUT: (a) kubejs/exported/oowwo_weapons.json   via KubeJS JsonIO
//         (b) ALWAYS: one line per weapon into logs/kubejs/server.log,
//             prefixed [oowwo-row] -- this is the guaranteed path.
//
// v1: JsonIO write.                     v2 broke it by switching to java.nio.
// v2: Rhino-safe vars (const-in-loop throws "redeclaration of var").
// v3: java.nio.file.Files is BLOCKED by KubeJS's class filter -> reverted to
//     JsonIO, and added an unconditional console dump so the data survives
//     even if every file API fails.
//
// Read-only: registers one command, writes at most one file.

ServerEvents.commandRegistry(function (event) {
  var Commands = event.commands

  event.register(
    Commands.literal('oowwo_dump_weapons').executes(function (ctx) {
      var src = ctx.source
      function say(m) {
        try { src.sendSystemMessage(Text.of(m)) } catch (e) { console.info(m) }
      }

      var BuiltInRegistries, DataComponents
      try {
        // net.minecraft.* is permitted by the class filter; java.* is not.
        BuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
        DataComponents    = Java.loadClass('net.minecraft.core.component.DataComponents')
      } catch (e) {
        say('§cclass load failed: ' + e)
        console.error('[oowwo] class load failed: ' + e)
        return 0
      }

      var rows = []
      var scanned = 0
      var errored = 0
      var itemReg = BuiltInRegistries.ITEM
      var it = itemReg.iterator()

      // hoisted — Rhino rejects const/let redeclaration inside a loop body
      var item, id, stack, mods, entries, i, e2, attrName, amount
      var dmg, speed, tier, incorrectTag, clazz, t

      while (it.hasNext()) {
        item = it.next()
        scanned++
        id = 'UNKNOWN'
        try {
          id = String(itemReg.getKey(item))
          stack = item.getDefaultInstance()
          mods = stack.get(DataComponents.ATTRIBUTE_MODIFIERS)
          if (mods == null) continue

          dmg = null
          speed = null
          entries = mods.modifiers()
          for (i = 0; i < entries.size(); i++) {
            e2 = entries.get(i)
            attrName = '?'
            try { attrName = String(e2.attribute().getRegisteredName()) }
            catch (x1) { try { attrName = String(e2.attribute()) } catch (x2) {} }
            amount = e2.modifier().amount()
            if (attrName.indexOf('attack_damage') >= 0) dmg = amount
            if (attrName.indexOf('attack_speed') >= 0) speed = amount
          }
          if (dmg == null) continue      // "has a damage value" filter

          tier = null
          incorrectTag = null
          try {
            if (item.getTier) {
              t = item.getTier()
              tier = String(t)
              try { incorrectTag = String(t.getIncorrectBlocksForDrops().location()) } catch (x3) {}
            }
          } catch (x4) {}

          clazz = ''
          try { clazz = String(item.getClass().getSimpleName()) } catch (x5) {}

          rows.push({
            id: id, namespace: id.split(':')[0],
            attack_damage: dmg, attack_speed: speed,
            tier: tier, incorrect_for: incorrectTag, item_class: clazz
          })
        } catch (err) {
          errored++
          if (errored < 25) console.warn('[oowwo] skipped ' + id + ': ' + err)
        }
      }

      rows.sort(function (a, b) {
        if (a.namespace !== b.namespace) return a.namespace < b.namespace ? -1 : 1
        return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0)
      })

      var byNs = {}
      var r, n
      for (n = 0; n < rows.length; n++) {
        r = rows[n]
        byNs[r.namespace] = (byNs[r.namespace] || 0) + 1
      }

      // ---- GUARANTEED PATH: straight into logs/kubejs/server.log ----
      console.info('[oowwo-begin] scanned=' + scanned + ' weapons=' + rows.length +
                   ' errors=' + errored)
      for (n = 0; n < rows.length; n++) {
        r = rows[n]
        console.info('[oowwo-row]\t' + r.id + '\t' + r.attack_damage + '\t' +
                     r.attack_speed + '\t' + r.tier + '\t' + r.incorrect_for +
                     '\t' + r.item_class)
      }
      console.info('[oowwo-end] total=' + rows.length)

      // ---- BEST-EFFORT: KubeJS's own file API (java.nio is class-filtered) ----
      var wrote = 0
      try {
        JsonIO.write('kubejs/exported/oowwo_weapons.json', {
          scanned_items: scanned, weapons_found: rows.length,
          errors: errored, by_namespace: byNs, weapons: rows
        })
        wrote = 1
      } catch (e3) {
        console.warn('[oowwo] JsonIO.write failed (log dump still has everything): ' + e3)
      }

      say('§a[oowwo] scanned ' + scanned + ' -> ' + rows.length +
          ' weapons (' + errored + ' errors, json=' + wrote + ')')
      say('§7full list is in logs/kubejs/server.log either way')
      return 1
    })
  )
})
