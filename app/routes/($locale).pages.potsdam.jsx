import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import '../styles/location-inner.css';
import {useEffect, useRef, useState} from 'react';

import {mergeMeta} from '../lib/meta';
import {DEFAULT_LOCALE} from 'countries';
import {sanityPreviewPayload} from '../lib/sanity/sanity.payload.server';
import {LOCATION_INNER_PAGE_QUERY} from '../qroq/queries';
import {useSanityData} from '../hooks/useSanityData';
import {getPageHandle} from './($locale).$';
import {getImageUrl} from '~/lib/utils';
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
    groqdQuery: LOCATION_INNER_PAGE_QUERY,
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
      query: LOCATION_INNER_PAGE_QUERY.query,
    }),
  });
}

export default function Page() {
  /** @type {LoaderReturnData} */
  const {page} = useLoaderData();
  const {data, encodeDataAttribute} = useSanityData({
    initial: page,
  });
  const imageTop = data?.imagesTop;
  const imageBottom = data?.imagesBottom;
  const openingTimes = data?.openingTimes;
  const paymentMethods = data?.paymentMethods;
  const openingTimesArray = openingTimes?.OpeningTimes;
  const googleRouting = data?.route;
  const Menus = data?.locationMenu;
  const VeganLogoUrl = getImageUrl(Menus?.MenuImage?.asset?._ref);
  const firstObject = openingTimesArray.slice(0, 4);
  const secondObject = openingTimesArray.slice(4);
  const result = {
    firstObject,
    secondObject,
  };
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      videoRef.current.play();
    }
  }, [isPlaying]);

  useEffect(() => {
    const videoElement = document.querySelector('video');
    if (videoElement) {
      videoRef.current = videoElement;
      setIsPlaying(true);
    }

    return () => {
      if (videoElement) {
        setIsPlaying(false);
      }
    };
  }, []);

  return (
    <div className="page location-inner-main">
      <main>
        <div id="popup">
          <div className="popup-container">
            <div className="popup-scroll">
              <div className="popup-img-right-one">
                {imageTop?.map((image, index) => {
                  const imageUrl = getImageUrl(image.image.asset._ref);
                  const imageClass = index === 0 ? 'img-one' : 'img-two';
                  return (
                    <img
                      key={index}
                      src={imageUrl}
                      className={imageClass}
                      alt={`Image ${index + 1}`}
                    />
                  );
                })}
              </div>
              <div className="popup">
                <div
                  data-aos="fade-up"
                  data-aos-duration="2000"
                  className="popup-wrap"
                >
                  <div className="popup-left">
                    <div className="popup-inner-left-box">
                      <h1>{data?.title}</h1>
                      <p>{data?.Subtitle}</p>
                      <div className="popup-left-img">
                        <video playsInline autoPlay muted id="location-inner">
                          <source
                            type="video/mp4"
                            src="https://cdn.shopify.com/videos/c/o/v/d3db6c1eec404868a1c8a8796fb46c21.mp4"
                          />
                          <source
                            type="video/webm"
                            src="https://cdn.shopify.com/videos/c/o/v/78b8d97ce6234456887ad4418ec5aa30.webm"
                          />
                          Your browser does not support the video tag.
                        </video>
                      </div>

                      <div className="popup-opening-hours">
                        <div className="popup-h-title">
                          <h2>{openingTimes?.title}</h2>
                        </div>
                        <div className="popup-r-time">
                          <ul>
                            {result.firstObject?.map((day, index) => {
                              return (
                                <li key={index}>
                                  <span>{day?.day}</span>&nbsp;{day?.time}
                                </li>
                              );
                            })}
                          </ul>
                          <ul>
                            {result?.secondObject?.map((day, index) => {
                              return (
                                <li key={index}>
                                  <span>{day?.day}</span>&nbsp;{day?.time}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                      <div className="popup-payment">
                        <h3>{paymentMethods?.title}</h3>
                        <ul>
                          {paymentMethods?.PaymentMethodsImages?.map((item) => {
                            const imageUrl = getImageUrl(item.image.asset._ref);
                            return (
                              <li key={item._key}>
                                <img src={imageUrl} alt="Cash" />
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      <div className="popup-location-btn">
                        <a
                          className="yellow-btn"
                          href={googleRouting?.buttonLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span>
                            <svg
                              viewBox="0 0 297 297"
                              xmlns="http://www.w3.org/2000/svg"
                              width="50px"
                              height="50px"
                              fill="#9B2220"
                            >
                              <g>
                                <path d="M148.5,0C87.43,0,37.747,49.703,37.747,110.797c0,91.026,99.729,179.905,103.976,183.645c1.936,1.705,4.356,2.559,6.777,2.559c2.421,0,4.841-0.853,6.778-2.559c4.245-3.739,103.975-92.618,103.975-183.645C259.253,49.703,209.57,0,148.5,0z M148.5,272.689c-22.049-21.366-90.243-93.029-90.243-161.892c0-49.784,40.483-90.287,90.243-90.287s90.243,40.503,90.243,90.287C238.743,179.659,170.549,251.322,148.5,272.689z" />
                                <path d="M148.5,59.183c-28.273,0-51.274,23.154-51.274,51.614c0,28.461,23.001,51.614,51.274,51.614c28.273,0,51.274-23.153,51.274-51.614C199.774,82.337,176.773,59.183,148.5,59.183z M148.5,141.901c-16.964,0-30.765-13.953-30.765-31.104c0-17.15,13.801-31.104,30.765-31.104c16.964,0,30.765,13.953,30.765,31.104C179.265,127.948,165.464,141.901,148.5,141.901z" />
                              </g>
                            </svg>
                          </span>
                          {googleRouting?.buttonText}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="popup-right">
                    <div className="popup-l-img">
                      <img
                        src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/CurryWolf_Logo_footer_d4b2cd6d-72f1-406d-8481-4098d51097ea.svg?v=1721306051"
                        alt="Curry Wolf Logo"
                      />
                    </div>
                    <div className="popup-right-box">
                      <div className="p-top-btn">
                        <img
                          src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/pushpin-147918_1280_2_1.png?v=1718878550"
                          alt="Pushpin Icon"
                        />
                      </div>
                      <div className="popup-top-title">
                        <h2>
                          <span>
                            <img src={VeganLogoUrl} alt="Vegan Logo" />
                          </span>
                          {Menus?.title}
                        </h2>
                      </div>
                      <div className="popup-bottom-menu">
                        <div className="foodmenu-one">
                          <h3>{Menus?.foods?.title}</h3>
                          <ul>
                            {Menus?.foods?.foods?.map((item) => {
                              return (
                                <li key={item._key}>
                                  <span>{item.food}</span>
                                  <span>{item.price}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        <div className="foodmenu-one">
                          <h3>{Menus?.drinks?.title}</h3>
                          <ul>
                            {Menus?.drinks?.drinks?.map((item) => {
                              return (
                                <li key={item._key}>
                                  <span>{item.drink}</span>
                                  <span>
                                    {item.volume && <span>{item.volume}</span>}
                                    <span>{item.price}</span>
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        <div className="foodmenu-one">
                          <h3>{Menus?.OutsideOfTheHouse?.title}</h3>
                          <ul>
                            {Menus?.OutsideOfTheHouse?.OutsideOfTheHouse?.map(
                              (item) => {
                                return (
                                  <li key={item._key}>
                                    <span>{item.Name}</span>
                                    <span className="volume">
                                      {item.volume && (
                                        <span>{item.volume}</span>
                                      )}
                                      <span>{item.price}</span>
                                    </span>
                                  </li>
                                );
                              },
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="popup-img-right-two">
                {imageBottom?.map((image, index) => {
                  const imageUrl = getImageUrl(image.image.asset._ref);
                  const imageClass = index === 0 ? 'img-three' : 'img-four';
                  return (
                    <img
                      key={index}
                      src={imageUrl}
                      className={imageClass}
                      alt={`Image ${index + 1}`}
                    />
                  );
                })}
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
