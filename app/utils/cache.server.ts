// hybrid module, either works
import LRUCache from 'lru-cache'
import type { Options } from 'lru-cache'

// At least one of 'max', 'ttl', or 'maxSize' is required, to prevent
// unsafe unbounded storage.
//
// In most cases, it's best to specify a max for performance, so all
// the required memory allocation is done up-front.
//
// All the other options are optional, see the sections below for
// documentation on what each one does.  Most of them can be
// overridden for specific items in get()/set()
const options: Options<string, object> = {
  max: 500,

  // for use with tracking overall storage size
  maxSize: 5000,
  sizeCalculation: (value, key) => {
    return 1
  },

  // for use when you need to clean up something when objects
  // are evicted from the cache
  dispose: (value, key) => {
    // freeFromMemoryOrWhatever(value)
  },

  // how long to live in ms
  ttl: 1000 * 60,

  // return stale items before removing from cache?
  allowStale: false,

  updateAgeOnGet: false,
  updateAgeOnHas: false,

  // async method to use for cache.fetch(), for
  // stale-while-revalidate type of behavior
  // fetchMethod: async (key, staleValue, { options, signal }) => {},
}

export const cache = new LRUCache(options)

// cache.set('key', 'value')
// cache.get('key') // "value"

// cache.clear() // empty the cache
