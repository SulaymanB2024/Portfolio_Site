import { readFile } from 'node:fs/promises'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

/** Exercise the shipped source asset without needing a browser Draco worker. */
export async function chessModel() {
  const bytes = await readFile(new URL('../../public/about-objects/chess-pieces.glb', import.meta.url))
  return (await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '')).scene
}
