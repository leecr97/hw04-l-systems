import {vec3, mat4, quat} from 'gl-matrix';

export default class Turtle {
    position: vec3 = vec3.create();
    orientation: vec3 = vec3.create();
    quaternion: quat = quat.create();
    recursionDepth: number = 0; // how many [ characters have been found while drawing before ]s
    angle: number;

  constructor(pos: vec3, orient: vec3, q: quat, a: number) {
    this.position = pos;
    this.orientation = orient;
    this.quaternion = q;
    this.angle = a;
  }

  moveForward() {
    let dist : vec3 = vec3.create();
    vec3.multiply(dist, this.orientation, vec3.fromValues(5, 5, 5));
    vec3.add(this.position, this.position, dist);
    // console.log("move forward: " + this.position);
  }
  
  drawLeaf() {
    // leaf
  }

  rotate(axis: vec3, deg: number) {
    vec3.normalize(axis, axis);
    let q: quat = quat.create();
    quat.setAxisAngle(q, axis, deg * Math.PI / 180.0);
    quat.normalize(q,q);

    this.orientation = vec3.transformQuat(this.orientation, this.orientation, q);
    vec3.normalize(this.orientation, this.orientation);
    quat.rotationTo(this.quaternion, vec3.fromValues(0,1,0), this.orientation);
  }

  rotateRightPos() {
    this.rotate(vec3.fromValues(1,0,0), this.angle);
  }

  rotateRightNeg() {
    this.rotate(vec3.fromValues(1,0,0), -1.0 * this.angle);
  }

  rotateUpPos() {
    this.rotate(vec3.fromValues(0,1,0), this.angle);
  }

  rotateUpNeg() {
    this.rotate(vec3.fromValues(0,1,0), -1.0 * this.angle);
  }

  rotateForwardPos() {
    this.rotate(vec3.fromValues(0,0,1), this.angle);
  }

  rotateForwardNeg() {
    this.rotate(vec3.fromValues(0,0,1), -1.0 * this.angle);
  }

  getTransformation() : mat4 {
    // transformation = translate * rotate * scale
    let t: mat4 = mat4.create();
    mat4.fromTranslation(t, this.position);
    let r: mat4 = mat4.create();
    mat4.fromQuat(r, this.quaternion);
    let s: mat4 = mat4.create();
    mat4.fromScaling(s, vec3.fromValues(1,1,1));
    // let s: vec3 = vec3.create();
    // vec3.fromValues(1,1,1);

    let transformMat: mat4 = mat4.create();
    // mat4.fromRotationTranslationScale(transformMat, this.quaternion, this.position, s);
    mat4.multiply(transformMat, r, s);
    mat4.multiply(transformMat, t, transformMat);
    return transformMat;
  }
}