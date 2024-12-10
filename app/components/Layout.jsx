import {Await} from '@remix-run/react';
import {lazy, Suspense, useState} from 'react';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/Cart';
import {
  PredictiveSearchForm,
  PredictiveSearchResults,
} from '~/components/Search';
import {useRootLoaderData} from '~/lib/root-data';
import {useSanityRoot} from '~/hooks/useSanityRoot';
import {useRootLoaderData as LoaderData} from '~/root';
import Truck from '../assets/Truck.svg';
import Tree from '../assets/christmas-tree.svg';
import Marquee from './Marquee';

/**
 * @param {LayoutProps}
 */
export function Layout({cart, children = null, footer, header, isLoggedIn}) {
  const [toggle, setToggle] = useState(false);
  const {env, locale, sanityPreviewMode} = useRootLoaderData();
  const {data} = useSanityRoot();
  return (
    <>
      <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside
        data={data}
        shop={header?.shop}
        toggle={toggle}
        setToggle={setToggle}
      />
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          toggle={toggle}
          setToggle={setToggle}
        />
      )}
      <Marquee duration={30} >
        <span className="clipped-text">
          We will be closed for Christmas from 15th December
        </span>
        
        <img src={Tree} alt="Tree" />
        <span className="clipped-text">
          Orders will resume after the holidays, thank you for your
          understanding!
        </span>
        <img className="truck" src={Truck} alt="Truck" />
        <span className="clipped-text">
          We will be closed for Christmas from 15th December
        </span>
        <img src={Tree} alt="Tree" />
        <span className="clipped-text">
          Orders will resume after the holidays, thank you for your
          understanding!
        </span>
        <img className="truck" src={Truck} alt="Truck" />
      </Marquee>
      <main>{children}</main>
      <Suspense>
        <Await resolve={footer}>
          {(footer) => <Footer menu={footer?.menu} shop={header?.shop} />}
        </Await>
      </Suspense>
    </>
  );
}

/**
 * @param {{cart: LayoutProps['cart']}}
 */
function CartAside({cart}) {
  return (
    <Aside id="cart-aside" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function SearchAside() {
  return (
    <Aside id="search-aside" heading="SEARCH">
      <div className="predictive-search">
        <br />
        <PredictiveSearchForm>
          {({fetchResults, inputRef}) => (
            <div>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
              />
              &nbsp;
              <button
                onClick={() => {
                  window.location.href = inputRef?.current?.value
                    ? `/search?q=${inputRef.current.value}`
                    : `/search`;
                }}
              >
                Search
              </button>
            </div>
          )}
        </PredictiveSearchForm>
        <PredictiveSearchResults />
      </div>
    </Aside>
  );
}

/**
 * @param {{
 *   menu: HeaderQuery['menu'];
 *   shop: HeaderQuery['shop'];
 *   toggle: boolean;
 *   setToggle: React.Dispatch<React.SetStateAction<boolean>>;
 * }}
 */
function MobileMenuAside({data, shop, toggle, setToggle}) {
  return (
    data?.header?.menu &&
    shop?.primaryDomain?.url && (
      <Aside
        id="mobile-menu-aside"
        heading="MENU"
        toggle={toggle}
        setToggle={setToggle}
      >
        <HeaderMenu
          menu={data}
          viewport="mobile"
          primaryDomainUrl={shop.primaryDomain.url}
          toggle={toggle}
          setToggle={setToggle}
        />
      </Aside>
    )
  );
}

/**
 * @typedef {{
 *   cart: Promise<CartApiQueryFragment | null>;
 *   children?: React.ReactNode;
 *   footer: Promise<FooterQuery>;
 *   header: HeaderQuery;
 *   isLoggedIn: Promise<boolean>;
 * }} LayoutProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
