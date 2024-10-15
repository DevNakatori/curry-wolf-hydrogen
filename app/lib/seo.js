import {getSeoMeta} from '@shopify/hydrogen';

export function getSeoMetaFromMatches(matches) {
  const seoData = [
    ...matches
      .filter((match) => typeof match.data?.seo !== 'undefined')
      .map((match) => match.data?.seo),
  ];
  return getSeoMeta(...seoData) || [];
}
