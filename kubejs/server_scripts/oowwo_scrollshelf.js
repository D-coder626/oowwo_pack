// oowwo_scrollshelf.js — Scroll Shelf (scrollshelf 1.0.5) only accepted the vanilla OAK bookshelf.
// Its recipe hardcodes {"item":"minecraft:bookshelf"} in the two D slots.
// Fix: every wooden bookshelf item in the registry joins the tag oowwo:scroll_shelf_bookshelves,
// and the recipe's bookshelf slots take that tag. Chiseled bookshelves are left out on purpose.
// Result is logged in logs/kubejs/server.log as "[oowwo_scrollshelf]". To revert: delete this file.
// var, not const/let, inside callbacks (Rhino redeclaration error seen before).

var OSS_Registries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')

var OSS_isBookshelf = function (id) {
  var p = id.split(':')[1] || ''
  p = p.substring(p.lastIndexOf('/') + 1)
  return /(bookshelf|bookcase)$/.test(p) && p.indexOf('chiseled') === -1
}

ServerEvents.tags('item', function (event) {
  var found = []
  OSS_Registries.ITEM.keySet().forEach(function (rl) {
    var id = String(rl)
    if (OSS_isBookshelf(id)) found.push(id)
  })
  if (found.indexOf('minecraft:bookshelf') === -1) found.push('minecraft:bookshelf')
  event.add('oowwo:scroll_shelf_bookshelves', found)
  console.info('[oowwo_scrollshelf] tag oowwo:scroll_shelf_bookshelves = ' + found.length + ' items: ' + found.join(', '))
})

ServerEvents.recipes(function (event) {
  event.replaceInput({ id: 'scrollshelf:scroll_shelf' }, 'minecraft:bookshelf', '#oowwo:scroll_shelf_bookshelves')
  console.info('[oowwo_scrollshelf] scrollshelf:scroll_shelf now takes #oowwo:scroll_shelf_bookshelves')
})
