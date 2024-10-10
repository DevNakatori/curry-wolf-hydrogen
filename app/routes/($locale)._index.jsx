import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import React, {useEffect, useRef, useState} from 'react';
import {mergeMeta} from '../lib/meta';
import {DEFAULT_LOCALE} from 'countries';
import {getSeoMetaFromMatches} from '../lib/seo';
import {sanityPreviewPayload} from '../lib/sanity/sanity.payload.server';
import {seoPayload} from '../lib/seo.server';
import {PAGE_QUERY} from '../qroq/queries';
import {useSanityData} from '../hooks/useSanityData';
import PageRoute from './($locale).$';
/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = mergeMeta(({matches}) => getSeoMetaFromMatches(matches));

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({request, params, context}) {
  const {env, locale, sanity, storefront} = context;
  const language = locale?.language.toLowerCase();
  const queryParams = {
    defaultLanguage: DEFAULT_LOCALE.language.toLowerCase(),
    handle: 'home',
    language,
  };
  const page = await sanity.query({
    groqdQuery: PAGE_QUERY,
    params: queryParams,
  });
  if (!page.data) {
    throw new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }
  const seo = seoPayload.home({
    page: page.data,
    sanity: {
      dataset: env.SANITY_STUDIO_DATASET,
      projectId: env.SANITY_STUDIO_PROJECT_ID,
    },
  });

  return json({
    page,
    seo,
    ...sanityPreviewPayload({
      context,
      params: queryParams,
      query: PAGE_QUERY.query,
    }),
  });
}
export default PageRoute;
