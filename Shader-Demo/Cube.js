class Cube{
    constructor(){
      this.type='cube';
      this.position = [0.0,0.0,0.0];
      this.color = [1.0,1.0,1.0,1.0];
      this.size = 0.5;
      //this.segments = 10;
      this.matrix = new Matrix4();
      //this.normalMatrix = new Matrix4();
      this.topScale = 1;
      this.bottomScale = 1;
      this.textureNum=-2;
    }
  
  render(M) {
    //var xy = this.position;
    var rgba = this.color;
    //var size = this.size;

    // pass texture number
    gl.uniform1i(u_whichTexture, this.textureNum);

    // Pass the color of a point to u_FragColor uniform variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // pass matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    var s = this.size;
    var t = this.topScale;
    var b = this.bottomScale;
    
    // front
    // [0,0,0,  1,1,0,  1,0,0]
    // [0,0,0,  0,1,0,  1,1,0]
    drawTriangle3DUVNormal( [-s*b,-s,-s*b,  s*t,s,-s*t,  s*b,-s,-s*b], [0,0, 1,1, 1,0], [0,0,-1,  0,0,-1,  0,0,-1]);
    drawTriangle3DUVNormal( [-s*b,-s,-s*b,  -s*t,s,-s*t,  s*t,s,-s*t], [0,0, 0,1, 1,1], [0,0,-1,  0,0,-1,  0,0,-1] );

    // back
    // [0,0,1,  1,1,1,  1,0,1]
    // [0,0,1,  0,1,1,  1,1,1]
    drawTriangle3DUVNormal( [-s*b,-s,s*b,  s*t,s,s*t,  s*b,-s,s*b], [0,0, 1,1, 1,0], [0,0,1,  0,0,1,  0,0,1]);
    drawTriangle3DUVNormal( [-s*b,-s,s*b,  -s*t,s,s*t,  s*t,s,s*t], [0,0, 0,1, 1,1], [0,0,1,  0,0,1,  0,0,1]);

    // fake lighting
    // pass color of pt to u_FragColor uniform var
    // top
    // [0,1,0,  0,1,1,  1,1,1]
    // [0,1,0,  1,1,1,  1,1,0]
    //gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
    drawTriangle3DUVNormal( [-s*t,s,-s*t,  -s*t,s,s*t,  s*t,s,s*t], [0,0, 0,1, 1,1], 
      [0,1,0, 0,1,0, 0,1,0]);
    drawTriangle3DUVNormal( [-s*t,s,-s*t,  s*t,s,s*t,  s*t,s,-s*t], [0,0, 1,1, 1,0], 
      [0,1,0, 0,1,0, 0,1,0]);

    // bottom
    //gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
    // [0,0,0,  0,0,1,  1,0,1]
    // [0,0,0, 1,0,1, 1,0,0]
    drawTriangle3DUVNormal( [-s*b,-s,-s*b, -s*b,-s,s*b, s*b,-s,s*b], [0,0, 0,1, 1,1],
      [0,-1,0,  0,-1,0,  0,-1,0] );
    drawTriangle3DUVNormal( [-s*b,-s,-s*b, s*b,-s,s*b, s*b,-s,-s*b], [0,0, 1,1, 1,0],
      [0,-1,0,  0,-1,0,  0,-1,0] );

    //right side
    // [1,0,0,  1,1,0,  1,1,1]
    // [1,0,0,  1,1,1,  1,0,1]
    //gl.uniform4f(u_FragColor, rgba[0]*.95, rgba[1]*.95, rgba[2]*.95, rgba[3]);
    drawTriangle3DUVNormal( [s*b,-s,-s*b, s*t,s,-s*t, s*t,s,s*t], [1,0, 1,1, 0,1], 
      [1,0,0,  1,0,0,  1,0,0] );
    drawTriangle3DUVNormal( [s*b,-s,-s*b, s*t,s,s*t, s*b,-s,s*b], [1,0, 0,1, 0,0], 
      [1,0,0,  1,0,0,  1,0,0] );
    // other sides: top, bottom, left, right, back

    //left side
    // [0,0,0,  0,1,0,  0,1,1]
    // [0,0,0,  0,1,1,  0,0,1]
    drawTriangle3DUVNormal( [-s*b,-s,-s*b, -s*t,s,-s*t, -s*t,s,s*t], [1,0, 1,1, 0,1], 
      [-1,0,0,  -1,0,0,  -1,0,0] );
    drawTriangle3DUVNormal( [-s*b,-s,-s*b, -s*t,s,s*t, -s*b,-s,s*b], [1,0, 0,1, 0,0],
      [-1,0,0,  -1,0,0, -1,0,0] );

    M*=this.matrix

    }
  
  }

      // // back
      // drawTriangle3D( [0,0,1*b,  1*t,1,1*t,  1*b,0,1*b] );
      // drawTriangle3D( [0,0,1*b,  0,1,1*t,  1*t,1,1*t] );
      // // fake lighting
      // // pass color of pt to u_FragColor uniform var
      // // top
      // gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
      // drawTriangle3D( [0,1,0,  0,1,1*t,  1*t,1,1*t] );
      // drawTriangle3D( [0,1,0,  1*t,1,1*t,  1*t,1,0] );
  
      // // bottom
      // //gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
      // drawTriangle3D( [0,0,0, 0,0,1*b, 1*b,0,1*b] );
      // drawTriangle3D( [0,0,0, 1*b,0,1*b, 1*b,0,0] );
  
      // //right side
      // gl.uniform4f(u_FragColor, rgba[0]*.95, rgba[1]*.95, rgba[2]*.95, rgba[3]);
      // drawTriangle3D( [1*b,0,0, 1*t,1,0, 1*t,1,1*t] );
      // drawTriangle3D( [1*b,0,0, 1*t,1,1*t, 1*b,0,1*b]);
      // // other sides: top, bottom, left, right, back
  
      // //left side
      // drawTriangle3D( [0,0,0, 0,1,0, 0,1,1*t] );
      // drawTriangle3D( [0,0,0, 0,1,1*t, 0,0,1*b] );