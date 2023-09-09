class Triangle{
  constructor(){
    this.type='triangle';
    this.position=[0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 5.0;

    this.buffer = null;
    //this.uv_buffer=null;
  }

  render() {
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the size of a point to u_Size
    gl.uniform1f(u_Size, size);
    // Draw
    var d = this.size/200.0;  // delta
    drawTriangle( [xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d] );
  }

}

function drawTriangle(vertices) {
    var n = 3; // # of vertices
  
    // Create a buffer object
    if( this.buffer == null) {
      this.buffer = gl.createBuffer();
      if (!this.buffer) {
        console.log('Failed to create the buffer object');
        return -1;
      }
    }
  
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  
    // var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    // if (a_Position < 0) {
    //   console.log('Failed to get the storage location of a_Position');
    //   return -1;
    // }

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
  
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
}
  
function drawTriangle3D(vertices) {
  var n = 3; // # of vertices

  // Create a buffer object
  // Create a buffer object
  if( this.buffer == null) {
    this.buffer = gl.createBuffer();
    if (!this.buffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  // if (a_Position < 0) {
  //   console.log('Failed to get the storage location of a_Position');
  //   return -1;
  // }

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);
}

function drawTriangle3DUV(vertices, uv) {
  var n = 3; // # of vertices

  // Create a buffer object
  if( this.buffer == null) {
    this.buffer = gl.createBuffer();
    if (!this.buffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  // if( this.uv_buffer === null) {
  //   this.uv_buffer = gl.createBuffer();
  //   if (!this.uv_buffer) {
  //     console.log('Failed to create the UV buffer object');
  //     return -1;
  //   }
  // }

    var uv_buffer = gl.createBuffer();
    if (!uv_buffer) {
      console.log('Failed to create the UV buffer object');
      return -1;
    }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_UV);

  //gl.drawArrays(gl.TRIANGLES, 0, n);
  gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);

  g_vertexBuffer=null;
}

function drawTriangle3DUVNormal(vertices, uv, normals) {
  var n = vertices.length/3; // # of vertices

  // Create a buffer object
  if( this.buffer == null) {
    this.buffer = gl.createBuffer();
    if (!this.buffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  // if( this.uv_buffer === null) {
  //   this.uv_buffer = gl.createBuffer();
  //   if (!this.uv_buffer) {
  //     console.log('Failed to create the UV buffer object');
  //     return -1;
  //   }
  // }

    var uv_buffer = gl.createBuffer();
    if (!uv_buffer) {
      console.log('Failed to create the UV buffer object');
      return -1;
    }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_UV);

  var normalBuffer = gl.createBuffer();
  if(!normalBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

 // Bind the buffer object to target
 gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
 // Write date into the buffer object
 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);
 // Assign the buffer object to a_Position variable
 gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);

 // Enable the assignment to a_Position variable
 gl.enableVertexAttribArray(a_Normal);

  //gl.drawArrays(gl.TRIANGLES, 0, n);
  gl.drawArrays(gl.TRIANGLES, 0, n);

  g_vertexBuffer=null;
}
