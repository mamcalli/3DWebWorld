class Cube{
    constructor(){
      this.type='cube';
      this.position = [0.0,0.0,0.0];
      this.color = [1.0,1.0,1.0,1.0];
      this.size = 0.5;
      //this.segments = 10;
      this.matrix = new Matrix4();
      this.topScale = 1;
      this.bottomScale = 1;
    }
  
  render(M) {
    //var xy = this.position;
    var rgba = this.color;
    //var size = this.size;

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    var s = this.size;
    var t = this.topScale;
    var b = this.bottomScale;
    
    // front
    drawTriangle3D( [-s*b,-s,-s*b,  s*t,s,-s*t,  s*b,-s,-s*b] );
    drawTriangle3D( [-s*b,-s,-s*b,  -s*t,s,-s*t,  s*t,s,-s*t] );

    // back
    drawTriangle3D( [-s*b,-s,s*b,  s*t,s,s*t,  s*b,-s,s*b] );
    drawTriangle3D( [-s*b,-s,s*b,  -s*t,s,s*t,  s*t,s,s*t] );
    // fake lighting
    // pass color of pt to u_FragColor uniform var
    // top
    gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
    drawTriangle3D( [-s*t,s,-s*t,  -s*t,s,s*t,  s*t,s,s*t] );
    drawTriangle3D( [-s*t,s,-s*t,  s*t,s,s*t,  s*t,s,-s*t] );

    // bottom
    //gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
    drawTriangle3D( [-s*b,-s,-s*b, -s*b,-s,s*b, s*b,-s,s*b] );
    drawTriangle3D( [-s*b,-s,-s*b, s*b,-s,s*b, s*b,-s,-s*b] );

    //right side
    gl.uniform4f(u_FragColor, rgba[0]*.95, rgba[1]*.95, rgba[2]*.95, rgba[3]);
    drawTriangle3D( [s*b,-s,-s*b, s*t,s,-s*t, s*t,s,s*t] );
    drawTriangle3D( [s*b,-s,-s*b, s*t,s,s*t, s*b,-s,s*b]);
    // other sides: top, bottom, left, right, back

    //left side
    drawTriangle3D( [-s*b,-s,-s*b, -s*t,s,-s*t, -s*t,s,s*t] );
    drawTriangle3D( [-s*b,-s,-s*b, -s*t,s,s*t, -s*b,-s,s*b] );

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