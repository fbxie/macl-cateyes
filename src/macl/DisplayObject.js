import {
    Transform
} from './datatype/index';

export class DisplayObject {
    alpha = 1;
    filterArea = '';
    filters = [];
    transform = new Transform();

    constructor() {
        return this;
    }

    destory() {

    }
}