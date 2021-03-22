import fpLcomotion from './index'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

const loader = new GLTFLoader().setPath('./')
loader.load('demo-scene/demo-scene.glb', function (gltf) {
    console.log(gltf.scene)
})