import { finishSurface } from '../work-models/surface-finish.mjs'
import { materialStyles } from '../work-models/geometry.mjs'

/** Use Work's metal family, calibrated for the helmet's brighter print transfer. */
export function cabinetGeometry(api) {
  const finishes = Object.fromEntries(Object.entries(materialStyles).map(([name, style]) => {
    const material = new api.THREE.MeshStandardMaterial({ metalness: style.metal, roughness: style.roughness })
    material.color.setRGB(...style.color.slice(0, 3)).multiplyScalar(.48)
    material.name = 'cabinet-' + name
    material.userData.cabinetFinish = name
    return [name, material]
  }))
  const cast = (parent, name, geometry, finish = 'silver', position = [0, 0, 0], rotation = [0, 0, 0]) => {
    const object = api.mesh(parent, name, geometry, 'silver', position, rotation)
    object.material = finishes[finish]
    return object
  }
  const wrapper = method => (parent, name, ...args) => {
    // Existing helpers author the geometry and pivot; replace their finish only.
    const index = method === 'rounded' || method === 'pierced' ? (method === 'rounded' ? 1 : 2) : method === 'ring' ? 3 : method === 'rod' ? 3 : 1
    const finish = args[index]
    const copy = [...args]; copy[index] = 'silver'
    const object = api[method](parent, name, ...copy)
    object.material = finishes[finish]
    return object
  }
  return { ...api, finishes, mesh: cast, rounded: wrapper('rounded'), pierced: wrapper('pierced'), ring: wrapper('ring'), rod: wrapper('rod'), lathe: wrapper('lathe') }
}

/** Finish only this new family; the accepted portraits retain their exact bytes. */
export function cabinetSurface(geometry, material) {
  if (material.userData.cabinetFinish) {
    finishSurface(geometry, material.userData.cabinetFinish)
    material.vertexColors = true
  }
  return geometry
}

export const ease = value => {
  const t = Math.max(0, Math.min(1, value))
  return t * t * t * (t * (t * 6 - 15) + 10)
}
export const gesture = (q, a, b, c, d) => q < a ? 0 : q < b ? ease((q - a) / (b - a)) : q < c ? 1 : q < d ? 1 - ease((q - c) / (d - c)) : 0

/** A closed curved casting, with few broad facets rather than thin ornament. */
export function castTube(api, parent, name, points, radius, finish = 'pewter', segments = 24, sides = 8) {
  const curve = new api.THREE.CatmullRomCurve3(points.map(p => new api.THREE.Vector3(...p)), false, 'centripetal')
  return api.mesh(parent, name, new api.THREE.TubeGeometry(curve, segments, radius, sides), finish)
}

export function screw(api, parent, name, position, radius = .025, finish = 'silver') {
  api.mesh(parent, name, new api.THREE.CylinderGeometry(radius, radius * .9, .020, 16), finish, position, [Math.PI / 2, 0, 0])
  api.mesh(parent, name + '-incised-slot', new api.THREE.BoxGeometry(radius * 1.25, radius * .16, .002), 'steel', [position[0], position[1], position[2] + .011])
}
