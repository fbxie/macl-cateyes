import Service from '../service';
import SThree from "../../SThree/index";
let PImage = SThree.Particle.PImage;
export default class Series {
    data={};
    dom_id = '';
    renderer = {};
    images=[];
    constructor(series) {
        this.data = series;
        
        return this;
    }

    loadStage() {

        let imgs = this.data.images;
        let self = this;
        for (let i = 0; i < imgs.length; i++) {
            let uri = JSON.parse(imgs[i].frames[0].uri);
            let id = uri.lossless;
            Service.ImageServer.get(id,(img) => {
                let pimage = new PImage(img);
                this.images.push(pimage);

                if(i==0){
                    this.renderer.render(pimage);
                }
            });
        }
    }

    show(index){
        if(!id){
            let imgs = this.data.images;
            let uri = JSON.parse(imgs[0].frames[0].uri);
            id = uri.lossless;
        }

        this.renderer.render(this.stages[id]);
    }

    creatView(id) {

        this.dom_id = id;

        let parentRenderer = document.getElementById(id);
        
        if (!parentRenderer) {
            throw new Error(`${id} is not exsit`);
        }
        this.renderer = new SThree.Renderer(parentRenderer.offsetWidth, parentRenderer.offsetHeight);
        
        parentRenderer.appendChild(this.renderer.view);

        this.loadStage();
    }


}