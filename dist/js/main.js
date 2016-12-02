var MACL_CATEYES = (function (fetch,Emitter,window$1) {
'use strict';

fetch = 'default' in fetch ? fetch['default'] : fetch;
Emitter = 'default' in Emitter ? Emitter['default'] : Emitter;
window$1 = 'default' in window$1 ? window$1['default'] : window$1;

var URL = {"DICOM":"/service/fileRes/dcmJson?listId=${f355c24988bc460fa67073c85d508f1e}","IMAGE":"/upload/api/1.0.0/file/acquisition/${46f27325b62793aa776e3dd8b85a8367}"};
var CACHE = true;
var ANIMATE_TIME = 500;
var TIMERUN_COUNT = 5;
var config = {
	URL: URL,
	CACHE: CACHE,
	ANIMATE_TIME: ANIMATE_TIME,
	TIMERUN_COUNT: TIMERUN_COUNT
};

/**
 * @class 
 */
class Server {

    constructor() {
        this.URL = config.URL;
        this.dicom = {};
        this.dicomcount = 0;
        this.emitter = new Emitter();
        this.dicom_status = {};

        this.image = {};
        this.imagecount = 0;
        this.image_status = {};
    }

    /**
     * @callback dicom_callback
     * @param {object} data
     */

    /**
     * @param {string} id - Dicom id
     * @param {object} other - null
     * @param {dicom_callback} callback 
     */
    getDicom(id, ...args) {
        if (!id) {
            id = `dicom-root-${this.dicomcount}`;
            // this.dicomcount++; //自家
        }

        let callback = args[args.length - 1];
        if (!callback && typeof callback != 'function') throw new Error('last params must be a function');

        this.emitter.once(`dicom-${id}`, data => callback(data)); //订阅事件dicom

        if (this.dicom[id]) {
            return this.emitter.emit(`dicom-${id}`, this.dicom[id]);
        }

        if (this.dicom_status[id]) {
            return;
        }

        let URL$$1;
        if (/dicom-root/i.test(id)) {
            URL$$1 = config.URL.DICOM.replace(/(\$\{|\})/g, '');
        } else {
            URL$$1 = config.URL.DICOM.replace(/\$\{\w+\}/g, id);
        }

        this.dicom_status[id] = true;
        let self = this;
        fetch(URL$$1, {
                method: 'GET',
                mode: 'same-origin',
                headers: {
                    // 'Accept ': 'application / json ',
                    'Content-Type': 'application/json'
                },
                // credentials: 'include',
                credentials: 'include'
            }).then(res => res.json())
            .then(res => {
                if (config.CACHE) {
                    self.dicom[id] = res.data;
                }
                self.emitter.emit(`dicom-${id}`, res.data);
            }).then(res => {
                self.dicom_status[id] = false;
            });
    }

    getImage(id, ...args) {
        if (!id) {
            id = `image-root-${this.imagecount}`;
        }
    }
}

var Server$1 = new Server();

/**
 * [setAttribute description]
 * @param {[type]} parent [description]
 * @param {[type]} name   [description]
 * @param {[type]} value  [description]
 */


/**
 * [getAttribute description]
 * @param  {[type]} parent [description]
 * @param  {[type]} name   [description]
 * @return {[type]}        [description]
 */

class Handler {
    constructor(studyId) {
        this.emitter = new Emitter();
        
        Server$1.getDicom(studyId, data => {
            this.dicom = data;
            this.emitter.emit('onload',data);
        });
        
        return this.emitter;
    }

    emmit(dicom) {
        ['study','patient','serieses','images'].forEach((item,index)=>{

        });

    }

}

class ImageFactory {
    constructor(str) {
        this.name = `image-${str}`;
        this._images = {};
        this.count = 0;
    }

    get(id) {
        if (!id) {
            id = `image-root-${this.count}`;
        }

        if (!this._images[id]) {
            let img = new Image();
            if (/image-root/i.test(id)) {
                img.src = config.URL.IMAGE.replace(/(\$\{|\})/g, '');
            } else {
                img.src = config.URL.IMAGE.replace(/\$\{\w+\}/g, id);
            }
            
            this._images[id] = img;
            
        }
        return this._images[id];
    }
}

var ImageFactory$1 = new ImageFactory('image');

function initBuffers(gl, vertices, colors) {

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

function initShaders(gl) {

    let fragmentShader = getShader(gl, "shader-fs");
    let vertexShader = getShader(gl, "shader-vs");

    // Create the shader program

    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

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
    // Didn't find an element with the specified ID; abort.

    if (!shaderScript) {
        return null;
    }

    // Walk through the source element's children, building the
    // shader source string.

    var theSource = "";
    var currentChild = shaderScript.firstChild;

    while (currentChild) {
        if (currentChild.nodeType == 3) {
            theSource += currentChild.textContent;
        }

        currentChild = currentChild.nextSibling;
    }

    // Now figure out what type of shader script we have,
    // based on its MIME type.

    var shader;

    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null; // Unknown shader type
    }

    // Send the source to the shader object

    gl.shaderSource(shader, theSource);

    // Compile the shader program

    gl.compileShader(shader);

    // See if it compiled successfully

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

// augment Sylvester some
let Matrix = window$1.Matrix||function(){};
Matrix.Translation = function (v)
{
  if (v.elements.length == 2) {
    var r = Matrix.I(3);
    r.elements[2][0] = v.elements[0];
    r.elements[2][1] = v.elements[1];
    return r;
  }

  if (v.elements.length == 3) {
    var r = Matrix.I(4);
    r.elements[0][3] = v.elements[0];
    r.elements[1][3] = v.elements[1];
    r.elements[2][3] = v.elements[2];
    return r;
  }

  throw "Invalid length for Translation";
};

Matrix.prototype.flatten = function ()
{
    var result = [];
    if (this.elements.length == 0)
        return [];


    for (var j = 0; j < this.elements[0].length; j++)
        for (var i = 0; i < this.elements.length; i++)
            result.push(this.elements[i][j]);
    return result;
};

Matrix.prototype.ensure4x4 = function()
{
    if (this.elements.length == 4 &&
        this.elements[0].length == 4)
        return this;

    if (this.elements.length > 4 ||
        this.elements[0].length > 4)
        return null;

    for (var i = 0; i < this.elements.length; i++) {
        for (var j = this.elements[i].length; j < 4; j++) {
            if (i == j)
                this.elements[i].push(1);
            else
                this.elements[i].push(0);
        }
    }

    for (var i = this.elements.length; i < 4; i++) {
        if (i == 0)
            this.elements.push([1, 0, 0, 0]);
        else if (i == 1)
            this.elements.push([0, 1, 0, 0]);
        else if (i == 2)
            this.elements.push([0, 0, 1, 0]);
        else if (i == 3)
            this.elements.push([0, 0, 0, 1]);
    }

    return this;
};

Matrix.prototype.make3x3 = function()
{
    if (this.elements.length != 4 ||
        this.elements[0].length != 4)
        return null;

    return Matrix.create([[this.elements[0][0], this.elements[0][1], this.elements[0][2]],
                          [this.elements[1][0], this.elements[1][1], this.elements[1][2]],
                          [this.elements[2][0], this.elements[2][1], this.elements[2][2]]]);
};

let Vector = window$1.Vector||function(){};

Vector.prototype.flatten = function ()
{
    return this.elements;
};

//
// gluPerspective
//
function makePerspective(fovy, aspect, znear, zfar)
{
    var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
    var ymin = -ymax;
    var xmin = ymin * aspect;
    var xmax = ymax * aspect;

    return makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);
}

//
// glFrustum
//
function makeFrustum(left, right,
                     bottom, top,
                     znear, zfar)
{
    var X = 2*znear/(right-left);
    var Y = 2*znear/(top-bottom);
    var A = (right+left)/(right-left);
    var B = (top+bottom)/(top-bottom);
    var C = -(zfar+znear)/(zfar-znear);
    var D = -2*zfar*znear/(zfar-znear);

    return $M([[X, 0, A, 0],
               [0, Y, B, 0],
               [0, 0, C, D],
               [0, 0, -1, 0]]);
}

//
// Matrix utility functions
//

let mvMatrix;

function loadIdentity() {
    mvMatrix = Matrix.I(4);
}

function multMatrix(m) {
    mvMatrix = mvMatrix.x(m);
}

function mvTranslate(v) {
    multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

function setMatrixUniforms(gl, shaderProgram, perspectiveMatrix) {

    var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

    var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
}

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
        } = initBuffers(gl, vertiecs,colors);

        // Set up to draw the scene periodically.

        setInterval(function () {
            drawScene(shaderProgram, squareVerticesBuffer, squareVerticesColorBuffer, vertexPositionAttribute, vertexColorAttribute);

        }, 15);

    }


}


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
    let perspectiveMatrix = makePerspective(46, roate, 0.0000001, 100000.0);

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.

    loadIdentity();

    // Now move the drawing position a bit to where we want to start
    // drawing the square.

    mvTranslate([-0.0, 0.0,-6]);

    // Draw the square by binding the array buffer to the square's vertices
    // array, setting attributes, and pushing it to GL.

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);


    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
    gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
    
    setMatrixUniforms(gl, shaderProgram, perspectiveMatrix);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

