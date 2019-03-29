import {vec3, mat4, quat} from 'gl-matrix';

export default class Turtle {
    position: vec3 = vec3.create();
    orientation: vec3 = vec3.create();
    quaternion: quat = quat.create();
    recursionDepth: number; // how many [ characters have been found while drawing before ]s
    angle: number;
    scale: vec3 = vec3.create();

  constructor(pos: vec3, orient: vec3, q: quat, a: number, s: vec3, rd: number) {
    this.position = pos;
    this.orientation = orient;
    this.quaternion = q;
    this.angle = a;
    this.scale = s;
    this.recursionDepth = rd;
  }

  moveForward() {
    let s: number = this.scale[1];
    let dist : vec3 = vec3.create();
    vec3.multiply(dist, this.orientation, vec3.fromValues(s, s, s));
    vec3.add(this.position, this.position, dist);
    // console.log("move forward: " + this.position);
  }
  
  drawLeaf() {
    // leaf
  }

  pointUp() {
    this.orientation[1] = -this.orientation[1];
    quat.rotationTo(this.quaternion, vec3.fromValues(0,1,0), this.orientation);
    quat.normalize(this.quaternion, this.quaternion);
  }

  pointDownwards() {
    this.orientation[1] = this.orientation[1] - 0.2;
    if (this.orientation[1] < -1) {
      this.orientation[1] = -1;
    }
    quat.rotationTo(this.quaternion, vec3.fromValues(0,1,0), this.orientation);
    quat.normalize(this.quaternion, this.quaternion);
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
    let rs: number = Math.floor(Math.random() * 11) - 5;
    let r = this.angle + rs;
    this.rotate(vec3.fromValues(1,0,0), r);
  }

  rotateRightNeg() {
    let rs: number = Math.floor(Math.random() * 11) - 5;
    let r = this.angle + rs;
    this.rotate(vec3.fromValues(1,0,0), -1.0 * r);
  }

  rotateUpPos() {
    let rs: number = Math.floor(Math.random() * 11) - 5;
    let r = this.angle + rs;
    this.rotate(vec3.fromValues(0,1,0), r);
  }

  rotateUpNeg() {
    let rs: number = Math.floor(Math.random() * 11) - 5;
    let r = this.angle + rs;
    this.rotate(vec3.fromValues(0,1,0), -1.0 * r);
  }

  rotateForwardPos() {
    let rs: number = Math.floor(Math.random() * 11) - 5;
    let r = this.angle + rs;
    this.rotate(vec3.fromValues(0,0,1), r);
  }

  rotateForwardNeg() {
    let rs: number = Math.floor(Math.random() * 11) - 5;
    let r = this.angle + rs;
    this.rotate(vec3.fromValues(0,0,1), -1.0 * r);
  }

  getTransformation() : mat4 {
    let transformMat: mat4 = mat4.create();
    mat4.fromRotationTranslationScale(transformMat, this.quaternion, this.position, this.scale);
    return transformMat;
  }

  rotateQuat(axis: vec3, deg: number) : quat {
    vec3.normalize(axis, axis);
    let q: quat = quat.create();
    quat.setAxisAngle(q, axis, deg * Math.PI / 180.0);
    quat.normalize(q,q);

    let v: vec3 = vec3.fromValues(this.orientation[0],this.orientation[1],this.orientation[2]);
    v = vec3.transformQuat(v, v, q);
    vec3.normalize(v, v);
    quat.rotationTo(q, vec3.fromValues(0,1,0), v);
    return q;
  }

  getLeafTransformation() : mat4 {
    let rq: quat = quat.create();
    let rangle : number = Math.floor(Math.random() * 361);
    // rq = this.rotateQuat(vec3.fromValues(1,0,0), rangle);
    // rangle  = Math.floor(Math.random() * 361);
    // rq = this.rotateQuat(vec3.fromValues(0,1,0), rangle);
    // rangle = Math.floor(Math.random() * 361);
    
    rq = this.rotateQuat(vec3.fromValues(0,0,1), rangle);

    let s: vec3 = vec3.create();
    let ss: number = 1 / (4 * this.scale[0]);
    if (ss > 1.5) {
      ss = 1.5;
    }
    s = vec3.fromValues(ss, ss, ss);

    let transformMat: mat4 = mat4.create();
    mat4.fromRotationTranslationScale(transformMat, rq, this.position, s);
    return transformMat;
  }
}