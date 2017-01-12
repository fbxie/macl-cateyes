var MACL_CATEYES = (function (fetch,Emitter) {
'use strict';

fetch = 'default' in fetch ? fetch['default'] : fetch;
Emitter = 'default' in Emitter ? Emitter['default'] : Emitter;

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

var Renderer = function () {
    function Renderer(width, height) {
        classCallCheck(this, Renderer);
        this.view = {};
        this.gl = {};

        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        this.view = canvas;
        this.gl = Renderer.create3DContext(canvas);
        return this;
    } //domElement


    createClass(Renderer, [{
        key: "render",

        /**
         * 显示
         */
        value: function render(particle) {
            var gl = this.gl;
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.enable(gl.DEPTH_TEST);

            var shader = particle.filters[0];
            this.gl.program = shader.initShader(this.gl);
            var n = particle.loadBuffer(this.gl);

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            gl.drawArrays(gl.POINTS, 0, n);
        }
    }], [{
        key: "create3DContext",
        value: function create3DContext(canvas, options) {

            var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
            var context = null;
            for (var i = 0; i < names.length; i++) {
                try {
                    context = canvas.getContext(names[i], options);
                } catch (e) {}

                if (context) {
                    break;
                }
            }

            return context;
        }
    }]);
    return Renderer;
}();

var Base = function () {
    function Base(gl, vertiecs, colors, num) {
        classCallCheck(this, Base);
        this.gl = {};
        this.vertiecs = [];
        this.colors = [];
        this.num = 0;

        this.vertiecs = vertiecs;
        this.colors = colors;
        this.num = num;
        return this;
    }

    createClass(Base, [{
        key: 'initBuffer',
        value: function initBuffer(gl) {
            this.gl = gl;
            // Write the vertex coordinates and color to the buffer object
            if (!Base.initArrayBuffer(this.gl, this.vertiecs, 3, gl.FLOAT, 'aVertexPosition')) return -1;

            if (!Base.initArrayBuffer(this.gl, this.colors, 4, gl.FLOAT, 'aVertexColor')) return -1;

            return this.num;
        }
    }], [{
        key: 'initArrayBuffer',
        value: function initArrayBuffer(gl, data, num, type, attribute) {
            // Create a buffer object
            var buffer = gl.createBuffer();
            if (!buffer) {
                console.log('Failed to create the buffer object');
                return false;
            }
            // Write date into the buffer object
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
            // Assign the buffer object to the attribute variable
            var a_attribute = gl.getAttribLocation(gl.program, attribute);
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
    }]);
    return Base;
}();

var Base$2 = function () {
    function Base(gl, vshader, fshader) {
        classCallCheck(this, Base);
        this.gl = {};
        this.vshader = {};
        this.fshader = {};
        this.program = {};

        this.gl = gl;
        this.vshader = vshader;
        this.fshader = fshader;

        return this;
    }

    createClass(Base, [{
        key: 'initShader',
        value: function initShader(gl) {
            this.gl = gl;
            this.program = Base.createProgram(this.gl, this.vshader, this.fshader);
            if (!this.program) {
                console.log('Failed to create program');
                return null;
            }

            gl.useProgram(this.program);
            gl.program = this.program;

            return this.program;
        }
    }], [{
        key: 'createProgram',
        value: function createProgram(gl, vshader, fshader) {
            // Create shader object
            var vertexShader = Base.loadShader(gl, gl.VERTEX_SHADER, vshader);
            var fragmentShader = Base.loadShader(gl, gl.FRAGMENT_SHADER, fshader);

            if (!vertexShader || !fragmentShader) {
                return null;
            }

            // Create a program object
            var program = gl.createProgram();
            if (!program) {
                return null;
            }

            // Attach the shader objects
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);

            // Link the program object
            gl.linkProgram(program);

            // Check the result of linking
            var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (!linked) {
                var error = gl.getProgramInfoLog(program);
                console.log('Failed to link program: ' + error);
                gl.deleteProgram(program);
                gl.deleteShader(fragmentShader);
                gl.deleteShader(vertexShader);
                return null;
            }
            return program;
        }
    }, {
        key: 'loadShader',
        value: function loadShader(gl, type, source) {
            // Create shader object
            var shader = gl.createShader(type);
            if (shader == null) {
                console.log('unable to create shader');
                return null;
            }

            // Set the shader program
            gl.shaderSource(shader, source);

            // Compile the shader
            gl.compileShader(shader);

            // Check the result of compilation
            var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (!compiled) {
                var error = gl.getShaderInfoLog(shader);
                console.log('Failed to compile shader: ' + error);
                gl.deleteShader(shader);
                return null;
            }

            return shader;
        }
    }]);
    return Base;
}();

var Cateyes = function (_Base) {
    inherits(Cateyes, _Base);

    function Cateyes(gl, vshader, fshader) {
        var _ret;

        classCallCheck(this, Cateyes);

        var _this = possibleConstructorReturn(this, (Cateyes.__proto__ || Object.getPrototypeOf(Cateyes)).call(this));

        _this.vshader = ['attribute vec3 aVertexPosition;', 'attribute vec4 aVertexColor;',
        // 'uniform mat4 uMVMatrix;',
        // 'uniform mat4 uPMatrix;',
        'varying lowp vec4 vColor;', 'void main(void) {', '   gl_Position =vec4(aVertexPosition, 1.0);',

        // '   gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);',
        '   gl_PointSize =11.4;', '   vec4 c = aVertexColor;', '   float gray = (c.r * 65536.0) + (c.g * 256.0) + (c.b);', '   gray = gray - 2047.0/1000.0;', '   gray = gray - 50.0/1000.0 + 350.0 / 2000.0;', '   gray = gray / 350.0*1000.0;', '   vColor = vec4(gray,gray,gray,1.0);', '}'].join('\n');
        _this.fshader = ['varying lowp vec4 vColor;', 'void main(void) {', 'gl_FragColor = vColor;', '} '].join('\n');

        _this.gl = gl;
        _this.vshader = vshader || _this.vshader;
        _this.fshader = fshader || _this.fshader;

        return _ret = _this, possibleConstructorReturn(_this, _ret);
    }

    return Cateyes;
}(Base$2);

var Shader = {
    Cateyes: Cateyes
};

var PImage$1 = function (_Base) {
    inherits(PImage, _Base);

    function PImage(img) {
        var _ret;

        classCallCheck(this, PImage);

        var _this = possibleConstructorReturn(this, (PImage.__proto__ || Object.getPrototypeOf(PImage)).call(this));

        _this.vertiecs = [];
        _this.colors = [];
        _this.filters = [];

        var pixels = PImage.getPixels(img);
        _this.colors = PImage.getColor(pixels);
        _this.vertiecs = PImage.getPosition(pixels);
        _this.num = pixels.width * pixels.height;
        _this.filters.push(new Shader.Cateyes());
        return _ret = _this, possibleConstructorReturn(_this, _ret);
    }

    createClass(PImage, [{
        key: 'loadBuffer',
        value: function loadBuffer(gl) {
            this.gl = gl;
            var n = this.initBuffer(gl);
            if (n < 0) {
                console.log('Failed to set the vertex information');
                return false;
            }
            return true;
        }
    }], [{
        key: 'getPixels',
        value: function getPixels(img) {
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            return ctx.getImageData(0, 0, canvas.width, canvas.height);
        }
    }, {
        key: 'getColor',
        value: function getColor(pixels) {
            var data = pixels.data;
            var color = [];
            for (var i = 0; i < data.length; i += 4) {
                color.push(data[i] / 1000, data[i + 1] / 1000, data[i + 2] / 1000, data[i + 3] / 1000);
            }
            return color;
        }
    }, {
        key: 'getPosition',
        value: function getPosition(pixels) {
            var data = pixels.data;
            var vertiecs = [];
            var calposition = function calposition(n, m) {
                return (2 * n - m + 1) / 1000;
            };
            var width = pixels.width;
            var height = pixels.height;
            for (var i = 0; i < width; i++) {
                for (var j = 0; j < height; j++) {
                    vertiecs.push(calposition(j, height), -calposition(i, width), 0);
                }
            }

            return vertiecs;
        }
    }]);
    return PImage;
}(Base);

var Particle = {
    PImage: PImage$1
};

var SThree = {
    Renderer: Renderer,
    Particle: Particle
};

var PImage = SThree.Particle.PImage;

var Series = function () {
    function Series(series) {
        classCallCheck(this, Series);
        this.data = {};
        this.dom_id = '';
        this.renderer = {};
        this.images = [];

        this.data = series;

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
                Service.ImageServer.get(id, function (img) {
                    var pimage = new PImage(img);
                    _this.images.push(pimage);

                    if (i == 0) {
                        _this.renderer.render(pimage);
                    }
                });
            };

            for (var i = 0; i < imgs.length; i++) {
                _loop(i);
            }
        }
    }, {
        key: 'show',
        value: function show(index) {
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

            if (!parentRenderer) {
                throw new Error(id + ' is not exsit');
            }
            this.renderer = new SThree.Renderer(parentRenderer.offsetWidth, parentRenderer.offsetHeight);

            parentRenderer.appendChild(this.renderer.view);

            this.loadStage();
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

var handler_1234 = new Handler();

handler_1234.on('onload', function (data) {
    if (data) {

        $("#aside")[0].appendChild(Aside(data.study.serieses));
        new View(data.study.serieses[0]);
    }
});

var main = {};

return main;

}(fetch,Emitter));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvbWFpbi5qcyIsInNvdXJjZXMiOltdLCJzb3VyY2VzQ29udGVudCI6W10sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
