import Handler from './handler';
import View from './components/view';
let handler_1234 = new Handler();

handler_1234.on('onload',function (data){
    new View(data.study.serieses[0]);
});
// export default handler_1234;


// import tool from './tool';



//Create the renderer
// let renderer = PIXI.autoDetectRenderer(256, 256);

// renderer.autoResize = true;
//Add the canvas to the HTML document
// document.body.appendChild(renderer.view);

//Create a container object called the `stage`
// let stage = new PIXI.Container();


//Tell the `renderer` to `render` the `stage`
// renderer.render(stage);

