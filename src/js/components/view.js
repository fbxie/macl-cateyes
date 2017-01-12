// import Dicom from './dicom';
import Series from './series';
import timerun from '../utils/timerun';
import config from '../../config.json';

export default class View {
    constructor(series, options) {

        this.series = new Series(series);
        this.series.creatView('glcanvas');
        // this.options = options;
        // this._select = options && options.select || 0;
        // this._canvas = document.createElement('canvas');
        // this.select(0);
        // let self = this;

        return this;
    }

    select(index) {
        if (!index) {
            this._select = index || 0;
        }
        new Dicom(this._series.images[this._select]).start();
        return this;
    }

    load() {
        this._length = this._series.images.length;
        this._renderers = [];
        let self = this;
        let Count = 0;
        self._process = 0;
        timerun.timeChunk(self._series.images, function (image) {
            let renderer = new Dicom(image);
            self._renderers.push(renderer);
            renderer._emitter.once('image-loadover', function () {
                Count++;
                self._process = Count / self._length;
                console.log('Image loading:%d\%', self._process * 100);
            });
        }, config.TIMERUN_COUNT)();
        return this;
    }

    getProcess() {
        return this._process;
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

            setTimeout(function () {
                animate()
            }, config.ANIMATE_TIME);
        }
    }
}