import * as THREE from "three"
import { inputSystem } from "../../../input/input-system"
import { collisionSystem } from "../../../collisions/collisions"
import { locomotionSystem } from "../../locomotion"

export function initClimbingVRSystem({ platformType, rig }) {
  if (platformType != "vr") {
    return
  }
  // used to compute velocity when detaching hands from walls
  const lastBodyPositions = []
  let climbingState = {
    grippedHand: null,
    canGrip: {
      left: true,
      right: true,
    },
    position: new THREE.Vector3(0, 0, 0),
  }
  const xrHands = inputSystem.getXRControllers()

  return (climbingVRSystem = {
    update(deltaTime) {
      const rigVelocity = locomotionSystem.getRigVelocity()

      for (const handName of ["left", "right"]) {
        if (inputSystem.getXRGamepadButtonValue(handName, 1) < 0.5) {
          //console.log('handName')
          if (climbingState.grippedHand == handName) {
            climbingState.grippedHand = null
          }
          climbingState.canGrip[handName] = true
        }
      }

      if (climbingState.grippedHand) {
        // console.log("climbingState.grippedHand")
        const handPosition = new THREE.Vector3()
        xrHands[climbingState.grippedHand].mesh.getWorldPosition(handPosition)
        rig.position.add(climbingState.position.clone().sub(handPosition))

        lastBodyPositions.push({
          position: rig.position.clone(),
          dt: deltaTime,
        })
        if (lastBodyPositions.length > 2) {
          lastBodyPositions.splice(0, 1)
        }
      }

      for (const handName of ["left", "right"]) {
        if (!climbingState.canGrip[handName]) {
          continue
        }

        // get grip value for the hand
        if (inputSystem.getXRGamepadButtonValue(handName, 1) < 0.5) {
          continue
        }

        // if one hand already gripped we do nothing
        if (climbingState.grippedHand == handName) {
          continue
        }

        const handPosition = new THREE.Vector3(0, 0, 0)
        xrHands[handName].mesh.getWorldPosition(handPosition)
        const result = collisionSystem.sphereIntersect(new THREE.Sphere(handPosition, 0.1))
        if (result) {
          climbingState.grippedHand = handName
          climbingState.position = handPosition
          climbingState.canGrip[handName] = false

          rigVelocity.x = 0
          rigVelocity.y = 0
          rigVelocity.z = 0
          break
        }
      }

      // for (const handName of ["left", "right"]) {
      //   if (climbingState.grippedHand == handName) {
      //     xrHands[handName].mesh.material.color.set(0xff1111)
      //     continue
      //   }
      //   xrHands[handName].mesh.material.color.set(0x11ff11)
      // }

      // when player relax grip, add inertia towards movement direction (allow player to fast climb a wall)
      if (climbingState.grippedHand === null && lastBodyPositions.length > 1) {
        rigVelocity.x =
          ((lastBodyPositions[1].position.x - lastBodyPositions[0].position.x) * 0.7) / deltaTime
        rigVelocity.y =
          ((lastBodyPositions[1].position.y - lastBodyPositions[0].position.y) * 0.7) / deltaTime
        rigVelocity.z =
          ((lastBodyPositions[1].position.z - lastBodyPositions[0].position.z) * 0.7) / deltaTime
        lastBodyPositions.splice(0)
      }
    },
    isClimbing() {
      return climbingState.grippedHand !== null
    },
  })
}

export let climbingVRSystem
