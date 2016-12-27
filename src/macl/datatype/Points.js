export class Points {
    vertiecs = [];
    colors = [];
    imagedata = {};

    constructor(img) {
        this.imagedata = Points.getImageData(img);
        this.vertiecs = Points.getVertes(this.imagedata);
        this.colors = Points.getColor(this.imagedata);

        return this;
    }

    static getImageData(img) {
        let canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    static getVertes(pixels) {
        let vertiecs = [];
        let data = pixels.data;
        let width = pixels.width;
        let height = pixels.height;

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                vertiecs.push(Points.calposition(j, height), -Points.calposition(i, width), 0);
            }
        }
        return vertiecs;
    }

    static getColor(pixels) {
        let colors = [];
        let data = pixels.data;

        for (let i = 0, len = data.length; i < len; i += 4) {
            colors.push(data[i] / 1000, data[i + 1] / 1000, data[i + 2] / 1000, data[i + 3] / 1000);
        }

        return colors;
    }

    static calposition(n, m) {
        let t = 2 * n - m + 1;
        return t / 1000;
    }
}