import {generateSanityImageUrl} from '../components/sanity/SanityImage';
import {stegaClean} from '@sanity/client/stega';
function root({root, sanity, url}) {
  const settings = root?.settings;
  const media = generateOGImageData({
    image: settings?.socialSharingImagePreview,
    sanity,
  });
  const logoWidth = settings?.logo
    ? getImageDimensions(settings.logo._ref).width
    : 0;
  const logoUrl = generateSanityImageUrl({
    dataset: sanity.dataset,
    projectId: sanity.projectId,
    ref: settings?.logo?._ref,
    width: logoWidth,
  });

  return {
    description: truncate(settings?.description ?? ''),
    handle: extractTwitterHandle(settings?.twitter ?? ''),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      logo: logoUrl || undefined,
      name: settings?.siteName ?? '',
      // Todo => Add search to schema
      // potentialAction: {
      //   '@type': 'SearchAction',
      //   query: "required name='search_term'",
      //   target: `${url}search?q={search_term}`,
      // },
      sameAs: [
        root?.settings?.facebook ?? '',
        root?.settings?.instagram ?? '',
        root?.settings?.twitter ?? '',
        root?.settings?.youtube ?? '',
        root?.settings?.tiktok ?? '',
        root?.settings?.snapchat ?? '',
        root?.settings?.pinterest ?? '',
        root?.settings?.tumblr ?? '',
        root?.settings?.vimeo ?? '',
        root?.settings?.linkedin ?? '',
      ],
      url,
    },
    media,
    robots: {
      noFollow: false,
      noIndex: false,
    },
    title: settings?.siteName,
    titleTemplate: `%s | ${root?.settings?.siteName}`,
    url,
  };
}

function home({page, sanity}) {
  const media = generateOGImageData({
    image: page?.seo?.image,
    sanity,
  });
  return {
    description: page?.seo?.description ?? '',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Home page',
    },
    media,
    robots: {
      noFollow: false,
      noIndex: false,
    },
    title: page?.seo?.title ?? '',
  };
}
function location({page, sanity}) {
  const media = generateOGImageData({
    image: page?.seo?.image,
    sanity,
  });
  return {
    description: page?.seo?.description ?? '',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Location page',
    },
    media,
    robots: {
      noFollow: false,
      noIndex: false,
    },
    title: page?.seo?.title ?? '',
  };
}
function productJsonLd({product, selectedVariant, url}) {
  const origin = new URL(url).origin;
  const variants = product.variants.nodes;
  const description = truncate(
    product?.seo?.description ?? product?.description,
  );
  const offers = (variants || []).map((variant) => {
    const variantUrl = new URL(url);
    for (const option of variant.selectedOptions) {
      variantUrl.searchParams.set(option.name, option.value);
    }
    const availability = variant.availableForSale
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock';

    return {
      '@type': 'Offer',
      availability,
      price: parseFloat(variant.price.amount),
      priceCurrency: variant.price.currencyCode,
      sku: variant?.sku ?? '',
      url: variantUrl.toString(),
    };
  });
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          item: `${origin}/products`,
          name: 'Products',
          position: 1,
        },
        {
          '@type': 'ListItem',
          name: product.title,
          position: 2,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      brand: {
        '@type': 'Brand',
        name: product.vendor,
      },
      description,
      image: [selectedVariant?.image?.url ?? ''],
      name: product.title,
      offers,
      sku: selectedVariant?.sku ?? '',
      url,
    },
  ];
}

function product({product, selectedVariant, url}) {
  const description = truncate(
    product?.seo?.description ?? product?.description ?? '',
  );
  return {
    description,
    jsonLd: productJsonLd({product, selectedVariant, url}),
    media: selectedVariant?.image,
    title: product?.seo?.title ?? product?.title,
  };
}

function collectionJsonLd({collection, url}) {
  const siteUrl = new URL(url);
  const itemListElement = collection.products.nodes.map((product, index) => {
    return {
      '@type': 'ListItem',
      position: index + 1,
      url: `/products/${product.handle}`,
    };
  });

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          item: `${siteUrl.host}/collections`,
          name: 'Collections',
          position: 1,
        },
        {
          '@type': 'ListItem',
          name: collection.title,
          position: 2,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      description: truncate(
        collection?.seo?.description ?? collection?.description ?? '',
      ),
      image: collection?.image?.url,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement,
      },
      name: collection?.seo?.title ?? collection?.title ?? '',
      url: `/collections/${collection.handle}`,
    },
  ];
}

