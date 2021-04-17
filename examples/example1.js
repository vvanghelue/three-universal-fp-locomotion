import fpLcomotion, { walk, snapTurnVR, climbVR, flyVR } from '../src/index'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import * as THREE from "three"
import { snapTurnVRSystem } from '../src/locomotion/snap-turn-vr'

function addStartButton(onStart) {
    document.body.innerHTML = ""
    const startButton = document.createElement('div')
    startButton.innerHTML = "START"
    startButton.style.fontSize = '30px';
    startButton.style.cursor = 'pointer';
    startButton.style.background = 'white';
    startButton.style.padding = '15px 20px';
    startButton.style.color = 'black';
    startButton.style.fontWeight = 'bold';
    startButton.style.position = 'fixed';
    startButton.style.top = '50%';
    startButton.style.left = '50%';
    startButton.style.transform = 'translate3d(-50%, -50%, 0)';
    document.body.appendChild(startButton)
    startButton.addEventListener('click', () => {
        startButton.remove()
        onStart()
    })
}

let scene, camera, renderer, locomotion

window.openExample1 = () => {
    const loader = new GLTFLoader().setPath('./')
    loader.load('demo-scene/demo-scene.glb', function (gltf) {
        console.log('demo scene loaded')
        // console.log(gltf.scene)

        addStartButton( async function onStart() {

            //alert(locomotion.getContext())
            // scene
            scene = new THREE.Scene()
            scene.background = new THREE.Color(0xabcdef)

            // camera
            camera = window.camera = new THREE.PerspectiveCamera(
                50,
                window.innerWidth / window.innerHeight,
                0.1,
                100000
            )
            camera.position.set(0, 1.7, 0)
            camera.lookAt(100, 0, 100)
            // scene.add(camera)

            // renderer
            renderer = window.renderer = new THREE.WebGLRenderer({ antialias: false })
            renderer.setPixelRatio(window.devicePixelRatio)
            renderer.setSize(window.innerWidth, window.innerHeight)
            renderer.outputEncoding = THREE.sRGBEncoding
            function onWindowResize() {
                camera.aspect = window.innerWidth / window.innerHeight
                camera.updateProjectionMatrix()
                renderer.setSize(window.innerWidth, window.innerHeight)
            }
            window.addEventListener("resize", onWindowResize, false)
            // renderer.xr.enabled = true
            document.body.appendChild(renderer.domElement)

            // lighting
//            const ambientLight = new THREE.AmbientLight(0x5555ff)
 //           ambientLight.intensity = 0.5
  //          scene.add(ambientLight)

            const light = new THREE.HemisphereLight( 0x4444ff, 0x111111, 1 );
            scene.add( light );

            const directionalLight = new THREE.DirectionalLight(0xff4444, 1)
            directionalLight.position.set(-15, 25, -5)
            scene.add( directionalLight );

            // fog
            scene.fog = new THREE.Fog(0xabcdef, 0, 190)
            // scene.fog = new THREE.FogExp2(0xffffff, .014)

            // create body rig
            const rig = window.debugRig = new THREE.Group()
            rig.position.set(0, 0, 0)
            scene.add(rig)
            rig.add(camera)

            // add scene
            scene.add(gltf.scene)

            // init locomotion
            const locomotion = await fpLcomotion({
                collisionObjects: [gltf.scene], // collision meshes,
                renderer,
                camera,
                rig,
                features: [
                    walk({ speedFactor: 1.5 }),
                    snapTurnVR(),
                    climbVR(),
                    flyVR()
                ]
            })
            
            const clock = new THREE.Clock()
            // let i = 0
            renderer.setAnimationLoop(function () {
                    
                
            // setInterval(() => {
                //console.log(clock)
                // if (i%3 == 0) {
                    const deltaTime = clock.getDelta() // in seconds
                    locomotion.update(deltaTime)
                // }
                // i++
                renderer.render(scene, camera)
            // }, 1000/20)
            })

            window.renderer1 = renderer
            window.THREE = THREE
                
        }) //onStart
    })
}