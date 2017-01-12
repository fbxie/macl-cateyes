export default class Base {
    gl = {};
    vshader = {};
    fshader = {};
    program = {};

    constructor(gl, vshader, fshader) {
        this.gl = gl;
        this.vshader = vshader;
        this.fshader = fshader;

        
        return this;
    }
    initShader(gl){
        this.gl = gl;
        this.program = Base.createProgram(this.gl, this.vshader, this.fshader);
        if (!this.program) {
            console.log('Failed to create program');
            return null;
        }

        gl.useProgram(this.program);
        gl.program = this.program;

        return this.program;
    }

    static createProgram(gl,vshader,fshader){
        // Create shader object
        let vertexShader = Base.loadShader(gl, gl.VERTEX_SHADER, vshader);
        let fragmentShader = Base.loadShader(gl, gl.FRAGMENT_SHADER, fshader);
        
        if (!vertexShader || !fragmentShader) {
            return null;
        }

        // Create a program object
        let program = gl.createProgram();
        if (!program) {
            return null;
        }

        // Attach the shader objects
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        // Link the program object
        gl.linkProgram(program);

        // Check the result of linking
        let linked = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!linked) {
            let error = gl.getProgramInfoLog(program);
            console.log('Failed to link program: ' + error);
            gl.deleteProgram(program);
            gl.deleteShader(fragmentShader);
            gl.deleteShader(vertexShader);
            return null;
        }
        return program;
    }

    static loadShader(gl, type , source){
          // Create shader object
        let shader = gl.createShader(type);
        if (shader == null) {
            console.log('unable to create shader');
            return null;
        }

        // Set the shader program
        gl.shaderSource(shader, source);

        // Compile the shader
        gl.compileShader(shader);

        // Check the result of compilation
        let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            let error = gl.getShaderInfoLog(shader);
            console.log('Failed to compile shader: ' + error);
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }
}