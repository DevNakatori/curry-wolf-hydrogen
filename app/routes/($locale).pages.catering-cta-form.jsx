import {json} from '@shopify/remix-oxygen';
import {Link, useLoaderData} from '@remix-run/react';

import {useMemo} from 'react';
import {mergeMeta} from '../lib/meta';
import {DEFAULT_LOCALE} from 'countries';
import {sanityPreviewPayload} from '../lib/sanity/sanity.payload.server';
import {CATERING_CTA_FORM_PAGE_QUERY} from '../qroq/queries';
import {useSanityData} from '../hooks/useSanityData';
import {getImageUrl} from '~/lib/utils';
import {useRootLoaderData as LoaderData} from '~/root';
import {stegaClean} from '@sanity/client/stega';
import {PortableText} from '@portabletext/react';
import {InternalLinkAnnotation} from '~/components/sanity/richtext/InternalLinkAnnotation';
import '../styles/catering-cta-form.css';
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
    groqdQuery: CATERING_CTA_FORM_PAGE_QUERY,
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
      query: CATERING_CTA_FORM_PAGE_QUERY.query,
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
    <div className="page catering-cta-form-page">
      <>
        <div className="page contact-page">
          <div>
            <div className="curry-contact-sec">
              <div className="food-decorative-garland">
                <img
                  src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/Group_136.png?v=1716964342"
                  alt="food-decorative-garland"
                />
              </div>
              <div className="container">
                <div className="go-back-pro-btn">
                  <Link
                    className="yellow-border-btn"
                    to={stegaClean(
                      `${locale.pathPrefix}/pages/${sectionFirst?.buttonLink}`,
                    )}
                  >
                    {sectionFirst?.buttonText}
                  </Link>
                </div>
                <div
                  className="contact-top-block"
                  data-aos-duration="1500"
                  data-aos="fade-up"
                >
                  <div className="left-title">
                    <h1>{sectionFirst?.title}</h1>
                    <div className="c-border"></div>
                  </div>
                  <div className="right-img">
                    <div className="curywolf-catering-box">
                      {sectionFirst?.image.map((item, index) => {
                        const imgUrl = getImageUrl(item?.asset?._ref);
                        return (
                          <div className="img-big-wrap">
                            <div className="img-one">
                              <div className="inner-white-box">
                                <img src={imgUrl} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div
                  className="contact-form"
                  data-aos-duration="1500"
                  data-aos="fade-up"
                >
                  <div className="c-left-form">
                    <div className="form-container">
                      <form
                        action="https://api.web3forms.com/submit"
                        method="POST"
                        id="multiStepForm"
                      >
                        <input
                          type="hidden"
                          name="access_key"
                          value="54375c58-c74a-4928-ae2d-2bae13e16d29"
                        />
                        <input
                          type="hidden"
                          name="subject"
                          value="Catering Info on Curry Wolf"
                        />
                        <input
                          type="hidden"
                          name="from_name"
                          value="Curry Wolf"
                        />
                        <div className="form-main-wrap active">
                          <div className="form-detail">
                            <p>{sectionSecond?.Kontakt?.Sectionname}</p>
                          </div>
                          <div className="form-group-container">
                            <div className="form-group">
                              <label htmlFor="name" className="form-label">
                                {sectionSecond?.Kontakt?.name}
                              </label>
                              <input
                                className="form-text"
                                type="text"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="email" className="form-label">
                                {sectionSecond?.Kontakt?.EMail}
                              </label>
                              <input
                                id="email"
                                name="email"
                                className="form-text"
                                type="email"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="phone" className="form-label">
                                {
                                  sectionSecond?.Kontakt
                                    ?.UnternehmenOrganisation
                                }
                              </label>
                              <input
                                id="company"
                                name="company"
                                className="form-text"
                                type="text"
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="phone" className="form-label">
                                {sectionSecond?.Kontakt?.Telefon}
                              </label>
                              <input
                                id="phone"
                                name="phone"
                                className="form-text"
                                type="text"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-main-wrap">
                          <div className="form-detail">
                            <p>{sectionSecond?.eventDates?.sectionname}</p>
                          </div>
                          <div className="form-group-container">
                            <div className="main-d-wrap">
                              <div className="form-group">
                                <label
                                  htmlFor="number-of-guests"
                                  className="form-label"
                                >
                                  {sectionSecond?.eventDates?.numberofguests}
                                </label>
                                <input
                                  className="form-text"
                                  type="text"
                                  id="number-of-guests"
                                  name="number-of-guests"
                                  required
                                />
                              </div>
                              <div className="date-wrap">
                                <div className="form-group">
                                  <label htmlFor="date" className="form-label">
                                    {sectionSecond?.eventDates?.date}
                                  </label>
                                  <input
                                    id="date"
                                    name="date"
                                    className="form-text"
                                    type="date"
                                    required
                                    placeholder="day/month/year"
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="time" className="form-label">
                                    {sectionSecond?.eventDates?.Zeit}
                                  </label>
                                  <input
                                    id="time"
                                    name="time"
                                    className="form-text"
                                    type="text"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <label
                                htmlFor="street-name"
                                className="form-label"
                              >
                                {sectionSecond?.eventDates?.street}
                              </label>
                              <input
                                id="street-name"
                                name="street-name"
                                className="form-text"
                                type="text"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label
                                htmlFor="street-number"
                                className="form-label"
                              >
                                {sectionSecond?.eventDates?.housenumber}
                              </label>
                              <input
                                id="street-number"
                                name="street-number"
                                className="form-text"
                                type="number"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label
                                htmlFor="postal-code"
                                className="form-label"
                              >
                                {sectionSecond?.eventDates?.Postalcode}
                              </label>
                              <input
                                id="postal-code"
                                name="postal-code"
                                className="form-text"
                                type="text"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="city" className="form-label">
                                {sectionSecond?.eventDates?.location}
                              </label>
                              <input
                                id="city"
                                name="city"
                                className="form-text"
                                type="text"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-main-wrap checkbox-sec">
                          <div className="form-detail">
                            <p>{sectionSecond?.catering?.title}</p>
                          </div>
                          <div className="form-group-container">
                            <div className="form-checkbox-wrap">
                              <h3>{sectionSecond?.catering?.dishes?.title}</h3>
                              {sectionSecond?.catering?.dishes?.dishes.map(
                                (item, index) => {
                                  return (
                                    <div
                                      key={item?._key}
                                      className={`form-group ${
                                        index === 0 ? 'star' : ''
                                      }`}
                                    >
                                      <input
                                        style={{display: 'none'}}
                                        id={item?._key}
                                        name={item.dish}
                                        type="checkbox"
                                        className="form-checkbox"
                                      />
                                      <label htmlFor={item?._key}>
                                        {item.dish}
                                      </label>
                                    </div>
                                  );
                                },
                              )}
                            </div>
                            <div className="form-checkbox-wrap">
                              <h3>{sectionSecond?.catering?.drinks?.title}</h3>
                              {sectionSecond?.catering?.drinks?.drinks.map(
                                (item, index) => {
                                  return (
                                    <div
                                      key={item?._key}
                                      className="form-group"
                                    >
                                      <input
                                        style={{display: 'none'}}
                                        id={item?._key}
                                        name={item.drink}
                                        type="checkbox"
                                        className="form-checkbox"
                                      />
                                      <label htmlFor={item?._key}>
                                        {item.drink}
                                      </label>
                                    </div>
                                  );
                                },
                              )}
                            </div>
                            <div className="form-checkbox-wrap">
                              <h3>
                                {sectionSecond?.catering?.eventArea?.title}
                              </h3>
                              {sectionSecond?.catering?.eventArea?.eventArea.map(
                                (item, index) => {
                                  return (
                                    <div
                                      key={item?._key}
                                      className="form-group"
                                    >
                                      <input
                                        style={{display: 'none'}}
                                        id={item?._key}
                                        name={item.area}
                                        type="checkbox"
                                        className="form-checkbox"
                                      />
                                      <label htmlFor={item?._key}>
                                        {item.area}
                                      </label>
                                    </div>
                                  );
                                },
                              )}
                            </div>
                            <div className="form-checkbox-wrap">
                              <h3>
                                {sectionSecond?.catering?.equipment?.title}
                              </h3>
                              {sectionSecond?.catering?.equipment?.equipment.map(
                                (item, index) => {
                                  return (
                                    <div
                                      key={item?._key}
                                      className="form-group"
                                    >
                                      <input
                                        style={{display: 'none'}}
                                        id={item?._key}
                                        name={item?.equipment}
                                        type="checkbox"
                                        className="form-checkbox"
                                      />
                                      <label htmlFor={item?._key}>
                                        {item?.equipment}
                                      </label>
                                    </div>
                                  );
                                },
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="form-main-wrap form-last-box">
                          <div className="form-group-container">
                            <div className="form-group">
                              <label htmlFor="name" className="form-label">
                                {sectionSecond?.commentsSection?.title}
                              </label>
                              <textarea
                                placeholder={
                                  sectionSecond?.commentsSection?.placeholder
                                }
                                name="message"
                                id="message"
                                className="form-textarea"
                              ></textarea>
                            </div>
                            <div className="form-group">
                              <input
                                style={{display: 'none'}}
                                id="checkbox13"
                                name="Ja, ich habe die"
                                type="checkbox"
                                required
                                className="form-checkbox"
                              />
                              <label htmlFor="checkbox13">
                                <PortableText
                                  components={components}
                                  value={
                                    sectionSecond?.commentsSection
                                      ?.privacyPolicyCheckbox
                                  }
                                />
                              </label>
                            </div>
                          </div>
                          <div className="c-form-submit">
                            <input
                              value="https://curry-wolf.de/pages/thank-you"
                              name="redirect"
                              type="hidden"
                            />
                            <button
                              type="submit"
                              className="form-submit yellow-btn"
                            >
                              {sectionSecond?.submitButtonText}
                            </button>
                            <div className="star-content">
                              {sectionSecond?.starContentText}
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="right-c-address">
                    <div className="form-sticky">
                      <div className="right-box">
                        <div className="c-left">
                          <img src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/House.svg?v=1721396559" />
                        </div>
                        <div className="c-right">
                          <h3>{sectionSecond?.Address?.address?.label}</h3>
                          <PortableText
                            value={sectionSecond?.Address?.address?.address}
                          />
                        </div>
                      </div>
                      <div className="right-box">
                        <div className="c-left">
                          <img src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/Email_c9ef8ff3-4cdc-43bd-b0bd-f159bd40a234.svg?v=1721396559" />
                        </div>
                        <div className="c-right">
                          <h3>{sectionSecond?.Address?.email?.label}</h3>
                          <p>
                            <a
                              href={`mailto:${sectionSecond?.Address?.email?.email}`}
                            >
                              {sectionSecond?.Address?.email?.email}
                            </a>
                          </p>
                        </div>
                      </div>
                      <div className="right-box">
                        <div className="c-left">
                          <img src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/Cil-Fax.svg?v=1721396596" />
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
                      <div className="right-box">
                        <div className="c-left">
                          <img src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/phone.svg?v=1721396560" />
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
