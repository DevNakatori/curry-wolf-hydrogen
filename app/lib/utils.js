import {useLocation} from '@remix-run/react';
import {stegaClean} from '@sanity/client/stega';
import {cx} from 'class-variance-authority';
import {useMemo} from 'react';
import {useRootLoaderData} from './root-data';

export function useVariantUrl(handle, selectedOptions) {
  const {pathname} = useLocation();

  return useMemo(() => {
    return getVariantUrl({
      handle,
      pathname,
      searchParams: new URLSearchParams(),
      selectedOptions,
    });
  }, [handle, selectedOptions, pathname]);
}

export function getVariantUrl({
  handle,
  pathname,
  searchParams,
  selectedOptions,
}) {
  const match = /(\/[a-zA-Z]{2}-[a-zA-Z]{2}\/)/g.exec(pathname);
  const isLocalePathname = match && match.length > 0;

  const path = isLocalePathname
    ? `${match[0]}products/${handle}`
    : `/products/${handle}`;

  selectedOptions.forEach((option) => {
    searchParams.set(option.name, option.value);
  });

  const searchString = searchParams.toString();

  return path + (searchString ? '?' + searchParams.toString() : '');
}

/**
 * A not found response. Sets the status code.
 */
export const notFound = (message = 'Not Found') =>
  new Response(message, {
    status: 404,
    statusText: 'Not Found',
  });

/**
 * Validates that a url is local
 * @param url
 * @returns `true` if local `false`if external domain
 */
export function isLocalPath(url) {
  try {
    // We don't want to redirect cross domain,
    // doing so could create fishing vulnerability
    // If `new URL()` succeeds, it's a fully qualified
    // url which is cross domain. If it fails, it's just
    // a path, which will be the current domain.
    new URL(url);
  } catch (e) {
    return true;
  }

  return false;
}

export function parseAsCurrency(value, locale) {
  return new Intl.NumberFormat(locale.language + '-' + locale.country, {
    currency: locale.currency,
    style: 'currency',
  }).format(value);
}

export function cn(...inputs) {
  return '';
}

export const getAspectRatioData = (aspectRatio) => {
  const cleanAspectRatio = stegaClean(aspectRatio);
  return cleanAspectRatio === 'video'
    ? {
        className: 'aspect-video',
        value: '16/9',
      }
    : cleanAspectRatio === 'square'
    ? {
        className: 'aspect-square',
        value: '1/1',
      }
    : {
        className: 'aspect-auto',
        value: undefined,
      };
};

export const getImageUrl = (ref) => {
  const baseRef = ref?.slice(6);
  const {env} = useRootLoaderData();
  const projectId = env.SANITY_STUDIO_PROJECT_ID;
  const fileExtension = baseRef?.includes('-svg')
    ? '.svg'
    : baseRef?.includes('-png')
    ? '.png'
    : baseRef?.includes('-jpg')
    ? '.jpg'
    : baseRef?.includes('-webp')
    ? '.webp'
    : '';
  const formattedRef = baseRef
    ?.replace('-svg', fileExtension)
    ?.replace('-png', fileExtension)
    ?.replace('-jpg', fileExtension)
    ?.replace('-webp', fileExtension);
  return `https://cdn.sanity.io/images/${projectId}/production/${formattedRef}`;
};

export function setShowTrailingZeroKeyValue(locale) {
  return locale.country + '_' + locale.language + +'_' + locale.pathPrefix;
}
