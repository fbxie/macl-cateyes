import {Points, Window} from '../datatype/index';

import {Container} from '../Container';

import {Shader} from '../shader/Shader';
import {Buffer} from '../shader/Buffer';

import {loadIdentity, mvTranslate, setMatrixUniforms} from '../../js/macl/base-matrix';

import {makePerspective} from '../../js/macl/base-utils';

export class Dicom extends Container {
    width = 0;
    height = 0;
    points = {};
    window = {};
    filters = [];

    constructor(img) {
        super();
        this.width = img.width;
        this.height = img.height;
        this.points = new Points(img);
        this.window = new Window();

        return this;
    }

    draw(gl) {
        this.gl = gl;
        let SHADER = this.initShader(gl);
        let BUFFER = this.initBuffer(gl);

        BUFFER
            .VertiecsBuffer
            .bind(BUFFER.VertiecsBuffer.DataBuffer);
        SHADER
            .attributes
            .aVertexPosition
            .pointer
            .call(SHADER.attributes.aVertexPosition, gl);
        gl.enableVertexAttribArray('aVertexPosition');

        BUFFER
            .ColorsBuffer
            .bind(BUFFER.ColorsBuffer.DataBuffer);

        gl.enableVertexAttribArray('aVertexColor');
        
        SHADER
            .attributes
            .aVertexColor
            .pointer
            .call(SHADER.attributes.aVertexColor, gl);
        this.Uniform(SHADER.program);

        this.showDraw();
    }

    initShader() {
        let gl = this.gl;
        let vertexSrc = Shader.getShaderElementById('shader-vs');
        let fragmentSrc = Shader.getShaderElementById('shader-fs');

        return new Shader(gl, vertexSrc, fragmentSrc);
    }

    initBuffer() {
        let gl = this.gl;
        let VertiecsBuffer = new Buffer(gl, this.points.vertiecs);
        let ColorsBuffer = new Buffer(gl, this.points.colors);
        return {VertiecsBuffer, ColorsBuffer};
    }

    Uniform(shaderProgram) {
        var roate = this.width / this.height;
        let perspectiveMatrix = makePerspective(45, roate, 0.0001, 1000000000.0);

        loadIdentity();

        mvTranslate([-0.0, 0.0, -1.5]);
        setMatrixUniforms(this.gl, shaderProgram, perspectiveMatrix);
    }

    showDraw() {
        this
            .gl
            .drawArrays(this.gl.POINTS, 0, 262144);
    }

}