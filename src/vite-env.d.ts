/// <reference types="vite/client" />

declare module 'virtual:portfolio-runtime-urls' {
  const urls: Record<string, string>
  export default urls
  export const decoderPath: string
}