var coreGL = {
    start
};

class render {

    constructor(image) {
        this._image = image;
        this._emitter = new Emitter();
        this._image_status = {};
        let self = this;
        this._imageInfo = image.frames[0];
        this._id = JSON.parse(this._imageInfo.uri).lossless;
        let id = this._id;

        this.imgs = ImageFactory$1.get(id);

        this.imgs.onload = () => {
            //创建canvas
            // this._canvas = PIXI.Texture.Draw(function (canvas) {
            //     canvas.width = self.imgs.width;
            //     canvas.height = self.imgs.height;
            //     let ctx = canvas.getContext('2d');
            //     ctx.drawImage(self.imgs, 0, 0);
            //     let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
            //     ctx.putImageData(self.toGray(pixels), 0, 0);
            // });

            // let imageSprite = new PIXI.Sprite(self._canvas); //创建图片精灵；


        };

        this.imgs.onload = () => {
            let canvas = document.createElement('canvas');
            canvas.width = this.imgs.width;
            canvas.height = this.imgs.height;

            let ctx = canvas.getContext('2d');

            ctx.drawImage(this.imgs, 0, 0);
            let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);

            let vertiecs = [];
            let colors = [];
            let data = pixels.data;
            data = [];
            for (var i = 0; i < 36; i++) {
                data[i] = 255 / i;
            }

            for (let i = 1, I_len = data.length + 1; i < I_len; i += 4) {
                colors.push(calcolor(data[i]), calcolor(data[i]), calcolor(data[i]), 1.0);
                let tempcolors = [];
                tempcolors.push(calcolor(data[i]), calcolor(data[i]), calcolor(data[i]), 1.0);
            }

            let width = 3 || this.imgs.width;
            let height = 3 || this.imgs.height;

            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {

                    let position = [];
                    position.push(calposition(i, width));
                    position.push(calposition(j, height));
                    position.push(0);

                    vertiecs.push(calposition(i, width), calposition(i, height), 0);


                }
            }
            this.vertiecs = vertiecs;
            this.colors = colors;
            coreGL.start("glcanvas", vertiecs, colors);
        };

        return this;


        function calposition(n, m) {

            let t = 2 * n - m + 1;
            return t / (m - 1);

        }

        function calcolor(n) {
            return n / 255;
        }
    }

    start() {
        // if (!this._image_status[`image-loadover`]) {
        //     this._emitter.once(`image-loadover`, data => renderer.render(data));
        // } else {
        //     renderer.render(this._stage);
        // }
        // return this;
    }

    position(image) {
        let height = image.height;
        let width = image.width;
        image.height = dom_main[0].offsetHeight;
        image.width = image.height / height * width;
        image.x = (dom_main[0].offsetWidth - image.width) / 2;
    }

    toGray(pixels) {
        let graies = [];

        let minGray = this._minGray || this._imageInfo.minGray;
        let grayWidth = this._grayWidth || (this._imageInfo.maxGray - this._imageInfo.minGray);
        let min = minGray;
        minGray = minGray < 0 ? Math.abs(minGray) : 0;

        let count = 0;
        min = 50;
        let width = 350;

        for (let i = 0, i_len = pixels.data.length; i < i_len; i += 4) {
            let gray = (pixels.data[i] << 16) + (pixels.data[i + 1] << 8) + (pixels.data[i + 2]);
            gray = gray - minGray;
            if (gray != 0 && count < 20) {
                console.log(gray);
                count++;
            }
            gray -= 2047;
            gray = getGray(gray, 50, 350);

            pixels.data[i] = gray;
            pixels.data[i + 1] = gray;
            pixels.data[i + 2] = gray;
        }

        return pixels;

        function getGray(gray, min, width) {
            let roate = width / 255;
            gray = Math.ceil((gray - min + width / 2) / roate);

            if (gray < 0) {
                gray = 0;
            } else if (gray > 255) {
                gray = 255;
            }
            return gray;
        }
    }

    GrayFilterGLSL() {
        let Filter = new PIXI.Filter();
        console.dir(Filter);
        console.log(Filter.vertexSrc);
        console.log(Filter.fragmentSrc);
        Filter.padding = 0.0;
        Filter.vertexSrc = [
            "attribute vec2 aVertexPosition;",
            "attribute vec2 aTextureCoord;",
            "attribute vec4 aColor;",
            "uniform mat3 projectionMatrix;",
            "uniform mat3 filterMatrix;",
            "letying vec2 vTextureCoord;",
            "letying vec2 vFilterCoord;",
            "letying vec4 vColor;",
            "void main(void) {",
            "   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);",
            // "    vColor = aColor ;",
            "   vFilterCoord = (filterMatrix * vec3(aTextureCoord, 1.0)).xy;",
            "   vTextureCoord = aTextureCoord;",
            "   vec4 c = aColor;",
            "   c.r *= 255.0;c.g *= 255.0; c.b *= 255.0;\n",
            "   float gray = (c.r * 65536.0) + (c.g * 256.0) + (c.b);\n",
            "   gray = gray - 2047.0;\n",
            "   gray = gray - 50.0 + 350.0 / 2.0;\n",
            "   gray = ceil(gray / 350.0 * 255.0);\n",
            "   vColor = vec4(aColor);",
            // "   vColor.r = 255.0/255.0;",
            // // "   vColor.g = gray/255.0;",
            // "   vColor.b = gray/255.0;",

            "}"
        ].join('\n');



        // let fragmentSrc = [
        //     "precision mediump float;",
        //     "letying vec2 vTextureCoord;\n",
        //     "uniform sampler2D uSampler;\n",
        //     "uniform float width;\n",
        //     "uniform float min;\n",
        //     "uniform float max;\n",
        //     "void main(void){\n",
        //     "   vec4 c = texture2D(uSampler, vTextureCoord);\n",
        //     "   c.r *= 255.0;c.g *= 255.0; c.b *= 255.0;\n",
        //     "   float gray = (c.r * 65536.0) + (c.g * 256.0) + (c.b);\n",
        //     "   gray = gray - 2047.0;\n",
        //     "   gray = gray - min + width / 2.0;\n",
        //     "   gray = ceil(gray / width * 255.0);\n",
        //     // "   gray = gray>0.0?gray:0.0;\n",
        //     // "   gray = gray<1.0?gray:1.0;\n",
        //     // "   gl_FragColor.rgb = mix(c.rgb,vec3(gray/255.0), 1.0);\n",
        //     "   gl_FragColor.r = gray/255.0;\n",
        //     "   gl_FragColor.g = gray/255.0;\n",
        //     "   gl_FragColor.b = gray/255.0;\n",
        //     "}\n"
        // ].join('');

        Filter.fragmentSrc = [
            "letying vec2 vTextureCoord;",
            "letying vec2 vFilterCoord;",
            "letying vec4 vColor;",
            "uniform sampler2D uSampler;",
            "uniform sampler2D filterSampler;",
            "void main(void) {",
            "    vec4 masky = texture2D(filterSampler, vFilterCoord);",
            "    vec4 sample = texture2D(uSampler, vTextureCoord);",
            "    vec4 color;",
            "    if (mod(vFilterCoord.x, 1.0) > 0.5) {",
            "        color = vec4(1.0, 0.0, 0.0, 1.0);",
            "    } else {",
            "        color = vec4(0.0, 1.0, 0.0, 1.0);",
            "    }",
            "    gl_FragColor = vColor;",
            // "    gl_FragColor = mix(masky , vColor, 0.5);",
            "    gl_FragColor *= sample.a;",
            // "    gl_FragColor.r = vColor.r;",
            // "    gl_FragColor.r = 1.0*0.1;",
            // "   gl_FragColor.a = 0.5;",
            "}"
        ].join('\n');
        // console.log(vertexSrc);
        // console.log(fragmentSrc);



        let minGray = this._minGray || this._imageInfo.minGray;
        let maxGray = this._maxGray || this._imageInfo.maxGray;

        let grayWidth = this._grayWidth || (this._imageInfo.maxGray - this._imageInfo.minGray);

        minGray = 50;
        grayWidth = 350;

        let uniforms = {};

        uniforms["width"] = {
            type: 'f',
            value: grayWidth
        };


        uniforms["min"] = {
            type: 'f',
            value: minGray
        };

        uniforms["max"] = {
            type: 'f',
            value: maxGray
        };

        return Filter;
        // return new PIXI.AbstractFilter(vertexSrc, fragmentSrc, uniforms);
    }



}

