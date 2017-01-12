import ST from '../src/SThree/index';

let PImage = ST.Particle.PImage;

TestST = {};

TestST.renderer= new ST.Renderer(document.body.offsetWidth,document.body.offsetHeight);

document.body.appendChild(TestST.renderer.view);

let img = new Image();
img.onload =()=>{
    let pimage = new PImage(img);
    TestST.renderer.render(pimage);
};
