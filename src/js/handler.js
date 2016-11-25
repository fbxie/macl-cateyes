import Server from './service';
import Emitter from 'Emitter';
import {getAttribute} from './utils/namespace';

export default class Handler {
    constructor(studyId) {
        this.emitter = new Emitter();
        
        Server.getDicom(studyId, data => {
            this.dicom = data;
            this.emitter.emit('onload',data);
        });
        
        return this.emitter;
    }

    emmit(dicom) {
        ['study','patient','serieses','images'].forEach((item,index)=>{

        });

    }

}