function collection({collection, url}) {
  return {
    description: truncate(
      collection?.seo?.description ?? collection?.description ?? '',
    ),
    jsonLd: collectionJsonLd({collection, url}),
    media: {
      altText: collection?.image?.altText,
      height: collection?.image?.height,
      type: 'image',
      url: collection?.image?.url,
      width: collection?.image?.width,
    },
    title: collection?.seo?.title ?? collection?.title,
    titleTemplate: '%s | Collection',
  };
}

function collectionsJsonLd({collections, url}) {
  const itemListElement = collections.nodes.map((collection, index) => {
    return {
      '@type': 'ListItem',
      position: index + 1,
      url: `/collections/${collection.handle}`,
    };
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    description: 'All collections',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement,
    },
    name: 'Collections',
    url,
  };
}

function listCollections({collections, url}) {
  return {
    description: 'All hydrogen collections',
    jsonLd: collectionsJsonLd({collections, url}),
    title: 'All collections',
    titleTemplate: '%s | Collections',
    url,
  };
}

function article({article, url}) {
  return {
    description: truncate(article?.seo?.description ?? ''),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      alternativeHeadline: article.title,
      articleBody: article.contentHtml,
      datePublished: article?.publishedAt,
      description: truncate(
        article?.seo?.description || article?.excerpt || '',
      ),
      headline: article?.seo?.title || '',
      image: article?.image?.url,
      url,
    },
    media: {
      altText: article?.image?.altText,
      height: article?.image?.height,
      type: 'image',
      url: article?.image?.url,
      width: article?.image?.width,
    },
    title: article?.seo?.title ?? article?.title,
    titleTemplate: '%s | Journal',
    url,
  };
}

function blog({blog, url}) {
  return {
    description: truncate(blog?.seo?.description || ''),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      description: blog?.seo?.description || '',
      name: blog?.seo?.title || blog?.title || '',
      url,
    },
    title: blog?.seo?.title,
    titleTemplate: '%s | Blog',
    url,
  };
}

function page({page, url}) {
  return {
    description: truncate(page?.seo?.description || ''),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page.title,
    },
    title: page?.seo?.title ?? page?.title,
    titleTemplate: '%s | Page',
    url,
  };
}

function policy({policy, url}) {
  return {
    description: truncate(policy?.body ?? ''),
    title: policy?.title,
    titleTemplate: '%s | Policy',
    url,
  };
}

function policies({policies, url}) {
  const origin = new URL(url).origin;
  const itemListElement = policies.filter(Boolean).map((policy, index) => {
    return {
      '@type': 'ListItem',
      item: `${origin}/policies/${policy.handle}`,
      name: policy.title,
      position: index + 1,
    };
  });
  return {
    description: 'Hydroge store policies',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        description: 'Hydrogen store policies',
        name: 'Policies',
        url,
      },
    ],
    title: 'Policies',
    titleTemplate: '%s | Policies',
  };
}

export const seoPayload = {
  article,
  blog,
  collection,
  home,
  location,
  listCollections,
  page,
  policies,
  policy,
  product,
  root,
};

/**
 * Truncate a string to a given length, adding an ellipsis if it was truncated
 * @param str - The string to truncate
 * @param num - The maximum length of the string
 * @returns The truncated string
 * @example
 * ```js
 * truncate('Hello world', 5) // 'Hello...'
 * ```
 */
function truncate(str, num = 155) {
  if (typeof str !== 'string') return '';
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num - 3) + '...';
}

function generateOGImageData({image, sanity}) {
  if (!image) {
    return undefined;
  }

  const socialImage = stegaClean(image);

  const size = {
    height: 628,
    width: 1200,
  };

  const url = generateSanityImageUrl({
    dataset: sanity.dataset,
    height: size.height,
    projectId: sanity.projectId,
    ref: socialImage?._ref,
    width: size.width,
  });

  return {url, ...size, altText: socialImage?.altText ?? '', type: 'image'};
}
function extractTwitterHandle(twitterUrl) {
  // Check if the URL is valid
  const urlRegex =
    /^(?:https?:\/\/)?(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)(?:\/)?$/;
  const match = twitterUrl.match(urlRegex);

  if (match && match.length === 2) {
    return `@${match[1]}`; // Prefix with "@"
  } else {
    return null; // URL does not match the expected pattern
  }
}
