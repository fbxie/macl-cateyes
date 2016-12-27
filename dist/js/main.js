var MACL_CATEYES = (function (fetch,Emitter,window$1) {
'use strict';

fetch = 'default' in fetch ? fetch['default'] : fetch;
Emitter = 'default' in Emitter ? Emitter['default'] : Emitter;
window$1 = 'default' in window$1 ? window$1['default'] : window$1;

var URL = { "DICOM": "/service/fileRes/dcmJson?listId=${f355c24988bc460fa67073c85d508f1e}", "IMAGE": "/upload/api/1.0.0/file/acquisition/${46f27325b62793aa776e3dd8b85a8367}" };
var CACHE = true;
var ANIMATE_TIME = 500;
var TIMERUN_COUNT = 5;
var config = {
	URL: URL,
	CACHE: CACHE,
	ANIMATE_TIME: ANIMATE_TIME,
	TIMERUN_COUNT: TIMERUN_COUNT
};

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get$1 = function get$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get$1(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

/**
 * @class 
 */

var BaseServer = function () {
    function BaseServer(name, url) {
        classCallCheck(this, BaseServer);

        this.name = name;
        this.url = url;
        this.entities = {};
        this.count = 0;
        this.emitter = new Emitter();
        this.status = {};
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


    createClass(BaseServer, [{
        key: 'get',
        value: function get(id) {
            var _ref;

            if (!id) id = 'root';

            var callback = (_ref = (arguments.length <= 1 ? 0 : arguments.length - 1) - 1 + 1, arguments.length <= _ref ? undefined : arguments[_ref]);
            if (!callback && typeof callback != 'function') throw new Error('last params must be a function');

            this.emitter.once(this.name + '-' + id, function (data) {
                return callback(data);
            }); //订阅事件dicom

            if (this.entities[id]) {
                return this.emitter.emit(this.name + '-' + id, this.entities[id]);
            }

            if (this.status[id]) {
                return;
            }

            var URL$$1 = void 0;
            if (/root/i.test(id)) {
                URL$$1 = this.url.replace(/(\$\{|\})/g, '');
            } else {
                URL$$1 = this.url.replace(/\$\{\w+\}/g, id);
            }

            this.status[id] = true;
            var self = this;
            this._require = {
                URL: URL$$1,
                id: id
            };
            this.requireGet();
        }
    }, {
        key: 'requireGet',
        value: function requireGet() {
            var self = this;
            var _require = this._require,
                URL$$1 = _require.URL,
                id = _require.id;

            fetch(URL$$1, {
                method: 'GET',
                mode: 'same-origin',
                headers: {
                    // 'Accept ': 'application / json ',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            }).then(function (res) {
                return res.json();
            }).then(function (res) {
                if (config.CACHE) {
                    self.entities[id] = res.data;
                }
                self.emitter.emit(self.name + '-' + id, res.data);
            }).then(function (res) {
                self.status[id] = false;
            }).catch(function (res) {
                // self.status[id] = false;
                // throw new Error(res);
            });
        }
    }]);
    return BaseServer;
}();

var DicomServer = function (_BaseServer) {
    inherits(DicomServer, _BaseServer);

    function DicomServer() {
        classCallCheck(this, DicomServer);
        return possibleConstructorReturn(this, (DicomServer.__proto__ || Object.getPrototypeOf(DicomServer)).call(this, 'dicom', config.URL.DICOM));
    }

    return DicomServer;
}(BaseServer);

var ImageServer = function (_BaseServer2) {
    inherits(ImageServer, _BaseServer2);

    function ImageServer() {
        classCallCheck(this, ImageServer);
        return possibleConstructorReturn(this, (ImageServer.__proto__ || Object.getPrototypeOf(ImageServer)).call(this, 'image', config.URL.IMAGE));
    }

    createClass(ImageServer, [{
        key: 'requireGet',
        value: function requireGet() {
            var self = this;
            var _require2 = this._require,
                URL$$1 = _require2.URL,
                id = _require2.id;

            var imgs = new Image();
            imgs.src = URL$$1;
            imgs.onload = function () {
                if (config.CACHE) {
                    self.entities[id] = imgs;
                }
                self.emitter.emit(self.name + '-' + id, imgs);
                self.status[id] = false;
            };

            imgs.onerror = function () {
                self.emitter.emit(self.name + '-' + id, null);
                self.status[id] = false;
            };
        }
    }]);
    return ImageServer;
}(BaseServer);

var Service = {
    ImageServer: new ImageServer(),
    DicomServer: new DicomServer()
};

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

var Handler = function () {
    function Handler(studyId) {
        var _this = this;

        classCallCheck(this, Handler);

        this.emitter = new Emitter();

        Service.DicomServer.get(studyId, function (data) {
            _this.dicom = data;
            _this.emitter.emit('onload', data);
        });

        return this.emitter;
    }

    createClass(Handler, [{
        key: 'emmit',
        value: function emmit(dicom) {
            ['study', 'patient', 'serieses', 'images'].forEach(function (item, index) {});
        }
    }]);
    return Handler;
}();

var Points$1 = function () {
    function Points(img) {
        classCallCheck(this, Points);
        this.vertiecs = [];
        this.colors = [];
        this.imagedata = {};

        this.imagedata = Points.getImageData(img);
        this.vertiecs = Points.getVertes(this.imagedata);
        this.colors = Points.getColor(this.imagedata);

        return this;
    }

    createClass(Points, null, [{
        key: 'getImageData',
        value: function getImageData(img) {
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            return ctx.getImageData(0, 0, canvas.width, canvas.height);
        }
    }, {
        key: 'getVertes',
        value: function getVertes(pixels) {
            var vertiecs = [];
            var data = pixels.data;
            var width = pixels.width;
            var height = pixels.height;

            for (var i = 0; i < width; i++) {
                for (var j = 0; j < height; j++) {
                    vertiecs.push(Points.calposition(j, height), -Points.calposition(i, width), 0);
                }
            }
            return vertiecs;
        }
    }, {
        key: 'getColor',
        value: function getColor(pixels) {
            var colors = [];
            var data = pixels.data;

            for (var i = 0, len = data.length; i < len; i += 4) {
                colors.push(data[i] / 1000, data[i + 1] / 1000, data[i + 2] / 1000, data[i + 3] / 1000);
            }

            return colors;
        }
    }, {
        key: 'calposition',
        value: function calposition(n, m) {
            var t = 2 * n - m + 1;
            return t / 1000;
        }
    }]);
    return Points;
}();

var Transform$1 = function Transform$1() {
    classCallCheck(this, Transform$1);
    this.x = 0;
    this.y = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.rotation = 0;
    this.skewX = 0;
    this.skewY = 0;
    this.pivotX = 0;
    this.pivotY = 0;
};

var Window$1 = function Window$1() {
    classCallCheck(this, Window$1);
    this.width = 350;
    this.level = 50;

    return this;
};

var DisplayObject = function () {
    function DisplayObject() {
        classCallCheck(this, DisplayObject);
        this.alpha = 1;
        this.filterArea = '';
        this.filters = [];
        this.transform = new Transform$1();

        return this;
    }

    createClass(DisplayObject, [{
        key: 'destory',
        value: function destory() {}
    }]);
    return DisplayObject;
}();

var Container = function (_DisplayObject) {
    inherits(Container, _DisplayObject);

    function Container() {
        var _ret;

        classCallCheck(this, Container);

        var _this = possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this));

        _this.sprites = [];

        return _ret = _this, possibleConstructorReturn(_this, _ret);
    }

    createClass(Container, [{
        key: 'addChild',
        value: function addChild(sprite) {
            this.sprites.push(sprite);
            return this;
        }
    }, {
        key: 'destory',
        value: function destory() {}
    }, {
        key: 'clear',
        value: function clear() {}
    }]);
    return Container;
}(DisplayObject);

var Renderer = function () {
    function Renderer(width, height) {
        classCallCheck(this, Renderer);
        this.width = 0;
        this.height = 0;
        this.view = {};
        this.gl = {};

        this.width = width;
        this.height = height;
        this.view = Renderer.createCanvas(width, height);
        this.gl = Renderer.createContext(this.view);
        var gl = this.gl;
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.enable(gl.DEPTH_TEST); // 开启“深度测试”, Z-缓存
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SPC_ALPHA);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // 清除颜色和深度缓存

        return this;
    }
    /**
     * @param {number} width
     * @param {number} height
     * @returns {DOM_canvas} canvas
     */


    createClass(Renderer, [{
        key: 'render',
        value: function render(stage) {
            this.clear();
            this.initSprites(stage.sprites);
        }
    }, {
        key: 'initSprites',
        value: function initSprites(sprites) {
            var _this = this;

            sprites.forEach(function (item, index) {
                item.draw(_this.gl);
            });
        }
    }, {
        key: 'clear',
        value: function clear() {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        }
    }], [{
        key: 'createCanvas',
        value: function createCanvas(width, height) {
            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            return canvas;
        }

        /**
         * @param {DOM_canvas} canvas
         */

    }, {
        key: 'createContext',
        value: function createContext(canvas) {
            var gl = void 0;
            try {
                gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            } catch (e) {}

            if (!gl) {
                alert("WebGL初始化失败，可能是因为您的浏览器不支持。");
                gl = null;
            }
            return gl;
        }
    }]);
    return Renderer;
}();

/**
 * @class
 * @memberof PIXI.glCore.shader
 * @param type {String}
 * @return {Number}
 */
var mapSize = function mapSize(type) {
    return GLSL_TO_SIZE[type];
};

var GLSL_TO_SIZE = {
    'float': 1,
    'vec2': 2,
    'vec3': 3,
    'vec4': 4,

    'int': 1,
    'ivec2': 2,
    'ivec3': 3,
    'ivec4': 4,

    'bool': 1,
    'bvec2': 2,
    'bvec3': 3,
    'bvec4': 4,

    'mat2': 4,
    'mat3': 9,
    'mat4': 16,

    'sampler2D': 1
};

var mapSize$2 = function mapSize$2(gl, type) {
    if (!GL_TABLE) {
        var typeNames = Object.keys(GL_TO_GLSL_TYPES);

        GL_TABLE = {};

        for (var i = 0; i < typeNames.length; ++i) {
            var tn = typeNames[i];
            GL_TABLE[gl[tn]] = GL_TO_GLSL_TYPES[tn];
        }
    }

    return GL_TABLE[type];
};

var GL_TABLE = null;

var GL_TO_GLSL_TYPES = {
    'FLOAT': 'float',
    'FLOAT_VEC2': 'vec2',
    'FLOAT_VEC3': 'vec3',
    'FLOAT_VEC4': 'vec4',

    'INT': 'int',
    'INT_VEC2': 'ivec2',
    'INT_VEC3': 'ivec3',
    'INT_VEC4': 'ivec4',

    'BOOL': 'bool',
    'BOOL_VEC2': 'bvec2',
    'BOOL_VEC3': 'bvec3',
    'BOOL_VEC4': 'bvec4',

    'FLOAT_MAT2': 'mat2',
    'FLOAT_MAT3': 'mat3',
    'FLOAT_MAT4': 'mat4',

    'SAMPLER_2D': 'sampler2D'
};

var Shader = function () {
    function Shader(gl, vertexSrc, fragmentSrc) {
        classCallCheck(this, Shader);
        this.gl = {};
        this.program = {};
        this.attributes = {};


        this.gl = gl;
        this.program = Shader.compileProgram(gl, vertexSrc, fragmentSrc);
        this.attributes = Shader.bind(gl, this.program);
        return this;
    }

    createClass(Shader, null, [{
        key: 'bind',
        value: function bind(gl, program) {
            var attributes = {};
            var totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

            for (var i = 0; i < totalAttributes; i++) {
                var attribData = gl.getActiveAttrib(program, i);
                var type = mapSize$2(gl, attribData.type);

                attributes[attribData.name] = {
                    type: type,
                    size: mapSize(type),
                    location: gl.getAttribLocation(program, attribData.name),
                    pointer: pointer
                };
            }

            return attributes;
        }
    }, {
        key: 'compileProgram',
        value: function compileProgram(gl, vertexSrc, fragmentSrc) {

            var glVertShader = Shader.compileShader(gl, gl.VERTEX_SHADER, vertexSrc);
            var glFragShader = Shader.compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);

            var program = gl.createProgram();

            gl.attachShader(program, glVertShader);
            gl.attachShader(program, glFragShader);
            gl.linkProgram(program);
            gl.useProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error('MACL Error: Could not initialize shader.');
                console.error('gl.VALIDATE_STATUS', gl.getProgramParameter(program, gl.VALIDATE_STATUS));
                console.error('gl.getError()', gl.getError());

                if (gl.getProgramInfoLog(program) !== '') {
                    console.warn('MACL Warning: gl.getProgramInfoLog()', gl.getProgramInfoLog(program));
                }

                gl.deleteProgram(program);
                program = null;
            }

            gl.deleteShader(glVertShader);
            gl.deleteShader(glFragShader);

            return program;
        }
    }, {
        key: 'compileShader',
        value: function compileShader(gl, type, src) {
            var shader = gl.createShader(type);

            gl.shaderSource(shader, src);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.log(gl.getShaderInfoLog(shader));
                return null;
            }

            return shader;
        }
    }, {
        key: 'getShaderElementById',
        value: function getShaderElementById(id) {
            var shaderScript = document.getElementById(id);

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
        }
    }]);
    return Shader;
}();

