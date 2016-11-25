import config from '../config.json';
import fetch from 'fetch';
import Emitter from 'Emitter';

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

        let URL;
        if (/dicom-root/i.test(id)) {
            URL = config.URL.DICOM.replace(/(\$\{|\})/g, '');
        } else {
            URL = config.URL.DICOM.replace(/\$\{\w+\}/g, id);
        }

        this.dicom_status[id] = true;
        let self = this;
        fetch(URL, {
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
                    self.dicom[id] = res.data
                };
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

export default new Server();