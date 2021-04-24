import * as THREE from "three"
import { initCollisions, collisionSystem } from "./collisions/collisions"
import { initLocomotion, locomotionSystem } from "./locomotion/locomotion"
import deepMerge from "deepmerge"
import { initUiOverlay, uiOverlay } from "./ui-overlay/ui-overlay"
import { initInputSystem, inputSystem } from "./input/input-system"

import { initWalkingSystem, walkingSystem } from "./locomotion/systems/walk/walk"
import { initSnapTurnVRSystem, snapTurnVRSystem } from "./locomotion/systems/snap-turn-vr/snap-turn-vr"
import { initClimbingVRSystem, climbingVRSystem } from "./locomotion/systems/climb-vr/climb-vr"
import { initFlyingVRSystem, flyingVRSystem } from "./locomotion/systems/fly-vr/fly-vr"
import { initTeleportVRSystem, teleportVRSystem } from "./locomotion/systems/teleport-vr/teleport-vr"

// detect context before loading
let platformType // 'vr', 'desktop', 'mobile'

if (window) {
  ;(async () => {
    platformType = "desktop"
    const agent = window.navigator.userAgent
    if (agent.includes("Quest")) {
      // if (await navigator.xr.isSessionSupported("immersive-vr")) {
      platformType = "vr"
    } else {
      if (window.document) {
        function detectMobile() {
          platformType = "mobile"
          window.document.removeEventListener("touchstart", detectMobile)
        }
        window.document.addEventListener("touchstart", detectMobile)
      }
    }
    //alert(platformType)
  })()
}

export default async function ({ collisionObjects, scene, rig, camera, renderer, features }) {
  let overlay

  if (!platformType) {
    throw new Error(
      "Cannot detect platformType, you must handle at least an user-based click before starting locomotion system"
    )
  }

  //   console.log(deepMerge({foo: 'bar', mdr: 'dssq'}, { mdr: 'iiiii' }))

  initInputSystem({ renderer })

  if (platformType === "vr") {
    console.log("init vr session")
    await inputSystem.initXRSession({ renderer, rig, camera })
    console.log("VR session started")
  }

  if (platformType === "mobile") {
    // alert()
    await inputSystem.initMobileInput()
    //inputSystem.getMobileJoysticksValue()
  }

  initCollisions({ platformType, collisionObjects, rig })
  initLocomotion({ platformType, features, overlay, camera, rig, scene })

  // await new Promise(r => setTimeout(r, 4000))
  return {
    update(deltaTime) {
      if (deltaTime > 1) {
        deltaTime = 1
      }
      // console.log(inputSystem.getKeyboardState())
      locomotionSystem.update(deltaTime)
      collisionSystem.update(deltaTime)
    },
    on() {},
    getPlatformType: () => platformType,
  }
}

export function walk(options) {
  return function ({ rig, camera, platformType, scene }) {
    return initWalkingSystem({ ...options, rig, camera, platformType, scene })
  }
}
export function snapTurnVR(options) {
  return function ({ rig, camera, platformType, scene }) {
    return initSnapTurnVRSystem({ ...options, rig, camera, platformType, scene })
  }
}
export function climbVR(options) {
  return function ({ rig, camera, platformType, scene }) {
    return initClimbingVRSystem({ ...options, rig, camera, platformType, scene })
  }
}
export function flyVR(options) {
  return function ({ rig, camera, platformType, scene }) {
    return initFlyingVRSystem({ ...options, rig, camera, platformType, scene })
  }
}
export function teleportVR(options) {
  return function ({ rig, camera, platformType, scene }) {
    return initTeleportVRSystem({ ...options, rig, camera, platformType, scene })
  }
}
