import { useEffect, useMemo, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import type { Group } from 'three'
import { disposeModel, frameModel } from './model-resources'

interface Props {
  slug: string
  quality: 'studio' | 'balanced'
  retry: number
  onReady: (ready: boolean, error?: string) => void
}
/** Fetch only the selected GLB; abort superseded requests and release old GPU resources. */
export function CollectionObject({ slug, quality, retry, onReady }: Props) {
  const { gl, invalidate, size } = useThree()
  const [loaded, setLoaded] = useState<{ url: string; object: Group } | null>(null)
  const decoder = useMemo(() => new DRACOLoader().setDecoderPath(`${import.meta.env.BASE_URL}draco/`).setWorkerLimit(2), [])
  const loader = useMemo(() => new GLTFLoader().setDRACOLoader(decoder), [decoder])
  const url = `${import.meta.env.BASE_URL}models/${slug}-${quality}.glb`
  useEffect(() => () => {
    decoder.dispose()
  }, [decoder])
  useEffect(() => {
    const request = new AbortController()
    let active = true
    let owned: Group | null = null
    onReady(false)
    setLoaded(null)
    async function load() {
      const response = await fetch(url, { signal: request.signal })
      if (!response.ok) throw new Error(`Model response: ${response.status}`)
      const bytes = await response.arrayBuffer()
      if (!active) return
      const gltf = await loader.parseAsync(bytes, `${import.meta.env.BASE_URL}models/`)
      if (!active) {
        disposeModel(gltf.scene)
        return
      }
      try {
        owned = frameModel(gltf.scene, 2.6)
      } catch (error) {
        disposeModel(gltf.scene)
        throw error
      }
      if (slug === 'king-erik-xiv') owned.rotation.y = -Math.PI / 3
      if (slug === 'farnese-atlas') owned.rotation.y = Math.PI / 3
      setLoaded({ url, object: owned })
      onReady(true)
      invalidate()
    }
    load().catch((error) => {
      if (!active) return
      onReady(false, 'This object could not load. Retry or choose another object.')
      console.error(error)
    })
    return () => {
      active = false
      request.abort()
      if (owned) disposeModel(owned)
      gl.renderLists.dispose()
    }
  }, [url, retry, slug, loader, gl, onReady, invalidate])
  if (!loaded || loaded.url !== url) return null
  // Keep wide objects inside narrow portrait stages without changing their geometry.
  return (
    <group scale={Math.min(1, size.width / size.height)}>
      <primitive object={loaded.object} dispose={null} />
    </group>
  )
}
