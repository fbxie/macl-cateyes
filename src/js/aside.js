import ImageFactory from './components/image-factory';
import Tools from './tools';
export default function (serieses) {


    
    let dom_aside = document.createElement('div');
    dom_aside.className = "aside";

    let dom_serieses = document.createElement('div');
    dom_aside.appendChild(dom_serieses);

    dom_serieses.className = "serieses";

    for(let i = 0 , i_len=serieses.length;i<i_len;i++){
        dom_serieses.appendChild(new Series(serieses[i])); 
    }

    dom_aside.appendChild(Tools());
    console.dir(new Series(serieses[0]));
    return dom_aside;
}

class Series {
    constructor(series) {
        this._series = series;
        this.createDom(series.images[0].frames[0].thumbnailUri);
        return this._DOM;
    }

    createDom(url) {
        this._DOM = document.createElement('div');
        this._DOM.className = "series";
        // this._DOM.style.position = "relative";
        // this._DOM.style.margin = "10px 2px";
        // this._DOM.style["padding"] = "5px 0px";
        // this._DOM.style["text-align"] = "center";
        this._DOM.appendChild(this.ImageDom(url));
    }

    ImageDom(url) {
        var img = document.createElement('img');
        img.src = ImageFactory.get(url).src;
        img.width = 80;
        img.height = 80;
        return img;
    }
}