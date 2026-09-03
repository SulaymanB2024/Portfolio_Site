import type p5 from 'p5';

export type SketchId = `yuru-${string}`;
export type P5SketchFactory = (instance: p5) => void;
export type P5SketchLoader = () => Promise<{ default: P5SketchFactory }>;
export type GenerativeArtworkTreatment = 'dark-field' | 'paper-field';

export type GenerativeArtworkAttribution = {
  label: 'Original p5.js sketch by @yuruyurau';
  artistName: '@yuruyurau';
  artistUrl: 'https://x.com/yuruyurau';
  sourceUrl: `https://x.com/yuruyurau/status/${string}`;
};

export type GenerativeArtwork = {
  sketchId: SketchId;
  title: string;
  posterSrc: string;
  alt: string;
  factory: P5SketchLoader;
  treatment: GenerativeArtworkTreatment;
  attribution: GenerativeArtworkAttribution;
  status: 'assigned' | 'reserve';
  assignedPath?: string;
};
