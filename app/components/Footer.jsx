import {NavLink} from '@remix-run/react';
import {useRootLoaderData} from '~/lib/root-data';
import {KeepInTouch} from '~/routes/footerData';
import {useSanityRoot} from '~/hooks/useSanityRoot';
import {useRootLoaderData as LoaderData} from '~/root';
import {stegaClean} from '@sanity/client/stega';
import {getImageUrl} from '~/lib/utils';
/**
 * @param {FooterQuery & {shop: HeaderQuery['shop']}}
 */

export function Footer({shop}) {
  const {data} = useSanityRoot();
  const menu = data?.footer?.footerLink;
  const footerLogo = getImageUrl(data?.footer?.logo?._ref);
  const footerAddress = data?.footer?.footerAddress;
  const footerSocialLinks = data?.footer?.footerSocialLinks;
  const FooterRightLogo = getImageUrl(data?.footer?.FooterRightLogo._ref);
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          {menu && shop?.primaryDomain?.url && (
            <>
              <div className="footer-child">
                <FooterMenu
                  menu={menu}
                  footerLogo={footerLogo}
                  primaryDomainUrl={shop.primaryDomain.url}
                />
                <KeepInTouch
                  footerSocialLinks={footerSocialLinks}
                  footerAddress={footerAddress}
                  FooterRightLogo={FooterRightLogo}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}

/**
 * @param {{
 *   menu: FooterQuery['menu'];
 *   primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
 * }}
 */

function FooterMenu({menu, footerLogo, primaryDomainUrl}) {
  const {publicStoreDomain} = useRootLoaderData();
  const {locale} = LoaderData();
  const footermenu = menu.menu;
  const footerMenuTitle = menu.title;
  return (
    <div className="left-block-wrap">
      <div className="logo">
        <a href="/">
          <img
            className="footer-bg-img"
            data-aos="zoom-in"
            data-aos-duration="1500"
            data-aos-once="true"
            src={footerLogo}
            alt="footer-logo"
          />
        </a>
      </div>
      <nav className="footer-menu" role="navigation">
        <span
          className="yellow-head"
          data-aos="fade-up"
          data-aos-duration="1500"
          data-aos-once="true"
        >
          {footerMenuTitle}
        </span>
        <ul data-aos="fade-up" data-aos-duration="1500" data-aos-once="true">
          {(footermenu || FALLBACK_HEADER_MENU.items).map((item) => {
            const link = item?.link;
            const documentType = link?.documentType;
            const slug = link?.slug;
            const slug2 = link?.slug?.current;
            const anchor = item?.anchor ? `#${item.anchor}` : '';
            const path = () => {
              switch (documentType) {
                case 'page':
                  return `${locale.pathPrefix}/pages/${slug}`;
                case 'job':
                  return `${locale.pathPrefix}/pages/job`;
                case 'locations':
                  return `${locale.pathPrefix}/pages/locations`;
                case 'catering':
                  return `${locale.pathPrefix}/pages/catering`;
                case 'ourStory':
                  return `${locale.pathPrefix}/pages/our-story`;
                case 'ourCurrywurst':
                  return `${locale.pathPrefix}/pages/our-currywurst`;
                case 'product':
                  return `${locale.pathPrefix}/products/${slug2}`;
                case 'collection':
                  return `${locale.pathPrefix}/collections/${slug2}`;
                case 'home':
                  return locale.pathPrefix || '/';
                case 'policiesInnerPage':
                  return `${locale.pathPrefix}/policies/${slug}`;
                case 'legalNoticePage':
                  return `${locale.pathPrefix}/pages/legal-notice`;
                default:
                  return '';
              }
            };
            const url = stegaClean(`${path()}${anchor}`);
            return (
              <li key={item._key}>
                <NavLink
                  prefetch="intent"
                  end
                  key={item._key}
                  style={activeLinkStyle}
                  to={url}
                >
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}

/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
