class Star{
    constructor(){
      this.type='star';
      this.position = [0.0,0.0,0.0];
      this.color = [1.0,1.0,1.0,1.0];
      this.size = 5.0;
    }
  
    render() {
      var xy = this.position;
      var rgba = this.color;
      var size = this.size;

      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      // Draw
      var d = this.size/200.0; // delta

    
      let centerPt = [xy[0], xy[1]];
      drawTriangle
      let pt1 = [centerPt[0]+1.0*d, centerPt[1]];
      let pt2 = [centerPt[0]-1.0*d, centerPt[1]];
      let pt3 = [centerPt[0], centerPt[1]+2.0*d];

      drawTriangle([ pt1[0], pt1[1], pt3[0], pt3[1], pt2[0], pt2[1] ]);
      pt3=[pt2[0], pt2[1]-1.5*d]
      drawTriangle([pt1[0], pt1[1], pt3[0], pt3[1], pt2[0], pt2[1] ]);
      pt2=[pt1[0], pt3[1]];
      drawTriangle([pt3[0], pt3[1], pt1[0], pt1[1], pt2[0], pt2[1] ]);
      drawTriangle([pt1[0], pt1[1], pt1[0]+2.0*d, pt1[1], pt2[0], pt2[1]]);
      drawTriangle([ pt2[0], pt2[1], pt2[0], pt2[1]-2.0*d, pt2[0]-1.0*d, pt2[1] ]);
      drawTriangle([ pt3[0], pt3[1], pt2[0]-1.0*d, pt2[1], pt3[0], pt3[1]-2.0*d ]);
      drawTriangle([ pt3[0], pt3[1], pt2[0]-1.0*d, pt2[1], pt3[0], pt3[1]-2.0*d ]);
      pt2 = [centerPt[0]-1.0*d, centerPt[1]];
      drawTriangle([ pt2[0], pt2[1], pt3[0], pt3[1], pt2[0]-2.0*d, pt2[1]]);
    }
}
  