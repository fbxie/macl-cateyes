import {
    Container
} from './Container';

export class Renderer {
    width = 0;
    height = 0;
    view = {};
    gl = {};
    constructor(width, height) {
            this.width = width;
            this.height = height;
            this.view = Renderer.createCanvas(width, height);
            this.gl = Renderer.createContext(this.view);
            let gl = this.gl;
            gl.clearColor(1.0, 1.0, 1.0, 1.0);
            gl.enable(gl.DEPTH_TEST); // 开启“深度测试”, Z-缓存
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SPC_ALPHA);
            gl.depthFunc(gl.LEQUAL);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // 清除颜色和深度缓存

            return this;
        }
    /**
     * @param {number} width
     * @param {number} height
     * @returns {DOM_canvas} canvas
     */
    static createCanvas(width, height) {
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }

    /**
     * @param {DOM_canvas} canvas
     */
    static createContext(canvas) {
        let gl;
        try {
            gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        } catch (e) {}

        if (!gl) {
            alert("WebGL初始化失败，可能是因为您的浏览器不支持。");
            gl = null;
        }
        return gl;
    }

    render(stage) {
        this.clear();
        this.initSprites(stage.sprites);
    }

    initSprites(sprites){
        sprites.forEach((item,index)=>{
            item.draw(this.gl);
        });
    }

    clear(){
       this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
}