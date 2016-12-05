import Buffer from './base-buffer';
import Shader from './base-shader';

import {
    loadIdentity,
    mvTranslate,
    setMatrixUniforms
} from './base-matrix';

import {
    makePerspective
} from './base-utils';
// WebGL的全局变量;
let gl;

let macl = {};

function start(id, vertiecs, colors) {
    let root = document.getElementById(id);
    let canvas = document.createElement('canvas');
    canvas.width = root.offsetWidth;
    macl.width = root.offsetWidth;
    canvas.height = root.offsetHeight;
    macl.height = root.offsetHeight;

    root.appendChild(canvas);
    gl = initWebGL(canvas);

    if (gl) {
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.enable(gl.DEPTH_TEST); // 开启“深度测试”, Z-缓存
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SPC_ALPHA);
        gl.depthFunc(gl.LEQUAL); // 设置深度测试，近的物体遮挡远的物体
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // 清除颜色和深度缓存


        let shader = new Shader(gl,Shader.getShaderElementById('shader-vs'),Shader.getShaderElementById('shader-fs'));
        shader.run();
        let shaderProgram = shader.shaderProgram;
        let vertexPositionAttribute = shader.vertexPositionAttribute;
        let vertexColorAttribute = shader.vertexColorAttribute;

        let buffer  = new Buffer(gl,vertiecs, colors);

        buffer.run();
        let squareVerticesBuffer = buffer.VerticesBuffer;
        let squareVerticesColorBuffer = buffer.VerticesColorBuffer;


        drawScene(shaderProgram, squareVerticesBuffer, squareVerticesColorBuffer, vertexPositionAttribute, vertexColorAttribute);
    }


};


function initWebGL(canvas) {
    window.gl = null;

    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch (e) {}

    if (!gl) {
        alert("WebGL初始化失败，可能是因为您的浏览器不支持。");
        gl = null;
    }
    return gl;
}


function drawScene(shaderProgram, squareVerticesBuffer, squareVerticesColorBuffer, vertexPositionAttribute, vertexColorAttribute) {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var roate = macl.width / macl.height;
    let perspectiveMatrix = makePerspective(45, roate, 0.000000001, 1000000000.0);


    loadIdentity();

    mvTranslate([-0.0, 0.0, -1.5]);

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);


    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
    gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

    setMatrixUniforms(gl, shaderProgram, perspectiveMatrix);

    gl.drawArrays(gl.POINTS, 0, 262144);
}

class coreGL {
    constructor(options) {
        this._options = options;
        this.id = options.id;

    }

    initWebGL() {
        let root = document.getElementById(id);
        let canvas = document.createElement('canvas');
        canvas.width = root.offsetWidth;
        macl.width = root.offsetWidth;
        canvas.height = root.offsetHeight;
        macl.height = root.offsetHeight;

        root.appendChild(canvas);
        gl = initWebGL(canvas);

    }
}

export default {
    start
};