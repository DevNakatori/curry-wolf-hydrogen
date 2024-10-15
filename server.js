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
import {SanitySession} from './app/lib/sanity/sanity.session.server.js';
import {createSanityClient} from './app/lib/sanity/sanity.server.js';
import {CART_QUERY_FRAGMENT} from './app/lib/fragments.js';
import {AppSession} from './app/lib/session.js';
import {getLocaleFromRequest} from './countries/index.js';

export default {
  /**
   * @param {Request} request
   * @param {Env} env
   * @param {ExecutionContext} executionContext
   */
  async fetch(request, env, executionContext) {
    try {
      if (!env?.SESSION_SECRET) {
        throw new Error('SESSION_SECRET environment variable is not set');
      }
      const waitUntil = executionContext.waitUntil.bind(executionContext);
      const [cache, session, sanitySession] = await Promise.all([
        caches.open('hydrogen'),
        AppSession.init(request, [env.SESSION_SECRET]),
        SanitySession.init(request, [env.SESSION_SECRET]),
      ]);
      const sanityPreviewMode = await sanitySession.has('previewMode');
      const isDev = env.NODE_ENV === 'development';
      const locale = getLocaleFromRequest(request);
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
      const customerAccount = createCustomerAccountClient({
        waitUntil,
        request,
        session,
        customerAccountId: env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID,
        customerAccountUrl: env.PUBLIC_CUSTOMER_ACCOUNT_API_URL,
      });
      const cart = createCartHandler({
        storefront,
        customerAccount,
        getCartId: cartGetIdDefault(request.headers),
        setCartId: cartSetIdDefault(),
        cartQueryFragment: CART_QUERY_FRAGMENT,
      });
      const sanity = createSanityClient({
        cache,
        config: {
          apiVersion: env.SANITY_STUDIO_API_VERSION,
          dataset: env.SANITY_STUDIO_DATASET,
          projectId: env.SANITY_STUDIO_PROJECT_ID,
          studioUrl: env.SANITY_STUDIO_URL,
          useCdn: env.NODE_ENV === 'production',
          useStega: env.SANITY_STUDIO_USE_PREVIEW_MODE,
        },
        isPreviewMode: sanityPreviewMode,
        waitUntil,
      });
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
          sanity,
          sanityPreviewMode,
          sanitySession,
        }),
      });
      const response = await handleRequest(request);
      if (session.isPending) {
        response.headers.set('Set-Cookie', await session.commit());
      }
      if (response.status === 404) {
        return storefrontRedirect({request, response, storefront});
      }
      return response;
    } catch (error) {
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};

/**
 * @returns {I18nLocale}
 * @param {Request} request
 */
/** @typedef {import('@shopify/remix-oxygen').AppLoadContext} AppLoadContext */
