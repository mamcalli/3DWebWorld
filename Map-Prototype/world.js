
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;

  // ch 10
  // uniform mat4 u_NormalMatrix;
  // attribute vec4 a_Normal;

  void main() {
    // ch 10
    //vec3 lightDirection = vec3(-0.35, 0.35, 0.87);
    //vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
    //float nDotL = max(dot(normal, lightDirection), 0.0);


    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;

  uniform int u_whichTexture;
  uniform float u_texColorWeight;
  void main() {

    if(u_whichTexture == -3) {
      vec4 texColor = texture2D(u_Sampler0, v_UV);
      vec4 baseColor = vec4(0,1,0,1);
      float t = u_texColorWeight;
      //float t=0.8;
      gl_FragColor = (1.0-t)*baseColor + t*texColor;
    } else if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV,1.0,1.0);
    } else if ( u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    } else if (u_whichTexture == 2) {
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    } else if (u_whichTexture == 3) {
      gl_FragColor = texture2D(u_Sampler3, v_UV);
    } else {
      gl_FragColor = vec4(1,.2,.2,1);
    }
  }`

// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;

let u_GlobalRotateMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;
let u_whichTexture;
let u_texColorWeight;
let g_camera;
let u_NormalMatrix;

// Global UI variables
let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_selectedSize=5;
let g_segments = 10;
let g_globalAngle=0;
let g_globalAngleX=0;
let g_globalAngleY=0;
let g_onLEdge=false;
let g_onREdge=false;
let g_mouseOn=true;
function setupWebGL(){
  // retrieve canvas element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
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
  if(!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if(!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  // get the storage location for u_Sampler
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if(!u_Sampler0) {
    console.log('failed to get the storage location of u_Sampler0');
    return false;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if(!u_Sampler1) {
    console.log('failed to get the storage location of u_Sampler1');
    return false;
  }

  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');

  if(!u_Sampler2 || !u_Sampler3) {
    console.log('failed to get the storage location of u_Sampler');
    return false;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if(!u_whichTexture) {
    console.log('failed to get the storage location of u_whichTexture');
    return false;
  }

  u_texColorWeight = gl.getUniformLocation(gl.program, 'u_texColorWeight');
  if(!u_texColorWeight) {
    console.log('failed to get the storage location of u_texColorWeight');
    return false;
  }

  // set initial value for matrix to identity
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  
  // ch 10
  // a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');

  // u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');

  // if(a_Normal < 0 || !u_NormalMatrix) {
  //   console.log('error fetching normal');
  // }
}

// Set up actions for HTML UI elements
function addActionsForHtmlUI(){
  document.getElementById("toggleMouse").onclick = function() { g_mouseOn ? g_mouseOn = false : g_mouseOn = true  };
}

// from the book:3
function initTextures() {
  // create image object
  var image1 = new Image();
  var image2 = new Image();
  var image3 = new Image();
  var image4 = new Image();


  if(!image1 || !image2 || !image3 || !image4){
    console.log('Failed to create the image object');
    return false;
  }
  // register the event handler to be called on loading an image
  image1.onload = function(){ sendImageToTEXTURE0(image1, u_Sampler0, 0); };
  image2.onload = function(){ sendImageToTEXTURE0(image2, u_Sampler1, 1); };
  image3.onload = function(){ sendImageToTEXTURE0(image3, u_Sampler2, 2); };
  image4.onload = function(){ sendImageToTEXTURE0(image4, u_Sampler3, 3); };


  // tell browser to load image
  image1.src = "sky.jpg";
  image2.src = "wall1.jpg";
  image3.src = "leaves.jpg";
  image4.src = "silver.jpg";

  // Can add more loading here
  return true;
}

// Load Texture Function from Textbook/ Prof. vids
function sendImageToTEXTURE0(image, u_Sampler, tex_num) {
  // create a texture object
  var texture = gl.createTexture();
  if(!texture) {
    console.log('failed to create the texture object');
    return false;
  }

  // flip image y axis
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  // enable texture unit0
  if(tex_num==0) {
    gl.activeTexture(gl.TEXTURE0);
  } else if (tex_num==1) {
    gl.activeTexture(gl.TEXTURE1);
  } else if (tex_num==2) {
    gl.activeTexture(gl.TEXTURE2);
  } else if (tex_num==3) {
    gl.activeTexture(gl.TEXTURE3);
  }
  // bind texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // set texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // set texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // set texture unit - to sampler
  gl.uniform1i(u_Sampler, tex_num);

  console.log('finished loadTexture');
}

var model;
function main() {
  // Set up canvas and GL variables
  setupWebGL();
  // Set up GLSL shader programs, connect JavaScript Variables with GLSL variables
  connectToGLSL();
  // Set up actions for HTML UI elements
  addActionsForHtmlUI();
  // initialize textures
  initTextures('sky.jpg');

  // model = initVertexBuffers(gl, gl.program);
  // if (!model) {
  //   console.log('Failed to set the vertex information');
  //   return;
  // }

  // readOBJFile('hat.obj', gl, model, 60, true);


  // Register function (event handler) to be called on a mouse press
  g_camera = new Camera(canvas.width/canvas.height, 0.1, 1000);
  document.onkeydown = function(ev){keydown(ev);};

  canvas.onmousedown = click;
    
  canvas.onmousemove = function(ev) { if(g_mouseOn){mouseRotate(ev)} };
  //canvas.onmousemove = function(ev){console.log("mouse location:", convertCoordsToGL(ev))}
  

  // Specify the color for clearing <canvas>
  gl.clearColor(0.770, 0.9, 1.0, 1);


  requestAnimationFrame(tick);
}

var g_startTime=performance.now()/1000.0;
var g_seconds=performance.now()/1000.0 - g_startTime;
function tick() {
  g_seconds=performance.now()/1000-g_startTime;

  if(g_mouseOn){
    if(g_onLEdge) {
      g_camera.panMouse(0.1);
    } else if (g_onREdge) {
      g_camera.panMouse(-0.1);
    }
  }
  //updateAnimationAngles();
  renderAllShapes();
  g_camera.updateView();
  requestAnimationFrame(tick);
}

function keydown(ev) {
  switch(ev.keyCode) {
    case 65: // a key
      g_camera.moveLeft();
      g_camera.updateView();
      break;
    case 68: // d key
      g_camera.moveRight();
      g_camera.updateView();
      break;
    case 83: // s key
      g_camera.moveBack();
      g_camera.updateView();
      //g_camera.eye.elements[2] -= .01;
      break;
    case 87: //w key pressed
      g_camera.moveForward();
      g_camera.updateView();
      //g_camera.eye.elements[2] += .01;
      break;
    case 69:
      g_camera.panRight();
      g_camera.updateView();
      break;
    case 81:
      g_camera.panLeft();
      g_camera.updateView();
      break;
    default:
      break;
  }
  //g_camera.updateView();

  //console.log(ev.keyCode);

  //sendImageToTEXTURE0("sky.jpg"); 
  // if(ev.keyCode==39) {
  //   g_eye[0]-=0.2;
  // } else if (ev.keyCode==37) {
  //   g_eye[0]+=0.2;
  // }
  //renderAllShapes();
  //console.log("eye:", g_camera.eye.elements);

  console.log(ev.keyCode);
}

let prev_mouse = [0,0];
function mouseRotate(ev) {
  let curr_mouse = convertCoordsToGL(ev);
  if(curr_mouse[0]<=(-0.92)) {
    g_onLEdge=true;
  } else if(curr_mouse[0]>=(0.92)){
    g_onREdge=true;
  }else {
    console.log('off edge')
    g_onLEdge=false;
    g_onREdge=false;
  }
  // while(curr_mouse[0]<(-.95)) {
  //   g_camera.panMouse(curr_mouse[0]);
  //   g_camera.updateView();
  // }
  
  g_camera.panMouse(prev_mouse[0]-curr_mouse[0]);

  g_camera.updateView();
 prev_mouse = convertCoordsToGL(ev);
}

function click(ev) {
  // if (ev.shiftKey) {
  //   g_clickAnimate = true;
  // }
  console.log("eye:", g_camera.eye.elements);
  console.log("at:", g_camera.at.elements);
  console.log("up:", g_camera.up.elements);

  let eye_x = g_camera.eye.elements[0];
  let eye_z = g_camera.eye.elements[2];
  let at_x = g_camera.at.elements[0] - eye_x;
  let at_z = g_camera.at.elements[2] - eye_z;
  if(ev.which==1) {
    if((at_x>=-.5) && (at_x<=.5) && (at_z>=-1.5) && (at_z<=(-.5))) {
      let loc=[(eye_x), Math.round(eye_z)-2];
      place_map.push(loc);
    } else if ((at_x>=-.5) && (at_x<=.5) && (at_z>=.5) && (at_z<=(1.5))) {
      let loc=[(eye_x), Math.round(eye_z)+2];
      place_map.push(loc);
    } else if ((at_x>=-1.5) && (at_x<=-.5) && (at_z>=-.5) && (at_z<=5)) {
      let loc=[Math.round(eye_x) -2, (eye_z)];
      place_map.push(loc);
    } else if ((at_x>=.5) && (at_x<=1.5) && (at_z>=-.5) && (at_z<=5)) {
      let loc=[Math.round(eye_x) +2, (eye_z)];
      place_map.push(loc);
    }
  } else if (ev.which==3) {
    let loc=[];
    if((at_x>=-.5) && (at_x<=.5) && (at_z>=-1.5) && (at_z<=(-.5))) {
      loc=[(eye_x), Math.round(eye_z)-2];

    } else if ((at_x>=-.5) && (at_x<=.5) && (at_z>=.5) && (at_z<=(1.5))) {
      loc=[(eye_x), Math.round(eye_z)+2];

    } else if ((at_x>=-1.5) && (at_x<=-.5) && (at_z>=-.5) && (at_z<=5)) {
      loc=[Math.round(eye_x) -2, (eye_z)];
      
    } else if ((at_x>=.5) && (at_x<=1.5) && (at_z>=-.5) && (at_z<=5)) {
      loc=[Math.round(eye_x) +2, (eye_z)];
      
    }
    console.log(loc);
    console.log(place_map);
    //console.log('find', place_map.indexOf(loc));

    for(i=0; i<place_map.length; ++i) {
      if( (loc[0]==place_map[i][0]) && loc[1]==place_map[i][1] ) {
        place_map.splice(i,1);
      }
    }
  }
  //renderAllShapes();
}

function convertCoordsToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

function renderAllShapes(){
  var start_time = performance.now();

  // pass projection matrix
  // var projMat = new Matrix4();
  // projMat.setPerspective(60, canvas.width/canvas.height, .1, 100); // 90 degrees wide, aspect, near plane .1, far 100
  //gl.uniformMatrix4fv(u_ProjectionMatrix, false, g_camera.projMatrix.elements);

  // pass view matrix
  // var viewMat=new Matrix4();
  // viewMat.setLookAt(g_eye[0],g_eye[1],g_eye[2], g_at[0],g_at[1],g_at[2], g_up[0],g_up[1],g_up[2]); // eye, at, up)
  //viewMat.setLookAt(0,0,3,  0,0,-100,  0,1,0); // eye, at, up)
  //gl.uniformMatrix4fv(u_ViewMatrix, false, g_camera.viewMatrix.elements);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, g_camera.projMatrix.elements);
  
  // set global rotation matrix
  var globalRotMat = new Matrix4().rotate(g_globalAngle,0,1,0);
  globalRotMat.rotate(-g_globalAngleX, 0,1,0);
  globalRotMat.rotate(-g_globalAngleY, 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  
  gl.uniformMatrix4fv(u_ViewMatrix, false, g_camera.viewMatrix.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //draw(gl, 0, model, u_NormalMatrix);

  // FLOOR
  var floor = new Cube();
  floor.color = [.4,0.4,0.4,1.0];
  //floor.textureNum=0;
  floor.matrix.translate(0,-.70,0);
  floor.matrix.scale(32,0,32);
  //floor.matrix.translate(-.5,0,-.5);
  floor.render();

  // SKY
  var sky = new Cube();
  sky.textureNum=0;
  sky.matrix.scale(100,100,100);
  sky.render();

  // walls = [];
  let w = new Cube();
  for (x = 0; x<32; ++x) {
    for (z = 0; z<32; ++z){ 
      if (map[x][z] == 1) {
        w.textureNum=3;
        w.matrix.setIdentity();
        w.matrix.translate(x-16, -.3, z-16);
        w.matrix.scale(1,3,1);
        //walls.push(w); x
        w.render();
      } else if (map[x][z]==2) {
        w.matrix.setIdentity();
        w.textureNum=2;
        w.matrix.translate(x-16, -.3, z-16);
        w.matrix.scale(2,3,2);
        w.render();
      }
    }
  }


  // outer walls
  let w2 = new Cube();
  w.textureNum=1;
  w2.textureNum=1
  for(y=0; y<4; y+=2) {
    for(i=-16; i<17; i+=2) {
      w.matrix.setIdentity();
      w2.matrix.setIdentity();
      w.matrix.translate(-16, -.3+y, i);
      w.matrix.scale(.1,2,2);
      w.render();
      w.matrix.translate(320,0,0);
      w.render();
      w2.matrix.translate(i,-.3+y,-16);
      w2.matrix.scale(2,2,.1);
      w2.render();
      w2.matrix.translate(0,0,320);
      w2.render();
    }
  }

  for(i=0; i < place_map.length; ++i) {
    w.matrix.setIdentity();
    w.matrix.translate(place_map[i][0], -.3, place_map[i][1]);
    w.render();
  }

  // lil guy
  drawKitty();


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

  let g_bodyAngle=180;

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

  let g_earWiggle = 0;

  var M = new Matrix4();

  var top_body = new Cube();
  top_body.textureNum=-2;
  top_body.color = [.099, .088, .11, 1];
  top_body.topScale = 0.60;
  top_body.bottomScale = 1.2;
  top_body.matrix.setTranslate(0, 0, -5);
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
  bottom_body.matrix.setTranslate(0, -.25, -5);
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
  head.matrix.translate(0,0.26, -5);
  head.matrix.rotate(180, 0,1,0);
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
}
