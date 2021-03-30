import * as THREE from "three"
import initCollisions from "./collisions/collisions"
import initMovements from "./locomotion/_locomotion"
import deepMerge from "deepmerge"
import initHtmlOverlay from "./overlay/html-overlay"

// detect context before loading
let platformType // 'vr', 'desktop', 'mobile'

if (window) {
  platformType = "desktop"
  if (window.document) {
    function detectMobile() {
      platformType = "mobile"
      window.document.removeEventListener("touchstart", detectMobile)
    }
    window.document.addEventListener("touchstart", detectMobile)
  }
  const agent = window.navigator.userAgent
  if (agent.includes("Quest")) {
    platformType = "vr"
  }
}

function initVRSession() {}

const defaultOptions = {
  platforms: {
    desktop: {
      enabled: true,
      features: {
        walk: {
          enabled: true,
          bind: ["arrows", "wasd"],
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
          follow: "controller-orientation", // headset-orientation
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

export default function (options) {
  let collisionSystem, locomotionSystem, overlay

  if (!platformType) {
    throw new Error(
      "Cannot detect platformType, you must handle at least an user-based click before starting locomotion system"
    )
  }

  overlay = initHtmlOverlay()
  overlay.getOverlay().innerHTML = "<button>dsqdsq</button>"

  const collisionObject = options.collisionObject
  options.collisionObject = undefined

  options = deepMerge(defaultOptions, options)

  //   console.log(deepMerge({foo: 'bar', mdr: 'dssq'}, { mdr: 'iiiii' }))

  collisionSystem = initCollisions({ collisionObject })
  locomotionSystem = initMovements({ platformType, options, overlay })

  return {
    update(dt) {
      locomotionSystem.update(dt)
      collisionSystem.update(dt)
    },
    on() {},
    getPlatformType: () => platformType,
  }
}
