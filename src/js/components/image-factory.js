import config from '../../config.json';

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

export default new ImageFactory('image');