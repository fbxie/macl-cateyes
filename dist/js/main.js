(function (fetch,Emitter,PIXI) {
'use strict';

fetch = 'default' in fetch ? fetch['default'] : fetch;
Emitter = 'default' in Emitter ? Emitter['default'] : Emitter;
PIXI = 'default' in PIXI ? PIXI['default'] : PIXI;

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

PIXI.Texture.Draw = function (cb) {
    var canvas = document.createElement('canvas');
    if (typeof cb == 'function') cb(canvas);
    return PIXI.Texture.fromCanvas(canvas);
};


PIXI.myGrayFilter = function(uniforms){
    PIXI.AbstractFilter.call( this );
 
    this.passes = [this];
 
    // set the uniforms
    this.uniforms = uniforms;
    this.fragmentSrc = [
        "varying vec2 vTextureCoord;\n",
        "uniform sampler2D uSampler;\n",
        "uniform float roate;\n",
        "uniform float min;\n",
        "uniform float max;\n",
        "void main(void){\n",
        "   vec3 c = texture2D(uSampler, vTextureCoord).rgb;\n",
        "   c.r *= 255.0; c.g *= 255.0; c.b *= 255.0;\n",
        "   c.r = (c.r * 65536.0) + (c.g * 256.0) + (c.b);\n",
        "   c.r = (c.r >= min || c.r <= max) ? c.r : 0.0;\n",
        "   c.r = c.r - min;\n",
        "   c.r = c.r / roate;\n",
        "   c.r = (c.r >= 0.0 || c.r <= 255.0) ? gray : 0.0;\n",
        "   gl_FragColor.r = gray / 255.0;\n",
        "   gl_FragColor.g = gray / 255.0;\n",
        "   gl_FragColor.b = gray / 255.0;\n",
        "}\n"
    ];
};
 
PIXI.myGrayFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.myGrayFilter.prototype.constructor = PIXI.myGrayFilter;

let dom_main = $("#main div");
let renderer = PIXI.autoDetectRenderer(dom_main[0].offsetWidth, dom_main[0].offsetHeight);
dom_main[0].appendChild(renderer.view);

class render {

    constructor(image) {
        this._image = image;
        this._stage = new PIXI.Container();
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

            let imageSprite = new PIXI.Sprite.from(self.imgs);


            let Filter = new PIXI.filters.ColorMatrixFilter();
            console.dir(Filter);
            let myFilter = self.GrayFilterGLSL();
           

            imageSprite.filters = [myFilter];

            self.position(imageSprite); //设置图片位置；
            self._stage.addChild(imageSprite);

            this._image_status[`image-loadover`] = true;
            this._emitter.emit(`image-loadover`, self._stage);
        };

        return this;
    }

    start() {
        if (!this._image_status[`image-loadover`]) {
            this._emitter.once(`image-loadover`, data => renderer.render(data));
        } else {
            renderer.render(this._stage);
        }
        return this;
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
        let vertexSrc = [
            "attribute vec2 aVertexPosition;",
            "attribute vec2 aTextureCoord;",
            
            // "uniform mat3 projectionMatrix;",
            "varying vec2 vTextureCoord;",
            "void main() {",
                "gl_Position = vec4((vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);",
                
                // "gl_Position = aVertexPosition;",
                "vTextureCoord = aTextureCoord;",
                // "vColor = aColor;",
            "}\n"
        ].join('');
        // let fragmentSrc = [
        //     "precision mediump float;",
        //     "varying vec2 vTextureCoord;\n",
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

        let fragmentSrc = [
            "precision mediump float;",
            "varying vec4 vColor;\n",
            "varying vec2 vTextureCoord;",
            "uniform sampler2D uSampler;\n",
            "uniform float width;\n",
            "uniform float min;\n",
            "uniform float max;\n",
            "void main(void){\n",
            "   vec4 c = texture2D(uSampler, vTextureCoord);\n",
            "   gl_FragColor =c;\n",
            // "   gl_FragColor =vColor;\n",
            "\n",
            "}\n"
        ].join('');
        console.log(vertexSrc);
        console.log(fragmentSrc);



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
        

        return new PIXI.AbstractFilter(vertexSrc,fragmentSrc , uniforms);
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
        var self = this;
        let Count = 0;
        self._process =0;
        timerun.timeChunk(self._series.images, function (image) {
            let renderer = new render(image);
            self._renderers.push(renderer);
            renderer._emitter.once('image-loadover',function(){
                Count++;
                self._process = Count/(self._length-1);
                console.log('Image loading:%d\%',self._process*100);                
            });            
        }, config.TIMERUN_COUNT)();
        return this;
    }

    getProcess(){
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
        var img = document.createElement('img');
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

}(fetch,Emitter,PIXI));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvbWFpbi5qcyIsInNvdXJjZXMiOltdLCJzb3VyY2VzQ29udGVudCI6W10sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7In0=
