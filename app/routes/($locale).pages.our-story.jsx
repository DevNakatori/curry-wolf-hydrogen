import React, {useEffect} from 'react';
import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {mergeMeta} from '../lib/meta';
import {DEFAULT_LOCALE} from 'countries/index';
import {sanityPreviewPayload} from '../lib/sanity/sanity.payload.server';
import {OUR_STORY_PAGE_QUERY} from '../qroq/queries';
import {useSanityData} from '../hooks/useSanityData';
import {getImageUrl} from '~/lib/utils';
import {useRootLoaderData as LoaderData} from '~/root';
import {stegaClean} from '@sanity/client/stega';
import {PortableText} from '@portabletext/react';
import '../styles/our-story.css';

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
    groqdQuery: OUR_STORY_PAGE_QUERY,
    params: queryParams,
  });
  console.log(queryParams);
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
      query: OUR_STORY_PAGE_QUERY.query,
    }),
  });
}

export default function Page() {
  const {page} = useLoaderData();
  const {data, encodeDataAttribute} = useSanityData({
    initial: page,
  });
  console.log(data);
  useEffect(() => {
    if (document.querySelectorAll('.path-vert').length > 0) {
      const path = document.querySelector('.path-vert');
      const pathLength = path.getTotalLength();
      path.style.strokeDasharray = pathLength;
      path.style.strokeDashoffset = pathLength;

      const updateDashOffset = () => {
        const scrollPosition = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const dashOffset = Math.max(
          0,
          pathLength - (scrollPosition / maxScroll) * pathLength,
        );
        path.style.strokeDashoffset = dashOffset;
      };

      window.addEventListener('scroll', updateDashOffset);
      updateDashOffset();
      path.style.display = 'block';

      return () => {
        window.removeEventListener('scroll', updateDashOffset);
      };
    }

    if (document.querySelectorAll('.our-story-box').length) {
      document.querySelectorAll('.our-story-box').forEach((box) => {
        const img = box.querySelector('.img-one');
        const line = box.querySelector('.line');

        img.addEventListener('mouseenter', () => {
          line.style.opacity = '0';
        });

        img.addEventListener('mouseleave', () => {
          line.style.opacity = '1';
        });
      });
    }

    if (document.querySelectorAll('#line-path').length) {
      const path = document.querySelector('#line-path');
      const pathLength = path.getTotalLength();
      path.style.strokeDasharray = `${pathLength} ${pathLength}`;
      path.style.strokeDashoffset = pathLength;
      path.getBoundingClientRect();

      const handleScroll = () => {
        const scrollPercentage =
          (document.documentElement.scrollTop + document.body.scrollTop) /
          (document.documentElement.scrollHeight -
            document.documentElement.clientHeight);
        const drawLength = pathLength * scrollPercentage;
        path.style.strokeDashoffset = pathLength - drawLength;
        if (scrollPercentage >= 0.99) {
          path.style.strokeDasharray = 'none';
        } else {
          path.style.strokeDasharray = `${pathLength} ${pathLength}`;
        }
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <div className="page our-story">
      <main>
        <div className="food-decorative-garland">
          <img
            alt="food-decorative-garland"
            src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/Group_136.png?v=1716964342"
          />
        </div>
        <div className="container">
          <div
            className="page-heading"
            data-aos="fade-down"
            data-aos-duration="1000"
            data-aos-once="true"
          >
            <h1>{data?.title}</h1>
          </div>
          <div
            className="subheader"
            data-aos="fade-down"
            data-aos-duration="1500"
            data-aos-once="true"
          >
            <p>{data?.subtitle}</p>
          </div>
          <div className="our-story-sec">
            <div
              data-aos-once="true"
              className="line aos-init aos-animate"
              data-aos="zoom-in"
              data-aos-easing="linear"
              data-aos-duration="700"
            >
              <svg
                xmlSpace="preserve"
                height="100%"
                width="30px"
                y="0px"
                x="0px"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xmlns="http://www.w3.org/2000/svg"
                id="line_2"
                version="1.1"
              >
                <path
                  d="M30 0 v600 1500"
                  stroke="#fff"
                  strokeWidth="1"
                  fill="#fff"
                  className="path-vert"
                ></path>
              </svg>
            </div>
            {data?.sectionFirst?.cards?.map((item, index) => {
              const imgUrl = getImageUrl(item?.image?.asset?._ref);
              const [titlePart1, titlePart2] = item?.title?.split(':') || [
                '',
                '',
              ]; // Split the title by ":"

              return (
                <div key={item?._key} className="our-story-box">
                  <div
                    data-aos-offset="300"
                    data-aos={index % 2 === 0 ? 'fade-right' : 'fade-left'}
                    data-aos-once="true"
                    className="story-left"
                  >
                    <h2>
                      {titlePart1 && `${titlePart1.trim()}:`}
                      <br />
                      {titlePart2 && <span>{titlePart2.trim()}</span>}
                    </h2>
                  </div>

                  <div className="story-wrap">
                    {index === 1 || index === 2 ? (
                      <div className="stroy-i-back">
                        <div
                          className="img-one"
                          data-aos="zoom-in"
                          data-aos-duration="1000"
                          data-aos-once="true"
                        >
                          <div className="inner-white-box">
                            <img alt={item?.title} src={imgUrl} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="img-one"
                        data-aos="zoom-in"
                        data-aos-duration="1000"
                        data-aos-once="true"
                      >
                        <div className="inner-white-box">
                          <img alt={item?.title} src={imgUrl} />
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    data-aos-offset="300"
                    data-aos={index % 2 === 0 ? 'fade-left' : 'fade-right'}
                    data-aos-once="true"
                    className="story-right"
                  >
                    <p>{item?.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
