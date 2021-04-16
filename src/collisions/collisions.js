import { inputSystem } from "../input/input-system"
import * as THREE from "three"
import { Octree } from "three/examples/jsm/math/Octree.js"
import { Capsule } from "three/examples/jsm/math/Capsule.js"

// Collision system with world octree and body capsule
// 99.99 % inspired by https://threejs.org/examples/?q=fps#games_fps

export let collisionSystem

export function initCollisions({ platform, collisionObjects, rig }) {
  // console.log('platform', platform)
  const DEFAULT_BODY_HEIGHT = 1.7
  const DEFAULT_BODY_RADIUS = 0.35

  let rigOnFloor = true

  let worldOctree = new Octree()

  for (const object of collisionObjects) {
    worldOctree.fromGraphNode(object)
  }

  const bodyCapsule = new Capsule()
  // new THREE.Vector3(0, DEFAULT_BODY_RADIUS, 0),
  // new THREE.Vector3(0, DEFAULT_BODY_RADIUS - DEFAULT_BODY_RADIUS, 0),
  // DEFAULT_BODY_RADIUS

  collisionSystem = {
    sphereIntersect(sphere) {
      return worldOctree.sphereIntersect(sphere)
    },
    isRigOnFloor() {
      return rigOnFloor
    },
    update(dt) {
      if (platform.type == "desktop" || platform.type == "mobile") {
        bodyCapsule.set(
          new THREE.Vector3(rig.position.x, rig.position.y + DEFAULT_BODY_RADIUS, rig.position.z),
          new THREE.Vector3(
            rig.position.x,
            rig.position.y + DEFAULT_BODY_HEIGHT - DEFAULT_BODY_RADIUS,
            rig.position.z
          ),
          DEFAULT_BODY_RADIUS
        )
      } // END if (platform.type == "desktop" ...

      if (platform.type == "vr") {
        const cameraPosition = inputSystem.getXRCamera().position
        bodyCapsule.set(
          new THREE.Vector3(
            cameraPosition.x,
            rig.position.y + DEFAULT_BODY_RADIUS,
            cameraPosition.z
          ),
          new THREE.Vector3(
            cameraPosition.x,
            cameraPosition.y - DEFAULT_BODY_RADIUS,
            cameraPosition.z
          ),
          DEFAULT_BODY_RADIUS
        )
      }

      rigOnFloor = false
      const result = worldOctree.capsuleIntersect(bodyCapsule)
      if (result) {
        rigOnFloor = result.normal.y > 0
        const vector = result.normal.multiplyScalar(result.depth)
        rig.position.add(vector)
      }
    },
  }
}
