import { inputSystem } from "../input/input-system"
import * as THREE from "three"
import { Octree } from "three/examples/jsm/math/Octree.js"
import { Capsule } from "three/examples/jsm/math/Capsule.js"

// Collision system with world octree and body capsule
// 99.99 % inspired by https://threejs.org/examples/?q=fps#games_fps

export let collisionSystem

export function initCollisions({ platformType, collisionObjects, rig, onCollision }) {
  const DEFAULT_BODY_HEIGHT = 1.7
  const DEFAULT_BODY_RADIUS = 0.35

  let rigOnFloor = true

  let worldOctree = new Octree()

  for (const object of collisionObjects) {
    worldOctree.fromGraphNode(object)
  }

  const bodyCapsule = new Capsule()

  collisionSystem = {
    sphereIntersect(sphere) {
      return worldOctree.sphereIntersect(sphere)
    },
    isRigOnFloor() {
      return rigOnFloor
    },
    update(dt) {
      if (platformType == "desktop" || platformType == "mobile") {
        bodyCapsule.set(
          new THREE.Vector3(rig.position.x, rig.position.y + DEFAULT_BODY_RADIUS, rig.position.z),
          new THREE.Vector3(
            rig.position.x,
            rig.position.y + DEFAULT_BODY_HEIGHT - DEFAULT_BODY_RADIUS,
            rig.position.z
          ),
          DEFAULT_BODY_RADIUS
        )
      } // END if "desktop"

      if (platformType == "vr") {
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
        window.debug = result.normal.y
        rigOnFloor = result.normal.y > 0.3
        const vector = result.normal.multiplyScalar(result.depth)
        rig.position.add(vector)
        onCollision ? onCollision({ result }) : null
      }
    },
  }
}
