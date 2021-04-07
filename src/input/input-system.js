import {
  initXRSession,
  getXRSession,
  getXRControllers,
  getXRGamepads,
  getXRCamera,
} from "./xr/xr-input"

import { initMobileInput, getMobileJoysticksValue } from "./mobile/mobile-input"

let keyboardState = {}

export function initInputSystem({ renderer }) {
  document.addEventListener(
    "keydown",
    (event) => {
      keyboardState[event.code] = true
    },
    false
  )
  document.addEventListener(
    "keyup",
    (event) => {
      keyboardState[event.code] = false
    },
    false
  )
}

export const inputSystem = (window.inputSystem = {
  // vr
  initXRSession,
  getXRControllers,
  getXRGamepads,
  getXRSession,
  getXRCamera,
  // mobile
  initMobileInput,
  getMobileJoysticksValue,
  // desktop
  getKeyboardState() {
    return keyboardState
  },
})
