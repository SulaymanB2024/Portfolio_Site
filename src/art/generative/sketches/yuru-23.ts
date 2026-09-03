// @ts-nocheck -- preserves the artist's compact mathematical notation verbatim.
import type { P5SketchFactory } from '../types';

/**
 * Instance-mode port of https://x.com/yuruyurau/status/2022995578016387236
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
  a=(y,o=mag(k=cos(y*99)*(y<9?20+sin(y)*8:11),e=y/8-13)/6)=>point((q=k*y/19+59+k*sin(y)*sin(o*2-e/3-t))*sin(c=o/3-e/5-t/8+i%4*8)-89*cos(c/3)+200,200+(q+70)*cos(c))
  t=0,instance.draw =$=>{t||createCanvas(w=400,w);background(6).stroke(w,96);for(t+=PI/40,i=2e4;i--;)a(i/500)};
};

export default sketch;
