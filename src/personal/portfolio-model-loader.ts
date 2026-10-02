import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js'
import { disposeModel } from '../model-resources.ts'

/** One decoder worker per owned renderer; fetches abort, late parses release their scene. */
export function createPortfolioModelLoader(base = import.meta.env.BASE_URL) {
  const decoder = new DRACOLoader().setDecoderPath(`${base}draco/`).setWorkerLimit(1)
  const loader = new GLTFLoader().setDRACOLoader(decoder)
  const requests = new Set<AbortController>()
  let disposed = false
  let pending = 0
  const aborted = () => new DOMException('Model request cancelled', 'AbortError')
  return {
    async load(url: string, signal?: AbortSignal): Promise<GLTF> {
      if (disposed || signal?.aborted) throw aborted()
      const request = new AbortController()
      const cancel = () => request.abort()
      signal?.addEventListener('abort', cancel, { once: true })
      requests.add(request)
      pending++
      try {
        const response = await fetch(url, { signal: request.signal })
        if (!response.ok) throw new Error(`Model response: ${response.status}`)
        const bytes = await response.arrayBuffer()
        if (disposed || request.signal.aborted) throw aborted()
        const model = await loader.parseAsync(bytes, url.slice(0, url.lastIndexOf('/') + 1))
        if (disposed || request.signal.aborted) { disposeModel(model.scene); throw aborted() }
        return model
      } finally {
        signal?.removeEventListener('abort', cancel)
        requests.delete(request)
        pending--
        // Do not terminate a decoder mid-parse and leave a GLTF promise unresolved.
        if (disposed && !pending) decoder.dispose()
      }
    },
    dispose() {
      if (disposed) return
      disposed = true
      for (const request of requests) request.abort()
      if (!pending) decoder.dispose()
    },
  }
}
