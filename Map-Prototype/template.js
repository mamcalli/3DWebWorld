// template.js
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform int u_whichTexture;
  void main() {
    if(u_whichTexture == -2) {
      gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV,1.0,1.0);
    } else if ( u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else {
      gl_FragColor = vec4(1,.2,.2,1);
    }
  }`

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 3;
const STAR = 4;

// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;
let u_whichTexture;
// Global UI variables
let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_selectedSize=5;
let g_selectedType=POINT;
let g_segments = 10;
let g_globalAngle=0;
let g_globalAngleX=0;
let g_globalAngleY=0;
let g_bodyAngle=0;

let g_earAngle = 0;
let g_headAngle = 0;
let g_rShoulderAngle = 0;
let g_rArmAngle=0;
let g_lArmAngle=0;
let g_earAnimation = false;
let g_lArmAnimation = false;
let g_rShoulderAnimation = false;
let g_rArmAnimation = false;
let g_headAnimation = false;

let g_lShoulderAngle = 0;
let g_rLegAngle=0;
let g_lLegAngle=0;
let g_lShoulderAnimation = false;
let g_rLegAnimation = false;
let g_lLegAnimation = false;

let g_lLowLegAngle = 0;
let g_rLowLegAngle = 0;
let g_lFootAngle = 0;
let g_rFootAngle = 0;

let g_rLowLegAn = false;
let g_rFootAn = false;
let g_lLowLegAn = false;
let g_lFootAn = false;

let g_clickAnimate = false;
let g_drop = 0;
let g_earWiggle = 0;
let g_walk=false;
let g_dripping=true;

function setupWebGL(){
  // retrieve canvas element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // depth buffer will keep track of spacing
  gl.enable(gl.DEPTH_TEST);
}

function connectToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if(!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if(!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if(!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if(!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  // get the storage location for u_Sampler
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if(!u_Sampler0) {
    console.log('failed to get the storage location of u_Sampler0');
    return false;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if(!u_whichTexture) {
    console.log('failed to get the storage location of u_whichTexture');
    return false;
  }

  // set initial value for matrix to identity
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

}

// Set up actions for HTML UI elements
function addActionsForHtmlUI(){

  document.getElementById('headOn').onclick = function() { g_headAnimation=true };
  document.getElementById('headOff').onclick = function() { g_headAnimation=false};
  document.getElementById('earsOn').onclick = function() { g_earAnimation=true };
  document.getElementById('earsOff').onclick = function() { g_earAnimation=false };


  document.getElementById('animationRShoulderOn').onclick = function() { g_rShoulderAnimation=true};
  document.getElementById('animationRShoulderOff').onclick = function() { g_rShoulderAnimation=false };
  document.getElementById('animationLShoulderOn').onclick = function() { g_lShoulderAnimation=true};
  document.getElementById('animationLShoulderOff').onclick = function() { g_lShoulderAnimation=false };

  document.getElementById('animationRArmOn').onclick = function() { g_rArmAnimation=true};
  document.getElementById('animationRArmOff').onclick = function() { g_rArmAnimation=false };
  document.getElementById('animationLArmOn').onclick = function() { g_lArmAnimation=true};
  document.getElementById('animationLArmOff').onclick = function() { g_lArmAnimation=false };


  document.getElementById('animationRLegOn').onclick = function() { g_rLegAnimation=true };
  document.getElementById('animationRLegOff').onclick = function() { g_rLegAnimation=false };
  document.getElementById('animationLLegOn').onclick = function() { g_lLegAnimation=true };
  document.getElementById('animationLLegOff').onclick = function() { g_lLegAnimation=false };

  document.getElementById('lLowLegOn').onclick = function() { g_lLowLegAn=true };
  document.getElementById('lLowLegOff').onclick = function() { g_lLowLegAn=false };
  document.getElementById('lFootOn').onclick = function() { g_lFootAn=true };
  document.getElementById('lFootOff').onclick = function() { g_lFootAn=false };

  document.getElementById('rLowLegOn').onclick = function() { g_rLowLegAn=true };
  document.getElementById('rLowLegOff').onclick = function() { g_rLowLegAn=false };
  document.getElementById('rFootOn').onclick = function() { g_rFootAn=true };
  document.getElementById('rFootOff').onclick = function() { g_rFootAn=false };

  document.getElementById('walkOn').onclick = function() { g_walk=true };
  document.getElementById('walkOff').onclick = function() { g_walk=false };
  document.getElementById('walkOff').onclick = function() { g_walk=false };
  document.getElementById('toggleDrip').onclick = function() { g_dripping ? g_dripping = false : g_dripping = true  };
  


  // Slider Events
  document.getElementById('earSlide').addEventListener('mousemove', function() { g_earAngle = this.value/*; renderAllShapes()*/ });
  document.getElementById('headSlide').addEventListener('mousemove', function() { g_headAngle = this.value/*; renderAllShapes()*/ });
  document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value/*; renderAllShapes()*/ });
  //document.getElementById('yAngleSlide').addEventListener('mousemove', function() { g_globalAngleY = this.value/*; renderAllShapes()*/ });
  document.getElementById('bodySlide').addEventListener('mousemove', function() { g_bodyAngle = -this.value/*; renderAllShapes()*/ });
  document.getElementById('rShoulderSlide').addEventListener('mousemove', function() { g_rShoulderAngle = -this.value/*; renderAllShapes()*/ });
  document.getElementById('lShoulderSlide').addEventListener('mousemove', function() { g_lShoulderAngle = -this.value/*; renderAllShapes(*/ });
  document.getElementById('rArmSlide').addEventListener('mousemove', function() { g_rArmAngle = -this.value/*; renderAllShapes()*/ });
  document.getElementById('lArmSlide').addEventListener('mousemove', function() { g_lArmAngle = -this.value/*; renderAllShapes()*/ });
  document.getElementById('rLegSlide').addEventListener('mousemove', function() { g_rLegAngle = -this.value/*; renderAllShapes()*/ });
  document.getElementById('lLegSlide').addEventListener('mousemove', function() { g_lLegAngle = -this.value/*; renderAllShapes()*/ });

  document.getElementById('lLowLegSlide').addEventListener('mousemove', function() { g_lLowLegAngle = -this.value/*; renderAllShapes()*/ });
  document.getElementById('lFootSlide').addEventListener('mousemove', function() { g_lFootAngle = -this.value/*; renderAllShapes()*/ });
  
  document.getElementById('rLowLegSlide').addEventListener('mousemove', function() { g_rLowLegAngle = -this.value/*; renderAllShapes()*/ });
  document.getElementById('rFootSlide').addEventListener('mousemove', function() { g_rFootAngle = -this.value/*; renderAllShapes()*/ });

}

// from the book:3
function initTextures() {
  // create texture object
  // var texture = gl.createTexture();
  // if(!texture) {
  //   console.log('failed to create the texture object');
  //   return false;
  // }

  // create image object
  var image = new Image();
  if(!image){
    console.log('Failed to create the image object');
    return false;
  }
  // register the event handler to be called on loading an image
  image.onload = function(){ sendImageToTEXTURE0(image); };
  // tell browser to load image
  image.src = 'sky.jpg';

  // Can add more loading here
  return true;
}

function sendImageToTEXTURE0(image) {
  // create a texture object
  var texture = gl.createTexture();
  if(!texture) {
    console.log('failed to create the texture object');
    return false;
  }

  // flip image y axis
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  // enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // bind texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // set texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // set texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // set texture unit - to sampler
  gl.uniform1i(u_Sampler0, 0);

  // gl.clear(gl.COLOR_BUFFET_BIT);
  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw rectangle
  console.log('finished loadTexture');
}

function main() {
  // Set up canvas and GL variables
  setupWebGL();
  // Set up GLSL shader programs, connect JavaScript Variables with GLSL variables
  connectToGLSL();

  // Set up actions for HTML UI elements
  addActionsForHtmlUI();

  initTextures();
  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { mouseRotate(ev) } };
  // Specify the color for clearing <canvas>
  gl.clearColor(0.770, 0.9, 1.0, 1);

  document.onkeydown = keydown;
  // render
  //renderAllShapes();
  
  requestAnimationFrame(tick);

}

var g_startTime=performance.now()/1000.0;
var g_seconds=performance.now()/1000.0 - g_startTime;
function tick() {
  g_seconds=performance.now()/1000-g_startTime;
  //console.log(g_seconds);

  updateAnimationAngles();
  renderAllShapes();

  requestAnimationFrame(tick);
}

function updateAnimationAngles() {
  var animateAll = g_walk;
  if(g_rShoulderAnimation || animateAll) {
    g_rShoulderAngle = (45*Math.sin(g_seconds));
  }
  if(g_lShoulderAnimation || animateAll) {
    g_lShoulderAngle = (45*Math.cos(g_seconds));
  }
  if(g_rArmAnimation || animateAll) {
    g_rArmAngle = (25*Math.sin(g_seconds));
  }
  if(g_lArmAnimation || animateAll) {
    g_lArmAngle = (25*Math.cos(g_seconds));
  }
  if(g_rLegAnimation || animateAll) {
    g_rLegAngle = (25*Math.cos(g_seconds));
  }
  if(g_lLegAnimation || animateAll) {
    g_lLegAngle = (25*Math.sin(g_seconds));
  }
  if(g_lLowLegAn || animateAll) {
    g_lLowLegAngle = 30*Math.cos(g_seconds);
  }
  if(g_rLowLegAn || animateAll) {
    g_rLowLegAngle = 30*Math.sin(g_seconds);
  }
  if(g_rFootAn || animateAll) {
    g_rFootAn = 20*Math.sin(g_seconds);
  }
  if(g_lFootAn || animateAll) {
    g_lFootAn = 20*Math.cos(g_seconds);
  }
  if(g_headAnimation || animateAll) {
    g_headAngle = (30*Math.cos(g_seconds));
  }
  if(g_earAnimation || animateAll) {
    g_earAngle = (30*Math.cos(g_seconds));
  }

  if(g_clickAnimate) {
    g_drop++;
    g_earWiggle = (45*Math.sin(g_seconds));
    if( g_drop > 100 ) {
      g_clickAnimate = false;
      g_drop = 0;
      g_earWiggle = 0;
  
    }
  }
}

function keydown(ev) {
  if(ev.keyCode==39) {
    g_eye[0]-=0.2;
  } else if (ev.keyCode==37) {
    g_eye[0]+=0.2;
  }
  renderAllShapes();
  console.log(ev.keyCode);
}

// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = [];

function mouseRotate(ev) {
  g_globalAngleX += ev.movementX;
  g_globalAngleY += ev.movementY;
}

function click(ev) {
  if (ev.shiftKey) {
    g_clickAnimate = true;
  }
}

function convertCoordsToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

var g_eye=[0,0,3];
var g_at=[0,0,-100];
var g_up=[0,1,0];
function renderAllShapes(){
  var start_time = performance.now();

  // pass projection matrix
  var projMat = new Matrix4();
  projMat.setPerspective(60, canvas.width/canvas.height, .1, 100); // 90 degrees wide, aspect, near plane .1, far 100
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  // pass view matrix
  var viewMat=new Matrix4();
  viewMat.setLookAt(g_eye[0],g_eye[1],g_eye[2], g_at[0],g_at[1],g_at[2], g_up[0],g_up[1],g_up[2]); // eye, at, up)
  //viewMat.setLookAt(0,0,3,  0,0,-100,  0,1,0); // eye, at, up)
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);
  
  // set global rotation matrix
  var globalRotMat = new Matrix4().rotate(g_globalAngle,0,1,0);
  globalRotMat.rotate(-g_globalAngleX, 0,1,0);
  globalRotMat.rotate(-g_globalAngleY, 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // draw floor
  var floor = new Cube();
  floor.color = [1.0,0.0,0.0,1.0];
  floor.textureNum=0;
  floor.matrix.translate(0,-.75,0);
  floor.matrix.scale(32,0,32);
  //floor.matrix.translate(-.5,0,-.5);
  floor.render();
  // var len = g_shapesList.length;

  // for(var i = 0; i < len; ++i) {

  //   g_shapesList[i].render();

  // }
   //draw a triangle
  //rawTriangle3D( [-1.0,0.0,0.0,  -0.5,-1.0,0.0, 0.0,0.0,0.0] );

  // draw a cube
  // operations happen in reverse order
  //test.render();
  var M = new Matrix4();

  var top_body = new Cube();
  top_body.color = [.099, .088, .11, 1];
  top_body.topScale = 0.60;
  top_body.bottomScale = 1.2;
  top_body.matrix.setTranslate(0, 0, 0);
  top_body.matrix.rotate(g_bodyAngle, 0,1,0);
  var body=new Matrix4(top_body.matrix);
  top_body.matrix.scale(0.40,.45,.2);
  top_body.render();

  // RIGHT UPPER ARM
  var right_bicep = new Cylinder();
  right_bicep.segments = 12;
  right_bicep.color = [.099, .088, .11, 1];
  right_bicep.matrix.set(body);
  right_bicep.topScale = 0.05;
  right_bicep.matrix.translate(0.13, .12, 0);
  right_bicep.matrix.rotate(35, 0,0,1);
  right_bicep.matrix.rotate(-g_rShoulderAngle, 1,0,0);
  right_bicep.matrix.scale(1,.60,1);
  M.set(right_bicep.matrix);
  right_bicep.render();

  // RIGHT FOREARM
  var right_arm = new Cylinder();
  right_arm.segments = 12;
  right_arm.color = [.099, .088, .11, 1];
  right_arm.matrix.set(M);
  right_arm.matrix.translate(0.002, -.48, 0);
  right_arm.matrix.rotate(-5, 0,0,1);
  right_arm.matrix.rotate(10, 1,0,0);
  right_arm.matrix.rotate(-g_rArmAngle, 1,0,0);
  right_arm.topScale = 1.08;
  right_arm.matrix.scale(.9,.5,.9);
  right_arm.render();

  var right_hand = new Cube();
  right_hand.matrix.set(right_arm.matrix);
  right_hand.matrix.translate(0,-.6,0);
  right_hand.matrix.scale(0.15,0.2,0.15);
  right_hand.render();

  var bottom_body = new Cube();
  bottom_body.matrix.set(body);
  bottom_body.bottomScale = 1.2;
  bottom_body.color = [.2, .15, .23, 1];
  bottom_body.matrix.setTranslate(0, -.25, 0);
  bottom_body.matrix.rotate(g_bodyAngle, 0,1,0);
  var bottom=new Matrix4(bottom_body.matrix);

  bottom_body.matrix.scale(0.40,.12,.2);
  bottom_body.render();

  // LEFT BICEP
  var left_bicep = new Cylinder();
  left_bicep.segments = 12;
  left_bicep.color = [.099, .088, .11, 1];
  left_bicep.matrix.set(body);
  left_bicep.topScale = 0.05;
  left_bicep.matrix.translate(-.13, .12, 0);
  left_bicep.matrix.rotate(-35, 0,0,1);
  left_bicep.matrix.rotate(-g_lShoulderAngle, 1,0,0);
  left_bicep.matrix.scale(1,.6,1);
  M.set(left_bicep.matrix);
  left_bicep.render();
  
  // LEFT FOREARM
  var left_arm = new Cylinder();
  left_arm.segments = 12;
  left_arm.color = [.099, .088, .11, 1];
  left_arm.matrix.set(M);
  left_arm.bottomScale = 0.6;
  left_arm.matrix.translate(-.002, -.48, 0);
  left_arm.matrix.rotate(5, 0,0,1);
  left_arm.matrix.rotate(10, 1,0,0);
  left_arm.matrix.rotate(-g_lArmAngle, 1,0,0);
  left_arm.topScale = 1.08;
  left_arm.matrix.scale(.9,.5,.9);
  left_arm.render();

  var left_hand = new Cube();
  left_hand.matrix.set(left_arm.matrix);
  left_hand.matrix.translate(0,-.6,0);
  left_hand.matrix.scale(0.15,0.2,0.15);
  left_hand.render();

  var head = new Cube();
  //head.segments = 10;
  head.color=[.90,.85,.98,1];
  //head.matrix.set(body);
  head.matrix.translate(0,0.26, 0);
  head.matrix.rotate(g_headAngle, 1,0,0);
  head.matrix.scale(0.55,0.4, .3);
  M.set(head.matrix);
  head.render();

  var right_ear = new Cone();
  right_ear.color=[.945,.89,1,1];
  right_ear.matrix.set(M);
  right_ear.matrix.translate(.60,1.2,0);
  right_ear.matrix.rotate(-23, 0,0,1);
  right_ear.matrix.rotate(g_earAngle, 0,1,0);
  right_ear.matrix.rotate(g_earWiggle,0,1,0);
  right_ear.matrix.scale(2.1,.8,2.3);
  right_ear.render();

  r_in_ear = new Cone();
  r_in_ear.color=[0,0,0,1];
  r_in_ear.matrix.set(right_ear.matrix);
  r_in_ear.matrix.translate(0,-.5,-.05);
  r_in_ear.matrix.rotate(5, 1,0,0);
  r_in_ear.matrix.scale(.3,.5,.3);
  r_in_ear.render();

  var left_ear = new Cone();
  left_ear.color=[.945,.89,1,1];
  left_ear.matrix.set(M);
  left_ear.matrix.translate(-.60,1.2,0);
  left_ear.matrix.rotate(23, 0,0,1);
  left_ear.matrix.rotate(-g_earAngle, 0,1,0);
  left_ear.matrix.rotate(-g_earWiggle,0,1,0);
  left_ear.matrix.scale(2.1,.8,2.3);
  left_ear.render();
  
  l_in_ear = new Cone();
  l_in_ear.color=[0,0,0,1];
  l_in_ear.matrix.set(left_ear.matrix);
  l_in_ear.matrix.translate(0,-.5,-.05);
  l_in_ear.matrix.rotate(5, 1,0,0);
  l_in_ear.matrix.scale(.3,.5,.3);
  l_in_ear.render();

  // var face = new Sphere();
  // //this.segments = 10;
  // face.matrix.set(M);
  // face.color = [.98,.98,1,1];
  // face.matrix.translate(0,0,-.35);
  // face.matrix.scale(0.8,0.8,0.8)
  // //face.render();

  var right_eye = new Cube();
  right_eye.segments = 6;
  right_eye.matrix.set(M);
  right_eye.color = [0,.92,.092,.90];
  right_eye.matrix.translate(.25,.3,-.5);
  right_eye.matrix.scale(0.18,0.1,0.18)
  right_eye.render();

  var left_eye = new Cube();
  left_eye.segments = 6;
  left_eye.matrix.set(M);
  left_eye.color = [0,.92,.092,.90];
  left_eye.matrix.translate(-.25,.3,-.5);
  left_eye.matrix.scale(0.18,0.1,0.18)
  left_eye.render();

  var nose = new Cube();
  //this.segments = 10;
  nose.matrix.set(M);
  nose.color = [0,0,0,1];
  nose.matrix.translate(0,0,-.6);
  nose.matrix.scale(0.13,0.1,0.18);
  nose.render();

  // var whisker1 = new Cone();
  // whisker1.color = [0.1, 0.1, 0.1, 1];
  // whisker1.matrix.set(nose.matrix);
  // whisker1.matrix.translate(.4,-.1,-.1);
  // whisker1.matrix.rotate(90, 0,0,1);
  // whisker1.matrix.rotate(g_drop/2, 1,0,0);
  // whisker1.matrix.scale(3,7,3);
  // whisker1.render();

  // var whisker2 = new Cone();
  // whisker2.color = [0.1, 0.1, 0.1, 1];
  // whisker2.matrix.set(nose.matrix);
  // whisker2.matrix.translate(.4,-.1,-.1);
  // whisker2.matrix.rotate(65, 0,0,1);
  // whisker2.matrix.rotate(g_drop/2, 1,0,0);
  // whisker2.matrix.scale(3,6.8,3);
  // whisker2.render();

  // var whisker3 = new Cone();
  // whisker3.color = [0.1, 0.1, 0.1, 1];
  // whisker3.matrix.set(nose.matrix);
  // whisker3.matrix.translate(.4,-.1,-.1);
  // whisker3.matrix.rotate(115, 0,0,1);
  // whisker3.matrix.rotate(g_drop/2, 1,0,0);
  // whisker3.matrix.scale(3,6.9,3);
  // whisker3.render();

  // var whisker4 = new Cone();
  // whisker4.color = [0.1, 0.1, 0.1, 1];
  // whisker4.matrix.set(nose.matrix);
  // whisker4.matrix.translate(.4,-.1,-.1);
  // whisker4.matrix.rotate(-90, 0,0,1);
  // whisker4.matrix.rotate(g_drop/2, 1,0,0);
  // whisker4.matrix.scale(3,7.1,3);
  // whisker4.render();

  // var whisker5 = new Cone();
  // whisker5.color = [0.1, 0.1, 0.1, 1];
  // whisker5.matrix.set(nose.matrix);
  // whisker5.matrix.translate(.4,-.1,-.1);
  // whisker5.matrix.rotate(-65, 0,0,1);
  // whisker5.matrix.rotate(g_drop/2, 1,0,0);
  // whisker5.matrix.scale(3,7.2,3);
  // whisker5.render();

  // var whisker6 = new Cone();
  // whisker6.color = [0.1, 0.1, 0.1, 1];
  // whisker6.matrix.set(nose.matrix);
  // whisker6.matrix.translate(.4,-.1,-.1);
  // whisker6.matrix.rotate(-115, 0,0,1);
  // whisker6.matrix.rotate(g_drop/2, 1,0,0);
  // whisker6.matrix.scale(3,6.9,3);
  // whisker6.render();

  // if(g_dripping) {
  //   var booger = new Cone();
  //   booger.color = [0.854, 0.990, 0.742, 0.89];
  //   booger.matrix.set(nose.matrix);
  //   booger.matrix.translate(.4,-.1,-.1);
  //   booger.matrix.translate(0,-g_drop,0);
  //   booger.matrix.scale(5,7,5);
  //   booger.render();
  // }

  // // RIGHT LEG
  var right_leg = new Cylinder();
  right_leg.segments=12;
  right_leg.color=[170/255, 166/255, 155/255, 1];
  right_leg.topScale = 0.5;
  right_leg.matrix.set(bottom);
  right_leg.matrix.translate(.08, -.04, -0.02);
  right_leg.matrix.rotate(10, 0,0,1);
  right_leg.matrix.rotate(-g_rLegAngle, 1,0,0);
  M.set(right_leg.matrix);
  right_leg.matrix.scale(1.2,0.53,1.2);
  //M.set(right_leg.matrix);
  right_leg.render();

  // // right ankle
  var r_ankle = new Cylinder();
  r_ankle.matrix.set(M);
  r_ankle.matrix.translate(-.01, -.19, 0);
  r_ankle.matrix.rotate(-8, 0,0,1);
  r_ankle.matrix.rotate(-g_lLowLegAngle, 1,0,0);
  M.set(r_ankle.matrix);
  r_ankle.matrix.scale(0.4,0.2,0.4);
  r_ankle.render();

  // // right shoe1
  var r_shoe = new Cube();
  r_shoe.color=[0,0,0,1];
  r_shoe.matrix.set(M);
  r_shoe.topScale=0.6;
  r_shoe.matrix.translate(0,-.14,0);
  r_shoe.matrix.rotate(-g_lFootAngle, 1,0,0);
  M.set(r_shoe.matrix);
  r_shoe.matrix.rotate(-90, 1,0,0);
  r_shoe.matrix.scale(0.14,0.10,0.12);
  r_shoe.render();

  // // right shoe2
  // var r_shoe2 = new Sphere();
  // r_shoe2.color=[0,0,0,1];
  // r_shoe2.segments=6;
  // r_shoe2.matrix.set(M);
  // r_shoe2.matrix.translate(0,-.03,-.01);
  // r_shoe2.matrix.scale(0.1,0.06,0.12);
  // r_shoe2.render();


  var left_leg = new Cylinder();
  left_leg.segments=12;
  left_leg.color=[170/255, 166/255, 155/255, 1];
  left_leg.topScale = 0.5;
  left_leg.matrix.set(bottom);
  left_leg.matrix.translate(-.08, -.04, -0.02);
  left_leg.matrix.rotate(-10, 0,0,1);
  left_leg.matrix.rotate(-g_lLegAngle, 1,0,0);
  M.set(left_leg.matrix);
  left_leg.matrix.scale(1.2,0.53,1.2);
  left_leg.render();

  var l_ankle = new Cylinder();
  l_ankle.matrix.set(M);
  l_ankle.matrix.translate(.01, -.19, 0);
  l_ankle.matrix.rotate(8, 0,0,1);
  l_ankle.matrix.rotate(-g_rLowLegAngle, 1,0,0);
  M.set(l_ankle.matrix);
  l_ankle.matrix.scale(0.4,0.2,0.4);
  l_ankle.render();

  var l_shoe = new Cube();
  l_shoe.color=[0,0,0,1];
  l_shoe.matrix.set(M);
  l_shoe.topScale=0.6;
  l_shoe.matrix.translate(0,-.14,0);
  l_shoe.matrix.rotate(-g_rFootAngle, 1,0,0);
  M.set(l_shoe.matrix);
  l_shoe.matrix.rotate(-90, 1,0,0);
  l_shoe.matrix.scale(0.14,0.10,0.12);
  l_shoe.render();

  // // right shoe1
  // var l_shoe2 = new Sphere();
  // l_shoe2.color=[0,0,0,1];
  // l_shoe2.segments=6;
  // l_shoe2.matrix.set(M);
  // l_shoe2.matrix.translate(0,-.03,-.01);
  // l_shoe2.matrix.scale(0.1,0.06,0.12);
  // l_shoe2.render();

  var duration = performance.now() - start_time;
  sendTextToHMTL("ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "fps");

}

function sendTextToHMTL(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if(!htmlElm) {
    console.log("Failed to get " + htmlID + "from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}
function drawKitty(){
  kitty = new Cat();
  g_shapesList.push(kitty);
  renderAllShapes();
}

// Controls for phone
let touchstartX = 0
let touchendX = 0
let touchstartY = 0;
let touchendY = 0;
    
function checkDirection() {
  g_globalAngleX += touchendX-touchstartX;
  g_globalAngleY += touchendY-touchstartY;
}

document.addEventListener('touchstart', e => {
  touchstartX = e.changedTouches[0].screenX
  checkDirection();
})

document.addEventListener('touchend', e => {
  touchendX = e.changedTouches[0].screenX
  checkDirection()
})

document.addEventListener('touchstart', e => {
  touchstartY = e.changedTouches[0].screenY
})

document.addEventListener('touchend', e => {
  touchendY = e.changedTouches[0].screenY
  checkDirection()
})