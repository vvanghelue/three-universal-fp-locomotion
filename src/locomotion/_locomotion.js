import initWalkingSystem from "./walk"
// import initClimbingSystem from "./climb"
// import initFlyingSystem from "./fly"

export default function ({ platform, overlay, camera, rig }) {
  console.log(platform)

  let walkingSystem, climbingSystem, flyingSystem

  if (platform.features.walk.enabled) {
    walkingSystem = initWalkingSystem({ platform, camera, rig })
  }

  return {
    update(deltaTime) {
      if (platform.features.walk.enabled === true) {
        let walkVector
        walkingSystem.update(deltaTime)
      }
      // if (platform.features.climb.enabled === true) {
      //   let walkVector
      //   if (platformType === "vr") {
      //   }
      // }
    },
  }
}
