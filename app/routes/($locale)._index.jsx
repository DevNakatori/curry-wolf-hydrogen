import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import React, {lazy, useEffect, useRef, useState} from 'react';
import {DEFAULT_LOCALE} from 'countries';
import {sanityPreviewPayload} from '../lib/sanity/sanity.payload.server';
import {PAGE_QUERY} from '../qroq/queries';
import {useSanityData} from '../hooks/useSanityData';
import '../styles/home-video.css';
import PageRoute from './($locale).$';
/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [
    {title: `Curry Wolf | ${data?.seo?.title ?? ''}`},
    {name: 'description', content: data?.seo?.description},
    {
      tagName: 'link',
      rel: 'canonical',
      href: data.canonicalUrl,
    },
  ];
};
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
  const seo = page?.data?.seo;
  const canonicalUrl = request.url;
  return json({
    page,
    seo,
    canonicalUrl,
    ...sanityPreviewPayload({
      context,
      params: queryParams,
      query: PAGE_QUERY.query,
    }),
  });
}
export default PageRoute;
