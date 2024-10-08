import {RemixServer} from '@remix-run/react';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';

/**
 * @param {Request} request
 * @param {number} responseStatusCode
 * @param {Headers} responseHeaders
 * @param {EntryContext} remixContext
 * @param {AppLoadContext} context
 */
export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext,
  context,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    scriptSrc: [
      `https://www.googletagmanager.com`,
      `https://cdn.shopify.com`, // Added the necessary script source here
      `https://integrations.etrusted.com`,
      `https://static.hotjar.com`,
      `https://script.hotjar.com`,
    ],
    ...createCspHeaders(),
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }
  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);
  responseHeaders.set(
    'Content-Security-Policy',
    `script-src 'self' https://* 'unsafe-inline' 'unsafe-eval' 'nonce-${nonce}'`,
  );
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
export const createCspHeaders = () => {
  const defaultsCSPHeaders = {
    connectSrc: ['*', "'self'"],
    fontSrc: ['*.sanity.io', "'self'", 'localhost:*'],
    frameAncestors: ['localhost:*', '*.sanity.studio'],
    frameSrc: ["'self'"],
    imgSrc: ['*.sanity.io', 'https://cdn.shopify.com', "'self'", 'localhost:*'],
    scriptSrc: ["'self'", 'localhost:*', 'https://cdn.shopify.com'],
  };

  return defaultsCSPHeaders;
};

/** @typedef {import('@shopify/remix-oxygen').EntryContext} EntryContext */
/** @typedef {import('@shopify/remix-oxygen').AppLoadContext} AppLoadContext */
