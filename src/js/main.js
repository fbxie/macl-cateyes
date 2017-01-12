import Handler from './handler';
import View from './components/view';
import Aside from './aside';


let handler_1234 = new Handler();

handler_1234.on('onload', function (data) {
    if (data) {

        $("#aside")[0].appendChild(Aside(data.study.serieses));
        new View(data.study.serieses[0])

    }
});


export default {};