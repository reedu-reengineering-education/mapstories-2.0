/* eslint-disable react-hooks/rules-of-hooks */
import { Arguments, BareFetcher, SWRConfiguration, SWRHook } from 'swr'

export const SWRLogger = (useSWRNext: SWRHook) => {
  return (
    key: unknown,
    fetcher: BareFetcher | null,
    config: SWRConfiguration,
  ) => {
    let nextFetcher = fetcher

    if (fetcher) {
      nextFetcher = (...args: unknown[]) => {
        const started = Date.now()
        const label =
          typeof key === 'function'
            ? key()
            : Array.isArray(key)
              ? key.join(', ')
              : key
        console.info('SWR Request start', label)
        const response = fetcher(...args)
        if (response instanceof Promise) {
          return response.then(result => {
            console.info(
              'SWR Request complete',
              label,
              'elapsed',
              Date.now() - started,
              'ms',
            )
            return result
          })
        }
        console.info(
          'SWR Request complete',
          label,
          'elapsed',
          Date.now() - started,
          'ms',
        )
        return response
      }
    }

    // Execute the hook with the new fetcher.
    return typeof key === 'function'
      ? useSWRNext(key, nextFetcher, config)
      : useSWRNext(key as Arguments, nextFetcher, config)
  }
}
