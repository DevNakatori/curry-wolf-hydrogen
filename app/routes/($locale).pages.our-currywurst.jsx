import {json} from '@shopify/remix-oxygen';
import {Link, useLoaderData} from '@remix-run/react';

import {useMemo} from 'react';
import {mergeMeta} from '../lib/meta';
import {DEFAULT_LOCALE} from 'countries';
import {sanityPreviewPayload} from '../lib/sanity/sanity.payload.server';
import {OUR_CURRYWURST_PAGE_QUERY} from '../qroq/queries';
import {useSanityData} from '../hooks/useSanityData';
import {getImageUrl} from '~/lib/utils';
import {useRootLoaderData as LoaderData} from '~/root';
import {stegaClean} from '@sanity/client/stega';
import {PortableText} from '@portabletext/react';
import {InternalLinkAnnotation} from '~/components/sanity/richtext/InternalLinkAnnotation';
import '../styles/currywurst-page.css';
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
    groqdQuery: OUR_CURRYWURST_PAGE_QUERY,
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
      query: OUR_CURRYWURST_PAGE_QUERY.query,
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
  const sectionSecond = data?.sectionSecond;
  const sectionThird = data?.sectionThird;
  const sectionFourth = data?.sectionFourth;
  console.log(sectionFourth);

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
    <div className="page catering-inner">
      <main>
        <div className="main-currywurast-page">
          <div className="food-decorative-garland">
            <img
              src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/Group_136_1.png?v=1720001398"
              alt="food-decorative-garland"
            />
          </div>
          <div className="container">
            <div
              className="curry-wrap"
              data-aos-once="true"
              data-aos="fade-up"
              data-aos-duration="1500"
            >
              <h1>{data?.title}</h1>
              <div className="sub-title">
                <p className="text-bold">{data?.subtitle}</p>
              </div>
            </div>
            <div
              data-aos-once="true"
              data-aos="fade-up"
              data-aos-duration="2000"
              data-aos-delay="500"
              className="our-currywurst-sec"
            >
              <div className="left-sec">
                <div className="inner-left-sticky">
                  <img
                    alt="berliner-currywurst-im-glas"
                    src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/berliner-currywurst-im-glas_card.webp?v=1721907787"
                  />
                  <div className="bottom-c-logo">
                    <img
                      alt="made-in-berlin"
                      src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/made_in_berlin_copy.svg?v=1721626292"
                    />
                  </div>
                </div>
              </div>
              <div className="right-content" data-aos-duration="1500">
                <PortableText
                  components={components}
                  value={sectionFirst?.content}
                />
                <div className="y-btn-wrap">
                  <Link
                    className="yellow-btn"
                    to={stegaClean(
                      `${locale.pathPrefix}/${sectionFirst?.buttonLink}`,
                    )}
                  >
                    {sectionFirst?.buttonText}
                  </Link>
                </div>
              </div>
            </div>
            <div
              data-aos-once="true"
              data-aos="fade-up"
              data-aos-duration="1500"
              className="prepare-food-sec"
            >
              <div className="p-left aos-init aos-animate">
                <PortableText value={sectionSecond?.content} />
              </div>
              <div className="p-right aos-init aos-animate">
                <div className="c-s-image-section aos-init aos-animate">
                  {sectionSecond?.images?.map((item, index) => {
                    const imgUrl = getImageUrl(item?.asset?._ref);
                    return (
                      <div
                        key={item?._key}
                        className="img-big-wrap aos-init aos-animate"
                      >
                        <div className="img-one">
                          <div className="inner-white-box">
                            <img src={imgUrl} alt="Curry Wolf Family" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div
              className="curry-image-content"
              data-aos-once="true"
              data-aos="fade-up"
              data-aos-duration="1500"
            >
              {sectionThird?.cards?.map((item, index) => {
                const imgUrl = getImageUrl(item?.image?.asset?._ref);
                const url = stegaClean(
                  `${locale.pathPrefix}${item?.buttonLink}`,
                );
                return (
                  <div key={item?._key} className="c-two-box">
                    <div className="c-left">
                      <img src={imgUrl} alt="shop-image" />
                    </div>
                    <div className="c-right">
                      <h2>{item?.title}</h2>
                      <p className="same-height">{item?.description}</p>
                      <Link to={url} className="yellow-border-btn">
                        {item?.buttonText}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="follow-currywolf">
              <div
                data-aos-once="true"
                data-aos="fade-up"
                data-aos-duration="1500"
              >
                <h2>
                  {sectionFourth?.title}
                  <br />
                  {sectionFourth?.Subtitle}
                </h2>
                <div className="curry-new-btn">
                  <a
                    href={sectionFourth?.buttonLink}
                    className="yellow-border-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {sectionFourth?.buttonText}
                  </a>
                </div>
                <div className="follow-box">
                  <div className="c-s-image-section aos-init aos-animate">
                    {sectionFourth?.images?.map((image, index) => {
                      const imageUrl = getImageUrl(image.image.asset._ref);
                      const aosType =
                        index === 0
                          ? 'fade-right'
                          : index === 1
                          ? 'zoom-in'
                          : index === 2
                          ? 'zoom-in'
                          : index === 3
                          ? 'fade-left'
                          : 'fade-right';
                      return (
                        <div
                          key={index}
                          className="img-big-wrap aos-init aos-animate"
                          data-aos-duration="2000"
                          data-aos-once="true"
                          data-aos={aosType}
                        >
                          <div className="img-one">
                            <div className="inner-white-box">
                              <img src={imageUrl} alt={`Image ${index}`} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
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
