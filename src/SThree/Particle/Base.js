export default class Base{
    gl={};
    vertiecs=[];
    colors=[];
    num=0;
    constructor(gl,vertiecs,colors,num){
        this.vertiecs = vertiecs;
        this.colors = colors;
        this.num = num;
        return this;
    }

    initBuffer(gl){
        this.gl = gl;
         // Write the vertex coordinates and color to the buffer object
        if (!Base.initArrayBuffer(this.gl, this.vertiecs, 3, gl.FLOAT, 'aVertexPosition'))
            return -1;

        if (!Base.initArrayBuffer(this.gl, this.colors, 4, gl.FLOAT, 'aVertexColor'))
            return -1;

        return this.num;
    }

    static initArrayBuffer(gl, data, num, type, attribute) {
        // Create a buffer object
        let buffer = gl.createBuffer();
        if (!buffer) {
            console.log('Failed to create the buffer object');
            return false;
        }
        // Write date into the buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        　// Assign the buffer object to the attribute variable
        let a_attribute = gl.getAttribLocation(gl.program, attribute);
        if (a_attribute < 0) {
            console.log('Failed to get the storage location of ' + attribute);
            return false;
        }
        gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
        // Enable the assignment of the buffer object to the attribute variable
        gl.enableVertexAttribArray(a_attribute);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        return true;
    }
}