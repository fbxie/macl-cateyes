import PIXI from 'PIXI';

PIXI.Texture.Draw = function (cb) {
    var canvas = document.createElement('canvas');
    if (typeof cb == 'function') cb(canvas);
    return PIXI.Texture.fromCanvas(canvas);
}
