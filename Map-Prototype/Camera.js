class Camera{
    constructor(aspectRatio, near, far){
        this.type="camera";
        this.fov=60.0;
        this.eye=new Vector3([0,0,0]);
        this.at=new Vector3([0,0,-1]);
        this.up=new Vector3([0,1,0]);

        this.viewMatrix = new Matrix4();
        this.updateView();

        this.projMatrix = new Matrix4();
        this.projMatrix.setPerspective(this.fov, canvas.width/canvas.height, .1, 1000); // 90 degrees wide, aspect, near plane .1, far 100
        this.speed=0.5;
        this.alpha=10;
    }
    
    updateView(){
        this.viewMatrix.setLookAt(
            this.eye.elements[0],this.eye.elements[1],this.eye.elements[2], 
            this.at.elements[0],this.at.elements[1],this.at.elements[2],
            this.up.elements[0],this.up.elements[1],this.up.elements[2]); 
    }

    moveForward() {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        f.mul(this.speed);
        this.at=this.at.add(f);
        this.eye=this.eye.add(f);
    }

    moveBack() {
        var b = new Vector3();
        b.set(this.at);
        b.sub(this.eye);
        b.normalize();
        b.mul(this.speed);
        this.at=this.at.sub(b);
        this.eye=this.eye.sub(b);
    }

    moveLeft() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        var s = new Vector3();
        s = Vector3.cross(this.up, f);
        // s.set(this.up);
        // s.cross(f);
        s.normalize();
        s.mul(this.speed);
        this.at=this.at.add(s);
        this.eye=this.eye.add(s);
    }

    moveRight() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let s = Vector3.cross(f, this.up);
        // var s = new Vector3();
        // s = Vector3.cross(f, this.up);
        // s.set(f);
        // s.cross(this.up);
        s.normalize();
        s.mul(this.speed);
        this.at.add(s);
        this.eye.add(s);
        console.log("hi");
    }

    panLeft() {
        let f = new Vector3();
        let m = new Matrix4();
        m.setIdentity();
        f.set(this.at);
        f.sub(this.eye);
        m.setRotate(this.alpha,this.up.elements[0],this.up.elements[1],this.up.elements[2]);
        let f_prime = m.multiplyVector3(f);
        this.at.set(this.eye).add(f_prime);
    }

    panRight() {
        let f = new Vector3();
        let m = new Matrix4();
        m.setIdentity();
        f.set(this.at);
        f.sub(this.eye);
        m.setRotate(-this.alpha,this.up.elements[0],this.up.elements[1],this.up.elements[2]);
        let f_prime = m.multiplyVector3(f);
        this.at.set(this.eye).add(f_prime);
    }

    panMouse(posi) {
        let f = new Vector3();
        let m = new Matrix4();
        m.setIdentity();
        f.set(this.at);
        f.sub(this.eye);
        m.setRotate(posi*this.alpha,this.up.elements[0],this.up.elements[1],this.up.elements[2]);
        let f_prime = m.multiplyVector3(f);
        this.at.set(this.eye).add(f_prime);
    }
}