import {createClient} from '@sanity/client';

// Do not import this into client-side components unless lazy-loaded
export const getSanityClient = (args) => {
  const {apiVersion, dataset, projectId, studioUrl,useCdn, useStega} = args;

  return {
    client: createClient({
      apiVersion: apiVersion || '2023-10-01',
      dataset,
      projectId,
      stega: {
        enabled: useStega === 'true' ? true : false,
        studioUrl,
      },
      useCdn,
    }),
  };
};
