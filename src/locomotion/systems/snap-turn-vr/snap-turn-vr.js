import { inputSystem } from "../../../input/input-system"
import rotateAboutPoint from "../../../_helpers/rotate-about-point"

export function initSnapTurnVRSystem({ platformType, rig }) {
  if (platformType != "vr") {
    return
  }
  let lastXRSnapTurnTime = 0

  return (snapTurnVRSystem = {
    update(deltaTime) {
      if (new Date().getTime() - lastXRSnapTurnTime > 200) {
        const gamepads = inputSystem.getXRGamepads()

        if (Math.abs(gamepads.right.gamepad.axes[2]) > 0.3) {
          const way = gamepads.right.gamepad.axes[2] > 0 ? -1 : 1
          rotateAboutPoint(
            rig,
            inputSystem.getXRCamera().position,
            new THREE.Vector3(0, 1, 0),
            (way * Math.PI) / 8,
            false
          )
          lastXRSnapTurnTime = new Date().getTime()
        }
      }
    },
  })
}

export let snapTurnVRSystem