/**
 * 节流运行
 * @param {Function} fn
 * @param {number} interval
 * @returns
 */
let throttle = function (fn, interval) {
    let _self = fn,
        timer,
        firstTime = true;

    return function () {
        let args = arguments,
            _me = this;

        if (firstTime) {
            _self.apply(_me, args);
            return firstTime = false;
        }

        if (timer) {
            return false;
        }

        timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
            _self.apply(_me, args);
        }, interval || 500);
    };
};

/**
 * [分时函数运行]
 * @param  {[type]}   ary   [description]
 * @param  {Function} fn    [description]
 * @param  {[type]}   count [description]
 * @return {[type]}         [description]
 */
let timeChunk = function (ary, fn, count) {
    let obj,
        t;
    let len = ary.length;
    let start = () => {
        for (let i = 0; i < Math.min(count || 1, ary.length); i++) {
            let obj = ary.shift();
            fn(obj);
        }
    };

    return function () {
        t = setInterval(() => {
            if (ary.length === 0) {
                return clearInterval(t);
            }
            start();
        }, 200);
    };
};

var timerun = {
    throttle,
    timeChunk
};

class View {
    constructor(series, options) {
        this._series = series;
        this.options = options;
        this._select = options && options.select || 0;
        this._canvas = document.createElement('canvas');
        this.select(0);
        this.load();

        let self = this;

        // setTimeout(function () {
        //     self.play()
        // }, 4000);
        return this;
    }

