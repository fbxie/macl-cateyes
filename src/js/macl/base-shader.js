export function initShaders(gl) {

    let fragmentShader = getShader(gl, "shader-fs");
    let vertexShader = getShader(gl, "shader-vs");

    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shader));
    }

    gl.useProgram(shaderProgram);

    let vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");

    gl.enableVertexAttribArray(vertexPositionAttribute);

    let vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(vertexColorAttribute);

    return {
        shaderProgram,
        vertexPositionAttribute,
        vertexColorAttribute
    };
}

function getShader(gl, id) {
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

    var shader;

    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }
    gl.shaderSource(shader, theSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

export default {
    initShaders,
    getShader
};