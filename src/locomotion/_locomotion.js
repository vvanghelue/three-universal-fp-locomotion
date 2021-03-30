import initWalkingSystem from "./walk"
// import initClimbingSystem from "./climb"
// import initFlyingSystem from "./fly"

export default function ({ platformType, options, overlay }) {
  const platform = options.platforms[platformType]

  let walkingSystem, climbingSystem, flyingSystem

  if (platform.features.walk.enabled) {
    walkingSystem = initWalkingSystem({ platformType })
  }

  return {
    update(dt) {
      if (platform.features.walk.enabled === true) {
        let walkVector
        if (platformType === "vr") {
        }
      }
      if (platform.features.teleport.enabled === true) {
        let walkVector
        if (platformType === "vr") {
        }
      }
    },
  }
}
