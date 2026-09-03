/**
 * Deterministic PRNG and procedural geometry tools
 * Based on 32-bit FNV-1a hashing and Mulberry32 PRNG.
 * Ensures zero hydration mismatch, zero layout shift, and reproducible graphics.
 */

export function hashString(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function createRNG(seed: number | string) {
  let s = (typeof seed === 'string' ? hashString(seed) : seed) >>> 0;
  return function next(): number {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededRange(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min);
}

export function seededInt(rng: () => number, min: number, max: number): number {
  return Math.floor(seededRange(rng, min, max + 1));
}
