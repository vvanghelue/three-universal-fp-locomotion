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
    collisionObject: myCollisionObject,
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
    }
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
