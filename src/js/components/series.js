import {Renderer} from '../../macl/Renderer';
import {Container} from '../../macl/Container';
import {Dicom} from '../../macl/sprite/Dicom';

import Service from '../service';

export default class Series {
    constructor(series) {
        this.data = series;
        this.dom_id = '';
        this.renderer = {};
        this.stages = {};
        this.loadStage();
        
        return this;
    }

    loadStage() {
        let imgs = this.data.images;
        let self = this;
        for (let i = 0; i < imgs.length; i++) {
            let uri = JSON.parse(imgs[i].frames[0].uri);
            let id = uri.lossless;
            this.stages[id] = new Container();
            Service.ImageServer.get(id,(img) => {
                let dicom = new Dicom(img);
                this.stages[id].addChild(dicom);
                if(i==0){
                    this.renderer.render(this.stages[id]);
                }
            });
        }
    }

    show(id){
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
        this.renderer = new Renderer(parentRenderer.offsetWidth, parentRenderer.offsetHeight);
        if (!parentRenderer) {
            throw new Error(`${id} is not exsit`);
        }
        parentRenderer.appendChild(this.renderer.view);

    }


}