import * as THREE from "three"
import { collisionSystem } from "../collisions/collisions"
import { initWalkingSystem, walkingSystem } from "./walk"
import { initSnapTurnVRSystem, snapTurnVRSystem } from "./snap-turn-vr"
import { initClimbingVRSystem, climbingVRSystem } from "./climb-vr"
import { initFlyingVRSystem, flyingVRSystem } from "./fly-vr"
// import { collisionSystem } from "../collisions/collisions"

// import initClimbingSystem from "./climb"
// import initFlyingSystem from "./fly"

const GRAVITY_FACTOR = 8

export let locomotionSystem

export function initLocomotion({ platform, overlay, camera, rig }) {
  window.collisionSystem = collisionSystem
  let rigVelocity = (window.rigVelocity = new THREE.Vector3(0, 0, 0))
  // console.log(platform)

  const systems = []
  if (platform.isEnabled("walk")) {
    initWalkingSystem({ platform, camera, rig, rigVelocity })
    systems.push(walkingSystem)
  }
  if (platform.isEnabled("snap-turn-vr")) {
    initSnapTurnVRSystem({ rig })
    systems.push(snapTurnVRSystem)
  }
  if (platform.isEnabled("climb-vr")) {
    initClimbingVRSystem({ rig })
    systems.push(climbingVRSystem)
  }
  if (platform.isEnabled("fly-vr")) {
    initFlyingVRSystem({ rig })
    systems.push(flyingVRSystem)
  }

  locomotionSystem = {
    getRigVelocity() {
      return rigVelocity
    },
    update(deltaTime) {
      for (const system of systems) {
        system.update(deltaTime)
      }

      // gravity
      if (!collisionSystem.isRigOnFloor()) {
        if (climbingVRSystem && climbingVRSystem.isClimbing() === true) {
          return
        }
        if (flyingVRSystem && flyingVRSystem.isFlying() === false) {
          rigVelocity.y -= GRAVITY_FACTOR * deltaTime

          const horizontalDamping = Math.exp(-0.5 * deltaTime)
          rigVelocity.x = rigVelocity.x * horizontalDamping
          rigVelocity.z = rigVelocity.z * horizontalDamping
        }
      }

      // update position from velocity vector
      const deltaPosition = rigVelocity.clone().multiplyScalar(deltaTime)
      rig.position.add(deltaPosition)
    },
  }
}
