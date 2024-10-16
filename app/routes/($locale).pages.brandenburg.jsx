import {json} from '@shopify/remix-oxygen';
import {Link, useLoaderData} from '@remix-run/react';
import {useEffect, useRef, useState} from 'react';
import {mergeMeta} from '../lib/meta';
import {DEFAULT_LOCALE} from 'countries';
import {sanityPreviewPayload} from '../lib/sanity/sanity.payload.server';
import {CATERING_INNER_PAGE_QUERY} from '../qroq/queries';
import {useSanityData} from '../hooks/useSanityData';
import {getImageUrl} from '~/lib/utils';
import {useRootLoaderData as LoaderData} from '~/root';
import {stegaClean} from '@sanity/client/stega';
import {generateSanityImageUrl} from '~/components/sanity/SanityImage';
import '../styles/catering-inner.css';
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
    handle, // Use the handle you extracted
    language,
  };

  const page = await sanity.query({
    groqdQuery: CATERING_INNER_PAGE_QUERY,
    params: queryParams,
  });
  if (!page) {
    throw new Response('Not Found', {status: 404});
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
      query: CATERING_INNER_PAGE_QUERY.query,
    }),
  });
}

export default function Page() {
  /** @type {LoaderReturnData} */
  const {page} = useLoaderData();
  const {locale} = LoaderData();
  const {data, encodeDataAttribute} = useSanityData({
    initial: page,
  });
  const ctaLink = stegaClean(`${locale.pathPrefix}/pages/${data?.link}`);
  const Brandenburger = data?.Brandenburger;
  const Referenzen = data?.Referenzen;
  const Rating = data?.Rating;
  const ImagesSection = data?.ImagesSection;

  return (
    <div className="page catering-inner">
      <main>
        <div className="wolf-bestell">
          <div className="food-decorative-garland">
            <img
              alt="food-decorative-garland"
              src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/Group_136.png?v=1716964342"
            />
          </div>
          <div className="container">
            <div
              className="inner-wolf-bestell"
              data-aos-once="true"
              data-aos="fade-up"
              data-aos-duration="1500"
            >
              <div className="left-content">
                <h1 dangerouslySetInnerHTML={{__html: data?.heroTitle}} />
                <h3>{data?.Description}</h3>
                <Link className="yellow-btn" to={ctaLink}>
                  {data?.ctaButtontext}
                </Link>
              </div>
              <div className="right-logo">
                <img src={getImageUrl(data?.image?.asset?._ref)} />
              </div>
            </div>
            <div
              className="brandenburg"
              data-aos-once="true"
              data-aos="fade-up"
              data-aos-duration="1500"
            >
              <div className="brand-left">
                <h2>{Brandenburger?.title}</h2>
                <p>{Brandenburger?.description}</p>
                <div className="c-brand-content">
                  {Brandenburger?.content?.map((item, index) => {
                    return (
                      <>
                        <p>
                          <span>{item?.title}</span>
                        </p>
                        <p>{item?.description}</p>
                      </>
                    );
                  })}
                </div>
                <div className="b-btn-wrap">
                  <Link
                    className="yellow-btn"
                    to={stegaClean(
                      `${locale.pathPrefix}/pages/${Brandenburger?.ButtonLink}`,
                    )}
                  >
                    {Brandenburger?.ButtonText}
                  </Link>
                </div>
              </div>
              <div className="brand-right">
                {Brandenburger?.secondContent.map((item, index) => {
                  return <p key={item._key}>{item?.description}</p>;
                })}

                <div className="b-btn-wrap">
                  <Link
                    className="yellow-border-btn"
                    to={stegaClean(
                      `${locale.pathPrefix}/pages/${Brandenburger?.secondButtonLink}`,
                    )}
                  >
                    {Brandenburger?.secondButtonText}
                  </Link>
                </div>
                <div className="img-big-wrap">
                  <div className="img-one">
                    <div className="inner-white-box">
                      <img
                        src={getImageUrl(
                          Brandenburger?.image?.image?.asset?._ref,
                        )}
                      />
                    </div>
                    <div className="white-box-content">
                      {Brandenburger?.image?.title}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="reference"
              data-aos-once="true"
              data-aos="fade-up"
              data-aos-duration="1500"
            >
              <h3>
                <span data-mce-fragment="1">{Referenzen?.title}</span>
              </h3>
              <div className="ref-slider">
                <div className="ref-wrap">
                  {Referenzen?.ReferenzenContent.map((item) => {
                    return (
                      <div className="ref-box">
                        <p className="same-height">{item?.description}</p>
                        <div className="ref-title">
                          <h4 dangerouslySetInnerHTML={{__html: item?.title}} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div
              className="wolf-logo"
              data-aos-once="true"
              data-aos="fade-up"
              data-aos-duration="1500"
            >
              <div className="w-left-content">
                <h3>{Rating?.number}</h3>
                <p>
                  <span data-mce-fragment="1">{Rating?.title}</span>
                </p>
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <svg
                      key={index}
                      width="47"
                      height="47"
                      viewBox="0 0 47 47"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M41.6799 16.2067L30.0263 14.513L24.8168 3.95177C24.6745 3.66261 24.4404 3.42853 24.1513 3.28625C23.4261 2.92824 22.5448 3.22658 22.1822 3.95177L16.9727 14.513L5.31913 16.2067C4.99784 16.2526 4.70409 16.404 4.47919 16.6335C4.20729 16.913 4.05747 17.2889 4.06263 17.6788C4.06779 18.0687 4.22752 18.4406 4.50673 18.7127L12.9383 26.9331L10.9463 38.5408C10.8996 38.8109 10.9294 39.0886 11.0325 39.3425C11.1356 39.5964 11.3078 39.8163 11.5295 39.9773C11.7512 40.1384 12.0136 40.2341 12.287 40.2536C12.5603 40.2731 12.8336 40.2156 13.076 40.0876L23.4995 34.6073L33.923 40.0876C34.2076 40.2391 34.5381 40.2896 34.8548 40.2345C35.6534 40.0968 36.1904 39.3395 36.0527 38.5408L34.0607 26.9331L42.4923 18.7127C42.7218 18.4878 42.8732 18.1941 42.9191 17.8728C43.0431 17.0695 42.4831 16.326 41.6799 16.2067Z"
                        fill="#FEDE03"
                      ></path>
                    </svg>
                  ))}
              </div>
              <div className="w-right-logo">
                {Rating?.image?.map((item) => {
                  const Imgurl = getImageUrl(item?.Image?.asset?._ref);
                  return (
                    <div className="logo-box">
                      <img src={Imgurl} />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="container">
              <div className="curywolf-catering-box">
                {ImagesSection?.cateringPageImages?.map((item, index) => {
                  const Imgurl = getImageUrl(item?.image?.asset?._ref);
                  // Determine AOS attributes conditionally
                  const url = stegaClean(
                    `${locale.pathPrefix}/pages/${item?.link}`,
                  );
                  const getAosAttributes = (index) => {
                    switch (index) {
                      case 0:
                      case 3:
                        return {
                          'data-aos': 'fade-right',
                          'data-aos-duration': '2000',
                        };
                      case 1:
                      case 4:
                        return {
                          'data-aos': 'zoom-in',
                          'data-aos-duration': '1500',
                        };
                      case 2:
                      default:
                        return {
                          'data-aos': 'fade-right',
                          'data-aos-duration': '2000',
                        };
                    }
                  };

                  const aosAttributes = getAosAttributes(index);
                  return (
                    <div
                      key={item?._key}
                      data-aos-duration="2000"
                      data-aos-once="true"
                      {...aosAttributes}
                      className="img-big-wrap"
                    >
                      <Link to={url}>
                        <div className="img-one">
                          <div className="inner-white-box">
                            <img src={Imgurl} />
                          </div>
                          <div className="inner-content">
                            <p>{item?.title}</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="f-btn-wrap">
              <div className="faq-btn">
                <Link
                  className="yellow-btn"
                  to={stegaClean(
                    `${locale.pathPrefix}/pages/${ImagesSection?.buttons?.[0]?.buttonLink}`,
                  )}
                >
                  {ImagesSection?.buttons?.[0]?.buttonText}
                </Link>
              </div>
              <div className="faq-btn">
                <Link
                  className="yellow-border-btn"
                  to={stegaClean(
                    `${locale.pathPrefix}/pages/${ImagesSection?.buttons?.[1]?.buttonLink}`,
                  )}
                >
                  {ImagesSection?.buttons?.[1]?.buttonText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
