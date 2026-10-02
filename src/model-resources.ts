import { Box3, BufferGeometry, Group, Material, Mesh, Object3D, Texture, Vector3 } from 'three'

/** One loader owns each collection object. Deduplicate resources shared by GLB nodes. */
export function disposeModel(object: Object3D) {
  const geometries = new Set<BufferGeometry>()
  const materials = new Set<Material>()
  const textures = new Set<Texture>()
  object.traverse((node) => {
    if (!(node instanceof Mesh)) return
    geometries.add(node.geometry)
    for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
      materials.add(material)
      for (const value of Object.values(material)) if (value instanceof Texture) textures.add(value)
    }
  })
  for (const geometry of geometries) geometry.dispose()
  for (const material of materials) material.dispose()
  for (const texture of textures) {
    texture.dispose()
    if (typeof ImageBitmap !== 'undefined' && texture.image instanceof ImageBitmap) texture.image.close()
  }
}

/** Display transforms stay outside the source hierarchy and shared geometry. */
export function frameModel(object: Object3D, extent = 1.9) {
  const bounds = new Box3().setFromObject(object)
  const size = bounds.getSize(new Vector3())
  const maximum = Math.max(size.x, size.y, size.z)
  if (!Number.isFinite(maximum) || maximum <= 0) throw new Error('Invalid model bounds')
  const offset = new Group()
  offset.position.copy(bounds.getCenter(new Vector3())).negate()
  offset.add(object)
  const frame = new Group()
  frame.scale.setScalar(extent / maximum)
  frame.add(offset)
  return frame
}
