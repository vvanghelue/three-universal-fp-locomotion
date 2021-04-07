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
  const self = {
    active: false,
    touchStartPosition: {
      x: 0,
      y: 0,
    },
    vector: {
      x: 0,
      y: 0,
    },
  }
  const element = document.createElement("div")
  element.classList.add("joystick-zone")
  element.innerHTML = `
        <div class="joystick">
        </div>
        <div class="inner-circle"></div>
    `
  const joystickElement = element.querySelector(".joystick")
  const innerCircleElement = element.querySelector(".inner-circle")

  if (side === "left") {
    element.style.left = "15px"
    joystickElement.style.left = "20vw"
    innerCircleElement.style.left = "20vw"
  }
  if (side === "right") {
    element.style.right = "15px"
    joystickElement.style.right = "20vw"
    innerCircleElement.style.right = "20vw"
  }

  joystickElement.style.bottom = "20vh"
  innerCircleElement.style.bottom = "20vh"

  return {
    ...self,
    element,
    joystickElement,
    innerCircleElement,
  }
}

export async function initMobileInput() {
  document.documentElement.requestFullscreen()

  htmlContainer = document.createElement("div")
  htmlContainer.classList.add("virtual-joysticks")
  document.body.appendChild(htmlContainer)

  virtualJoysticks.left = createJoystick("left")
  htmlContainer.appendChild(virtualJoysticks.left.element)

  virtualJoysticks.right = createJoystick("right")
  htmlContainer.appendChild(virtualJoysticks.right.element)

  document.body.addEventListener("touchstart", (event) => {
    // console.log('touchstart', event)
    if (true) {
      // console.log(event.clientX, event.clientY, screen.width, screen.height)
    }
  })
  document.body.addEventListener("touchmove", (event) => {
    console.log("touchmove", event.targetTouches)
  })
  document.body.addEventListener("touchend", (event) => {
    // console.log('touchstart', event)
  })
}

export function getMobileJoysticksValue() {
  return {
    left: virtualJoysticks.left.vector,
    right: virtualJoysticks.right.vector,
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
        background: rgba(0, 255, 0, .3);
        position: fixed;
        bottom: 15px;
        width: calc(50vw - 30px);
        height: calc(60vh - 30px);
    }
    .virtual-joysticks .joystick {
        width: 1px;
        height: 1px;
        position: fixed;
    }
    .virtual-joysticks .joystick:after {
        content: "";
        display:block;
        width: 100px;
        height: 100px;
        background: rgba(255, 255, 255, .2);
        border: 2px solid rgba(255, 255, 255, .6);
        border-radius: 50%;
        transform: translate3d(-50%,-50%,0);
    }
    .virtual-joysticks .inner-circle {
        width: 1px;
        height: 1px;
        position: fixed;
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
`
document.head.appendChild(style)
