// oowwo: Saint's Dragons — make dragonheart reachable without netherite (2026-10-04, Derek approved).
//
// WHY: oowwo_steel_tier.js removes netherite (steel is the top tier). Saint's Dragons tags its End-only
// dragonheart ore/blocks as needs_netherite_tool, which NeoForge folds into incorrect_for_diamond_tool,
// so the steel-crafted diamond pickaxe could not harvest them -> no dragonheart chunks -> no Blood Tempest
// or Dragonlord gear. This moves them to needs_diamond_tool (steel/diamond pick tier).
//
// Revert: delete this file.
const OOWWO_SD_HEART_BLOCKS = [
  'saintsdragons:dragonheart_ore',
  'saintsdragons:dragonheart_block',
  'saintsdragons:dragonheart_alloy_block'
];

ServerEvents.tags('block', event => {
  ['c:needs_netherite_tool', 'neoforge:needs_netherite_tool', 'forge:needs_netherite_tool'].forEach(tag => {
    OOWWO_SD_HEART_BLOCKS.forEach(id => event.remove(tag, id));
  });
  event.add('minecraft:needs_diamond_tool', OOWWO_SD_HEART_BLOCKS);
});
