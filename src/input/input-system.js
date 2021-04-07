import { initXRSession, getXRSession, getXRControllers, getXRGamepads } from "./xr/xr-input"

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
  initXRSession,
  getXRControllers,
  getXRGamepads,
  getXRSession,
  getKeyboardState() {
    return keyboardState
  },
})
