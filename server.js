// Virtual entry point for the app
import * as remixBuild from 'virtual:remix/server-build';
import {
  cartGetIdDefault,
  cartSetIdDefault,
  createCartHandler,
  createStorefrontClient,
  storefrontRedirect,
  createCustomerAccountClient,
} from '@shopify/hydrogen';
import {
  createRequestHandler,
  getStorefrontHeaders,
} from '@shopify/remix-oxygen';
import {SanitySession} from './lib/sanity/sanity.session.server.js';
import {createSanityClient} from './lib/sanity/sanity.server.js';
import {CART_QUERY_FRAGMENT} from './lib/fragments.js';
import {AppSession} from './lib/session.js';
import {getLocaleFromRequest} from './countries/index.js';

/**
 * Export a fetch handler in module format.
 */
export default {
  /**
   * @param {Request} request
   * @param {Env} env
   * @param {ExecutionContext} executionContext
   */
  async fetch(request, env, executionContext) {
    try {
      /**
       * Open a cache instance in the worker and a custom session instance.
       */
      if (!env?.SESSION_SECRET) {
        throw new Error('SESSION_SECRET environment variable is not set');
      }

      const waitUntil = executionContext.waitUntil.bind(executionContext);
      const [cache, session, sanitySession] = await Promise.all([
        caches.open('hydrogen'),
        AppSession.init(request, [env.SESSION_SECRET]),
        SanitySession.init(request, [env.SESSION_SECRET]), // Initialize Sanity session
      ]);
      const sanityPreviewMode = await sanitySession.has('previewMode');
      const isDev = env.NODE_ENV === 'development';
      const locale = getLocaleFromRequest(request);
      /**
       * Create Hydrogen's Storefront client.
       */
      const {storefront} = createStorefrontClient({
        cache,
        waitUntil,
        i18n: {country: locale.country, language: locale.language},
        publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
        privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
        storeDomain: env.PUBLIC_STORE_DOMAIN,
        storefrontId: env.PUBLIC_STOREFRONT_ID,
        storefrontHeaders: getStorefrontHeaders(request),
      });

      /**
       * Create a client for Customer Account API.
       */
      const customerAccount = createCustomerAccountClient({
        waitUntil,
        request,
        session,
        customerAccountId: env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID,
        customerAccountUrl: env.PUBLIC_CUSTOMER_ACCOUNT_API_URL,
      });

      /*
       * Create a cart handler that will be used to
       * create and update the cart in the session.
       */
      const cart = createCartHandler({
        storefront,
        customerAccount,
        getCartId: cartGetIdDefault(request.headers),
        setCartId: cartSetIdDefault(),
        cartQueryFragment: CART_QUERY_FRAGMENT,
      });

      /**
       * Initialize Sanity CMS client
       */
      const sanity = createSanityClient({
        cache,
        config: {
          apiVersion: env.SANITY_STUDIO_API_VERSION,
          dataset: env.SANITY_STUDIO_DATASET,
          projectId: env.SANITY_STUDIO_PROJECT_ID,
          studioUrl: env.SANITY_STUDIO_URL,
          useCdn: !env.NODE_ENV || env.NODE_ENV === 'production',
          useStega: env.SANITY_STUDIO_USE_PREVIEW_MODE,
        },
        isPreviewMode: sanityPreviewMode,
        waitUntil,
      });

      /**
       * Create a Remix request handler and pass
       * Hydrogen's Storefront client and Sanity client to the loader context.
       */
      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => ({
          session,
          storefront,
          customerAccount,
          cart,
          isDev,
          env,
          waitUntil,
          locale,
          sanity, // Pass the Sanity client to the loader context
          sanityPreviewMode,
          sanitySession,
        }),
      });

      const response = await handleRequest(request);

      if (session.isPending) {
        response.headers.set('Set-Cookie', await session.commit());
      }

      if (response.status === 404) {
        /**
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({request, response, storefront});
      }

      return response;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};

/**
 * @returns {I18nLocale}
 * @param {Request} request
 */
// function getLocaleFromRequest(request) {
//   const url = new URL(request.url);
//   const firstPathPart = url.pathname.split('/')[1]?.toUpperCase() ?? '';

//   let pathPrefix = '';
//   let [language, country] = ['DE', 'DE']; // Default to German

//   if (/^[A-Z]{2}-[A-Z]{2}$/i.test(firstPathPart)) {
//     pathPrefix = '/' + firstPathPart;
//     [language, country] = firstPathPart.split('-');
//   }

//   return {language, country, pathPrefix};
// }

/** @typedef {import('@shopify/remix-oxygen').AppLoadContext} AppLoadContext */
