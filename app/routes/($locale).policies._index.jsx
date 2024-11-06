import {json} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import React, {useEffect, useRef, useMemo} from 'react';
import {mergeMeta} from '../lib/meta';
import {DEFAULT_LOCALE} from 'countries';
import {sanityPreviewPayload} from '../lib/sanity/sanity.payload.server';
import {POLICIES_PAGE_QUERY} from '../qroq/queries';
import {useSanityData} from '../hooks/useSanityData';
import {getImageUrl} from '~/lib/utils';
import {useRootLoaderData as LoaderData} from '~/root';
import {stegaClean} from '@sanity/client/stega';
import {PortableText} from '@portabletext/react';
import {InternalLinkAnnotation} from '~/components/sanity/richtext/InternalLinkAnnotation';
import '../styles/policies.css';

/**
 * @param {LoaderFunctionArgs}
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

export async function loader({request, context}) {
  const {env, locale, sanity, storefront} = context;
  const pathname = new URL(request.url).pathname;
  const segments = pathname.split('/').filter(Boolean);
  const handle = segments[segments.length - 1];
  const language = locale?.language.toLowerCase();
  const queryParams = {
    defaultLanguage: DEFAULT_LOCALE.language.toLowerCase(),
    handle,
    language,
  };

  const page = await sanity.query({
    groqdQuery: POLICIES_PAGE_QUERY,
    params: queryParams,
  });

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }
  const seo = page?.data?.seo;
  const canonicalUrl = request.url;

  return json({
    page,
    canonicalUrl,
    seo,
    ...sanityPreviewPayload({
      context,
      params: queryParams,
      query: POLICIES_PAGE_QUERY.query,
    }),
  });
}

export default function Policies() {
  /** @type {LoaderReturnData} */
  const {page} = useLoaderData();
  const {data, encodeDataAttribute} = useSanityData({
    initial: page,
  });
  const {locale} = LoaderData();

  return (
    <div className="policies">
      <div className="policies-box">
        <div className="p-title">
          <h1>{data?.policiesLink?.title}</h1>
        </div>
        <div className="policies-inner">
          {data?.policiesLink?.menu?.map((policy) => {
            const link = policy?.link;
            const documentType = link?.documentType;
            const slug = link?.slug;
            const slug2 = link?.slug?.current;
            const anchor = policy?.anchor ? `#${policy?.anchor}` : '';
            const path = () => {
              switch (documentType) {
                case 'policiesInnerPage':
                  return `${locale?.pathPrefix}/policies/${slug}`;
                default:
                  return '';
              }
            };
            const url = stegaClean(`${path()}${anchor}`);
            return (
              <fieldset key={policy?._key}>
                <Link to={url}>{policy?.name}</Link>
              </fieldset>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
