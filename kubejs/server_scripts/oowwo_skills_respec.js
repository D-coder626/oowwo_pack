// Draught of Unlearning recipes (items registered in startup_scripts/oowwo_items.js)
// Sulfur = Wayfarer's sulfur (No Man's Land's nomansland:sulfur; wayfarer_core has no sulfur item of its own)
ServerEvents.recipes(function (event) {
  // 2 sulfur + 1 mercury -> Mercurial Salt, ground in the pack's general mortar (Toxony's mortar & pestle;
  // same recipe format as oowwo_mortars.js)
  event.custom({
    type: 'toxony:mortar_pestle',
    ingredients: [{ item: 'nomansland:sulfur' }, { item: 'nomansland:sulfur' }, { item: 'wayfarer_core:mercury_ingot' }],
    result: { id: 'oowwo:mercurial_salt', count: 1 }
  }).id('oowwo:mortars/mercurial_salt')

  // Alchemist Cauldron: 250 mB water + Mercurial Salt -> Draught of Unlearning
  // (format copied from Iron's own soak_bloody_vellum: brew with an item byproduct and no fluid result)
  event.custom({
    type: 'irons_spellbooks:alchemist_cauldron_brew',
    base_fluid: { id: 'minecraft:water', amount: 250 },
    input: { item: 'oowwo:mercurial_salt' },
    results: [],
    byproduct: { id: 'oowwo:draught_of_unlearning' }
  }).id('oowwo:alchemist_cauldron/draught_of_unlearning')
})
