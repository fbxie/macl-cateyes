import PIXI from 'PIXI';
import render from './render';
import timerun from '../utils/timerun';
import config from '../../config.json';

export default class View {
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
                animate()
            }, config.ANIMATE_TIME);
        }
    }
}