import Base from './Base';

export default class Cateyes extends Base {

    vshader = [
        'attribute vec3 aVertexPosition;',
        'attribute vec4 aVertexColor;',
        // 'uniform mat4 uMVMatrix;',
        // 'uniform mat4 uPMatrix;',
        'varying lowp vec4 vColor;',
        'void main(void) {',
        '   gl_Position =vec4(aVertexPosition, 1.0);',
        
        // '   gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);',
        '   gl_PointSize =11.4;',
        '   vec4 c = aVertexColor;',
        '   float gray = (c.r * 65536.0) + (c.g * 256.0) + (c.b);',
        '   gray = gray - 2047.0/1000.0;',
        '   gray = gray - 50.0/1000.0 + 350.0 / 2000.0;',
        '   gray = gray / 350.0*1000.0;',
        '   vColor = vec4(gray,gray,gray,1.0);',
        '}'
    ].join('\n');

    fshader = ['varying lowp vec4 vColor;', 'void main(void) {', 'gl_FragColor = vColor;', '} '].join('\n');

    constructor(gl, vshader, fshader) {
        super();
        this.gl = gl;
        this.vshader = vshader || this.vshader;
        this.fshader = fshader || this.fshader;

        return this;
    }

}
