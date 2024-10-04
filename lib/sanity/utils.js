import {useLocation} from '@remix-run/react';
import {stegaClean} from '@sanity/client/stega';
import {cx} from 'class-variance-authority';
import {useMemo} from 'react';

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

export function parseAsCurrency(value) {
  return new Intl.NumberFormat(locale.language + '-' + locale.country, {
    currency: locale.currency,
    style: 'currency',
  }).format(value);
}

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(cx(inputs));
// }

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

export function generateShopifyImageThumbnail(url) {
  if (!url) return null;

  const imageUrl = new URL(url);

  if (imageUrl.hostname !== 'cdn.shopify.com') return null;

  const size = '_30x.jpg';
  const thumbnailUrl =
    imageUrl.origin + imageUrl.pathname.replace('.jpg', size);

  return thumbnailUrl;
}

export function setShowTrailingZeroKeyValue(locale) {
  return locale.country + '_' + locale.language + +'_' + locale.pathPrefix;
}

export function statusMessage(status, themeContent) {
  const translations = {
    CANCELLED: themeContent?.account.orderStatusCancelled || 'Cancelled',
    ERROR: themeContent?.account.orderStatusError || 'Error',
    FAILURE: themeContent?.account.orderStatusFailure || 'Failed',
    OPEN: themeContent?.account.orderStatusOpen || 'Open',
    PENDING: themeContent?.account.orderStatusPending || 'Pending',
    SUCCESS: themeContent?.account.orderStatusSuccess || 'Success',
  };
  try {
    return translations?.[status];
  } catch (error) {
    return status;
  }
}
