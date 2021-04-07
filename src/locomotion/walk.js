import { inputSystem } from "../input/input-system"
import * as THREE from "three"

const SPEED = 4

export default function ({ platform, camera, rig }) {
  let playerVelocity = new THREE.Vector3(0, 0, 0)

  const desktopKeyboardState = {}
  if (platform.type == "desktop") {
    document.body.requestPointerLock()
    camera.rotation.order = "YXZ"

    document.body.addEventListener(
      "mousemove",
      (event) => {
        if (document.pointerLockElement === document.body) {
          camera.rotation.y -= event.movementX / 500
          camera.rotation.x -= -event.movementY / 500
        }
      },
      false
    )
  }

  function getSideVector() {
    const direction = getForwardVector(camera)
    direction.cross(camera.up)
    return direction
  }

  function getForwardVector() {
    const direction = new THREE.Vector3()
    if (platform.type == "desktop") {
      camera.getWorldDirection(direction)
      direction.y = 0
    }
    if (platform.type == "vr") {
      inputSystem.getXRControllers().left.mesh.parent.getWorldDirection(direction)
      direction.multiplyScalar(-1)
    }
    return direction
  }

  return {
    update(deltaTime) {
      let forwardValue = 0
      let sideValue = 0

      if (platform.type == "desktop") {
        const keys = inputSystem.getKeyboardState()
        const forward = keys["KeyW"] ? 1 : 0
        const backward = keys["KeyS"] ? -1 : 0
        const right = keys["KeyD"] ? 1 : 0
        const left = keys["KeyA"] ? -1 : 0
        forwardValue = forward + backward
        sideValue = left + right
      }

      if (platform.type == "mobile") {
      }

      if (platform.type == "vr") {
        forwardValue = inputSystem.getXRGamepads().left.gamepad.axes[3] * -1
        sideValue = inputSystem.getXRGamepads().left.gamepad.axes[2]
      }

      const deltaPosition = new THREE.Vector3(0, 0, 0)
      deltaPosition
        .add(getForwardVector(camera).multiplyScalar(forwardValue))
        .add(getSideVector(camera).multiplyScalar(sideValue))
        .normalize()
        .multiplyScalar(SPEED * deltaTime)
      playerVelocity.add(deltaPosition)
      const damping = Math.exp(-30 * deltaTime) - 1
      playerVelocity.addScaledVector(playerVelocity, damping)
      rig.position.add(playerVelocity)
    },
  }
}
