import fpLcomotion from '../index'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

window.openExample1 = () => {
    const loader = new GLTFLoader().setPath('./')
    loader.load('demo-scene/demo-scene.glb', function (gltf) {
        console.log(gltf.scene)
    })
}