import PIXI from 'PIXI';
import config from '../../config.json';
import ImageFactory from './image-factory';

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
        var image = new PIXI.Sprite.from(ImageFactory.get(id));
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

export default render;