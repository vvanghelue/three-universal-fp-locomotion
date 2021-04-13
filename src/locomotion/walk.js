import { inputSystem } from "../input/input-system"
import * as THREE from "three"

const SPEED = 5
const INERTIA_FACTOR = 0.7

export default function ({ platform, camera, rig, rigVelocity, collisionSystem }) {
  const desktopKeyboardState = {}

  if (platform.type == "desktop" || platform.type == "mobile") {
    camera.rotation.order = "YXZ"
  }

  if (platform.type == "desktop") {
    document.body.requestPointerLock()
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
    if (platform.type == "desktop" || platform.type == "mobile") {
      camera.getWorldDirection(direction)
      direction.y = 0
    }
    if (platform.type == "vr") {
      inputSystem.getXRControllers().left.mesh.parent.getWorldDirection(direction)
      direction.multiplyScalar(-1)
      direction.y = 0
    }
    direction.normalize()
    return direction
  }

  return {
    update(deltaTime) {
      if (platform.type == "mobile") {
        camera.rotation.y -= inputSystem.getMobileJoysticksValue().right.x / 30
        camera.rotation.x -= inputSystem.getMobileJoysticksValue().right.y / 50
      }

      if (!collisionSystem.isRigOnFloor()) {
        return
      }

      let forwardValue = 0
      let sideValue = 0

      if (platform.type == "desktop") {
        const keys = inputSystem.getKeyboardState()
        const forward = keys["KeyW"] || keys["ArrowUp"] ? 1 : 0
        const backward = keys["KeyS"] || keys["ArrowDown"] ? -1 : 0
        const right = keys["KeyD"] || keys["ArrowRight"] ? 1 : 0
        const left = keys["KeyA"] || keys["ArrowLeft"] ? -1 : 0
        forwardValue = forward + backward
        sideValue = left + right
        sideValue = sideValue / 1.5
      }

      if (platform.type == "mobile") {
        forwardValue = inputSystem.getMobileJoysticksValue().left.y
        sideValue = inputSystem.getMobileJoysticksValue().left.x

        // camera.rotation.y -= inputSystem.getMobileJoysticksValue().right.x / 30
        // camera.rotation.x -= inputSystem.getMobileJoysticksValue().right.y / 30
      }

      if (platform.type == "vr") {
        forwardValue = inputSystem.getXRGamepads().left.gamepad.axes[3] * -1
        sideValue = inputSystem.getXRGamepads().left.gamepad.axes[2]
      }

      const deltaPosition = new THREE.Vector3(0, 0, 0)
      deltaPosition
        .add(getForwardVector(camera).multiplyScalar(forwardValue))
        .add(getSideVector(camera).multiplyScalar(sideValue))
        // .normalize()
        .multiplyScalar(SPEED * platform.features.walk.speedFactor)
      rigVelocity.add(deltaPosition)

      // rigVelocity.copy(deltaPosition)

      // const damping = Math.exp(-1.0001) - 1
      // rigVelocity.addScaledVector(rigVelocity, damping)
      rigVelocity.multiplyScalar(INERTIA_FACTOR)
    },
  }
}
