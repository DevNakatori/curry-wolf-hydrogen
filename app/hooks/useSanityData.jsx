import {useMatches, useRouteLoaderData} from '@remix-run/react';
import {useQuery} from '../../lib/sanity/sanity.loader';
import {useRootLoaderData} from '../root';

/**
 * The `useSanityData` hook is needed to preview live data from Sanity Studio.
 * It must be used within a route that has a loader that returns a `sanityPreviewPayload` object.
 */
export function useSanityData({initial, isRoot}) {
  const matches = useMatches();
  const {id: routeId} = matches[matches.length - 1];
  const rootLoaderData = useRootLoaderData();
  const loaderData = useRouteLoaderData(routeId);
  const {env} = rootLoaderData;
  const studioUrl = env.SANITY_STUDIO_URL;
  const sanity = isRoot ? rootLoaderData.sanity : loaderData?.sanity;

  if (sanity === undefined) {
    console.warn(
      'Warning: The useSanityData hook must be used within a route that has a loader that returns a sanityPreviewPayload object.',
    );
  }

  const params = sanity?.params;
  const query = sanity?.query || '';

  // Todo: find a way to avoid using useQuery hook in production when STEGA is disabled
  const {data, encodeDataAttribute, loading, sourceMap} = useQuery(
    query,
    params,
    {
      initial: initial,
    },
  );

  return {data, encodeDataAttribute, loading, sourceMap};
}
