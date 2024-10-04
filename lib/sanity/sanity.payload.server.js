/**
 * The `sanityPreviewPayload` object is used by the `useSanityData` hook.
 * It is used to pass the query and params to the Sanity client and fetch live data from Sanity Studio.
 * The payload will be returned as `null` if `sanityPreviewMode` is set to false.
 **/
export function sanityPreviewPayload({context, params, query}) {
  const {sanityPreviewMode} = context;

  if (sanityPreviewMode) {
    return {
      sanity: {
        params,
        query,
      },
    };
  }

  return {
    sanity: null,
  };
}
