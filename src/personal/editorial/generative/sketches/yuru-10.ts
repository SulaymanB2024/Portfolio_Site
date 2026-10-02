// @ts-nocheck -- preserves the artist's compact mathematical notation verbatim.
import type { P5SketchFactory } from '../types';

/**
 * Instance-mode port of https://x.com/yuruyurau/status/2030650578758680723
 * Formula and timing are preserved; only p5 globals are bound to this instance.
 */
const sketch: P5SketchFactory = (instance) => {
  const PI = instance.PI;
  const abs = instance.abs.bind(instance);
  const atan2 = instance.atan2.bind(instance);
  const background = instance.background.bind(instance);
  const circle = instance.circle.bind(instance);
  const clear = instance.clear.bind(instance);
  const cos = instance.cos.bind(instance);
  const fill = instance.fill.bind(instance);
  const get = instance.get.bind(instance);
  const image = instance.image.bind(instance);
  const mag = instance.mag.bind(instance);
  const noStroke = instance.noStroke.bind(instance);
  const point = instance.point.bind(instance);
  const rotate = instance.rotate.bind(instance);
  const sin = instance.sin.bind(instance);
  const stroke = instance.stroke.bind(instance);
  const strokeWeight = instance.strokeWeight.bind(instance);
  const translate = instance.translate.bind(instance);
  const createCanvas = (...args) => {
    const renderer = instance.createCanvas(...args);
    instance.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
    return renderer;
  };
  let a, b, c, d, e, f, i, k, m, n, o, p, q, s, t, u, w, x, y, z;
  a=(x,y,d=mag(k=(4+cos(y))*cos(x),e=y/6-13)-3)=>point((q=3*sin(k*2)+k/16*y*(e+2*sin(e-d*5+t))+99)*sin(c=d/1.2-t/4+i%2*3)*sin(c/4+e/6-8)+200,q*d/9*cos(c)+d*22)
  t=0,instance.draw =$=>{t||createCanvas(w=400,w);background(9).stroke(w,126);for(t+=PI/30,i=2e4;i--;)a(i,i/940)};
};

export default sketch;
