class Cone {
    constructor() {
      this.type = "cone";
      this.position = [0.0, 0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.size = 20.0;
      this.segments = 8;
      // layers: how many "rows" of triangles make up a half sphere
      this.layers = 3;
      //this.buffer = null;
      //this.vertices = null;
      this.matrix = new Matrix4();
    }
  
    render() {
      var xyz = this.position;
      var rgba = this.color;
      //var size = this.size;
  
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
      // Draw
      var d = this.size/200.0; // delta
  
      let angleStep=360/this.segments;

      for(var angle = 0, c=0; angle < 360; angle+=angleStep, ++c) {
        var f_light = 1-(c%5)*.02;
        gl.uniform4f(u_FragColor, rgba[0]*f_light, rgba[1]*f_light, rgba[2]*f_light, rgba[3]);

        let centerPt = [xyz[0], xyz[1], xyz[2]];
        let angle1=angle;
        let angle2=angle+angleStep;
        let vec1=[Math.cos(angle1*Math.PI/180)*d, Math.sin(angle1*Math.PI/180)*d]
        let vec2=[Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d]
        let pt1 = [centerPt[0]+vec1[0], centerPt[1]-1, centerPt[2]+vec1[1]];
        let pt2 = [centerPt[0]+vec2[0],centerPt[1]-1, centerPt[2]+vec2[1]];
  
        drawTriangle3D([ xyz[0], xyz[1], xyz[2], pt1[0], pt1[1], pt1[2], pt2[0], pt2[1],pt2[2] ]);
      }
  
    }
  
  //   generateVertices() {
      
  //     let [x, y, z] = this.position;
  //     let vertices = [];
  
  //     // var d = this.size / 200.0; // delta
  
  //     let v = [];
  //     // calculates angleStep for x&y coordinates
  //     let angleStep = 360 / this.segments;
  //     // calculates step for z coordinate
  //     let angleZStep = 90 / this.layers;
  //     for (var z_step = 0; z_step< this.layers; z_step++) {
  //       for (var xy_step = 0; xy_step < this.segments; xy_step++) {
  //         let centerPt = [x, y, z];
  //         let angle1 = step*angleStep;
  //         let angle2 = (step+1)*angleStep;
  //         let vec1 = [ 
  //           Math.cos((angle1 * Math.PI) / 180) * d,
  //           Math.sin((angle1 * Math.PI) / 180) * d,
  //           (z_step/this.layers) * d 
  //         ];
  //         let vec2 = [
  //           Math.cos((angle2 * Math.PI) / 180) * d,
  //           Math.sin((angle2 * Math.PI) / 180) * d,
  //           (z_step/this.layers) * d 
  //         ];
  //         let pt1 = [centerPt[0] + vec1[0], centerPt[1] + vec1[1], centerPt[2] + vec1[2]];
  //         let pt2 = [centerPt[0] + vec2[0], centerPt[1] + vec2[1], centerPt[2] + vec2[2]];
  //         v.push(x, y, z, pt1[0], pt1[1], pt1[2], pt2[0], pt2[1], pt2[2]);
  //       }
  //       this.vertices = new Float32Array(v);
  //     }
  //   }
  //   render(gl) {
  //     let rgba = this.color;
  
  //     //const uFragColor = gl.getUniformLocation(gl.program, "uFragColor");
  //     //const aPosition = gl.getAttribLocation(gl.program, "aPosition");
  
  //     // Pass the color of a point to uFragColor variable
  //     gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  //     //gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
  //     // Draw
  
  //     //      let vertices = [x, y, pt1[0], pt1[1], pt2[0], pt2[1]];
  //     if (this.vertices === null) {
  //       this.generateVertices();
  //     }
  //     // Create a buffer object
  //     if (this.buffer === null) {
  //       this.buffer = gl.createBuffer();
  //       if (!this.buffer) {
  //         console.log("Failed to create the buffer object");
  //         return -1;
  //       }
  //     }
  
  //     // Bind the buffer object to target
  //     gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
  
  //     // Write date into the buffer object
  //     gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
  
  //     // Assign the buffer object to aPosition variable
  //     gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
  
  //     // Enable the assignment to aPosition variable
  //     gl.enableVertexAttribArray(aPosition);
  
  //     gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
  
  //   }
  }
  