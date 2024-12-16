import {json, redirect} from '@shopify/remix-oxygen';
import {useLoaderData, Link, useLocation} from '@remix-run/react';
import {
  Pagination,
  getPaginationVariables,
  Image,
  Money,
  Analytics,
} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import decorativegarland from '../assets/decorativegarland.png';
import '../styles/collection.css';
import dhlLogo from '../assets/logo_dhl-gogreen.svg';
import {useEffect} from 'react';
import {useSanityRoot} from '~/hooks/useSanityRoot';
import {getImageUrl} from '~/lib/utils';
import {PortableText} from '@portabletext/react';
import {useRootLoaderData as LoaderData} from '~/root';
import HolidayBanner from '~/components/HolidayBanner';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [
    {title: `Curry Wolf | ${data?.collection.title ?? ''}`},
    {name: 'description', content: `${data?.collection.seo.description ?? ''}`},
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
export async function loader({request, params, context}) {
  const {handle} = params;
  const {storefront, locale} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 25,
  });
  const pathname = new URL(request.url).pathname;
  const segments = pathname.split('/').filter(Boolean);

  var language = locale?.language
  if ( 'ZH'===language) {
    language = 'ZH_CN';
  }

  if (!handle) {
    return redirect('/collections');
  }

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {handle,language, ...paginationVariables},
  });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  const customMenuPromise = storefront.query(CUSTOM_MENU_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      customMenuHandle: 'collection-menu',
      language 
    },
  });
  const canonicalUrl = request.url;
  return json({
    canonicalUrl,
    collection,
    customMenu: await customMenuPromise,
  });
}

