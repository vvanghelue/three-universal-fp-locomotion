# three-universal-fp-locomotion

## Demo
https://vvanghelue.github.io/three-universal-fp-locomotion/


## Config
```javascript
import fpLocomotion from "three-universal-fp-locomotion"

// init camera, scene, etc...

// create a body rig
const body = new THREE.Group()
body.position.set(0, 0, 0)
body.add(camera)

scene.add(body)

const locomotion = fpLocomotion({
    rig: body,
    renderer: renderer,
    camera: camera,
    collisionObjects: [ terrain, walls ],
    platforms: {
        mouseAndKeyboard: {
            can: ['move', 'jump', 'snap-turn'],
            input: {
                move: { bind: ['arrows', 'wasd'] } // 'wasd'
                jump: { bind: 'space' }
            }
        },
        vr: {
            devices: ['oculus-quest'],
            //hands: 'default',
            can: ['move', 'climb', 'fly', 'jump'],
            follow: 'controller-orientation', // headset-orientation
            input: {
                jump: { bind: 'A' }
            }
        },
        mobile: {
            forceOrientation: 'landscape', // portrait
            can: ['move', 'jump']
        }
    },
    responsiveLogic: {
        isVR() {
            return window.navigator.userAgent.includes('Oculus Quest')
        }
    },
    worldOptions: {
        gravity: 9.81,
        speedFactor: 1.2
    },
})


const clock = new THREE.Clock()
renderer.setAnimationLoop(() => {
    const deltaTime = clock.getDelta()

    locomotion.update(deltaTime)

    // render my app
    // doStuff(deltaTime)
    // render() 
})
```

# display tutorial
```javascript
locomotion.context // vr, mouse-and-keyboard, mobile
locomotion.on('context-change', () => {
    //
})
```

# display tutorial
```javascript
locomotion.displayTutorial()
```

# events
```javascript
locomotion.on('jump', () => {

})
```
