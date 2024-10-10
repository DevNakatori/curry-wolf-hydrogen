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
import '../styles/home-video.css';
import Home from '~/components/Home';
/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({request}) {
  const {env, locale, sanity, storefront} = context;
  const pathname = new URL(request.url).pathname;
  const handle = getPageHandle({locale, params, pathname});
  const language = locale?.language.toLowerCase();
  const queryParams = {
    defaultLanguage: DEFAULT_LOCALE.language.toLowerCase(),
    handle,
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
export default function PageRoute() {
  const {page} = useLoaderData();
  const {data, encodeDataAttribute} = useSanityData({
    initial: page,
  });
  return <Home data={data} />;
}
export function getPageHandle(args) {
  const {locale, params, pathname} = args;
  const pathWithoutLocale = pathname.replace(`${locale?.pathPrefix}`, '');
  const pathWithoutSlash = pathWithoutLocale.replace(/^\/+/g, '');
  const isTranslatedHomePage =
    params.locale && locale.pathPrefix && !params['*'];

  // Return home as handle for a translated homepage ex: /fr/
  if (isTranslatedHomePage) return 'home';

  const handle =
    locale?.pathPrefix && params['*']
      ? params['*'] // Handle for a page with locale having pathPrefix ex: /fr/about-us/
      : params.locale && params['*']
      ? `${params.locale}/${params['*']}` // Handle for default locale page with multiple slugs ex: /about-us/another-slug
      : params.locale || pathWithoutSlash; // Handle for default locale page  ex: /about-us/

  return handle;
}

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
