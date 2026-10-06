/** Only binary, self-contained glTF models belong in the sculpture registry. */
export function requireGLBPath(path: string) {
  if (typeof path !== 'string' || !path.split(/[?#]/, 1)[0].endsWith('.glb')) throw new Error('Sculpture assets must be GLB files')
  return path
}

export function requireGLBBytes(bytes: ArrayBuffer) {
  if (bytes.byteLength < 28) throw new Error('Truncated GLB model')
  const header = new DataView(bytes)
  if (header.getUint32(0, true) !== 0x46546c67 || header.getUint32(4, true) !== 2 || header.getUint32(8, true) !== bytes.byteLength
    || header.getUint32(16, true) !== 0x4e4f534a) throw new Error('Invalid binary glTF model')
}
