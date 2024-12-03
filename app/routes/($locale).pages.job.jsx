import {json} from '@shopify/remix-oxygen';
import {Link, useLoaderData} from '@remix-run/react';
import React, {useEffect, useRef, useMemo} from 'react';
import {mergeMeta} from '../lib/meta';
import {DEFAULT_LOCALE} from 'countries/index';
import {sanityPreviewPayload} from '../lib/sanity/sanity.payload.server';
import {JOB_PAGE_QUERY} from '../qroq/queries';
import {useSanityData} from '../hooks/useSanityData';
import {getImageUrl} from '~/lib/utils';
import {useRootLoaderData as LoaderData} from '~/root';
import {stegaClean} from '@sanity/client/stega';
import {PortableText} from '@portabletext/react';
import {InternalLinkAnnotation} from '~/components/sanity/richtext/InternalLinkAnnotation';
import '../styles/job-page.css';
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
    groqdQuery: JOB_PAGE_QUERY,
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
      query: JOB_PAGE_QUERY.query,
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

  return (
    <div className="page job-main">
      <div className="main-job-page">
        <div className="food-decorative-garland">
          <img
            alt="food-decorative-garland"
            src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/Group_136.png?v=1716964342"
          />
        </div>
        <div className="container">
          <div
            className="inner-job-sec"
            data-aos-once="true"
            data-aos="fade-up"
            data-aos-duration="1500"
          >
            <h1>{sectionFirst?.title}</h1>
            <p>{sectionFirst?.subtitle}</p>
          </div>
        </div>
        <div className="job-img-box">
          <div className="curywolf-catering-box">
            {sectionSecond?.map((item, index) => {
              const imageUrl = getImageUrl(item?.image?.asset?._ref);
              return (
                <div
                  key={item?._key}
                  className="img-big-wrap aos-init aos-animate"
                >
                  <div className="img-one">
                    <div className="inner-white-box">
                      <img src={imageUrl} alt="Currywolf Truck" />
                    </div>
                    <div className="inner-content">
                      <p>{item?.title}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="container">
          <div
            className="gute-job"
            data-aos-once="true"
            data-aos="fade-up"
            data-aos-duration="1500"
          >
            <div className="gute-left">
              <h3>{sectionThird?.title}</h3>
              <p>{sectionThird?.description}</p>
            </div>
            <div className="gute-right">
              <h3>{sectionThird?.stellenangebote?.title}</h3>
              <section className="accordion">
                {sectionThird?.stellenangebote?.innerPage.map((item, index) => {
                  const url = stegaClean(
                    `${locale.pathPrefix}/pages/${item?.link}`,
                  );
                  return (
                    <div key={item?._key} className="tab">
                      <Link to={url}>
                        <label htmlFor="cb1" className="tab__label">
                          {item?.title}
                        </label>
                      </Link>
                    </div>
                  );
                })}
              </section>
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
