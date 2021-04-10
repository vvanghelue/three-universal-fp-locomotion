import * as THREE from "three"
import initWalkingSystem from "./walk"
import initSnapTurnSystem from "./snap-turn"
// import { collisionSystem } from "../collisions/collisions"

// import initClimbingSystem from "./climb"
// import initFlyingSystem from "./fly"

const GRAVITY_FACTOR = 8

export default function initLocomotion({ platform, overlay, camera, rig, collisionSystem }) {
  window.collisionSystem = collisionSystem
  let rigVelocity = (window.rigVelocity = new THREE.Vector3(0, 0, 0))
  // console.log(platform)

  let walkingSystem, snapTurnSystem

  if (platform.isEnabled("walk")) {
    walkingSystem = initWalkingSystem({ platform, camera, rig, rigVelocity, collisionSystem })
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

      // console.log(collisionSystem.isRigOnFloor())
      // GRAVITY
      if (!collisionSystem.isRigOnFloor()) {
        rigVelocity.y -= GRAVITY_FACTOR * deltaTime

        const horizontalDamping = Math.exp(-0.5 * deltaTime)
        rigVelocity.x = rigVelocity.x * horizontalDamping
        rigVelocity.z = rigVelocity.z * horizontalDamping
      }

      const deltaPosition = rigVelocity.clone().multiplyScalar(deltaTime)
      rig.position.add(deltaPosition)

      // if (platform.features.climb.enabled === true) {
      //   let walkVector
      //   if (platformType === "vr") {
      //   }
      // }
    },
  }
}
