// @ts-nocheck -- preserves the artist's compact mathematical notation verbatim.
import type { P5SketchFactory } from '../types';

/**
 * Instance-mode port of https://x.com/yuruyurau/status/1975590549366448389
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
  t=0,a=9,b=28,c=2
  instance.draw =_=>{t++||createCanvas(w=400,w);background(9);for(x=y=z=.1,i=3e4;i--;strokeWeight(s=(i+t)%540?1:5).stroke(w,s*96).point((x+y)*(sin(t*PI/90+z/49+x*x/w)*2+2)+200,325-z*5))[x,y,z]=[[x,a*(y-x)],[y,x*(b-z)-y],[z,x*y-c*z]].map(([d,e])=>d+e*1e-3)};
};

export default sketch;
