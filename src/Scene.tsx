import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Center, Float, useGLTF } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { ACESFilmicToneMapping, PCFShadowMap, type Mesh, type MeshStandardMaterial } from 'three'
import type { GLTF } from 'three-stdlib'
import { PostProcessing } from './post-processing'
import { EnvironmentWrapper } from './environment'
import type { Settings } from './settings'
import { CollectionObject } from './CollectionObject'

const modelUrl = `${import.meta.env.BASE_URL}jousting_helmet-transformed.glb`
const decoderUrl = `${import.meta.env.BASE_URL}draco/`
useGLTF.preload(modelUrl, decoderUrl)
type HelmetGLTF = GLTF & {
  nodes: { Object_2: Mesh }
  materials: { model_Material_u1_v1: MeshStandardMaterial }
}
/** Jousting Helmet, The Royal Armoury, CC-BY-4.0. Original transforms retained. */
function Helmet({ balanced }: { balanced: boolean }) {
  const { nodes, materials } = useGLTF(balanced ? `${import.meta.env.BASE_URL}helmet-balanced.glb` : modelUrl, decoderUrl) as unknown as HelmetGLTF
  return (
    <group dispose={null}>
      <mesh
        castShadow
        geometry={nodes.Object_2.geometry}
        material={materials.model_Material_u1_v1}
        material-roughness={0.15}
        position={[-2.016, -0.06, 1.381]}
        rotation={[-1.601, 0.068, 2.296]}
        scale={0.038}
      />
    </group>
  )
}
function Content({ settings, resetView, rotate, onReady, model, retry }: SceneProps) {
  const { size, gl, camera, invalidate } = useThree()
  const orbit = useRef<OrbitControlsImpl>(null)
  useEffect(() => {
    orbit.current?.reset()
  }, [resetView])
  useEffect(() => {
    if (model === 'jousting-helmet') onReady(true)
  }, [onReady, settings.quality, model])
  useEffect(() => {
    const target = gl.domElement.closest('.canvas-wrap') as HTMLElement | null
    const onKey = (event: KeyboardEvent) => {
      const controls = orbit.current
      if (!controls) return
      const angle = 0.15
      switch (event.key) {
        case 'ArrowLeft':
          controls.setAzimuthalAngle(controls.getAzimuthalAngle() - angle)
          break
        case 'ArrowRight':
          controls.setAzimuthalAngle(controls.getAzimuthalAngle() + angle)
          break
        case 'ArrowUp':
          controls.setPolarAngle(controls.getPolarAngle() - angle)
          break
        case 'ArrowDown':
          controls.setPolarAngle(controls.getPolarAngle() + angle)
          break
        case '+':
        case '=':
          camera.position.sub(controls.target).multiplyScalar(0.9).add(controls.target)
          break
        case '-':
          camera.position.sub(controls.target).multiplyScalar(1.1).add(controls.target)
          break
        case 'Home':
          controls.reset()
          break
        default:
          return
      }
      event.preventDefault()
      controls.update()
      invalidate()
    }
    target?.addEventListener('keydown', onKey)
    return () => target?.removeEventListener('keydown', onKey)
  }, [gl, camera, invalidate])
  return (
    <>
      <color attach="background" args={[settings.background]} />
      <group position={[0, -0.5, 0]}>
        <Float enabled={settings.motion} autoInvalidate floatIntensity={2} rotationIntensity={1} speed={2}>
          {model === 'jousting-helmet' ? (
            <Center scale={size.width <= 768 ? 2.4 : 3} position={[0, 0.8, 0]} rotation={[0, -Math.PI / 3.5, -0.4]}>
              <Helmet balanced={settings.quality === 'balanced'} />
            </Center>
          ) : (
            <group position={[0, 0.5, 0]}>
              <CollectionObject slug={model} quality={settings.quality} retry={retry} onReady={onReady} />
            </group>
          )}
        </Float>
      </group>
      <OrbitControls ref={orbit} makeDefault autoRotate={rotate && settings.motion} autoRotateSpeed={1} />
      <EnvironmentWrapper
        intensity={settings.environment}
        highlight={settings.highlight}
        resolution={settings.quality === 'studio' ? 1024 : 256}
        room={model !== 'jousting-helmet'}
      />
      <PostProcessing settings={settings} />
    </>
  )
}
interface SceneProps {
  settings: Settings
  resetView: number
  rotate: boolean
  onReady: (ready: boolean, error?: string) => void
  model: string
  retry: number
}
export default function Scene(props: SceneProps) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const active = usePageVisible()
  return (
    <Canvas
      ref={canvas}
      shadows={{ type: PCFShadowMap }}
      frameloop={active ? 'demand' : 'never'}
      dpr={props.settings.quality === 'studio' ? [1, 2] : [1, 1.5]}
      camera={{ position: [0, -1, 4], fov: 65 }}
      gl={{ alpha: false, antialias: false, toneMapping: ACESFilmicToneMapping }}
      fallback={<div className="scene-error">This interactive study needs a browser with WebGL.</div>}>
      <Suspense fallback={<LoadingSignal onReady={props.onReady} />}>
        <Content {...props} />
      </Suspense>
    </Canvas>
  )
}
function usePageVisible() {
  const [visible, setVisible] = useState(!document.hidden)
  useEffect(() => {
    const change = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', change)
    return () => document.removeEventListener('visibilitychange', change)
  }, [])
  return visible
}

function LoadingSignal({ onReady }: { onReady: (ready: boolean) => void }) {
  useEffect(() => {
    onReady(false)
  }, [onReady])
  return null
}
