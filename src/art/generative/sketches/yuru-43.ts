// @ts-nocheck -- preserves the artist's compact mathematical notation verbatim.
import type { P5SketchFactory } from '../types';

/**
 * Instance-mode port of https://x.com/yuruyurau/status/1974495782792507630
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
  t=0,instance.draw =$=>{t||createCanvas(w=400,w);clear(m=200);for(t+=PI/240,i=2e4;i--;)i>14?(d=5*cos(mag(k=i%50-25,e=i/1100)-t+i%2),stroke(w,46).point(k+k*d/6*sin(d+e/3+t)+m,90+e*d-e/d*2*cos(d+t)+m)):i^14?rotate(PI/7).image(p,-m,-m):(p=get())+background(9).translate(m,m)};
};

export default sketch;
