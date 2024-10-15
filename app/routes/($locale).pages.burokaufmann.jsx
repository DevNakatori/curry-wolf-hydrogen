import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import React, {useEffect, useRef, useMemo} from 'react';
import {mergeMeta} from '../lib/meta';
import {DEFAULT_LOCALE} from 'countries';
import {sanityPreviewPayload} from '../lib/sanity/sanity.payload.server';
import {JOB_INNER_PAGE_QUERY} from '../qroq/queries';
import {useSanityData} from '../hooks/useSanityData';
import {getPageHandle} from './($locale).$';
import {getImageUrl} from '~/lib/utils';
import {useRootLoaderData as LoaderData} from '~/root';
import {stegaClean} from '@sanity/client/stega';
import {PortableText} from '@portabletext/react';
import {InternalLinkAnnotation} from '~/components/sanity/richtext/InternalLinkAnnotation';
import '../styles/job-detail.css';
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
    groqdQuery: JOB_INNER_PAGE_QUERY,
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
      query: JOB_INNER_PAGE_QUERY.query,
    }),
  });
}

export default function Page() {
  /** @type {LoaderReturnData} */
  const {page} = useLoaderData();
  const {data, encodeDataAttribute} = useSanityData({
    initial: page,
  });
  const {locale} = LoaderData();
  const sectionFirst = data?.sectionFirst;
  const sectionSecond = data?.images;
  const sectionThird = data?.sectionThird;
  const sectionFourth = data?.sectionFourth;

  return (
    <div className="page job-detail-main">
      <div className="job-detail">
        <div className="food-decorative-garland">
          <img
            src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/Group_136.png?v=1716964342"
            alt="food-decorative-garland"
          />
        </div>
        <div className="container">
          <div
            className="go-back-pro-btn"
            data-aos-once="true"
            data-aos="fade-up"
            data-aos-duration="1500"
          >
            <a className="yellow-border-btn">{sectionFirst?.buttonText}</a>
          </div>
          <div
            className="top-job-detail"
            data-aos-once="true"
            data-aos="fade-up"
            data-aos-duration="1500"
          >
            <div className="job-detail-left">
              <h1 dangerouslySetInnerHTML={{__html: sectionFirst?.title}} />
              <PortableText value={sectionFirst?.subtitle} />
            </div>
            <div className="job-detail-right">
              <div className="curywolf-catering-box">
                {sectionSecond?.map((item, index) => {
                  const imageUrl = getImageUrl(item?.image?.asset?._ref);
                  return (
                    <div key={item?._key} className="img-big-wrap">
                      <a>
                        <div className="img-one">
                          <div className="inner-white-box">
                            <img src={imageUrl} alt="Rooftop Catering" />
                          </div>
                          <div className="inner-content">
                            <p>{item?.title}</p>
                          </div>
                        </div>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="white-border"></div>
          <div
            className="job-detail-wrap"
            data-aos-once="true"
            data-aos="fade-up"
            data-aos-duration="1500"
          >
            <div className="job-detail-das">
              <h3>{sectionThird?.weoffer?.title}</h3>
              <PortableText value={sectionThird?.weoffer?.content} />
            </div>
            <div className="job-detail-ans">
              <h3>{sectionThird?.Howtoapply?.title}</h3>
              <PortableText value={sectionThird?.Howtoapply?.content} />
            </div>
          </div>
          <div
            className="job-detail-send-mail"
            data-aos-once="true"
            data-aos="fade-up"
            data-aos-duration="1500"
          >
            <div className="detail-mail-left">
              <a className="yellow-btn">{sectionFourth?.buttonText}</a>
            </div>
            <div className="detail-mail-right">
              <PortableText value={sectionFourth?.content} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
