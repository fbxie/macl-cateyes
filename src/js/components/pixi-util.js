import PIXI from 'PIXI';

PIXI.Texture.Draw = function (cb) {
    let canvas = document.createElement('canvas');
    if (typeof cb == 'function') cb(canvas);
    return PIXI.Texture.fromCanvas(canvas);
}


PIXI.myGrayFilter = function(uniforms){
    PIXI.AbstractFilter.call( this );
 
    this.passes = [this];
 
    // set the uniforms
    this.uniforms = uniforms;
    this.fragmentSrc = [
        "letying vec2 vTextureCoord;\n",
        "uniform sampler2D uSampler;\n",
        "uniform float roate;\n",
        "uniform float min;\n",
        "uniform float max;\n",
        "void main(void){\n",
        "   vec3 c = texture2D(uSampler, vTextureCoord).rgb;\n",
        "   c.r *= 255.0; c.g *= 255.0; c.b *= 255.0;\n",
        "   c.r = (c.r * 65536.0) + (c.g * 256.0) + (c.b);\n",
        "   c.r = (c.r >= min || c.r <= max) ? c.r : 0.0;\n",
        "   c.r = c.r - min;\n",
        "   c.r = c.r / roate;\n",
        "   c.r = (c.r >= 0.0 || c.r <= 255.0) ? gray : 0.0;\n",
        "   gl_FragColor.r = gray / 255.0;\n",
        "   gl_FragColor.g = gray / 255.0;\n",
        "   gl_FragColor.b = gray / 255.0;\n",
        "}\n"
    ];
}
 
PIXI.myGrayFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.myGrayFilter.prototype.constructor = PIXI.myGrayFilter;