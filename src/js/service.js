import config from '../config.json';
import fetch from 'fetch';
import Emitter from 'Emitter';

/**
 * @class 
 */
class BaseServer {

    constructor(name, url) {
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
    get(id, ...args) {

        if (!id) id = `root`;

        let callback = args[args.length - 1];
        if (!callback && typeof callback != 'function') throw new Error('last params must be a function');

        this.emitter.once(`${this.name}-${id}`, data => callback(data)); //订阅事件dicom

        if (this.entities[id]) {
            return this.emitter.emit(`${this.name}-${id}`, this.entities[id]);
        }

        if (this.status[id]) {
            return;
        }

        let URL;
        if (/root/i.test(id)) {
            URL = this.url.replace(/(\$\{|\})/g, '');
        } else {
            URL = this.url.replace(/\$\{\w+\}/g, id);
        }

        this.status[id] = true;
        let self = this;
        this._require = {
            URL,
            id
        };
        this.requireGet();
    }

    requireGet() {
        let self = this;
        let {
            URL,
            id
        } = this._require;
        fetch(URL, {
                method: 'GET',
                mode: 'same-origin',
                headers: {
                    // 'Accept ': 'application / json ',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            }).then(res => res.json())
            .then(res => {
                if (config.CACHE) {
                    self.entities[id] = res.data
                };
                self.emitter.emit(`${self.name}-${id}`, res.data);
            }).then(res => {
                self.status[id] = false;
            }).catch(res => {
                // self.status[id] = false;
                // throw new Error(res);
            });
    }
}

class DicomServer extends BaseServer {
    constructor() {
        super('dicom', config.URL.DICOM);
    }
}
class ImageServer extends BaseServer {
    constructor() {
        super('image', config.URL.IMAGE);
    }
    requireGet() {
        let self = this;
        let {
            URL,
            id
        } = this._require;
        let imgs = new Image();
        imgs.src = URL;
        imgs.onload = function () {
            if (config.CACHE) {
                self.entities[id] = imgs;
            };
            self.emitter.emit(`${self.name}-${id}`, imgs);
            self.status[id] = false;
        };

        imgs.onerror = function () {
            self.emitter.emit(`${self.name}-${id}`, null);
            self.status[id] = false;
        };
    };
}

export default {
    ImageServer: new ImageServer(),
    DicomServer: new DicomServer()
};