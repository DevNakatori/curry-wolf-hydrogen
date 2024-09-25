import type {SanityClient} from '@sanity/client';
import type {
  ClientPerspective,
  ContentSourceMap,
  FilteredResponseQueryOptions,
  QueryParams,
  UnfilteredResponseQueryOptions,
} from '@sanity/client/stega';
import type {BaseQuery, InferType, z} from 'groqd';
import {CacheShort, createWithCache} from '@shopify/hydrogen';
import {getSanityClient} from './client';
import {queryStore} from './sanity.loader';

interface ExecutionContext {
  waitUntil(promise: Promise<any>): void;
}

type CreateSanityClientOptions = {
  cache: Cache;
  config: {
    apiVersion: string;
    dataset: string;
    projectId: string;
    studioUrl: string;
    useCdn: boolean;
    useStega: boolean;
  };
  isPreviewMode: boolean;
  waitUntil?: ExecutionContext['waitUntil'];
};

type CachingStrategy = ReturnType<typeof CacheShort>;
type BaseType<T = any> = z.ZodType<T>;
type GroqdQuery = BaseQuery<BaseType<any>>;

export type Sanity = {
  client: SanityClient;
  query<T extends GroqdQuery>(options: {
    cache?: CachingStrategy;
    groqdQuery: T;
    params?: QueryParams;
    queryOptions?:
      | FilteredResponseQueryOptions
      | UnfilteredResponseQueryOptions;
  }): Promise<{
    data: InferType<T>;
    perspective?: ClientPerspective;
    sourceMap?: ContentSourceMap;
  }>;
};

export function createSanityClient(options: CreateSanityClientOptions): Sanity {
  const {
    cache,
    config,
    isPreviewMode,
    waitUntil = (promise: Promise<any>) => {},
  } = options;
  const {apiVersion, dataset, projectId, studioUrl, useCdn, useStega} = config;

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

  const sanity: Sanity = {
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
export async function sha256(message: string): Promise<string> {
  const messageBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', messageBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Hash query and its parameters for use as cache key
 */
function hashQuery(
  query: GroqdQuery['query'],
  params?: QueryParams,
): Promise<string> {
  let hash = query;
  if (params != null) {
    hash += JSON.stringify(params);
  }
  return sha256(hash);
}
