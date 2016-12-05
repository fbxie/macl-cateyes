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

class Buffer {

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

        let gl =this.gl;
        let VerticesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,VerticesBuffer);
        let vertices = this.vertices || [
            1.0, 1.0, 0.0, -1.0, 1.0, 0.0,
            1.0, -1.0, 0.0, -1.0, -1.0, 0.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        let colors = this.colors || [
            1.0, 1.0, 1.0, 1.0, // white
            1.0, 0.0, 0.0, 1.0, // red
            0.0, 1.0, 0.0, 1.0, // green
            0.0, 0.0, 1.0, 1.0 // blue
        ];

        let VerticesColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, VerticesColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        this.VerticesBuffer = VerticesBuffer;
        this.VerticesColorBuffer =VerticesColorBuffer;
    }
}

class Shader {

    /**
     * @param {Object} gl
     * @param {String|Array.<string>} vertexSrc
     * @param {String|Array.<string>} fragmentSrc 
     */
    constructor(gl, vertexSrc, fragmentSrc) {
        this.gl = gl;
        this.vertexSrc = vertexSrc || '';
        this.fragmentSrc = fragmentSrc || '';
        return this;
    }

    run() {

        this.vertexShader = this.createShader(this.vertexSrc, 'vertex');
        this.fragmentShader = this.createShader(this.fragmentSrc, 'fragment');
        let gl = this.gl;
        let shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, this.vertexShader);
        gl.attachShader(shaderProgram, this.fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shader));
        }

        gl.useProgram(shaderProgram);

        let vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");

        gl.enableVertexAttribArray(vertexPositionAttribute);

        let vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(vertexColorAttribute);

        this.shaderProgram = shaderProgram;
        this.vertexPositionAttribute = vertexPositionAttribute;
        this.vertexColorAttribute = vertexColorAttribute;

        return this;
    }

    /**
     * @param {string} source
     * @param {string} [type = 'fragment'||'vertex']
     */
    createShader(source, type) {
        let type_Shader;
        if (type == 'fragment') {
            type_Shader = this.gl.FRAGMENT_SHADER;
        } else if (type == 'vertex') {
            type_Shader = this.gl.VERTEX_SHADER;
        } else {
            return void 0;
        }
        let shader = this.gl.createShader(type_Shader);

        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            alert("An error occurred compiling the shaders: " + this.gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }




}

/**
 * @public 
 * @param {string} id
 */
Shader.getShaderElementById = function (id) {
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
    return theSource;
};

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


}


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

var coreGL$1 = {
    start
};

class Dicom {

    constructor(image) {
        this._image = image;
        this._emitter = new Emitter();
        this._image_status = {};

        this._imageInfo = image.frames[0];
        this._id = JSON.parse(this._imageInfo.uri).lossless;
        let id = this._id;

        this.Init(this._id);
        return this;
    }

    start() {
        if (!this._image_status[`loadover`]) {
            this._emitter.once(`loadover`, data => coreGL$1.start("glcanvas", this._macldata.vertiecs, this._macldata.colors));
        } else {
            coreGL$1.start("glcanvas", this._macldata.vertiecs, this._macldata.colors);
        }
        return this;
    }

    Init(id) {
        this._img = ImageFactory$1.get(id);
        this._img.onload = () => {
            this._width = this._img.width;
            this._height = this._img.height;
            this._pixels = this.getImageData(this._img);
            this._macldata = this.getPositionAndColor();

            this._image_status['loadover'] = true;
            this._emitter.emit('loadover');
        };
    }

    /**
     * @param {HTMLImageElement} img - 图片元素
     * @returns {} pixels - 图片像素数据
     */
    getImageData(img) {
        let canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    getPositionAndColor() {
        let vertiecs = [];
        let colors = [];

        let data = this._pixels.data;
        for (let i = 0, I_len = data.length; i < I_len; i += 4) {
            colors.push(data[i] / 1000, data[i + 1] / 1000, data[i + 2] / 1000, data[i + 3] / 1000);
        }

        let width = this._width;
        let height = this._height;
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                vertiecs.push(calposition(j, height), -calposition(i, width), 0);
            }
        }

        return {
            vertiecs,
            colors
        };

        function calposition(n, m) {
            let t = 2 * n - m + 1;
            return t / 1000;
        }
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
        let self = this;

        return this;
    }

    select(index) {
        if (!index) {
            this._select = index || 0;
        }
        new Dicom(this._series.images[this._select]).start();
        return this;
    }

    load() {
        this._length = this._series.images.length;
        this._renderers = [];
        let self = this;
        let Count = 0;
        self._process = 0;
        timerun.timeChunk(self._series.images, function (image) {
            let renderer = new Dicom(image);
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

var main = {};

return main;

}(fetch,Emitter,window));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvbWFpbi5qcyIsInNvdXJjZXMiOltdLCJzb3VyY2VzQ29udGVudCI6W10sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
