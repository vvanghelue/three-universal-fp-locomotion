# three-universal-fp-locomotion

A three.js first-person universal locomotion system for VR, Desktop and mobile 

## Demo
https://vvanghelue.github.io/three-universal-fp-locomotion/

## Install
```bash
npm i three-universal-fp-locomotion
```

## Config
```javascript
import firstPersonLocomotion from "three-universal-fp-locomotion"

// <-- init camera, renderer, scene, etc...

// create a body rig
const rig = new THREE.Group()
rig.position.set(0, 0, 0)
rig.add(camera)
scene.add(rig)

// First, you must handle a user-based click for vr and mobile
const locomotion = firstPersonLocomotion({
    rig: rig,
    renderer: renderer,
    camera: camera,
    collisionObjects: [ terrain, walls ],
    platforms: {
        desktop: {
            can: ['walk', 'jump'],
            input: {
                move: { bind: ['arrows', 'wasd'] }, // 'wasd'
                jump: { bind: 'space' }
            }
        },
        vr: {
            devices: ['oculus-quest'],
            can: ['walk', 'run', 'snap-turn', 'climb', 'fly', 'jump'],
            snapTurnStep: Math.PI/4,
            directionFollow: 'controller-orientation', // headset-orientation
            input: {
                jump: { bind: 'A' }
            }
        },
        mobile: {
            forceOrientation: 'landscape', // portrait
            can: ['walk', 'jump']
        }
    },
    responsiveLogic: {
        detectVR() {
            return window.navigator.userAgent.includes('Oculus Quest')
        }
    },
    world: {
        gravity: 9.81,
        speedFactor: 1.2
    },
})


const clock = new THREE.Clock()
renderer.setAnimationLoop(() => {
    const deltaTime = clock.getDelta()

    locomotion.update(deltaTime)

    // render my app
    // render() 
})
```

# display tutorial
```javascript
locomotion.context // vr, desktop, mobile
locomotion.on('context-change', () => {
    //
})
```

# display tutorial
```javascript
locomotion.tutorial.display('gl') // 'html' => only mobile and desktop
```

# events
```javascript
locomotion.on('jump', () => {

})
```
