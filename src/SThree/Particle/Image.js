import Base from './Base';
import Shader from '../Shader/index';
export default class PImage extends Base {
    vertiecs = [];
    colors = [];
    filters = [];
    constructor(img) {
        super();
        let pixels = PImage.getPixels(img);
        this.colors = PImage.getColor(pixels);
        this.vertiecs = PImage.getPosition(pixels);
        this.num = pixels.width * pixels.height;
        this.filters.push(new Shader.Cateyes());
        return this;
    }

    loadBuffer(gl) {
        this.gl = gl;
        let n = this.initBuffer(gl);
        if (n < 0) {
            console.log('Failed to set the vertex information');
            return false;
        }
        return true;
    }
    static getPixels(img) {
        let canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    static getColor(pixels) {
        let data = pixels.data;
        let color = [];
        for (let i = 0; i < data.length; i += 4) {
            color.push(data[i] / 1000, data[i + 1] / 1000, data[i + 2] / 1000, data[i + 3] / 1000);
        }
        return color;
    }

    static getPosition(pixels) {
        let data = pixels.data;
        let vertiecs = [];
        let calposition = (n, m) => {
            return (2 * n - m + 1) / 1000;
        };
        let width = pixels.width;
        let height = pixels.height;
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                vertiecs.push(calposition(j, height), -calposition(i, width), 0);
            }
        }

        return vertiecs;

    }

}