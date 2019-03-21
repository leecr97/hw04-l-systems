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
    angle: number = 35.0;

    branchData: mat4[] = [];
    leafData: mat4[] = [];

    constructor() {
    }

    initTurtle() {
        this.currTurtle = new Turtle(vec3.fromValues(0,0,0), 
                                     vec3.fromValues(0,1,0),
                                     quat.fromValues(0,0,0,1), this.angle);
        this.turtleStack = [];
    }

    createDrawingRules() {
        // F - move forware
        this.drawingMap.set("F", this.currTurtle.moveForward.bind(this.currTurtle));
        // X - draw leaf
        this.drawingMap.set("X", this.currTurtle.drawLeaf.bind(this.currTurtle));
        // rotations
        this.drawingMap.set("-", this.currTurtle.rotateRightPos.bind(this.currTurtle));
        this.drawingMap.set("+", this.currTurtle.rotateUpPos.bind(this.currTurtle));
        this.drawingMap.set("~", this.currTurtle.rotateForwardPos.bind(this.currTurtle));
        // negative?
    }

    pushTurtle() {
        let pos: vec3 = vec3.create();
        vec3.copy(pos, this.currTurtle.position);
        let ori: vec3 = vec3.create();
        vec3.copy(ori, this.currTurtle.orientation);
        let q: quat = quat.create();
        quat.copy(q, this.currTurtle.quaternion);

        let newT : Turtle = new Turtle(pos, ori, q, this.angle);
        this.turtleStack.push(newT);
    }

    popTurtle() {
        let newT : Turtle = this.turtleStack.pop();
        if (newT) {
            this.currTurtle.position = newT.position;
            this.currTurtle.orientation = newT.orientation;
            this.currTurtle.quaternion = newT.quaternion;
            // console.log(this.currTurtle.getTransformation());
        }
    }

    draw(axiom: string) {
        for (let i: number = 0; i < axiom.length; i++) {
            let c: string = axiom[i];
            let drawFunc: any = this.drawingMap.get(c);

            // stack stuff
            if (c == "[") {
                // console.log(this.currTurtle.getTransformation());
                this.pushTurtle();
            }

            if (c == "]") {
                this.popTurtle();
            }

            // drawing stuff
            if (drawFunc) {
                drawFunc();

                let newMat: mat4 = this.currTurtle.getTransformation();
                // console.log(newMat);

                if (c == 'X') {
                    this.leafData.push(newMat);
                }
                else {
                    this.branchData.push(newMat);
                }
            }

        }
        // console.log("leaves: " + this.leafData.length);
        // console.log("branches: " + this.branchData.length);
    }

}