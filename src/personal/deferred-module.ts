/** Share one import and expose its resolved value before a synchronous route commit. */
export function createDeferredModule<T>(load: () => Promise<T>) {
  let ready: T | undefined
  let request: Promise<T> | undefined
  return {
    read: () => ready,
    prepare() {
      if (request) return request
      request = Promise.resolve().then(load).then(value => {
        ready = value
        return value
      }, error => {
        request = undefined
        throw error
      })
      return request
    },
  }
}
