import hasParent from "../../_helpers/dom-element-has-parent"
import delay from "delay"
import deepmerge from "deepmerge"
import { MaxEquation } from "three"

const BACK_TO_POSITION_ANIMATION_DURATION = 200
const JOYSTICK_RADIUS = 80

let htmlContainer
const virtualJoysticks = {
  left: null,
  right: null,
}

const screenSize = {
  x: 0,
  y: 0,
}

function createJoystick(side) {
  const defaultState = {
    active: false,
    touchIdentifier: null,
    touchStartPosition: {
      x: 0,
      y: 0,
    },
    innerCirclePosition: {
      x: 0,
      y: 0,
    },
    vector: {
      x: 0,
      y: 0,
    },
  }
  let self = deepmerge({}, defaultState)

  const zone = document.createElement("div")
  zone.classList.add("joystick-zone")
  zone.innerHTML = `
        <div class="joystick">
        </div>
        <div class="inner-circle"></div>
    `
  const joystickElement = zone.querySelector(".joystick")
  const innerCircleElement = zone.querySelector(".inner-circle")

  async function resetZonePosition() {
    zone.classList.add("animate-joystick-start-position")
    if (side === "left") {
      zone.style.left = "15px"
      joystickElement.style.top = "70vh"
      joystickElement.style.left = "20vw"
      innerCircleElement.style.top = "70vh"
      innerCircleElement.style.left = "20vw"
    }
    if (side === "right") {
      zone.style.right = "15px"
      joystickElement.style.top = "70vh"
      joystickElement.style.left = "80vw"
      innerCircleElement.style.top = "70vh"
      innerCircleElement.style.left = "80vw"
    }
    await delay(BACK_TO_POSITION_ANIMATION_DURATION)
    zone.classList.remove("animate-joystick-start-position")
  }
  resetZonePosition()

  joystickElement.style.bottom = "20vh"
  innerCircleElement.style.bottom = "20vh"

  function updateJoystickPosition({ x, y }) {
    joystickElement.style.top = `${y}px`
    joystickElement.style.left = `${x}px`
  }

  function updateInnerCirclePosition({ x, y }) {
    innerCircleElement.style.top = `${y}px`
    innerCircleElement.style.left = `${x}px`
  }

  function intersectLineCircle({ point, circleCenter, radius }) {
    // console.log(...arguments)
    // const output = lineCircleCollision(
    //     [endPoint.x, endPoint.y],
    //   [startPoint.x, startPoint.y],
    //   [circleCenter.x, circleCenter.y],
    //   radius
    // )
    const lenX = point.x - circleCenter.x
    const lenY = point.y - circleCenter.y

    const lineLength = Math.sqrt(
      (point.x - circleCenter.x) * (point.x - circleCenter.x) +
        (point.y - circleCenter.y) * (point.y - circleCenter.y)
    )
    const alpha = (lineLength - radius) / lineLength
    // console.log(alpha)
    if (alpha <= 0) {
      return false
    }
    // return output
    return {
      x: point.x + (circleCenter.x - point.x) * alpha,
      y: point.y + (circleCenter.y - point.y) * alpha,
    }
  }

  function getVectorValue({ center, point, radius }) {
    return {
      x: (point.x - center.x) / radius,
      y: (-1 * (point.y - center.y)) / radius,
    }
  }

  zone.addEventListener("touchstart", (event) => {
    // console.log("touchstart", event)
    joystickElement.classList.add("active")
    innerCircleElement.classList.add("active")
    if (self.active) {
      return
    }
    self.active = true
    self.touchIdentifier = event.targetTouches[0].identifier
    self.touchStartPosition.x = event.targetTouches[0].pageX
    self.touchStartPosition.y = event.targetTouches[0].pageY
    updateJoystickPosition(self.touchStartPosition)
    updateInnerCirclePosition(self.touchStartPosition)
  })
  zone.addEventListener("touchmove", (event) => {
    // console.log("touchmove", event.changedTouches.item(self.touchIdentifier))
    // console.log("touchmove", event.touches.length, event.changedTouches.length, event.targetTouches.length)
    if (self.active) {
      const point = {
        x: event.touches.item(self.touchIdentifier).pageX,
        y: event.touches.item(self.touchIdentifier).pageY,
      }
      const intersection = intersectLineCircle({
        point,
        circleCenter: self.touchStartPosition,
        radius: JOYSTICK_RADIUS,
      })
      if (intersection) {
        self.innerCirclePosition.x = intersection.x
        self.innerCirclePosition.y = intersection.y
      } else {
        self.innerCirclePosition.x = event.targetTouches[0].pageX
        self.innerCirclePosition.y = event.targetTouches[0].pageY
      }

      self.vector = getVectorValue({
        center: self.touchStartPosition,
        point: self.innerCirclePosition,
        radius: JOYSTICK_RADIUS,
      })
      updateInnerCirclePosition(self.innerCirclePosition)
    }
  })
  zone.addEventListener("touchend", () => {
    // console.log("touchend", event)
    self = deepmerge({}, defaultState)
    setTimeout(resetZonePosition, 100)
    joystickElement.classList.remove("active")
    innerCircleElement.classList.remove("active")
  })

  return {
    getVector() {
      return self.vector
    },
    element: zone,
  }
}

