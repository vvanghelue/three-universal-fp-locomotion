import initWalkingSystem from "./walk"
import initSnapTurnSystem from "./snap-turn"

// import initClimbingSystem from "./climb"
// import initFlyingSystem from "./fly"

export default function ({ platform, overlay, camera, rig }) {
  // console.log(platform)

  let walkingSystem, snapTurnSystem

  if (platform.isEnabled("walk")) {
    walkingSystem = initWalkingSystem({ platform, camera, rig })
  }
  if (platform.isEnabled("snap-turn")) {
    snapTurnSystem = initSnapTurnSystem({ rig })
  }

  return {
    update(deltaTime) {
      if (platform.isEnabled("walk")) {
        walkingSystem.update(deltaTime)
      }
      if (platform.isEnabled("snap-turn")) {
        snapTurnSystem.update(deltaTime)
      }
      // if (platform.features.climb.enabled === true) {
      //   let walkVector
      //   if (platformType === "vr") {
      //   }
      // }
    },
  }
}
