export function initBuffers(gl, vertices, colors) {

    // Create a buffer for the square's vertices.

    let squareVerticesBuffer = gl.createBuffer();

    // Select the squareVerticesBuffer as the one to apply vertex
    // operations to from here out.

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);

    // Now create an array of vertices for the square. Note that the Z
    // coordinate is always 0 here.

    vertices = vertices||[
        1.0, 1.0, 0.0, -1.0, 1.0, 0.0,
        1.0, -1.0, 0.0, -1.0, -1.0, 0.0
    ];

    // Now pass the list of vertices into WebGL to build the shape. We
    // do this by creating a Float32Array from the JavaScript array,
    // then use it to fill the current vertex buffer.
    console.dir(new Float32Array(vertices));
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    colors =colors|| [
        1.0, 1.0, 1.0, 1.0, // white
        1.0, 0.0, 0.0, 1.0, // red
        0.0, 1.0, 0.0, 1.0, // green
        0.0, 0.0, 1.0, 1.0 // blue
    ];

    let squareVerticesColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    console.dir(new Float32Array(colors));
    return {
        squareVerticesBuffer,
        squareVerticesColorBuffer
    };
}

export default {
    initBuffers
};