    select(index) {
        if (!index) {
            this._select = index || 0;
        }
        console.dir(this._series);
        new render(this._series.images[this._select]).start();
        return this;
    }

    load() {
        this._length = this._series.images.length;
        this._renderers = [];
        let self = this;
        let Count = 0;
        self._process = 0;
        timerun.timeChunk(self._series.images, function (image) {
            let renderer = new render(image);
            self._renderers.push(renderer);
            renderer._emitter.once('image-loadover', function () {
                Count++;
                self._process = Count / self._length;
                console.log('Image loading:%d\%', self._process * 100);
            });
        }, config.TIMERUN_COUNT)();
        return this;
    }

    getProcess() {
        return this._process;
    }

    play() {
        let self = this;
        self._select = self._select || 0;
        animate();

        function animate() {
            self._renderers[self._select].start();
            self._select++;
            if (self._select >= self._length) {
                self._select = 0;
            }
            //rotate the container!
            // render the root container
            setTimeout(function () {
                animate();
            }, config.ANIMATE_TIME);
        }
    }
}

var Tools = function (){   
    let dom_tools = document.createElement('div');
    
    return dom_tools;
};

var Aside = function (serieses) {


    
    let dom_aside = document.createElement('div');
    dom_aside.className = "aside";

    let dom_serieses = document.createElement('div');
    dom_aside.appendChild(dom_serieses);

    dom_serieses.className = "serieses";

    for(let i = 0 , i_len=serieses.length;i<i_len;i++){
        dom_serieses.appendChild(new Series(serieses[i])); 
    }

    dom_aside.appendChild(Tools());
    console.dir(new Series(serieses[0]));
    return dom_aside;
};