var pointer = function pointer(gl, type, normalized, stride, start) {
    gl.vertexAttribPointer(this.location, this.size, type || gl.FLOAT, normalized || false, stride || 0, start || 0);
};

var Buffer = function () {
    function Buffer(gl, data) {
        classCallCheck(this, Buffer);


        this.data = data;
        this.gl = gl;
        this.DataBuffer = this.createBuffer();
        return this;
    }

    createClass(Buffer, [{
        key: "createBuffer",
        value: function createBuffer() {
            var gl = this.gl;
            var DataBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, DataBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
            return DataBuffer;
        }
    }, {
        key: "bind",
        value: function bind(buffer) {
            var gl = this.gl;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        }
    }]);
    return Buffer;
}();

// augment Sylvester some
var Matrix = window$1.Matrix || function () {};
Matrix.Translation = function (v) {
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

Matrix.prototype.flatten = function () {
    var result = [];
    if (this.elements.length == 0) return [];

    for (var j = 0; j < this.elements[0].length; j++) {
        for (var i = 0; i < this.elements.length; i++) {
            result.push(this.elements[i][j]);
        }
    }return result;
};

Matrix.prototype.ensure4x4 = function () {
    if (this.elements.length == 4 && this.elements[0].length == 4) return this;

    if (this.elements.length > 4 || this.elements[0].length > 4) return null;

    for (var i = 0; i < this.elements.length; i++) {
        for (var j = this.elements[i].length; j < 4; j++) {
            if (i == j) this.elements[i].push(1);else this.elements[i].push(0);
        }
    }

    for (var i = this.elements.length; i < 4; i++) {
        if (i == 0) this.elements.push([1, 0, 0, 0]);else if (i == 1) this.elements.push([0, 1, 0, 0]);else if (i == 2) this.elements.push([0, 0, 1, 0]);else if (i == 3) this.elements.push([0, 0, 0, 1]);
    }

    return this;
};

Matrix.prototype.make3x3 = function () {
    if (this.elements.length != 4 || this.elements[0].length != 4) return null;

    return Matrix.create([[this.elements[0][0], this.elements[0][1], this.elements[0][2]], [this.elements[1][0], this.elements[1][1], this.elements[1][2]], [this.elements[2][0], this.elements[2][1], this.elements[2][2]]]);
};

var Vector = window$1.Vector || function () {};

Vector.prototype.flatten = function () {
    return this.elements;
};

//
// gluPerspective
//
function makePerspective(fovy, aspect, znear, zfar) {
    var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
    var ymin = -ymax;
    var xmin = ymin * aspect;
    var xmax = ymax * aspect;

    return makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);
}

