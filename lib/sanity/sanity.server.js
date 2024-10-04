import {CacheShort, createWithCache} from '@shopify/hydrogen';
import {getSanityClient} from './client';
import {queryStore} from './sanity.loader';

export function createSanityClient(options) {
  const {cache, config, isPreviewMode, waitUntil = (promise) => {}} = options;
  const {apiVersion, dataset, projectId, studioUrl,useCdn, useStega} = config;

  // Validate required config options
  if (!projectId || !apiVersion || !dataset || !studioUrl) {
    console.error('Missing required configuration for Sanity client:', {
      projectId,
      apiVersion,
      dataset,
      studioUrl,
    });
    throw new Error('Missing required configuration for Sanity client');
  }

  const {client} = getSanityClient({
    apiVersion,
    dataset,
    projectId,
    studioUrl,
    useCdn: useCdn ?? true,
    useStega: isPreviewMode && useStega ? 'true' : 'false',
  });

  queryStore.setServerClient(client);
  const {loadQuery} = queryStore;

  const sanity = {
    client,
    async query({
      cache: strategy = CacheShort(),
      groqdQuery,
      params,
      queryOptions,
    }) {
      const {query} = groqdQuery;
      const queryHash = await hashQuery(query, params);
      const withCache = createWithCache({
        cache,
        waitUntil,
      });

      return withCache(queryHash, strategy, () => {
        if (!queryOptions) {
          return loadQuery(query, params);
        }

        // Union type satisfaction
        return loadQuery(query, params, queryOptions);
      });
    },
  };

  return sanity;
}

/**
 * Create an SHA-256 hash as a hex string
 */
export async function sha256(message) {
  const messageBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', messageBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Hash query and its parameters for use as cache key
 */
function hashQuery(query, params) {
  let hash = query;
  if (params != null) {
    hash += JSON.stringify(params);
  }
  return sha256(hash);
}
