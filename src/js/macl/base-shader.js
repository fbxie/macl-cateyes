export default class Shader {

    /**
     * @param {Object} gl
     * @param {String|Array.<string>} vertexSrc
     * @param {String|Array.<string>} fragmentSrc 
     */
    constructor(gl, vertexSrc, fragmentSrc) {
        this.gl = gl;
        this.vertexSrc = vertexSrc || '';
        this.fragmentSrc = fragmentSrc || '';
        return this;
    }

    run() {

        this.vertexShader = this.createShader(this.vertexSrc, 'vertex');
        this.fragmentShader = this.createShader(this.fragmentSrc, 'fragment');
        let gl = this.gl;
        let shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, this.vertexShader);
        gl.attachShader(shaderProgram, this.fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shader));
        }

        gl.useProgram(shaderProgram);

        let vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");

        gl.enableVertexAttribArray(vertexPositionAttribute);

        let vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(vertexColorAttribute);

        this.shaderProgram = shaderProgram;
        this.vertexPositionAttribute = vertexPositionAttribute;
        this.vertexColorAttribute = vertexColorAttribute;

        return this;
    }

    /**
     * @param {string} source
     * @param {string} [type = 'fragment'||'vertex']
     */
    createShader(source, type) {
        let type_Shader;
        if (type == 'fragment') {
            type_Shader = this.gl.FRAGMENT_SHADER;
        } else if (type == 'vertex') {
            type_Shader = this.gl.VERTEX_SHADER;
        } else {
            return void 0;
        }
        let shader = this.gl.createShader(type_Shader);

        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            alert("An error occurred compiling the shaders: " + this.gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }




}

/**
 * @public 
 * @param {string} id
 */
Shader.getShaderElementById = function (id) {
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