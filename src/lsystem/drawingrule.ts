import {vec3, mat4, quat} from 'gl-matrix';
import Turtle from "./Turtle";

export default class DrawingRule {
    // precondition: string;
    // drawAction: any;
    // probability: number;
    // new_symbol: string;
    currTurtle: Turtle;
    turtleStack: Turtle[];
    drawingMap: Map<string, any> = new Map<string, any>();
    angle: number;

    branchData: mat4[] = [];
    leafData: mat4[] = [];

    constructor(a: number) {
        this.angle = a;
        this.initTurtle();
        this.createDrawingRules();
        // this.lenscale = s / 5.0;
        console.log("ang: " + this.angle);
    }

    initTurtle() {
        this.currTurtle = new Turtle(vec3.fromValues(0,0,0), 
                                     vec3.fromValues(0,1,0),
                                     quat.fromValues(0,0,0,1), 
                                     this.angle, 
                                     vec3.fromValues(1,1,1), 0);
        this.turtleStack = [];
    }

    createDrawingRules() {
        // F - move forware
        this.drawingMap.set("F", this.currTurtle.moveForward.bind(this.currTurtle));
        // X - draw leaf
        // this.drawingMap.set("X", this.currTurtle.drawLeafRotate.bind(this.currTurtle));
        this.drawingMap.set("L", this.currTurtle.drawLeaf.bind(this.currTurtle));
        // rotations
        this.drawingMap.set("+", this.currTurtle.rotateForwardPos.bind(this.currTurtle));
        this.drawingMap.set("=", this.currTurtle.rotateUpPos.bind(this.currTurtle));
        this.drawingMap.set("~", this.currTurtle.rotateRightPos.bind(this.currTurtle));

        this.drawingMap.set("-", this.currTurtle.rotateForwardNeg.bind(this.currTurtle));
        this.drawingMap.set("_", this.currTurtle.rotateUpNeg.bind(this.currTurtle));
        this.drawingMap.set("*", this.currTurtle.rotateRightNeg.bind(this.currTurtle));
    }

    pushTurtle() {
        let pos: vec3 = vec3.create();
        vec3.copy(pos, this.currTurtle.position);
        let ori: vec3 = vec3.create();
        vec3.copy(ori, this.currTurtle.orientation);
        let q: quat = quat.create();
        quat.copy(q, this.currTurtle.quaternion);
        let s: vec3 = vec3.create();
        vec3.copy(s, this.currTurtle.scale);

        let newT : Turtle = new Turtle(pos, ori, q, this.currTurtle.angle, s, this.currTurtle.recursionDepth);
        this.turtleStack.push(newT);
    }

    popTurtle() {
        let newT : Turtle = this.turtleStack.pop();
        if (newT) {
            this.currTurtle.position = newT.position;
            this.currTurtle.orientation = newT.orientation;
            this.currTurtle.quaternion = newT.quaternion;
            this.currTurtle.scale = newT.scale;
            this.currTurtle.recursionDepth++;
            this.currTurtle.angle = newT.angle;
            // console.log(this.currTurtle.getTransformation());
        }
    }

    draw(axiom: string) {
        for (let i: number = 0; i < axiom.length; i++) {
            let c: string = axiom[i];
            let drawFunc: any = this.drawingMap.get(c);

            // stack stuff
            if (c == "[") {
                this.pushTurtle();
            }

            if (c == "]") {
                this.popTurtle();
            }

            // drawing stuff
            if (drawFunc) {
                drawFunc();

                let mat: mat4;
                mat = mat4.create();

                if (c == 'L') {
                    mat = this.currTurtle.getLeafTransformation();
                    this.leafData.push(mat);
                }
                else if (c == 'F') {
                    if (this.currTurtle.scale[0] > 0.02) {
                        this.currTurtle.scale[0] *= 0.95;
                        this.currTurtle.scale[1] *= 0.99;
                        this.currTurtle.scale[2] *= 0.95;
                    }
                    if (this.currTurtle.orientation[1] < 0 && this.currTurtle.recursionDepth < 4) {
                        this.currTurtle.pointUp();
                    }

                    mat = this.currTurtle.getTransformation();
                    this.branchData.push(mat);
                }
            }

        }
    }

}