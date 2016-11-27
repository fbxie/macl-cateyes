import render from './render';
import timerun from '../utils/timerun';
import config from '../../config.json';

export default class View {
    constructor(series, options) {
        this._series = series;
        this.options = options;
        this._select = options && options.select || 0;
        this._canvas = document.createElement('canvas');
        this.select(0);
        this.load();

        let self = this;

        // setTimeout(function () {
        //     self.play()
        // }, 4000);
        return this;
    }

    select(index) {
        if (!index) {
            this._select = index || 0;
        }
        console.dir(this._series);
        new render(this._series.images[this._select]).start();
        return this;
    }

    load() {
        this._length = this._series.images.length;
        this._renderers = [];
        var self = this;
        let Count = 0;
        self._process =0;
        timerun.timeChunk(self._series.images, function (image) {
            let renderer = new render(image);
            self._renderers.push(renderer);
            renderer._emitter.once('image-loadover',function(){
                Count++;
                self._process = Count/(self._length-1);
                console.log('Image loading:%d\%',self._process*100);                
            });            
        }, config.TIMERUN_COUNT)();
        return this;
    }

    getProcess(){
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
            //rotate the container!
            // render the root container
            setTimeout(function () {
                animate()
            }, config.ANIMATE_TIME);
        }
    }
}