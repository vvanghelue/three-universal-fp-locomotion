import * as THREE from "three"
import { inputSystem } from "../input/input-system"
import { locomotionSystem } from "../locomotion/_locomotion"
import { collisionSystem } from "../collisions/collisions"

export let flyingVRSystem

export function initFlyingVRSystem({ rig }) {
  let canFly = false

  function getFlyingForwardVector() {
    const leftHandPosition = new THREE.Vector3()
    const rightHandPosition = new THREE.Vector3()

    const hands = inputSystem.getXRControllers()
    hands.left.mesh.parent.getWorldPosition(leftHandPosition)
    hands.right.mesh.parent.getWorldPosition(rightHandPosition)
    return leftHandPosition
      .clone()
      .sub(rightHandPosition)
      .normalize()
      .cross(new THREE.Vector3(0, 1, 0))
      .normalize()
  }

  function handsInFlyingPosition() {
    const hands = inputSystem.getXRControllers()
    const distanceOk =
      hands.left.mesh.parent.position.distanceTo(hands.right.mesh.parent.position) > 1.1

    const leftHandPosition = hands.left.mesh.parent.position
    const rightHandPosition = hands.right.mesh.parent.position

    // playerInput.getXRCamera().position.distanceTo()
    const angleOk = Math.abs(leftHandPosition.clone().sub(rightHandPosition).normalize().y) < 0.8

    return distanceOk && angleOk
  }

  flyingVRSystem = window.flyingVRSystem = {
    isFlying() {
      return canFly
    },
    update(deltaTime) {
      if (collisionSystem.isRigOnFloor() === true) {
        canFly = false
        return
      }
      const rigVelocity = locomotionSystem.getRigVelocity()
      canFly = handsInFlyingPosition()
      //playerInput.getKeyStates().ShiftLeft
      if (canFly) {
        //   console.log(getFlyingForwardVector())
        //   debugger
        rigVelocity.copy(getFlyingForwardVector().multiplyScalar(10))
        rigVelocity.y = -3
      }
      // FLYING DAMPING
      //   playerVelocity.y -= 65 * deltaTime
      //   const damping = Math.exp(-25 * deltaTime) - 1
      //   playerVelocity.addScaledVector(playerVelocity, damping)
    },
  }
}
