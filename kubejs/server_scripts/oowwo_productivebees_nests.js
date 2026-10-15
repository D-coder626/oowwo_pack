// oowwo: Productive Bees nest recipes used minecraft:wooden_sword, which the pack removed.
// Swap it for the Osseous Sword (2 bone + string) in every Productive Bees recipe that asks for it.
// (iron/diamond sword nest recipes are left alone)
ServerEvents.recipes(event => {
  event.replaceInput(
    { mod: 'productivebees', input: 'minecraft:wooden_sword' },
    'minecraft:wooden_sword',
    'sons_of_sins:osseous_sword'
  )
  console.info('[oowwo_productivebees_nests] wooden_sword -> osseous_sword applied')
})
