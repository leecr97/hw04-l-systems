import {vec3, mat4} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Square from './geometry/Square';
import ScreenQuad from './geometry/ScreenQuad';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import LSystem from './lsystem/LSystem';
import {readTextFile} from './globals';
import Mesh from './geometry/Mesh';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  Iterations: 5,
  Season: 0,
  Angle: 25,
};

let square: Square;
let screenQuad: ScreenQuad;
let time: number = 0.0;

let axiom: string = "FFFFFFFFFX";
let iter: number = 5;
let leaf: Mesh;
let branch: Mesh;
let dirt: Mesh;

let season: number = 0;
let angle: number = 25;

function loadScene() {
  // square = new Square();
  // square.create();
  screenQuad = new ScreenQuad();
  screenQuad.create();

  // let dirtobj: string = readTextFile('https://raw.githubusercontent.com/leecr97/hw04-l-systems/master/src/obj/dirt.obj');
  let dirtobj: string = readTextFile('./src/obj/dirt.obj');
  dirt = new Mesh(dirtobj, vec3.fromValues(0,0,0));
  dirt.create();

  // let branchobj: string = readTextFile('https://raw.githubusercontent.com/leecr97/hw04-l-systems/master/src/obj/Branch.obj');
  let branchobj: string = readTextFile('./src/obj/branch.obj');
  branch = new Mesh(branchobj, vec3.fromValues(0,0,0));
  branch.create();

  // let leafobj: string = readTextFile('https://raw.githubusercontent.com/leecr97/hw04-l-systems/master/src/obj/leaf.obj');
  let leafobj: string = readTextFile('./src/obj/leaf.obj');
  leaf = new Mesh(leafobj, vec3.fromValues(0,0,0));
  leaf.create();

  // lsystem
  let ls : LSystem = new LSystem(axiom, iter, angle);
  ls.parseLSystem();
  let bData: mat4[] = ls.branchData;
  let lData: mat4[] = ls.leafData;

  // Set up instanced rendering data arrays here.
  let colorsArray : number[] = [];
  let col1Array : number[] = [];
  let col2Array : number[] = [];
  let col3Array : number[] = [];
  let col4Array : number[] = [];

  // draw dirt
  if (season == 0) { // summer
    colorsArray = [52.0 / 255.0, 114.0 / 255.0, 36.0 / 255.0, 1.0];
  }
  else if (season == 1) { // fall
    colorsArray = [130.0 / 255.0, 101.0 / 255.0, 84.0 / 255.0, 1.0];
  }
  else if (season == 2) { // winter
    colorsArray = [170.0 / 255.0, 166.0 / 255.0, 164.0 / 255.0, 1.0];
  }
  else { // spring
    colorsArray = [105.0 / 255.0, 186.0 / 255.0, 85.0 / 255.0, 1.0];
  }
  

  col1Array = [5, 0, 0, 0];
  col2Array = [0, 5, 0, 0];
  col3Array = [0, 0, 5, 0];
  col4Array = [0, -30, 0, 1];
  let colors : Float32Array = new Float32Array(colorsArray);
  let col1 : Float32Array = new Float32Array(col1Array);
  let col2 : Float32Array = new Float32Array(col2Array);
  let col3 : Float32Array = new Float32Array(col3Array);
  let col4 : Float32Array = new Float32Array(col4Array);
  dirt.setInstanceVBOs(colors, col1, col2, col3, col4);
  dirt.setNumInstances(1);

  // draw branches
  colorsArray = [];
  col1Array = [];
  col2Array = [];
  col3Array = [];
  col4Array = [];

  console.log("branches: " + bData.length);
  for (let i: number = 0; i < bData.length; i++) {
    let t: mat4 = bData[i];
    // console.log(t);

    // column data
    col1Array.push(t[0]);
    col1Array.push(t[1]);
    col1Array.push(t[2]);
    col1Array.push(t[3]);

    col2Array.push(t[4]);
    col2Array.push(t[5]);
    col2Array.push(t[6]);
    col2Array.push(t[7]);

    col3Array.push(t[8]);
    col3Array.push(t[9]);
    col3Array.push(t[10]);
    col3Array.push(t[11]);

    col4Array.push(t[12]);
    col4Array.push(t[13]);
    col4Array.push(t[14]);
    col4Array.push(t[15]);

    // color data
    if (season == 0) { // summer
      colorsArray.push(151.0 / 255.0);
      colorsArray.push(160.0 / 255.0);
      colorsArray.push(120.0 / 255.0);
      colorsArray.push(1.0);
    }
    else if (season == 1) { // fall
      colorsArray.push(76.0 / 255.0);
      colorsArray.push(56.0 / 255.0);
      colorsArray.push(28.0 / 255.0);
      colorsArray.push(1.0);
    }
    else if (season == 2) { // winter
      colorsArray.push(33.0 / 255.0);
      colorsArray.push(31.0 / 255.0);
      colorsArray.push(29.0 / 255.0);
      colorsArray.push(1.0);
    }
    else { // spring
      colorsArray.push(122.0 / 255.0);
      colorsArray.push(89.0 / 255.0);
      colorsArray.push(56.0 / 255.0);
      colorsArray.push(1.0);
    }

  }
  colors = new Float32Array(colorsArray);
  col1 = new Float32Array(col1Array);
  col2 = new Float32Array(col2Array);
  col3 = new Float32Array(col3Array);
  col4 = new Float32Array(col4Array);
  branch.setInstanceVBOs(colors, col1, col2, col3, col4);
  branch.setNumInstances(bData.length); 

  // draw leaves
  colorsArray = [];
  col1Array = [];
  col2Array = [];
  col3Array = [];
  col4Array = [];

  console.log("leaves: " + lData.length);
  for (let i: number = 0; i < lData.length; i++) {
    let t: mat4 = lData[i];
    // console.log(t);

    // column data
    col1Array.push(t[0]);
    col1Array.push(t[1]);
    col1Array.push(t[2]);
    col1Array.push(t[3]);

    col2Array.push(t[4]);
    col2Array.push(t[5]);
    col2Array.push(t[6]);
    col2Array.push(t[7]);

    col3Array.push(t[8]);
    col3Array.push(t[9]);
    col3Array.push(t[10]);
    col3Array.push(t[11]);

    col4Array.push(t[12]);
    col4Array.push(t[13]);
    col4Array.push(t[14]);
    col4Array.push(t[15]);

    // color data
    if (season == 0) { // summer
      colorsArray.push(144.0 / 255.0);
      colorsArray.push(237.0 / 255.0);
      colorsArray.push(147.0 / 255.0);
      colorsArray.push(1.0);
    }
    else if (season == 1) { // fall
      colorsArray.push(186.0 / 255.0);
      colorsArray.push(100.0 / 255.0);
      colorsArray.push(57.0 / 255.0);
      colorsArray.push(1.0);
    }
    else if (season == 2) { // winter
      colorsArray.push(255.0 / 255.0);
      colorsArray.push(255.0 / 255.0);
      colorsArray.push(255.0 / 255.0);
      colorsArray.push(1.0);
    }
    else { // spring
      colorsArray.push(255.0 / 255.0);
      colorsArray.push(164.0 / 255.0);
      colorsArray.push(163.0 / 255.0);
      colorsArray.push(1.0);
    }
    // colorsArray.push(66.0 / 255.0);
    // colorsArray.push(124.0 / 255.0);
    // colorsArray.push(68.0 / 255.0);
    // colorsArray.push(1.0);

  }
  colors = new Float32Array(colorsArray);
  col1 = new Float32Array(col1Array);
  col2 = new Float32Array(col2Array);
  col3 = new Float32Array(col3Array);
  col4 = new Float32Array(col4Array);
  leaf.setInstanceVBOs(colors, col1, col2, col3, col4);
  leaf.setNumInstances(lData.length); 
}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.add(controls, 'Iterations', 0, 5);
  gui.add(controls, 'Season', {Summer: 0, Fall: 1, Winter: 2, Spring: 3});
  gui.add(controls, 'Angle', 0, 45);

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  // const camera = new Camera(vec3.fromValues(50, 50, 10), vec3.fromValues(50, 50, 0));
  const camera = new Camera(vec3.fromValues(10, 40, 70), vec3.fromValues(0, 30, 0));
  // const camera = new Camera(vec3.fromValues(10, 30, 50), vec3.fromValues(0, 40, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  // gl.enable(gl.BLEND);
  // gl.blendFunc(gl.ONE, gl.ONE); // Additive blending
  gl.enable(gl.DEPTH_TEST);

  const instancedShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/instanced-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/instanced-frag.glsl')),
  ]);

  const flat = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/flat-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/flat-frag.glsl')),
  ]);

  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    instancedShader.setTime(time);
    flat.setTime(time++);
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);

    if (iter != controls.Iterations) {
      iter = controls.Iterations;
      loadScene();
    }
    if (season != controls.Season) {
      season = controls.Season;
      loadScene();
      flat.setSeason(season);
    }
    if (angle != controls.Angle) {
      angle = controls.Angle;
      loadScene();
    }

    renderer.clear();
    renderer.render(camera, flat, [screenQuad]);
    renderer.render(camera, instancedShader, [
      dirt, 
      branch, 
      leaf, 
      // square
    ]);
    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    flat.setDimensions(window.innerWidth, window.innerHeight);
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
  flat.setDimensions(window.innerWidth, window.innerHeight);

  // Start the render loop
  tick();
}

main();