//
// glFrustum
//
function makeFrustum(left, right, bottom, top, znear, zfar) {
    var X = 2 * znear / (right - left);
    var Y = 2 * znear / (top - bottom);
    var A = (right + left) / (right - left);
    var B = (top + bottom) / (top - bottom);
    var C = -(zfar + znear) / (zfar - znear);
    var D = -2 * zfar * znear / (zfar - znear);

    return $M([[X, 0, A, 0], [0, Y, B, 0], [0, 0, C, D], [0, 0, -1, 0]]);
}

//
// Matrix utility functions
//

var mvMatrix = void 0;

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

var Dicom$1 = function (_Container) {
    inherits(Dicom, _Container);

    function Dicom(img) {
        var _ret;

        classCallCheck(this, Dicom);

        var _this = possibleConstructorReturn(this, (Dicom.__proto__ || Object.getPrototypeOf(Dicom)).call(this));

        _this.width = 0;
        _this.height = 0;
        _this.points = {};
        _this.window = {};
        _this.filters = [];

        _this.width = img.width;
        _this.height = img.height;
        _this.points = new Points$1(img);
        _this.window = new Window$1();

        return _ret = _this, possibleConstructorReturn(_this, _ret);
    }

    createClass(Dicom, [{
        key: 'draw',
        value: function draw(gl) {
            this.gl = gl;
            var SHADER = this.initShader(gl);
            var BUFFER = this.initBuffer(gl);

            BUFFER.VertiecsBuffer.bind(BUFFER.VertiecsBuffer.DataBuffer);
            SHADER.attributes.aVertexPosition.pointer.call(SHADER.attributes.aVertexPosition, gl);
            gl.enableVertexAttribArray('aVertexPosition');

            BUFFER.ColorsBuffer.bind(BUFFER.ColorsBuffer.DataBuffer);

            gl.enableVertexAttribArray('aVertexColor');

            SHADER.attributes.aVertexColor.pointer.call(SHADER.attributes.aVertexColor, gl);
            this.Uniform(SHADER.program);

            this.showDraw();
        }
    }, {
        key: 'initShader',
        value: function initShader() {
            var gl = this.gl;
            var vertexSrc = Shader.getShaderElementById('shader-vs');
            var fragmentSrc = Shader.getShaderElementById('shader-fs');

            return new Shader(gl, vertexSrc, fragmentSrc);
        }
    }, {
        key: 'initBuffer',
        value: function initBuffer() {
            var gl = this.gl;
            var VertiecsBuffer = new Buffer(gl, this.points.vertiecs);
            var ColorsBuffer = new Buffer(gl, this.points.colors);
            return { VertiecsBuffer: VertiecsBuffer, ColorsBuffer: ColorsBuffer };
        }
    }, {
        key: 'Uniform',
        value: function Uniform(shaderProgram) {
            var roate = this.width / this.height;
            var perspectiveMatrix = makePerspective(45, roate, 0.0001, 1000000000.0);

            loadIdentity();

            mvTranslate([-0.0, 0.0, -1.5]);
            setMatrixUniforms(this.gl, shaderProgram, perspectiveMatrix);
        }
    }, {
        key: 'showDraw',
        value: function showDraw() {
            this.gl.drawArrays(this.gl.POINTS, 0, 262144);
        }
    }]);
    return Dicom;
}(Container);

