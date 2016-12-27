export default class Buffer {

    /**
     * @param {object} gl
     * @param {number[]} vertices
     * @param {number[]} colors
     */
    constructor(gl, vertices, colors) {
        this.gl = gl;
        this.vertices = vertices || [];
        this.colors = colors || [];
    }

    run() {

        let gl = this.gl;
        let VerticesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, VerticesBuffer);
        let vertices = this.vertices || [
            1.0,
            1.0,
            0.0,
            -1.0,
            1.0,
            0.0,
            1.0,
            -1.0,
            0.0,
            -1.0,
            -1.0,
            0.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        let colors = this.colors || [
            1.0, 1.0, 1.0, 1.0, // white
            1.0,
            0.0,
            0.0,
            1.0, // red
            0.0,
            1.0,
            0.0,
            1.0, // green
            0.0,
            0.0,
            1.0,
            1.0 // blue
        ];

        let VerticesColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, VerticesColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        this.VerticesBuffer = VerticesBuffer;
        this.VerticesColorBuffer = VerticesColorBuffer;
    }
}