class Series {
    constructor(series) {
        this._series = series;
        this.createDom(series.images[0].frames[0].thumbnailUri);
        return this._DOM;
    }

    createDom(url) {
        this._DOM = document.createElement('div');
        this._DOM.className = "series";
        // this._DOM.style.position = "relative";
        // this._DOM.style.margin = "10px 2px";
        // this._DOM.style["padding"] = "5px 0px";
        // this._DOM.style["text-align"] = "center";
        this._DOM.appendChild(this.ImageDom(url));
    }

    ImageDom(url) {
        let img = document.createElement('img');
        img.src = ImageFactory$1.get(url).src;
        img.width = 80;
        img.height = 80;
        return img;
    }
}

let handler_1234 = new Handler();

handler_1234.on('onload', function (data) {
    if (data) {
        $("#aside")[0].appendChild(Aside(data.study.serieses));
        new View(data.study.serieses[0]);

    }
});


// export default handler_1234;


// import tool from './tool';



//Create the renderer
// let renderer = PIXI.autoDetectRenderer(256, 256);

// renderer.autoResize = true;
//Add the canvas to the HTML document
// document.body.appendChild(renderer.view);

//Create a container object called the `stage`
// let stage = new PIXI.Container();


//Tell the `renderer` to `render` the `stage`
// renderer.render(stage);





var main = {};

return main;

}(fetch,Emitter,window));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvbWFpbi5qcyIsInNvdXJjZXMiOltdLCJzb3VyY2VzQ29udGVudCI6W10sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