var Series = function () {
    function Series(series) {
        classCallCheck(this, Series);

        this.data = series;
        this.dom_id = '';
        this.renderer = {};
        this.stages = {};
        this.loadStage();

        return this;
    }

    createClass(Series, [{
        key: 'loadStage',
        value: function loadStage() {
            var _this = this;

            var imgs = this.data.images;
            var self = this;

            var _loop = function _loop(i) {
                var uri = JSON.parse(imgs[i].frames[0].uri);
                var id = uri.lossless;
                _this.stages[id] = new Container();
                Service.ImageServer.get(id, function (img) {
                    var dicom = new Dicom$1(img);
                    _this.stages[id].addChild(dicom);
                    if (i == 0) {
                        _this.renderer.render(_this.stages[id]);
                    }
                });
            };

            for (var i = 0; i < imgs.length; i++) {
                _loop(i);
            }
        }
    }, {
        key: 'show',
        value: function show(id) {
            if (!id) {
                var imgs = this.data.images;
                var uri = JSON.parse(imgs[0].frames[0].uri);
                id = uri.lossless;
            }

            this.renderer.render(this.stages[id]);
        }
    }, {
        key: 'creatView',
        value: function creatView(id) {
            this.dom_id = id;
            var parentRenderer = document.getElementById(id);
            this.renderer = new Renderer(parentRenderer.offsetWidth, parentRenderer.offsetHeight);
            if (!parentRenderer) {
                throw new Error(id + ' is not exsit');
            }
            parentRenderer.appendChild(this.renderer.view);
        }
    }]);
    return Series;
}();

