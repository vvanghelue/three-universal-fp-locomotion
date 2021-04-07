import * as THREE from "three"

export default function rotateAboutPoint(obj, point, axis, theta, pointIsWorld) {
  pointIsWorld = pointIsWorld === undefined ? false : pointIsWorld

  if (pointIsWorld) {
    obj.parent.localToWorld(obj.position) // compensate for world coordinate
  }

  obj.position.sub(point) // remove the offset
  obj.position.applyAxisAngle(axis, theta) // rotate the POSITION
  obj.position.add(point) // re-add the offset

  if (pointIsWorld) {
    obj.parent.worldToLocal(obj.position) // undo world coordinates compensation
  }

  obj.rotateOnAxis(axis, theta) // rotate the OBJECT
}

// @SEE
// THREE.Object3D.prototype.rotateAroundWorldAxis = function() {

//     // rotate object around axis in world space (the axis passes through point)
//     // axis is assumed to be normalized
//     // assumes object does not have a rotated parent

//     var q = new THREE.Quaternion();

//     return function rotateAroundWorldAxis( point, axis, angle ) {

//         q.setFromAxisAngle( axis, angle );

//         this.applyQuaternion( q );

//         this.position.sub( point );
//         this.position.applyQuaternion( q );
//         this.position.add( point );

//         return this;

//     }

// }();
