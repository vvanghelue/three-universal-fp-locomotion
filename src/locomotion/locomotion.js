import * as THREE from "three"
import { collisionSystem } from "../collisions/collisions"

import { initClimbingVRSystem, climbingVRSystem } from "./systems/climb-vr/climb-vr"
import { initFlyingVRSystem, flyingVRSystem } from "./systems/fly-vr/fly-vr"

const GRAVITY_FACTOR = 9.81

export let locomotionSystem

export function initLocomotion({ platformType, features, overlay, camera, rig, scene }) {
  window.collisionSystem = collisionSystem
  let rigVelocity = (window.rigVelocity = new THREE.Vector3(0, 0, 0))

  const systems = []
  for (const feature of features) {
    const system = feature({ platformType, camera, rig, scene })
    if (system) {
      systems.push(system)
    }
  }

  locomotionSystem = {
    getCamera() {
      return camera
    },
    getRigVelocity() {
      return rigVelocity
    },
    update(deltaTime) {
      for (const system of systems) {
        system.update(deltaTime)
      }

      // gravity
      if (collisionSystem.isRigOnFloor()) {
        // continue
      } else if (climbingVRSystem && climbingVRSystem.isClimbing() === true) {
        return
      } else if (flyingVRSystem && flyingVRSystem.isFlying() === true) {
        // continue
      } else {
        rigVelocity.y -= GRAVITY_FACTOR * deltaTime
        const horizontalDamping = Math.exp(-0.5 * deltaTime)
        rigVelocity.x = rigVelocity.x * horizontalDamping
        rigVelocity.z = rigVelocity.z * horizontalDamping
      }

      // update position from velocity vector
      const deltaPosition = rigVelocity.clone().multiplyScalar(deltaTime)
      rig.position.add(deltaPosition)
    },
  }
}