export async function initMobileInput() {
  if (!location.href.includes("localhost")) {
    if (!userAgent.match(/iPad/i) && !userAgent.match(/iPhone/i)) {
      document.documentElement.requestFullscreen()
    }
  }

  htmlContainer = document.createElement("div")
  htmlContainer.classList.add("virtual-joysticks")
  document.body.appendChild(htmlContainer)

  virtualJoysticks.left = createJoystick("left")
  htmlContainer.appendChild(virtualJoysticks.left.element)

  virtualJoysticks.right = createJoystick("right")
  htmlContainer.appendChild(virtualJoysticks.right.element)

  //   document.body.addEventListener("touchstart", (event) => {
  //     // console.log('touchstart', event)
  //     if (true) {
  //       // console.log(event.clientX, event.clientY, screen.width, screen.height)
  //     }
  //   })
  //   document.body.addEventListener("touchmove", (event) => {
  //     // console.log("touchmove", event.targetTouches)
  //   })
  //   document.body.addEventListener("touchend", (event) => {
  //     // console.log('touchstart', event)
  //   })
}

export function getMobileJoysticksValue() {
  return {
    left: virtualJoysticks.left.getVector(),
    right: virtualJoysticks.right.getVector(),
  }
}

const style = document.createElement("style")
style.innerHTML = `
    .virtual-joysticks {
        position: fixed;
        left: 0;
        bottom: 0;
    }
    .virtual-joysticks .joystick-zone {
        __background: rgba(0, 255, 0, .3);
        position: fixed;
        bottom: 15px;
        width: calc(50vw - 30px);
        height: calc(60vh - 30px);
    }
    .virtual-joysticks .joystick {
        width: 1px;
        height: 1px;
        position: fixed;
        transition: opacity 500ms ease;
        opacity: .3;
    }
    .virtual-joysticks .joystick:after {
        content: "";
        display:block;
        width: ${JOYSTICK_RADIUS * 2}px;
        height: ${JOYSTICK_RADIUS * 2}px;
        background: rgba(255, 255, 255, .2);
        border: 2px solid rgba(255, 255, 255, .6);
        border-radius: 50%;
        transform: translate3d(-50%,-50%,0);
    }
    .virtual-joysticks .inner-circle {
        width: 1px;
        height: 1px;
        position: fixed;
        transition: opacity 500ms ease;
        opacity: .5;
    }
    .virtual-joysticks .inner-circle:after {
        content: "";
        display:block;
        width: 50px;
        height: 50px;
        background: rgba(255, 255, 255, .4);
        border-radius: 50%;
        transform: translate3d(-50%,-50%,0);
    }

    .animate-joystick-start-position .joystick,
    .animate-joystick-start-position .inner-circle {
        transition: ${BACK_TO_POSITION_ANIMATION_DURATION}ms ease;
    }
    .virtual-joysticks .joystick.active {
        opacity: 1;
    }
    .virtual-joysticks .inner-circle.active {
        opacity: 1;
    }
`
document.head.appendChild(style)
