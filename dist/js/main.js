(function (fetch,Emitter,PIXI) {
'use strict';

fetch = 'default' in fetch ? fetch['default'] : fetch;
Emitter = 'default' in Emitter ? Emitter['default'] : Emitter;
PIXI = 'default' in PIXI ? PIXI['default'] : PIXI;

var URL = {"DICOM":"/service/fileRes/dcmJson?listId=${668e1ab0a540451c9d85a864afb62ef2}","IMAGE":"/upload/api/1.0.0/file/acquisition/${46f27325b62793aa776e3dd8b85a8367}"};
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

let dom_main = $("#main div");
let renderer = PIXI.autoDetectRenderer(dom_main[0].offsetWidth, dom_main[0].offsetHeight);
dom_main[0].appendChild(renderer.view);

class render {

    constructor(image) {
        this._image = image;
        this._stage = new PIXI.Container();

        let id = JSON.parse(image.frames[0].uri).lossless;
        // let id = image.frames[0].thumbnailUri;
        // var texture = PIXI.utils.TextureCache();
        var image = new PIXI.Sprite.from(ImageFactory$1.get(id));
        var filter = new PIXI.filters.ColorMatrixFilter();
        image.filters = [filter];

        console.dir(filter);
        // for(var i=0,len = filter.matrix; i< len;i++){
        //     filter.matrix[i] = 255;
        // }
        
        this._stage.addChild(image);
        return this;
    }

    start() {
        renderer.render(this._stage);
        return this;
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
        this._select = options && options.select || 0;

        this.select(0);
        this.load();

        let self = this;

        // setTimeout(function () {
        //     self.play()
        // }, 2000);
        return this;
    }

    select(index) {
        if (!index) {
            this._select = index || 0;
        }
        new render(this._series.images[this._select]).start();
        return this;
    }

    load() {
        this._length = this._series.images.length;
        this._renderers = [];
        var self = this;

        timerun.timeChunk(self._series.images, function (image) {
            self._renderers.push(new render(image));
        }, config.TIMERUN_COUNT)();
        return this;
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

let handler_1234 = new Handler();

handler_1234.on('onload',function (data){
    new View(data.study.serieses[0]);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvbWFpbi5qcyIsInNvdXJjZXMiOltdLCJzb3VyY2VzQ29udGVudCI6W10sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