/**
 * 节流运行
 * @param {Function} fn
 * @param {number} interval
 * @returns
 */
var throttle = function throttle(fn, interval) {
    var _self = fn,
        timer = void 0,
        firstTime = true;

    return function () {
        var args = arguments,
            _me = this;

        if (firstTime) {
            _self.apply(_me, args);
            return firstTime = false;
        }

        if (timer) {
            return false;
        }

        timer = setTimeout(function () {
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
var timeChunk = function timeChunk(ary, fn, count) {
    var obj = void 0,
        t = void 0;
    var len = ary.length;
    var start = function start() {
        for (var i = 0; i < Math.min(count || 1, ary.length); i++) {
            var _obj = ary.shift();
            fn(_obj);
        }
    };

    return function () {
        t = setInterval(function () {
            if (ary.length === 0) {
                return clearInterval(t);
            }
            start();
        }, 200);
    };
};

var timerun = {
    throttle: throttle,
    timeChunk: timeChunk
};

// import Dicom from './dicom';
var View = function () {
    function View(series, options) {
        classCallCheck(this, View);

        this.series = new Series(series);
        this.series.creatView('glcanvas');
        this.series.loadStage();
        // this.options = options;
        // this._select = options && options.select || 0;
        // this._canvas = document.createElement('canvas');
        // this.select(0);
        // let self = this;

        return this;
    }

    createClass(View, [{
        key: 'select',
        value: function select(index) {
            if (!index) {
                this._select = index || 0;
            }
            new Dicom(this._series.images[this._select]).start();
            return this;
        }
    }, {
        key: 'load',
        value: function load() {
            this._length = this._series.images.length;
            this._renderers = [];
            var self = this;
            var Count = 0;
            self._process = 0;
            timerun.timeChunk(self._series.images, function (image) {
                var renderer = new Dicom(image);
                self._renderers.push(renderer);
                renderer._emitter.once('image-loadover', function () {
                    Count++;
                    self._process = Count / self._length;
                    console.log('Image loading:%d\%', self._process * 100);
                });
            }, config.TIMERUN_COUNT)();
            return this;
        }
    }, {
        key: 'getProcess',
        value: function getProcess() {
            return this._process;
        }
    }, {
        key: 'play',
        value: function play() {
            var self = this;
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
    }]);
    return View;
}();

var ImageFactory = function () {
    function ImageFactory(str) {
        classCallCheck(this, ImageFactory);

        this.name = 'image-' + str;
        this._images = {};
        this.count = 0;
    }

    createClass(ImageFactory, [{
        key: 'get',
        value: function get(id) {
            if (!id) {
                id = 'image-root-' + this.count;
            }

            if (!this._images[id]) {
                var img = new Image();
                if (/image-root/i.test(id)) {
                    img.src = config.URL.IMAGE.replace(/(\$\{|\})/g, '');
                } else {
                    img.src = config.URL.IMAGE.replace(/\$\{\w+\}/g, id);
                }

                this._images[id] = img;
            }
            return this._images[id];
        }
    }]);
    return ImageFactory;
}();

var ImageFactory$1 = new ImageFactory('image');

var Tools = function () {
    var dom_tools = document.createElement('div');

    return dom_tools;
};

var Tool = function Tool(name) {
    classCallCheck(this, Tool);

    this._name = name;
    return document.createElement('div');
};

var Aside = function (serieses) {

    var dom_aside = document.createElement('div');
    dom_aside.className = "aside";

    var dom_serieses = document.createElement('div');
    dom_aside.appendChild(dom_serieses);

    dom_serieses.className = "serieses";

    for (var i = 0, i_len = serieses.length; i < i_len; i++) {
        dom_serieses.appendChild(new Series$2(serieses[i]));
    }

    dom_aside.appendChild(Tools());
    console.dir(new Series$2(serieses[0]));
    return dom_aside;
};

var Series$2 = function () {
    function Series(series) {
        classCallCheck(this, Series);

        this._series = series;
        this.createDom(series.images[0].frames[0].thumbnailUri);
        return this._DOM;
    }

    createClass(Series, [{
        key: 'createDom',
        value: function createDom(url) {
            this._DOM = document.createElement('div');
            this._DOM.className = "series";
            // this._DOM.style.position = "relative";
            // this._DOM.style.margin = "10px 2px";
            // this._DOM.style["padding"] = "5px 0px";
            // this._DOM.style["text-align"] = "center";
            this._DOM.appendChild(this.ImageDom(url));
        }
    }, {
        key: 'ImageDom',
        value: function ImageDom(url) {
            var img = document.createElement('img');
            img.src = ImageFactory$1.get(url).src;
            img.width = 80;
            img.height = 80;
            return img;
        }
    }]);
    return Series;
}();

var Buffer$1 = function () {

    /**
     * @param {object} gl
     * @param {number[]} vertices
     * @param {number[]} colors
     */
    function Buffer(gl, vertices, colors) {
        classCallCheck(this, Buffer);

        this.gl = gl;
        this.vertices = vertices || [];
        this.colors = colors || [];
    }

    createClass(Buffer, [{
        key: "run",
        value: function run() {

            var gl = this.gl;
            var VerticesBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, VerticesBuffer);
            var vertices = this.vertices || [1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, -1.0, 0.0];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            var colors = this.colors || [1.0, 1.0, 1.0, 1.0, // white
            1.0, 0.0, 0.0, 1.0, // red
            0.0, 1.0, 0.0, 1.0, // green
            0.0, 0.0, 1.0, 1.0 // blue
            ];

            var VerticesColorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, VerticesColorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

            this.VerticesBuffer = VerticesBuffer;
            this.VerticesColorBuffer = VerticesColorBuffer;
        }
    }]);
    return Buffer;
}();

var Shader$1 = function () {

    /**
     * @param {Object} gl
     * @param {String|Array.<string>} vertexSrc
     * @param {String|Array.<string>} fragmentSrc 
     */
    function Shader(gl, vertexSrc, fragmentSrc) {
        classCallCheck(this, Shader);

        this.gl = gl;
        this.vertexSrc = vertexSrc || '';
        this.fragmentSrc = fragmentSrc || '';
        return this;
    }

    createClass(Shader, [{
        key: 'run',
        value: function run() {

            this.vertexShader = this.createShader(this.vertexSrc, 'vertex');
            this.fragmentShader = this.createShader(this.fragmentSrc, 'fragment');
            var gl = this.gl;
            var shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, this.vertexShader);
            gl.attachShader(shaderProgram, this.fragmentShader);
            gl.linkProgram(shaderProgram);

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shader));
            }

            gl.useProgram(shaderProgram);

            var vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");

            gl.enableVertexAttribArray(vertexPositionAttribute);

            var vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
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

    }, {
        key: 'createShader',
        value: function createShader(source, type) {
            var type_Shader = void 0;
            if (type == 'fragment') {
                type_Shader = this.gl.FRAGMENT_SHADER;
            } else if (type == 'vertex') {
                type_Shader = this.gl.VERTEX_SHADER;
            } else {
                return void 0;
            }
            var shader = this.gl.createShader(type_Shader);

            this.gl.shaderSource(shader, source);
            this.gl.compileShader(shader);
            if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                alert("An error occurred compiling the shaders: " + this.gl.getShaderInfoLog(shader));
                return null;
            }
            return shader;
        }
    }]);
    return Shader;
}();

