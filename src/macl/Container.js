import {DisplayObject} from './DisplayObject';

export class Container extends DisplayObject {
    sprites = [];
    constructor() {
        super();
        return this;
    }

    addChild(sprite) {
        this.sprites.push(sprite);
        return this;
    }
    destory() {

    }

    clear() {

    }
}
