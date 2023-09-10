class Cylinder{
    constructor(){
      this.type='cylinder';
      this.position = [0.0,0.0,0.0];
      this.color = [1.0,1.0,1.0,1.0];
      this.size = 20.0;
      this.segments = 10;
      this.matrix = new Matrix4();
      this.topScale = 1; // used if we want the top to be thinner
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
      var s = this.topScale;
      var v=[];
      let angleStep=360/this.segments;
      for(var angle = 0, c=0; angle < 360; angle+=angleStep, ++c) {
        var f_light = 1+(c%5)*.01;
        gl.uniform4f(u_FragColor, rgba[0]*f_light, rgba[1]*f_light, rgba[2]*f_light, rgba[3]);

        let centerPt = [xyz[0], xyz[1], xyz[2]];
        let angle1=angle;
        let angle2=angle+angleStep;
        let vec1=[Math.cos(angle1*Math.PI/180)*d, Math.sin(angle1*Math.PI/180)*d]
        let vec2=[Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d]
        let pt1 = [centerPt[0]+vec1[0], xyz[1], centerPt[2]+vec1[1]];
        let pt2 = [centerPt[0]+vec2[0], xyz[1], centerPt[2]+vec2[1]];
        // top triangle
        drawTriangle3D([ xyz[0],xyz[1],xyz[2],  pt1[0]*s,pt1[1],pt1[2]*s,  pt2[0]*s,pt2[1]*s,pt2[2]*s]);
        // side along triangle edge
        drawTriangle3D( [pt1[0]*s, pt1[1], pt1[2]*s,  pt2[0]*s,pt2[1],pt2[2]*s,  pt1[0],pt1[1]-.5,pt1[2]] );
        drawTriangle3D( [pt1[0],pt1[1]-.5,pt1[2],  pt2[0]*s,pt2[1],pt2[2]*s,  pt2[0],pt2[1]-.5,pt2[2]] );
        drawTriangle3D( [ xyz[0], xyz[1]-.5, xyz[2], pt1[0], pt1[1]-.5, pt1[2], pt2[0], pt2[1]-.5,pt2[2] ] );


        //v.push( pt1[0], pt1[1], pt1[2], pt2[0], pt2[1], pt2[2] );
      }
    // front of cube
    drawTriangle3D( [v[0], v[1], v[2],  v[3],v[4],v[5],  v[0], v[1]-.5, v[2],] );
    //drawTriangle3D( [0,0,0,  0,1,0,  1,1,0] );

    // back
    //drawTriangle3D( [0,0,1,  1,1,1,  1,0,1] );
    //drawTriangle3D( [0,0,1,  0,1,1,  1,1,1] );
    // fake lighting
    // pass color of pt to u_FragColor uniform var
    // top
    //gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
    //drawTriangle3D( [0,1,0,  0,1,1,  1,1,1] );
    //drawTriangle3D( [0,1,0,  1,1,1,  1,1,0] );

    // bottom
    //gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
    //drawTriangle3D( [0,0,0, 0,0,1, 1,0,1] );
    //drawTriangle3D( [0,0,0, 1,0,1, 1,0,0] );

    //right side
    //gl.uniform4f(u_FragColor, rgba[0]*.95, rgba[1]*.95, rgba[2]*.95, rgba[3]);
    //drawTriangle3D( [1,0,0, 1,1,0, 1,1,1] );
    //drawTriangle3D( [1,0,0, 1,1,1, 1,0,1]);
    // other sides: top, bottom, left, right, back

    //left side
    //drawTriangle3D( [0,0,0, 0,1,0, 0,1,1] );
    //drawTriangle3D( [0,0,0, 0,1,1, 0,0,1] );


    }
  
  }