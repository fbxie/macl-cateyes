export function initBuffers(gl, vertices, colors) {

    let squareVerticesBuffer = gl.createBuffer();


    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);

    vertices = vertices|| [
        1.0, 1.0, 0.0, -1.0, 1.0, 0.0,
        1.0, -1.0, 0.0, -1.0, -1.0, 0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    colors = colors|| [
        1.0, 1.0, 1.0, 1.0, // white
        1.0, 0.0, 0.0, 1.0, // red
        0.0, 1.0, 0.0, 1.0, // green
        0.0, 0.0, 1.0, 1.0 // blue
    ];

    let squareVerticesColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    return {
        squareVerticesBuffer,
        squareVerticesColorBuffer
    };
}

export default {
    initBuffers
};