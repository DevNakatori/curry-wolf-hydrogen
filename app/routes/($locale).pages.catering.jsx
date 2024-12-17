import '../styles/catering-page.css';
import {json} from '@shopify/remix-oxygen';
import {Link, useLoaderData, useLocation, useParams} from '@remix-run/react';
import {useEffect, useState} from 'react';
import {mergeMeta} from '../lib/meta';
import {DEFAULT_LOCALE} from 'countries/index';
import {sanityPreviewPayload} from '../lib/sanity/sanity.payload.server';
import {CATERING_PAGE_QUERY} from '../qroq/queries';
import {useSanityData} from '../hooks/useSanityData';
import {getImageUrl} from '~/lib/utils';
import {useRootLoaderData as LoaderData} from '~/root';
import {stegaClean} from '@sanity/client/stega';
import {PortableText} from '@portabletext/react';
import CateringSlider from '~/components/CateringSlider';
import MagneticGSApp from '~/components/MagneticGSApp';
import naturalImage from '../assets/natural.png';
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
    groqdQuery: CATERING_PAGE_QUERY,
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
      query: CATERING_PAGE_QUERY.query,
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
  const cateringPageImages = data?.cateringPageImages;
  const cateringPageBannerImages = data?.cateringPageBannerImages;
  const ctaLink = stegaClean(`${locale.pathPrefix}/pages/${data?.link}`);
  const [openTabs, setOpenTabs] = useState([]);
  const Referenzen = data?.Referenzen;
  const Rating = data?.Rating;
  const Accordions = data?.Accordions;
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        const offset = 120;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
  }, [location]);
  
  

useEffect(() => {
  function adjustInnerWolfWrapHeight() {
    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
    const marqueeHeight = document.querySelector('.marquee')?.offsetHeight || 0;

    // Calculate the remaining height
    const availableHeight = window.innerHeight - headerHeight - marqueeHeight;
    console.log(availableHeight)
    // Apply the calculated height
    const innerWrap = document.querySelector('.inner-wolf-bestell-wrap');
    console.log(innerWrap)
    if (innerWrap) {
        innerWrap.style.height = `${availableHeight}px`;
    }
}

// Adjust height on load and on resize
window.addEventListener('load', adjustInnerWolfWrapHeight);
window.addEventListener('resize', adjustInnerWolfWrapHeight);
},[])
  useEffect(() => {
    if (Accordions?.accordion?.groups?.length > 0) {
      setOpenTabs([Accordions.accordion.groups[0]._key]);
    }
  }, [Accordions]);
  return (
    <div className="page catering-main">
      <div className="main-catering-page">
        <div className="food-decorative-garland">
          <img
            src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/Group_136.png?v=1716964342"
            alt="food-decorative-garland"
          />
        </div>
        <div className="container">
          <div className="inner-wolf-bestell-wrap">
          <div
            className="inner-wolf-bestell"
            data-aos-duration="1500"
            data-aos="fade-up"
            data-aos-once="true"
          >
            <div className="left-content">
              <h1 dangerouslySetInnerHTML={{__html: data?.heroTitle}} />
            </div>
            <div className="right-logo">
              <img alt='cateringLogo' src={getImageUrl(data?.image?.asset?._ref)} />
              <h3>{data?.Description}</h3>
            </div>
            <div className="s-wrap">
              <div
                data-aos-duration="2000"
                data-aos-once="true"
                data-aos="fade-up"
                className="c-s-image-section aos-init aos-animate"
              >
                {cateringPageBannerImages?.map((image, index) => {
                  const Imgurl = getImageUrl(image?.image?.asset?._ref);
                  return (
                    <MagneticGSApp key={index}>
                      <div className="img-big-wrap ">
                        <div className="img-one">
                          <div className="inner-white-box">
                            <img src={Imgurl} alt={`Image ${index + 1}`} />
                          </div>
                        </div>
                      </div>
                    </MagneticGSApp>
                  );
                })}
              </div>
              <img
                className="naturlich-image"
                alt="naturlichLogo"
                src={getImageUrl(data?.naturlichVeganLogo?.asset?._ref)}
              />
            </div>
            <h4>{data?.subTitle}</h4>
            <div className="c-bottom-btn">
              <Link to={ctaLink} className="yellow-btn">
                <span data-mce-fragment="1">{data?.ctaButtontext}</span>
              </Link>
            </div>
          </div>
          </div>
          <div className="curywolf-catering-box">
            {cateringPageImages?.map((item, index) => {
              const Imgurl = getImageUrl(item?.image?.asset?._ref);
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
                  case 5:
                    return {
                      'data-aos': 'fade-left',
                      'data-aos-duration': '2000',
                    };
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
          <div className="more-img-text">
            <p>Klicken Sie auf die Bilder für weitere Informationen</p>
          </div>
          <div
            className="reference"
            data-aos-once="true"
            data-aos-duration="1500"
            data-aos="fade-up"
          >
            <h3>
              <span data-mce-fragment="1">{Referenzen?.title}</span>
            </h3>
            <CateringSlider Referenzen={Referenzen} />
          </div>
          <div
            className="wolf-logo"
            data-aos-once="true"
            data-aos-duration="1500"
            data-aos="fade-up"
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
                  <div key={item?._key} className="logo-box">
                    <img src={Imgurl} />
                  </div>
                );
              })}
            </div>
          </div>
          <div
            id="faq-section"
            className="faq-sec"
            data-aos-once="true"
            data-aos-duration="1500"
            data-aos="fade-up"
          >
            <div className="faq-left">
              <h3>{Accordions?.title}</h3>
              <Link
                to={`${locale.pathPrefix}/pages/${Accordions?.link}`}
                className="yellow-btn"
              >
                <span data-mce-fragment="1">{Accordions?.ctaButtontext}</span>
              </Link>
            </div>
            <div className="faq-right">
              <section className="accordion">
                {Accordions?.accordion?.groups.map((item, index) => {
                  const uniqueId = `cb-${index + 1}`;
                  const handleToggle = (key) => {
                    if (openTabs.includes(key)) {
                      setOpenTabs(openTabs.filter((tab) => tab !== key));
                    } else {
                      setOpenTabs([...openTabs, key]);
                    }
                  };
                  return (
                    <div key={item?._key} className="tab">
                      <input
                        type="checkbox"
                        name="accordion-1"
                        id={uniqueId}
                        checked={openTabs.includes(item?._key)}
                        onChange={() => handleToggle(item?._key)}
                      />
                      <label htmlFor={uniqueId} className="tab__label">
                        {item?.title}
                      </label>
                      {openTabs.includes(item?._key) && (
                        <div className="tab__content">
                          <PortableText value={item?.body} />
                        </div>
                      )}
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
