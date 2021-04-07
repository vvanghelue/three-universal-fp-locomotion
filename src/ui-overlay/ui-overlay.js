export function initUiOverlay() {
  const overlay = document.createElement("div")
  overlay.classList.add("locomotion-html-overlay")
  overlay.style.position = "fixed"
  overlay.style.zIndex = "99"
  overlay.style.top = "0px"
  overlay.style.left = "0px"
  overlay.style.width = "100vw"
  overlay.style.height = "100vh"
  document.body.appendChild(overlay)

  // return {
  //   getOverlay() {
  //     return overlay
  //   },
  // }
}

export const uiOverlay = {
  showMobileTutorial() {},
  showDesktopTutorial() {},
  showVrTutorial() {},
}