export default function Collection() {
  /** @type {LoaderReturnData} */

  const {data} = useSanityRoot();
  const globalContent = data?.global?.globalContent;
  const benefitsSection = globalContent?.benefitsSection;
  const trustedShop = globalContent?.trustedShop;
  const {collection, customMenu} = useLoaderData();
  const shopHolidays = data?.global?.ShopHolidays;
const bannerHoliday = shopHolidays?.banner
  const currentDate = new Date();
  const startDate = new Date(shopHolidays?.start);
  const endDate = new Date(shopHolidays?.end);
  const ShopIsActive = currentDate >= startDate && currentDate <= endDate;
  return (
    <div className="collection">
     {ShopIsActive &&  <HolidayBanner bannerHoliday={bannerHoliday} />}
      <div className="food-decorative-garland">
        <img
          src={decorativegarland}
          className="decorative-image"
          alt={decorativegarland}
        />
      </div>
      <CustomMenu data={customMenu} />
      <div className="collection-banner">
        <h1>{collection.title}</h1>
        {/* <p className="collection-description">{collection.description}</p> */}
        {collection.image && (
          <img
            src={collection.image.url}
            className="collection image"
            alt={collection.image.altText || collection.title}
            data-aos="fade-up"
            data-aos-duration="1500"
            data-aos-once="true"
          />
        )}
      </div>
      <div
        className="benifits"
        data-aos="fade-up"
        data-aos-duration="1500"
        data-aos-once="true"
      >
        <div className="container">
          <div className="benifits-inner-wrap">
            {/* <h4>Vorteile von Curry Wolf</h4> */}
            <div className="banifits-wrap">
              {benefitsSection?.benefits.map((benefit, index) => {
                const imgUrl = getImageUrl(benefit?.image?.asset?._ref);
                return (
                  <div key={benefit?._key} className="benifits-content">
                    <img src={imgUrl} alt="face smile icon" />
                    <div className="">
                      <h4>{benefit?.title}</h4>
                      <p>{benefit?.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <Pagination connection={collection.products}>
          {({nodes, isLoading, PreviousLink, NextLink}) => (
            <>
              <div className="previous-button">
                <PreviousLink>
                  {isLoading ? (
                    'Loading...'
                  ) : (
                    <span className="yellow-btn">↑ Load previous</span>
                  )}
                </PreviousLink>
              </div>
              <ProductsGrid products={nodes} />
              <br />
              <div className="loadmore-button">
                <NextLink>
                  {isLoading ? (
                    'Loading...'
                  ) : (
                    <span className="yellow-btn">Load more ↓</span>
                  )}
                </NextLink>
              </div>
            </>
          )}
        </Pagination>
      </div>
      <div className="collection-logo-sec">
        <div className="container">
          <div
            className="c-logo-wrap"
            data-aos="fade-up"
            data-aos-duration="1500"
            data-aos-once="true"
          >
            <div className="left-l">
              <h4>{collection.title}</h4>
              <p>{collection.description}</p>
            </div>
            <div className="right-l">
              <div className="c-right-wrap">
                {trustedShop?.certifications?.map((certification, index) => {
                  const imgUrl = getImageUrl(certification?.image?.asset?._ref);
                  return (
                    <div key={certification?._key} className="right-inner">
                      <div className="l-logo">
                        <img src={imgUrl} alt="certified logo" />
                      </div>
                      <div className="r-content">
                        <p>{certification?.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <PortableText value={trustedShop?.deliveryNote} />
            </div>
          </div>
        </div>
      </div>
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

function CustomMenu({data}) {
  const location = useLocation();
  return (
    <nav
      className="collection-menu"
      data-aos="fade-up"
      data-aos-duration="1500"
      data-aos-once="true"
    >
      <ul>
        {data.menu.items.map((item) => (
          <li key={item.id}>
            <Link
              to={new URL(item.url).pathname}
              className={item.url.includes(location.pathname) ? 'active' : ''}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * @param {{products: ProductItemFragment[]}}
 */
function ProductsGrid({products}) {
  return (
    <>
      <div className="products-grid">
        <div className="container">
          <div className="product-g-wrap">
            {products.map((product, index) => {
              return (
                <ProductItem
                  key={product.id}
                  product={product}
                  loading={index < 25 ? 'eager' : undefined}
                  ProductsLength={products.length}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * @param {{
 *   product: ProductItemFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
function ProductItem({product, loading, ProductsLength}) {
  const {data} = useSanityRoot();
  const globalContent = data?.global?.globalContent;
  const addToCartButton = globalContent?.addToCartButton;
  const soldOutButton = globalContent?.soldOutButton;
  const {locale} = LoaderData();
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  // const variantUrl2 =locale.pathPrefix
  function classifyValue(value) {
    // Regular expression to match strings like "3+1", "8x", "48x", "4x"
    const regexPattern = /^(\d+(\.\d+)?([x]|\+\d+)?)$/;
    if (regexPattern.test(value)) {
      return 'number';
    } else {
      return 'string';
    }
  }
  const collectionBadge = product.metafield?.value;
  const valueType = classifyValue(collectionBadge);
  const titleParts = product.title.split('(');
  const titleMain = titleParts[0];
  const titleSub = titleParts[1] ? `(${titleParts[1]}` : '';
  const variantNumber = product.variants.nodes[0].id.match(/\d+/);
  const variantId = variantNumber ? variantNumber[0] : null;
  // Assuming weight is in kilograms
  const weight = variant.weight
    ? `${globalContent?.ShippingWeight}: ${variant.weight} kg`
    : globalContent?.WeightNotAvailable;
  // Adding the unit price
  const referenceUnit = variant.unitPriceMeasurement?.referenceUnit;
  const unitPrice = variant.unitPrice ? (
    <div>
      {variant.unitPrice && (
        <>
          <FormattedMoney money={variant.unitPrice} /> /{' '}
        </>
      )}
      {referenceUnit
        ? referenceUnit.toLowerCase()
        : 'referenceUnit is not defined'}
    </div>
  ) : null;

  const deliveryTime = product.tags.includes('app:expresshint')
    ? 'Lieferzeit: 1 Tag (*)'
    : globalContent?.deliveryTime;
  useEffect(() => {
    const priceElements = document.querySelectorAll('.c-price-range');
    priceElements.forEach((priceElement) => {
      const content = priceElement.textContent;
      const spacedContent = content.replace(/([€$£])(\d)/, '$1 $2');
      priceElement.textContent = spacedContent;
    });
  }, [product.priceRange.minVariantPrice]);
  return (
    <Link
      className="product-item"
      style={ProductsLength === 1 ? {width: '100%'} : {}}
      key={product.id}
      prefetch="intent"
      to={`${locale.pathPrefix}${variantUrl}`}
      data-aos="fade-up"
      data-aos-duration="1500"
      data-aos-once="true"
    >
      {collectionBadge && (
        <div className="collection-badge">
          <p className={valueType === 'string' ? 'string' : ''}>
            {collectionBadge}
          </p>
        </div>
      )}
      {product.featuredImage && (
        <Image
          alt={product.featuredImage.altText || product.title}
          aspectRatio="1/1"
          data={product.featuredImage}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <h4>
        {titleMain}
        <br />
      </h4>
      <span>{titleSub}</span>
      <div className="c-price-range">
        {product.priceRange.minVariantPrice && (
          <FormattedMoney money={product.priceRange.minVariantPrice} />
        )}
      </div>
      <div className="c-all-wrap">
        <div className="tax-hint">
          <div className="same-height">
            <small>
              {globalContent?.inclVatText}
              <Link
                className="shipping_policy"
                to={`${locale.pathPrefix}/policies/shipping-policy`}
              >
                {globalContent?.plusShippingCostsText}
              </Link>
            </small>

            <div className="c-weight">{weight}</div>
            <span>{deliveryTime}</span>

            <div className="pro-wrap-c unit-price">{unitPrice}</div>
          </div>
          <div className="cart-btn">
            <span className="yellow-btn">{addToCartButton}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
/**
 * @param {{money: {amount: string, currencyCode: string}}}
 */
function FormattedMoney({money}) {
  if (!money || !money.amount || !money.currencyCode) {
    console.error('Invalid money object:', money);
    return null;
  }

  const currencySymbols = {
    EUR: '€',
    USD: '$',
  };
  const symbol = currencySymbols[money.currencyCode] || money.currencyCode;
  const formattedAmount = parseFloat(money.amount).toFixed(2);

  return (
    <span>
      {symbol} {formattedAmount}
    </span>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    tags
    variants(first: 1) {
      nodes {
        id
        title
        sku
        availableForSale
        selectedOptions {
          name
          value
        }
        weight
        unitPrice {
          ...MoneyProductItem
        }
          unitPriceMeasurement {
          measuredType
          quantityUnit
          quantityValue
          referenceUnit
          referenceValue
        }
      }
    }
    metafield(namespace: "custom", key: "collection_badge") {
      value
    }
  }
`;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(language: $language, country: $country) {
    collection(handle: $handle) {
      id
      handle
      title
      description
       seo {
          description
          title
          }
      image {
        altText
        url
        width
        height
      }
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
`;

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

const CUSTOM_MENU_QUERY = `#graphql
  query CustomMenu(
    $country: CountryCode
    $customMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    menu(handle: $customMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@remix-run/react').ShouldRevalidateFunction} ShouldRevalidateFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
