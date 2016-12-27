import mapSize from './mapSize';
import mapType from './mapType';

export class Shader {
    gl={};
    program={};
    attributes={};

    constructor(gl, vertexSrc, fragmentSrc) {
        
        this.gl = gl;
        this.program = Shader.compileProgram(gl, vertexSrc, fragmentSrc);
        this.attributes = Shader.bind(gl,this.program);
        return this;
    }

    static bind(gl,program){
        let attributes = {};
        let totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        
        for (let i = 0; i < totalAttributes; i++)
        {
            let attribData = gl.getActiveAttrib(program, i);
            let type = mapType(gl, attribData.type);
            
            attributes[attribData.name] = {
                type:type,
                size:mapSize(type),
                location:gl.getAttribLocation(program, attribData.name),
                pointer: pointer
            };
        }

        return attributes;
    }
    

    static compileProgram(gl, vertexSrc, fragmentSrc) {

        let glVertShader = Shader.compileShader(gl, gl.VERTEX_SHADER, vertexSrc);
        let glFragShader = Shader.compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);

        let program = gl.createProgram();

        gl.attachShader(program, glVertShader);
        gl.attachShader(program, glFragShader);
        gl.linkProgram(program);
        gl.useProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('MACL Error: Could not initialize shader.');
            console.error('gl.VALIDATE_STATUS', gl.getProgramParameter(program, gl.VALIDATE_STATUS));
            console.error('gl.getError()', gl.getError());

            if (gl.getProgramInfoLog(program) !== '') {
                console.warn('MACL Warning: gl.getProgramInfoLog()', gl.getProgramInfoLog(program));
            }

            gl.deleteProgram(program);
            program = null;
        }

        gl.deleteShader(glVertShader);
        gl.deleteShader(glFragShader);

        return program;
    }

    static compileShader(gl, type, src) {
        let shader = gl.createShader(type);

        gl.shaderSource(shader, src);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    };

    static getShaderElementById(id){
        let shaderScript = document.getElementById(id);

        if (!shaderScript) {
            return null;
        }
        var theSource = "";
        var currentChild = shaderScript.firstChild;
        while (currentChild) {
            if (currentChild.nodeType == 3) {
                theSource += currentChild.textContent;
            }
            currentChild = currentChild.nextSibling;
        }
        return theSource;    
    }
}

let pointer = function(gl,type, normalized, stride, start){
    gl.vertexAttribPointer(this.location,this.size, type || gl.FLOAT, normalized || false, stride || 0, start || 0);
};