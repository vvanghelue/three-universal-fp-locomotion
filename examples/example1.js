import fpLcomotion from '../src/index'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import * as THREE from "three"

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
        console.log(gltf.scene)

        addStartButton(function onStart() {

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
            const ambientLight = new THREE.AmbientLight(0x5555ff)
            ambientLight.intensity = 0.5
            scene.add(ambientLight)
            const directionalLight = new THREE.DirectionalLight(0xff0022, 0.5)
            directionalLight.position.set(-5, 25, -5)

            // init locomotion
            const locomotion = fpLcomotion({
                collisionObject: gltf.scene, // collision meshes
            })

            const clock = new THREE.Clock()
            renderer.setAnimationLoop(function () {
                //console.log(clock)
                const deltaTime = clock.getDelta() // in seconds
                locomotion.update(deltaTime)
                renderer.render(scene, camera)
            })
                
        }) //onStart
    })
}