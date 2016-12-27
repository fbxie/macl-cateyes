export class Buffer{
    constructor(gl,data){
        
        this.data = data;
        this.gl=gl;
        this.DataBuffer = this.createBuffer();
        return this; 
    }

    createBuffer(){
        let gl = this.gl;
        let DataBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,DataBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.data),gl.STATIC_DRAW);
        return DataBuffer;
    }

    bind(buffer){
        let gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    };
}