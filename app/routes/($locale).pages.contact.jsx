import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import React, {useEffect, useRef, useMemo} from 'react';
import {mergeMeta} from '../lib/meta';
import {DEFAULT_LOCALE} from 'countries';
import {sanityPreviewPayload} from '../lib/sanity/sanity.payload.server';
import {CONTACT_PAGE_QUERY} from '../qroq/queries';
import {useSanityData} from '../hooks/useSanityData';
import {getPageHandle} from './($locale).$';
import {getImageUrl} from '~/lib/utils';
import {useRootLoaderData as LoaderData} from '~/root';
import {stegaClean} from '@sanity/client/stega';
import {PortableText} from '@portabletext/react';
import {InternalLinkAnnotation} from '~/components/sanity/richtext/InternalLinkAnnotation';
import '../styles/contact-page.css';

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
    groqdQuery: CONTACT_PAGE_QUERY,
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
      query: CONTACT_PAGE_QUERY.query,
    }),
  });
}

export default function Page() {
  const {page} = useLoaderData();
  const {data, encodeDataAttribute} = useSanityData({
    initial: page,
  });
  const {locale} = LoaderData();
  const sectionFirst = data?.sectionFirst;
  const sectionSecond = data?.sectionSecond;
  const sectionThird = data?.sectionThird;
  const imageUrl = getImageUrl(sectionFirst?.image?.asset?._ref);

  console.log(data);

  useEffect(() => {
    const phoneInput = document.querySelector('input[name="phone"]');
    if (phoneInput) {
      const handleInput = (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
      };
      phoneInput.addEventListener('input', handleInput);
      return () => {
        phoneInput.removeEventListener('input', handleInput);
      };
    }
  }, [page]);
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
    <div className="page contact-page">
      <div className="klaviyo-form-WcMX8a"></div>
      <div className="curry-contact-sec">
        <div className="food-decorative-garland">
          <img
            src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/Group_136.png?v=1716964342"
            alt="food-decorative-garland"
          />
        </div>
        <div className="container">
          <div className="contact-top-block">
            <div
              className="left-title"
              data-aos-once="true"
              data-aos="fade-up"
              data-aos-duration="1500"
            >
              <h1>{sectionFirst?.title}</h1>
              <div className="c-border"></div>
            </div>
            <div
              data-aos-delay="800"
              data-aos-once="true"
              data-aos="fade-up"
              data-aos-duration="1500"
              className="right-img"
            >
              <img src={imageUrl} alt="Curry Wolf Hero Animation" />
            </div>
          </div>
          <div
            data-aos-once="true"
            data-aos="fade-up"
            data-aos-duration="1500"
            className="contact-form"
          >
            <div className="c-left-form">
              <form method="POST" action="https://api.web3forms.com/submit">
                <div className="form-left">
                  <input
                    type="hidden"
                    name="access_key"
                    value="54375c58-c74a-4928-ae2d-2bae13e16d29"
                  />
                  <input
                    type="hidden"
                    name="subject"
                    value="Contact Form Submission from CurryWolf"
                  />
                  <input type="hidden" name="from_name" value="CurryWolf" />
                  <div className="form-group-container">
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">
                        {sectionSecond?.Kontakt?.name}
                      </label>
                      <input
                        type="text"
                        className="form-text"
                        required="required"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        {sectionSecond?.Kontakt?.EMail}
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required="required"
                        className="form-text"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">
                        {sectionSecond?.Kontakt?.Telefon}
                      </label>
                      <input
                        required="required"
                        id="phone"
                        name="phone"
                        type="text"
                        className="form-text"
                      />
                    </div>
                  </div>
                </div>
                <div className="form-right">
                  <div className="form-group">
                    <label htmlFor="message" className="form-label">
                      {sectionSecond?.commentsSection?.title}
                    </label>
                    <textarea
                      placeholder={sectionSecond?.commentsSection?.placeholder}
                      className="form-textarea"
                      id="message"
                      required="required"
                      name="message"
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <input
                      className="form-checkbox"
                      required="required"
                      type="checkbox"
                      name="data-collection"
                      id="data-collection"
                      style={{display: 'none'}}
                    />
                    <label htmlFor="data-collection">
                      <PortableText
                        components={components}
                        value={
                          sectionSecond?.commentsSection?.privacyPolicyCheckbox
                        }
                      />
                    </label>
                  </div>
                  <div className="submit-btn">
                    <input
                      type="hidden"
                      name="redirect"
                      value="https://curry-wolf.de/pages/thank-you"
                    />
                    <button className="form-submit yellow-btn" type="submit">
                      {sectionSecond?.submitButtonText}
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="right-c-address">
              <div className="right-box">
                <div className="c-left">
                  <img
                    src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/House.svg?v=1721396559"
                    alt="house"
                  />
                </div>
                <div className="c-right">
                  <h3>{sectionSecond?.Address?.address.label}</h3>
                  <PortableText
                    value={sectionSecond?.Address?.address?.address}
                  />
                </div>
              </div>
              <div className="right-box">
                <div className="c-left">
                  <img
                    src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/Email_c9ef8ff3-4cdc-43bd-b0bd-f159bd40a234.svg?v=1721396559"
                    alt="email"
                  />
                </div>
                <div className="c-right">
                  <h3>{sectionSecond?.Address?.email?.label}</h3>
                  <p>
                    <a href={`mailto:${sectionSecond?.Address?.email?.email}`}>
                      {sectionSecond?.Address?.email?.email}
                    </a>
                  </p>
                </div>
              </div>
              <div className="right-box">
                <div className="c-left">
                  <img
                    src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/Cil-Fax.svg?v=1721396596"
                    alt="fax"
                  />
                </div>
                <div className="c-right">
                  <h3>{sectionSecond?.Address?.faxNumber?.label}</h3>
                  <p>
                    <a
                      href={`tel:${sectionSecond?.Address?.faxNumber?.number}`}
                    >
                      {sectionSecond?.Address?.faxNumber?.number}
                    </a>
                  </p>
                </div>
              </div>
              <div className="right-box">
                <div className="c-left">
                  <img
                    src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/phone.svg?v=1721396560"
                    alt="phone"
                  />
                </div>
                <div className="c-right">
                  <h3>{sectionSecond?.Address?.phoneNumber?.label}</h3>
                  <p>
                    <a
                      href={`tel:${sectionSecond?.Address?.phoneNumber?.number}`}
                    >
                      {sectionSecond?.Address?.phoneNumber?.number}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="follow-currywolf">
            <div
              data-aos-once="true"
              data-aos="fade-up"
              data-aos-duration="1500"
            >
              <h2>
                {sectionThird?.title}
                <br />
                {sectionThird?.Subtitle}
              </h2>
              <div className="curry-new-btn">
                <a
                  href={sectionThird?.buttonLink}
                  className="yellow-border-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {sectionThird?.buttonText}
                </a>
              </div>
              <div className="follow-box">
                <div className="c-s-image-section aos-init aos-animate">
                  {sectionThird?.images?.map((image, index) => {
                    const imageUrl = getImageUrl(image.image.asset._ref);
                    return (
                      <div
                        key={index}
                        className="img-big-wrap"
                        data-aos-once="true"
                        data-aos={
                          index === 1 || index === 2
                            ? 'zoom-in'
                            : index === 0
                            ? 'fade-right'
                            : 'fade-left'
                        }
                      >
                        <div className="img-one">
                          <div className="inner-white-box">
                            <img src={imageUrl} alt="" />
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
    </div>
  );
}

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
