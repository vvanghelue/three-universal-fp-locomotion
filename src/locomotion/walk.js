import { inputSystem } from "../input/input-system"
import { collisionSystem } from "../collisions/collisions"
import * as THREE from "three"

const SPEED = 5
const INERTIA_FACTOR = 0.7

export function initWalkingSystem({ platform, camera, rig, rigVelocity }) {
  const desktopKeyboardState = {}
  const eulerAngle = new THREE.Euler(0, 0, 0, "YXZ")
  const minPolarAngle = 0
  const maxPolarAngle = Math.PI

  if (platform.type == "desktop" || platform.type == "mobile") {
    //camera.rotation.order = "YXZ"
  }

  function rotateCamera({ deltaX, deltaY }) {
    eulerAngle.setFromQuaternion(camera.quaternion)
    eulerAngle.y -= deltaX
    eulerAngle.x -= deltaY
    eulerAngle.x = Math.max(
      Math.PI / 2 - maxPolarAngle,
      Math.min(Math.PI / 2 - minPolarAngle, eulerAngle.x)
    )
    camera.quaternion.setFromEuler(eulerAngle)
  }

  if (platform.type == "desktop") {
    document.body.requestPointerLock()
    document.body.addEventListener(
      "mousemove",
      (event) => {
        if (document.pointerLockElement === document.body) {
          // camera.rotation.y -= event.movementX / 500
          // camera.rotation.x -= -event.movementY / 500
          rotateCamera({ deltaX: event.movementX * 0.002, deltaY: event.movementY * 0.002 })
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

  walkingSystem = {
    update(deltaTime) {
      if (platform.type == "mobile") {
        rotateCamera({
          deltaX: inputSystem.getMobileJoysticksValue().right.x / 30,
          deltaY: (-1 * inputSystem.getMobileJoysticksValue().right.y) / 50,
        })
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
    isWalking() {
      return (
        collisionSystem.isRigOnFloor() &&
        Math.abs(rigVelocity.x) + Math.abs(rigVelocity.y) + Math.abs(rigVelocity.z) > 0.05
      )
    },
  }
  window.walkingSystem = walkingSystem
}

export let walkingSystem