Shader$1.getShaderElementById = function (id) {
    var shaderScript = document.getElementById(id);

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

// WebGL的全局变量;
var gl = void 0;

var macl = {};



function _initWebGL(canvas) {
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
    var perspectiveMatrix = makePerspective(45, roate, 0.000000001, 1000000000.0);

    loadIdentity();

    mvTranslate([-0.0, 0.0, -1.5]);

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
    gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

    setMatrixUniforms(gl, shaderProgram, perspectiveMatrix);

    gl.drawArrays(gl.POINTS, 0, 262144);
}

var coreGL = function () {
    function coreGL(options) {
        classCallCheck(this, coreGL);

        this._options = options;
        this.id = options.id;
    }

    createClass(coreGL, [{
        key: 'initWebGL',
        value: function initWebGL() {
            var root = document.getElementById(id);
            var canvas = document.createElement('canvas');
            canvas.width = root.offsetWidth;
            macl.width = root.offsetWidth;
            canvas.height = root.offsetHeight;
            macl.height = root.offsetHeight;

            root.appendChild(canvas);
            gl = _initWebGL(canvas);
        }
    }]);
    return coreGL;
}();

var handler_1234 = new Handler();

handler_1234.on('onload', function (data) {
    if (data) {
        $("#aside")[0].appendChild(Aside(data.study.serieses));
        new View(data.study.serieses[0]);
    }
});

var main = {};

return main;

}(fetch,Emitter,window));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvbWFpbi5qcyIsInNvdXJjZXMiOltdLCJzb3VyY2VzQ29udGVudCI6W10sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7In0=
