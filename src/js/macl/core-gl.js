import {
    initBuffers
} from './base-buffer';
import {
    initShaders
} from './base-shader';

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
    // 初始化 WebGL 上下文
    gl = initWebGL(canvas);

    // 只有在 WebGL 可用的时候才继续

    if (gl) {
        // 设置清除颜色为黑色，不透明
        // gl.viewport(0, 0,640.0, 480.0);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        // 开启“深度测试”, Z-缓存
        gl.enable(gl.DEPTH_TEST);
        // 设置深度测试，近的物体遮挡远的物体
        gl.depthFunc(gl.LEQUAL);
        // 清除颜色和深度缓存
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        let {
            shaderProgram,
            vertexPositionAttribute,
            vertexColorAttribute
        } = initShaders(gl);

        // Here's where we call the routine that builds all the objects
        // we'll be drawing.

        let {
            squareVerticesBuffer,
            squareVerticesColorBuffer
        } = initBuffers(gl, vertiecs);

        // Set up to draw the scene periodically.

        setInterval(function () {
            drawScene(shaderProgram, squareVerticesBuffer, squareVerticesColorBuffer, vertexPositionAttribute, vertexColorAttribute);

        }, 15);

    }


};


function initWebGL(canvas) {
    // 创建全局变量
    window.gl = null;

    try {
        // 尝试获取标准上下文，如果失败，回退到试验性上下文
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch (e) {}

    // 如果没有GL上下文，马上放弃
    if (!gl) {
        alert("WebGL初始化失败，可能是因为您的浏览器不支持。");
        gl = null;
    }
    return gl;
}


function drawScene(shaderProgram, squareVerticesBuffer, squareVerticesColorBuffer, vertexPositionAttribute, vertexColorAttribute) {
    // Clear the canvas before we start drawing on it.

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Establish the perspective with which we want to view the
    // scene. Our field of view is 45 degrees, with a width/height
    // ratio of 640:480, and we only want to see objects between 0.1 units
    // and 100 units away from the camera.
    var roate = macl.width / macl.height;
    let perspectiveMatrix = makePerspective(45, roate, 0.0000001, 100000.0);

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.

    loadIdentity();

    // Now move the drawing position a bit to where we want to start
    // drawing the square.

    mvTranslate([-0.0, 0.0,-2.5]);

    // Draw the square by binding the array buffer to the square's vertices
    // array, setting attributes, and pushing it to GL.

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);


    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
    gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
    setMatrixUniforms(gl, shaderProgram, perspectiveMatrix);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

export default {
    start
};