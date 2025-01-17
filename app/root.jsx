import {useNonce, getShopAnalytics, Analytics} from '@shopify/hydrogen';
import {useShopifyCookies} from '@shopify/hydrogen-react';
import {defer} from '@shopify/remix-oxygen';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  useRouteError,
  useLoaderData,
  ScrollRestoration,
  isRouteErrorResponse,
  useMatches,
} from '@remix-run/react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import favicon from './assets/favicon.png';
import resetStyles from './styles/reset.css?url';
import appStyles from './styles/app.css?url';
import {Layout} from '~/components/Layout';
import fontStyles from './styles/font.css?url';
import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import Popup from './components/Popup';
import * as gtag from './util/gtag';
import {DEFAULT_LOCALE} from 'countries/index';
import {useLocalePath} from './hooks/useLocalePath';
import {sanityPreviewPayload} from './lib/sanity/sanity.payload.server';
import {seoPayload} from './lib/seo.server';
import {ROOT_QUERY} from './qroq/queries';
import { useSanityRoot } from './hooks/useSanityRoot';
export const shouldRevalidate = ({formMethod, currentUrl, nextUrl}) => {
  if (formMethod && formMethod !== 'GET') {
    return true;
  }

  if (currentUrl.toString() === nextUrl.toString()) {
    return true;
  }

  return false;
};

export function ScrollToTop() {
  const {pathname} = useLocation();

  useEffect(() => {
    if (!pathname.includes('catering')) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!pathname.includes('catering')) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);

  return null;
}

export function AosInit() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
    AOS.refresh();
  }, []);
}

export function links() {
  return [
    {rel: 'stylesheet', href: resetStyles},
    {rel: 'stylesheet', href: appStyles},
    {rel: 'stylesheet', href: fontStyles},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/png', href: favicon},
    {
      rel: 'preload',
      as: 'image',
      type: 'image/png/webp/svg',
      href: 'https://cdn.sanity.io/images/vu17rm6q/production/f18e33a3d1beba4dcde02e818f7bd4b933b69f71-273x186.svg',
      crossOrigin: 'anonymous',
    }
  ];
}

export async function loader({context, request}) {
    const url = new URL(request.url);

 // Redirect specific query path to `/pages/catering`
    if (url.pathname === '/de/currywurst-catering') {
      return redirect('/pages/catering');
    }
  const {
    storefront,
    customerAccount,
    cart,
    env,
    locale,
    sanity,
    sanityPreviewMode,
  } = context;

  // Ensure locale exists
  if (!locale) {
    throw new Error('Locale is missing in the context');
  }
  const language = locale?.language.toLowerCase();
  const publicStoreDomain = context.env.PUBLIC_STORE_DOMAIN;

  const isLoggedInPromise = customerAccount.isLoggedIn();

  const queryParams = {
    defaultLanguage: DEFAULT_LOCALE.language.toLowerCase(),
    language,
  };

  const languageMap = {
    ZH: 'ZH_CN',
    NL: 'NL',
  };
  const headerLang = languageMap[locale?.language] ||  locale?.language
  const cartPromise = cart.get({
    language: headerLang,
  });
  const rootData = Promise.all([
    sanity.query({
      groqdQuery: ROOT_QUERY,
      params: queryParams,
    }),
    storefront.query(`#graphql
      query layout {
        shop {
          id
        } 
      }
    `),
  ]);
  const footerPromise = storefront.query(FOOTER_QUERY, {
    // cache: storefront.CacheLong(),
    variables: {
      footerMenuHandle: 'footer-1',
    },
  });

  const headerPromise = storefront.query(HEADER_QUERY, {
    // cache: storefront.CacheLong(),
    variables: {
      headerMenuHandle: 'new-menu',
      language: headerLang
    },
  });
  const [sanityRoot, layout] = await rootData;
  const seo = seoPayload.root({
    root: sanityRoot.data,
    sanity: {
      dataset: env.SANITY_STUDIO_DATASET,
      projectId: env.SANITY_STUDIO_PROJECT_ID,
    },
    url: request.url,
  });
  return defer({
    cart: cartPromise,
    footer: footerPromise,
    header: await headerPromise,
    isLoggedIn: isLoggedInPromise,
    locale,
    sanityPreviewMode,
    sanityRoot,
    seo,
    publicStoreDomain,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
    },
    env: {
      /*
       * Be careful not to expose any sensitive environment variables here.
       */
      NODE_ENV: env.NODE_ENV,
      PUBLIC_STORE_DOMAIN: env.PUBLIC_STORE_DOMAIN,
      PUBLIC_STOREFRONT_API_TOKEN: env.PUBLIC_STOREFRONT_API_TOKEN,
      PUBLIC_STOREFRONT_API_VERSION: env.PUBLIC_STOREFRONT_API_VERSION,
      SANITY_STUDIO_API_VERSION: env.SANITY_STUDIO_API_VERSION,
      SANITY_STUDIO_DATASET: env.SANITY_STUDIO_DATASET,
      SANITY_STUDIO_PROJECT_ID: env.SANITY_STUDIO_PROJECT_ID,
      SANITY_STUDIO_URL: env.SANITY_STUDIO_URL,
      SANITY_STUDIO_USE_PREVIEW_MODE: env.SANITY_STUDIO_USE_PREVIEW_MODE,
    },
    ...sanityPreviewPayload({
      context,
      params: queryParams,
      query: ROOT_QUERY.query,
    }),
  });
}
export const useRootLoaderData = () => {
  const matches = useMatches();
  const rootMatch = matches.find((match) => match.id === 'root'); // Ensure we get the correct match

  // Return data or provide a fallback object if data is missing
  return (
    rootMatch?.data || {
      locale: {language: 'en'},
    }
  );
};

