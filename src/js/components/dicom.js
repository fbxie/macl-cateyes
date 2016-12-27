import Emitter from 'Emitter';
import config from '../../config.json';
import ImageFactory from './image-factory';
// import coreGL from '../macl/core-gl';

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
            // this._emitter.once(`loadover`, data => coreGL.start("glcanvas", this._macldata.vertiecs, this._macldata.colors));
        } else {
            coreGL.start("glcanvas", this._macldata.vertiecs, this._macldata.colors);
        }
        return this;
    }

    Init(id) {
        this._img = ImageFactory.get(id);
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

export default Dicom;