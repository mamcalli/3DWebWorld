class Sphere {
  constructor() {
    this.type = "sphere";
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 5.0;
    this.segments = 13;
    this.matrix = new Matrix4();
    this.buffer=null;
    this.vertices=null;
    this.indices=null;
  }



  render() {
    var rgba = this.color;

    // Pass the color of a point to uFragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // Draw

    if (this.vertices === null) {
      this.generateVertices();
    }
    // Create a buffer object
    if (this.buffer === null) {
      this.buffer = gl.createBuffer();
      if (!this.buffer) {
        console.log("Failed to create the buffer object");
        return -1;
      }
    }

    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
      console.log("Failed to create the buffer object");
      return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);

    // Assign the buffer object to aPosition variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to aPosition variable
    gl.enableVertexAttribArray(a_Position);

    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    //gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 2);
  }

  generateVertices() {

    // Generate coordinate  var SPHERE_DIV = 13;
    var SPHERE_DIV = this.segments;
    var i, ai, si, ci;
    var j, aj, sj, cj;
    var p1, p2;

    var positions = [];
    var ind = [];

    for (j = 0; j <= SPHERE_DIV; j++) {
      aj = j * Math.PI / SPHERE_DIV;
      sj = Math.sin(aj);
      cj = Math.cos(aj);
      for (i = 0; i <= SPHERE_DIV; i++) {
        ai = i * 2 * Math.PI / SPHERE_DIV;
        si = Math.sin(ai);
        ci = Math.cos(ai);

        positions.push(si * sj);  // X
        positions.push(cj);       // Y
        positions.push(ci * sj);  // Z
      }
    }
    this.vertices = new Float32Array(positions);

      // Generate indices
    for (j = 0; j < SPHERE_DIV; j++) {
      for (i = 0; i < SPHERE_DIV; i++) {
        p1 = j * (SPHERE_DIV+1) + i;
        p2 = p1 + (SPHERE_DIV+1);

        ind.push(p1);
        ind.push(p2);
        ind.push(p1 + 1);

        ind.push(p1 + 1);
        ind.push(p2);
        ind.push(p2 + 1);
      }
    }
    this.indices = new Uint16Array(ind);
  }

}