export default function App() {
  useShopifyCookies({hasUserConsent: true, domain: 'curry-wolf.de'});
  const nonce = useNonce();
  const data = useLoaderData();
  const location = useLocation();
  const gaTrackingId = 'G-RMTF34SVQM';
  const {locale} = useRootLoaderData();
  useEffect(() => {
    if (gaTrackingId?.length) {
      gtag.pageview(location.pathname, gaTrackingId);
    }
  }, [location, gaTrackingId]);

  useEffect(() => {
    function setEqualHeight() {
      const boxes = document.querySelectorAll('.same-height');
      if (boxes.length === 0) {
        return;
      }

      let maxHeight = 0;
      boxes.forEach((box) => {
        box.style.height = 'auto';
      });

      boxes.forEach((box) => {
        const boxHeight = box.clientHeight;
        if (boxHeight > maxHeight) {
          maxHeight = boxHeight;
        }
      });

      boxes.forEach((box) => {
        box.style.height = `${maxHeight}px`;
      });
    }

    setEqualHeight();
    window.addEventListener('resize', setEqualHeight);
    return () => {
      window.removeEventListener('resize', setEqualHeight);
    };
  }, [location]);

  const isProductOrCollectionPage =
    location.pathname.includes('/products/') ||
    location.pathname.includes('/collections/') ||
    location.pathname.includes('/collections') ||
    location.pathname.includes('/collections/all');

  return (
    <html lang={locale.language.toLowerCase()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="robots" content="index, follow" />
        {!gaTrackingId ? null : (
          <>
            <script
              async
              nonce={nonce}
              src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
            />
            <script
              async
              id="gtag-init"
              nonce={nonce}
              dangerouslySetInnerHTML={{
                __html: `
                          window.dataLayer = window.dataLayer || [];
                          function gtag(){dataLayer.push(arguments);}
                          gtag('js', new Date());

                          gtag('config', '${gaTrackingId}', {
                            page_path: window.location.pathname,
                          });
                        `,
              }}
            />
          </>
        )}
        <Meta />
        <Links />
        <script
          async
          id="hotjar"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `
                    (function(h,o,t,j,a,r){
                        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                        h._hjSettings={hjid:5081562,hjsv:6};
                        a=o.getElementsByTagName('head')[0];
                        r=o.createElement('script');r.async=1;
                        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                        a.appendChild(r);
                    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                  `,
          }}
        />
      </head>
      <body>
        <Analytics.Provider
          cart={data.cart}
          shop={data.shop}
          consent={data.consent}
          customData={{foo: 'bar'}}
        >
          <ScrollToTop />
          <AosInit />
          {/* {isProductOrCollectionPage && <Popup />} */}
          <Layout {...data}>
            <Outlet />
          </Layout>
          {/* Facebook Meta Pixel Code */}
          <script
            async
            nonce={nonce}
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '1092539505646208');
                fbq('track', 'PageView');
              `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src="https://www.facebook.com/tr?id=1092539505646208&ev=PageView&noscript=1"
              alt=""
            />
          </noscript>
        {/* End Facebook Meta Pixel Code */}
          <script
            async
            data-desktop-y-offset="0"
            data-mobile-y-offset="0"
            data-desktop-disable-reviews="false"
            data-desktop-enable-custom="false"
            data-desktop-position="left"
            data-desktop-custom-width="156"
            data-desktop-enable-fadeout="false"
            data-disable-mobile="false"
            data-disable-trustbadge="false"
            data-mobile-custom-width="156"
            data-mobile-disable-reviews="false"
            data-mobile-enable-custom="false"
            data-mobile-position="left"
            data-mobile-enable-topbar="false"
            data-mobile-enable-fadeout="true"
            data-color-scheme="light"
            charSet="UTF-8"
            nonce={nonce}
            src={`https://widgets.trustedshops.com/js/X7C31CAC2688E2716F5D2E3220C01EE91.js`}
          />
          <ScrollRestoration nonce={nonce} />
          <Scripts nonce={nonce} />
        </Analytics.Provider>
      </body>
    </html>
  );
}

export function ErrorBoundary({error}) {
  const nonce = useNonce(); // Safely use nonce without loader context
  const errorMessage = error?.message || 'An unknown error occurred';
  const errorStatus = error?.status || 500;
  const {locale} = useRootLoaderData();
  // Fallback locale if loader data is not available
  const fallbackLocale = {language: 'en'}; // Default to English if no locale data
  const {data} = useSanityRoot();
  const notfoundPageData =data?.global?.notFoundPage
  return (
    <html lang={fallbackLocale.language.toLowerCase()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="error-oops">
        <Layout>
          <div className="route-error">
            <h1>{notfoundPageData?.title}</h1>
            <h2>{errorStatus}</h2>
            {errorMessage && (
              <fieldset>
                <pre>{errorMessage}</pre>
              </fieldset>
            )}
            <div className="thank-you-btn">
              <a href={`${locale.pathPrefix}${notfoundPageData?.btnLink}`} className="yellow-btn">
               {notfoundPageData?.btnText}
              </a>
            </div>
          </div>
        </Layout>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

const MENU_FRAGMENT = `#graphql
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
`;

const HEADER_QUERY = `#graphql
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    brand {
      logo {
        image {
          url
        }
      }
    }
  }
  query Header(
    $country: CountryCode
    $headerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    shop {
      ...Shop
    }
    menu(handle: $headerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
`;

const FOOTER_QUERY = `#graphql
  query Footer(
    $country: CountryCode
    $footerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
`;
