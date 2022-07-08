/** @type {string} */
const CACHE_NAME = 'v2'

/** @type {string[]} */
const CACHE_KEEP_LIST = [CACHE_NAME]

/** @type {string} */
const API_URL = 'http://localhost:3001'

/** @type {RegExp[]} */
const ROUTES_TO_AUTOCACHE = [
  new RegExp(`^${API_URL}/users/me/character/?$`),
  /\/static\/.*/,
]

/** @type {(String | RegExp)[]} */
const APP_ROUTES = [
  '/home',
  '/login',
  '/signup',
  '/scanner',
  '/search',
  '/user',
  '/personalization',
  new RegExp('/shops/\\d')
]

/**
 * @param requests {(Request | string)[]}
 * @returns {Promise<void>}
 */
const addRequestsToCache = async (requests) => {
  const cache = await caches.open(CACHE_NAME)
  await cache.addAll(requests)
}

/**
 * @param request {Request | string}
 * @param response {Response}
 * @returns {Promise<void>}
 */
const putResponseInCache = async (request, response) => {
  const cache = await caches.open(CACHE_NAME)
  await cache.put(request, response)
}

/**
 * @param key {string}
 * @returns {Promise<void>}
 */
const deleteCache = async key => {
  await caches.delete(key)
}

/**
 * @returns {Promise<void>}
 */
const deleteOldCaches = async () => {
  const keyList = await caches.keys()
  const cachesToDelete = keyList.filter(key => !CACHE_KEEP_LIST.includes(key))
  await Promise.all(cachesToDelete.map(deleteCache))
}

/** @type {{ route: RegExp, interceptor: (r: RegExpExecArray | null) => Promise<Response> }[]} */
const customInterceptors = [
  {
    route: new RegExp(`^${API_URL}\/shops\/(\\d+)\/?(\\?(?:.+?=.+&?)+?)`, 'g'),
    interceptor: async (r) => {
      const cache = await caches.open(CACHE_NAME)

      const shopsResponse = await cache.match(`${API_URL}/shops`)

      if (!shopsResponse) {
        return new Response('Service Worker: No response found.', { status: 408 })
      }

      /** @type {Shop[]} */
      const shops = await shopsResponse.clone().json()
      const shop = shops.find(shop => shop.id === Number(r[1]))

      if (!shop) {
        return new Response('Service Worker: No response found.', { status: 408 })
      }

      return new Response(JSON.stringify(shop), { status: 200, headers: { 'Content-Type': 'application/json' } })
    },
  },
  {
    route: new RegExp(`^${API_URL}\/shops\/?(\\?(?:.+?=.+&?)+?)`, 'g'),
    interceptor: async () => {
      const cache = await caches.open(CACHE_NAME)

      const shopsResponse = await cache.match(`${API_URL}/shops`)

      if (!shopsResponse) {
        return new Response('Service Worker: No response found.', { status: 408 })
      }

      /** @type {Shop[]} */
      const shops = await shopsResponse.clone().json()

      return new Response(JSON.stringify(shops), { status: 200, headers: { 'Content-Type': 'application/json' } })
    },
  },
  {
    route: new RegExp(`(^((?!${API_URL}).*)((${APP_ROUTES.join(')|(')})))`, 'g'),
    interceptor: async (r) => {
      const cache = await caches.open(CACHE_NAME)

      const appResponse = await cache.match(r[1])

      if (!appResponse) {
        return new Response('Service Worker: No response found.', { status: 408 })
      }

      return appResponse
    }
  },
]

/**
 * This function is called when a request is made. Its purpose is:
 *  - return a network request if the device is online
 *  - if it fails, return a cache request if the device is offline
 *  - if it fails, return the preloaded response if it is defined
 *  - if it fails, return the response of the request to the fallback url if it is defined
 *  - if it fails, return a network error
 *
 * @param request {Request | string}
 * @param preloadResponsePromise? {Promise<Response>}
 * @param fallbackUrl? {string}
 * @returns {Promise<Response>}
 */
const getResponse = async ({ request, preloadResponsePromise, fallbackUrl }) => {
  if (navigator.onLine) {
    return await fetch(request)
  }

  for (const { route, interceptor } of customInterceptors) {
    const r = route.exec(request.url)
    if (r) {
      return await interceptor(r)
    }
  }

  const response = await caches.match(request)
  if (response) {
    return response
  }

  if (preloadResponsePromise) {
    return await preloadResponsePromise
  }

  if (fallbackUrl) {
    return await fetch(fallbackUrl)
  }

  return new Response('Service Worker: No response found.', { status: 408 })
}

const onFetch = async event => {
  // console.log('Service Worker: Fetching', event.request.url)

  const responsePromise = getResponse({
    request: event.request,
    preloadResponsePromise: event.preloadResponse,
  })

  event.respondWith((async () => {
    const response = await responsePromise

    if (ROUTES_TO_AUTOCACHE.map(route => route.test(event.request.url)).some(Boolean)) {
      const clonedResponse = response.clone()
      putResponseInCache(event.request, clonedResponse).then()
    }

    return response
  })())
}

const onActivate = async (event) => {
  event.waitUntil(Promise.all([self.registration.navigationPreload?.enable(), deleteOldCaches()]))
}

const onInstall = async (event) => {
  event.waitUntil(
    addRequestsToCache(['/', '/manifest.json']),
  )
}

self.addEventListener('fetch', onFetch)
self.addEventListener('activate', onActivate)
self.addEventListener('install', onInstall)
