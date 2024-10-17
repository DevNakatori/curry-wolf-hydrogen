import {json} from '@shopify/remix-oxygen';
import {Link, useLoaderData, useParams} from '@remix-run/react';
import React, {useEffect, useRef, useMemo} from 'react';
import {mergeMeta} from '../lib/meta';
import {DEFAULT_LOCALE} from 'countries';
import {sanityPreviewPayload} from '../lib/sanity/sanity.payload.server';
import {POLICIES_INNER_PAGE_QUERY} from '../qroq/queries';
import {useSanityData} from '../hooks/useSanityData';
import {getImageUrl} from '~/lib/utils';
import {useRootLoaderData as LoaderData} from '~/root';
import {stegaClean} from '@sanity/client/stega';
import {PortableText} from '@portabletext/react';
import {InternalLinkAnnotation} from '~/components/sanity/richtext/InternalLinkAnnotation';
import '../styles/policies.css';

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
export async function loader({params, request, context}) {
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
    groqdQuery: POLICIES_INNER_PAGE_QUERY,
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
      query: POLICIES_INNER_PAGE_QUERY.query,
    }),
  });
}

export default function Policy() {
  /** @type {LoaderReturnData} */
  const {page} = useLoaderData();
  const {data, encodeDataAttribute} = useSanityData({
    initial: page,
  });
  const {locale} = LoaderData();
  const button = data?.button;
  const buttonLink = stegaClean(`${locale.pathPrefix}/${button?.link}`);

  // useEffect(() => {
  //   if (policy.handle === 'privacyPolicy') {
  //     const tabContent = document.getElementsByClassName('tabContent');
  //     const tab = document.getElementsByClassName('tab');

  //     function hideTabsContent(a) {
  //       for (let i = a; i < tabContent.length; i++) {
  //         tabContent[i].classList.remove('show');
  //         tabContent[i].classList.add('hide');
  //         tab[i].classList.remove('whiteborder');
  //       }
  //     }

  //     function showTabsContent(b) {
  //       if (tabContent[b].classList.contains('hide')) {
  //         hideTabsContent(0);
  //         tab[b].classList.add('whiteborder');
  //         tabContent[b].classList.remove('hide');
  //         tabContent[b].classList.add('show');
  //       }
  //     }

  //     hideTabsContent(1);

  //     document.getElementById('tabs').onclick = function (event) {
  //       const target = event.target;
  //       if (target.className === 'tab') {
  //         for (let i = 0; i < tab.length; i++) {
  //           if (target === tab[i]) {
  //             showTabsContent(i);
  //             break;
  //           }
  //         }
  //       }
  //     };
  //   }
  // }, [policy.handle]);
  const {handle} = useParams();
  console.log(handle);
  const components = useMemo(
    () => ({
      marks: {
        linkInternal: ({value, children}) => {
          const {reference} = value;
          return (
            <InternalLinkAnnotation reference={reference}>
              {children}
            </InternalLinkAnnotation>
          );
        },
      },
    }),
    [],
  );
  return (
    <div className="policy">
      <div className="container">
        <div>
          <Link className="yellow-border-btn" to={buttonLink}>
            {button?.label}
          </Link>
        </div>
        <div className="top-title">
          <h1>{data?.title}</h1>
        </div>
        <div className={handle === 'terms-of-service' ? 'policy-sec' : ''}>
          <div className={handle === 'terms-of-service' ? 'container' : ''}>
            <PortableText components={components} value={data?.content} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @typedef {keyof Pick<
 *   Shop,
 *   'privacyPolicy' | 'shippingPolicy' | 'termsOfService' | 'refundPolicy'
 * >} SelectedPolicies
 */

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').Shop} Shop */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
