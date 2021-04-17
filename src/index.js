import * as THREE from "three"
import { initCollisions, collisionSystem } from "./collisions/collisions"
import { initLocomotion, locomotionSystem } from "./locomotion/_locomotion"
import deepMerge from "deepmerge"
import { initUiOverlay, uiOverlay } from "./ui-overlay/ui-overlay"
import { initInputSystem, inputSystem } from "./input/input-system"

import { initWalkingSystem, walkingSystem } from "./locomotion/walk"
import { initSnapTurnVRSystem, snapTurnVRSystem } from "./locomotion/snap-turn-vr"
import { initClimbingVRSystem, climbingVRSystem } from "./locomotion/climb-vr"
import { initFlyingVRSystem, flyingVRSystem } from "./locomotion/fly-vr"

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

export default async function ({ collisionObjects, rig, camera, renderer, features }) {
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
  initLocomotion({ platformType, features, overlay, camera, rig })

  // await new Promise(r => setTimeout(r, 4000))
  return {
    update(deltaTime) {
      // console.log(inputSystem.getKeyboardState())
      locomotionSystem.update(deltaTime)
      collisionSystem.update(deltaTime)
    },
    on() {},
    getPlatformType: () => platformType,
  }
}

export function walk(options) {
  return function ({ rig, camera, platformType }) {
    return initWalkingSystem({ ...options, rig, camera, platformType })
  }
}
export function snapTurnVR(options) {
  return function ({ rig, camera, platformType }) {
    return initSnapTurnVRSystem({ ...options, rig, camera, platformType })
  }
}
export function climbVR(options) {
  return function ({ rig, camera, platformType }) {
    return initClimbingVRSystem({ ...options, rig, camera, platformType })
  }
}
export function flyVR(options) {
  return function ({ rig, camera, platformType }) {
    return initFlyingVRSystem({ ...options, rig, camera, platformType })
  }
}
