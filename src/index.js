import * as THREE from "three"
import initCollisions from "./collisions/collisions"
import initLocomotion from "./locomotion/_locomotion"
import deepMerge from "deepmerge"
import { initUiOverlay, uiOverlay } from "./ui-overlay/ui-overlay"
import { initInputSystem, inputSystem } from "./input/input-system"

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

const defaultOptions = {
  platforms: {
    desktop: {
      enabled: true,
      features: {
        walk: {
          enabled: true,
          bind: ["arrows", "wasd"],
          speedFactor: 1,
        },
        jump: {
          enabled: true,
          bind: "space",
        },
      },
    },
    vr: {
      enabled: true,
      devices: ["oculus-quest", "valve-index"],
      features: {
        walk: {
          enabled: true,
          follow: "controller-orientation", // headset-orientation,
          speedFactor: 1,
        },
        run: {
          enabled: true,
        },
        "snap-turn": {
          enabled: true,
          step: Math.PI / 8,
        },
        jump: {
          enabled: true,
          bind: ["oculus-quest-button-A", "valve-index-A-button"], // (device) => device === "oculus-quest" ? "A" : null
        },
        climb: {
          enabled: true,
        },
        fly: {
          enabled: true,
        },
      },
    },
    mobile: {
      enabled: true,
      forceOrientation: "landscape", // portrait
      features: {
        walk: {
          enabled: true,
          speedFactor: 1,
        },
        jump: {
          enabled: true,
        },
      },
    },
  },
  world: {
    gravity: 9.81,
  },
}

export default async function (options) {
  let collisionSystem, locomotionSystem, overlay

  if (!platformType) {
    throw new Error(
      "Cannot detect platformType, you must handle at least an user-based click before starting locomotion system"
    )
  }

  // initUiOverlay()
  // console.log("uiOverlay", uiOverlay)
  // uiOverlay.innerHTML = "<button>dsqdsq</button>"

  // prevent object traverse in deep merge
  const collisionObject = options.collisionObject
  options.collisionObject = undefined
  // prevent object traverse in deep merge
  const rig = options.rig
  options.rig = undefined
  // prevent object traverse in deep merge
  const camera = options.camera
  options.camera = undefined
  // prevent object traverse in deep merge
  const renderer = options.renderer
  options.renderer = undefined

  options = deepMerge(defaultOptions, options)

  //   console.log(deepMerge({foo: 'bar', mdr: 'dssq'}, { mdr: 'iiiii' }))

  const platform = options.platforms[platformType]
  platform.type = platformType
  platform.isEnabled = function (featureName) {
    return platform.features[featureName] && platform.features[featureName].enabled
  }

  initInputSystem({ renderer })

  if (platform.type === "vr") {
    console.log("init vr session")
    await inputSystem.initXRSession({ renderer, rig, camera })
    console.log("VR session started")
  }

  if (platform.type === "mobile") {
    // alert()
    await inputSystem.initMobileInput()
    //inputSystem.getMobileJoysticksValue()
  }

  collisionSystem = initCollisions({ platform, collisionObject, rig })
  locomotionSystem = initLocomotion({ platform, overlay, camera, rig, collisionSystem })

  // await new Promise(r => setTimeout(r, 4000))
  return {
    update(deltaTime) {
      // console.log(inputSystem.getKeyboardState())
      locomotionSystem.update(deltaTime)
      collisionSystem.update(deltaTime)
    },
    on() {},
    getPlatform: () => platform,
  }
}
