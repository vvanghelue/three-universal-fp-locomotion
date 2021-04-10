import * as THREE from "three"
import { inputSystem } from "../input-system"
import waitUntil from "../../_helpers/wait-until"
import { Camera } from "three"

let originalCamera
let XRSession
let controllers = {}

export function getXRControllers() {
  return controllers
}

export function getXRSession() {
  return XRSession
}

export function getXRCamera() {
  return renderer.xr.getCamera(originalCamera)
}

async function buildController(data) {
  let geometry, material

  if (data.targetRayMode == "tracked-pointer") {
    geometry = new THREE.RingBufferGeometry(0.02, 0.04, 32) //.translate(0, 0, -1)
    material = new THREE.MeshBasicMaterial({
      opacity: 0.5,
      transparent: true,
      side: THREE.DoubleSide,
    })
    return new THREE.Mesh(geometry, material)
  }
}

export function getXRGamepads() {
  const pads = XRSession && XRSession.inputSources
  if (pads) {
    const list = [pads[0], pads[1]].filter((i) => i)
    const left = list.find((i) => i.handedness === "left")
    const right = list.find((i) => i.handedness === "right")
    if (!left || !right) {
      return false
    }
    return { left, right }
  }
  return null
}

export function getXRGamepadButtonValue(hand, index) {
  return getXRGamepads() && getXRGamepads()[hand].gamepad.buttons.map((i) => i.value)[index]
}

export async function initXRSession({ renderer, rig, camera }) {
  originalCamera = camera

  renderer.xr.enabled = true
  const sessionOptions = { optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking"] }
  XRSession = await navigator.xr.requestSession("immersive-vr", sessionOptions)
  if (!XRSession) {
    console.log("session not there")
    alert("XR Session not started")
    return
  }
  XRSession.addEventListener("end", function () {
    console.log("session end")
    //   GAME_STOPPED = true
    XRSession = null
  })
  renderer.xr.setSession(XRSession)

  // PLAYER HEIGHT
  // console.log(renderer.xr.getCamera(camera).position.y)

  for (const index of [0, 1]) {
    const controller = renderer.xr.getController(index)
    controller.addEventListener("connected", async function (event) {
      // console.log("connected", event)
      const mesh = await buildController(event.data)
      controllers[event.data.handedness] = {
        hand: event.data.handedness,
        mesh: mesh,
      }
      this.add(mesh)
    })
    controller.addEventListener("disconnected", function () {
      this.remove(this.children[0])
    })
    rig.add(controller)
  }

  return await waitUntil(
    function () {
      return controllers.left && controllers.right
    },
    5000,
    "Controllers not loaded (timeout)"
  )
}
