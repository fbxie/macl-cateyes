import PIXI from 'PIXI';
import Emitter from 'Emitter';
import config from '../../config.json';
import ImageFactory from './image-factory';
import './pixi-util';


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

        this.imgs = ImageFactory.get(id);

        this.imgs.onload = () => {
            //创建canvas
            this._canvas = PIXI.Texture.Draw(function (canvas) {
                canvas.width = self.imgs.width;
                canvas.height = self.imgs.height;
                let ctx = canvas.getContext('2d');
                ctx.drawImage(self.imgs, 0, 0);
                let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
                ctx.putImageData(self.toGray(pixels), 0, 0);
            });

            let imageSprite = new PIXI.Sprite(self._canvas); //创建图片精灵；
            // let noiseFilter = new PIXI.filters.NoiseFilter(); //图片去燥过滤；
            // imageSprite.filters = [noiseFilter];

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

        let min = (255<<16)+(255<<8)+255;

        for (let i = 0, i_len = pixels.data.length; i < i_len; i += 4) {
            let gray = (pixels.data[i] << 16) + (pixels.data[i + 1] << 8) + (pixels.data[i + 2]);
            min = Math.min(min, gray);
            gray = getGray(gray-1023, minGray, grayWidth);
            pixels.data[i] = gray;
            pixels.data[i + 1] = gray;
            pixels.data[i + 2] = gray;
        }

        console.dir(min);
        return pixels;

        function getGray(number, min, width) {
            let roate = width / 255;
            if (number < min) {
                number = 0;
            } else if (number > (min + width)) {
                number = 255;
            } else {
                number = Math.ceil(number / roate);
            }
            return number;
        }
    }



}

export default render;