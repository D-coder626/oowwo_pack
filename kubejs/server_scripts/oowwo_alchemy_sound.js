// oowwo: anvil "clang" when an alchemical ring is forged in a crafting table / workbench (2026-10-09, Derek).
// Rings come from OAL_RINGS in oowwo_alchemy.js; only stacks with custom_data oowwo_alchemical=1 trigger it,
// so crafting anything else (or a loot ring) stays silent.
var OAS_SoundEvents = Java.loadClass('net.minecraft.sounds.SoundEvents')
var OAS_SoundSource = Java.loadClass('net.minecraft.sounds.SoundSource')
var OAS_DataComponents = Java.loadClass('net.minecraft.core.component.DataComponents')

var OAS_RINGS = (typeof OAL_RINGS !== 'undefined') ? OAL_RINGS : [{ ring: 'wayfarer_core:sulfur_gemstone_ring' }]

OAS_RINGS.forEach(function (r) {
  ItemEvents.crafted(r.ring, function (event) {
    try {
      var cd = event.getItem().get(OAS_DataComponents.CUSTOM_DATA)
      if (cd == null || cd.copyTag().getInt('oowwo_alchemical') !== 1) return
      var p = event.getEntity()
      p.level.playSound(null, p.getX(), p.getY(), p.getZ(), OAS_SoundEvents.ANVIL_USE, OAS_SoundSource.PLAYERS, 0.8, 1.0)
    } catch (err) {
      console.error('[oowwo_alchemy_sound] ' + err)
    }
  })
})
