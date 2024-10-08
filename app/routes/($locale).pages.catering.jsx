import {json} from '@shopify/remix-oxygen';
import {Link, useLoaderData, useLocation} from '@remix-run/react';
import {useEffect, useState} from 'react';
import '../styles/catering-page.css';
import {mergeMeta} from '../lib/meta';
import {DEFAULT_LOCALE} from 'countries';
import {sanityPreviewPayload} from '../../lib/sanity/sanity.payload.server';
import {CATERING_PAGE_QUERY} from '../qroq/queries';
import {useSanityData} from '../hooks/useSanityData';
import {getPageHandle} from './($locale).$';
import {getImageUrl} from '~/lib/utils';
import {useRootLoaderData as LoaderData} from '~/root';
import {stegaClean} from '@sanity/client/stega';
import {PortableText} from '@portabletext/react';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [
    {title: `Curry Wolf | ${data?.seo?.title ?? ''}`},
    {name: 'description', content: data?.seo?.description},
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
export async function loader({params, request, context}) {
  const {env, locale, sanity, storefront} = context;
  const pathname = new URL(request.url).pathname;
  const segments = pathname.split('/').filter(Boolean);
  const handle = segments[segments.length - 1];
  console.log(handle);
  const language = locale?.language.toLowerCase();
  const queryParams = {
    defaultLanguage: DEFAULT_LOCALE.language.toLowerCase(),
    handle,
    language,
  };

  const page = await sanity.query({
    groqdQuery: CATERING_PAGE_QUERY,
    params: queryParams,
  });

  console.log(page.data);
  if (!page) {
    throw new Response('Not Found', {status: 404});
  }
  const seo = page?.data?.seo;
  const canonicalUrl = request.url;

  return json({
    page,
    canonicalUrl,
    seo,
    ...sanityPreviewPayload({
      context,
      params: queryParams,
      query: CATERING_PAGE_QUERY.query,
    }),
  });
}

export default function Page() {
  /** @type {LoaderReturnData} */
  const {page} = useLoaderData();
  const {data, encodeDataAttribute} = useSanityData({
    initial: page,
  });

  useEffect(() => {
    function setEqualHeight() {
      const boxes = document.querySelectorAll('.same-height');
      if (boxes.length === 0) {
        return;
      }

      let maxHeight = 0;

      boxes.forEach((box) => {
        box.style.minHeight = '100px';
        box.style.height = 'auto';
      });

      boxes.forEach((box) => {
        const boxHeight = box.clientHeight;
        if (boxHeight > maxHeight) {
          maxHeight = boxHeight;
        }
      });

      boxes.forEach((box) => {
        box.style.height = `${maxHeight}px`;
      });
    }

    setEqualHeight();
    window.addEventListener('resize', setEqualHeight);

    return () => {
      window.removeEventListener('resize', setEqualHeight);
    };
  }, [data]);
  const {locale} = LoaderData();
  const cateringPageImages = data?.cateringPageImages;
  const ctaLink = stegaClean(`${locale.pathPrefix}/pages/${data?.link}`);
  const [openTab, setOpenTab] = useState(null);
  const Referenzen = data?.Referenzen;
  const Rating = data?.Rating;
  const Accordions = data?.Accordions;

  return (
    <div className="page catering-main">
      <div className="main-catering-page">
        <div className="food-decorative-garland">
          <img
            src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/Group_136.png?v=1716964342"
            alt="food-decorative-garland"
          />
        </div>
        <div className="container">
          <div
            className="inner-wolf-bestell"
            data-aos-duration="1500"
            data-aos="fade-up"
            data-aos-once="true"
          >
            <div className="left-content">
              <h1>{data?.heroTitle}</h1>
            </div>
            <div className="right-logo">
              <img src={getImageUrl(data?.image?.asset?._ref)} />
              <h3>
                <span data-mce-fragment="1">{data?.Description}</span>
              </h3>
            </div>
          </div>
          <div className="c-bottom-btn">
            <Link to={ctaLink} className="yellow-btn">
              <span data-mce-fragment="1">{data?.ctaButtontext}</span>
            </Link>
          </div>
          <div className="curywolf-catering-box">
            {cateringPageImages?.map((item, index) => {
              const Imgurl = getImageUrl(item?.image?.asset?._ref);
              // Determine AOS attributes conditionally
              const url = stegaClean(
                `${locale.pathPrefix}/pages/${item?.link}`,
              );
              const getAosAttributes = (index) => {
                switch (index) {
                  case 0:
                  case 3:
                    return {
                      'data-aos': 'fade-right',
                      'data-aos-duration': '2000',
                    };
                  case 1:
                  case 4:
                    return {
                      'data-aos': 'zoom-in',
                      'data-aos-duration': '1500',
                    };
                  case 2:
                  case 5:
                    return {
                      'data-aos': 'fade-left',
                      'data-aos-duration': '2000',
                    };
                  default:
                    return {
                      'data-aos': 'fade-right',
                      'data-aos-duration': '2000',
                    };
                }
              };

              const aosAttributes = getAosAttributes(index);
              return (
                <div
                  key={item?._key}
                  data-aos-duration="2000"
                  data-aos-once="true"
                  {...aosAttributes}
                  className="img-big-wrap"
                >
                  <Link to={url}>
                    <div className="img-one">
                      <div className="inner-white-box">
                        <img src={Imgurl} />
                      </div>
                      <div className="inner-content">
                        <p>{item?.title}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="more-img-text">
            <p>Klicken Sie auf die Bilder für weitere Informationen</p>
          </div>
          <div
            className="reference"
            data-aos-once="true"
            data-aos-duration="1500"
            data-aos="fade-up"
          >
            <h3>
              <span data-mce-fragment="1">{Referenzen?.title}</span>
            </h3>
            <div className="ref-slider">
              <div className="ref-wrap">
                {Referenzen?.ReferenzenContent.map((item) => {
                  return (
                    <div className="ref-box">
                      <p className="same-height">{item?.description}</p>
                      <div className="ref-title">
                        <h4>{item?.title}</h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div
            className="wolf-logo"
            data-aos-once="true"
            data-aos-duration="1500"
            data-aos="fade-up"
          >
            <div className="w-left-content">
              <h3>{Rating?.number}</h3>
              <p>
                <span data-mce-fragment="1">{Rating?.title}</span>
              </p>
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <svg
                    key={index}
                    width="47"
                    height="47"
                    viewBox="0 0 47 47"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M41.6799 16.2067L30.0263 14.513L24.8168 3.95177C24.6745 3.66261 24.4404 3.42853 24.1513 3.28625C23.4261 2.92824 22.5448 3.22658 22.1822 3.95177L16.9727 14.513L5.31913 16.2067C4.99784 16.2526 4.70409 16.404 4.47919 16.6335C4.20729 16.913 4.05747 17.2889 4.06263 17.6788C4.06779 18.0687 4.22752 18.4406 4.50673 18.7127L12.9383 26.9331L10.9463 38.5408C10.8996 38.8109 10.9294 39.0886 11.0325 39.3425C11.1356 39.5964 11.3078 39.8163 11.5295 39.9773C11.7512 40.1384 12.0136 40.2341 12.287 40.2536C12.5603 40.2731 12.8336 40.2156 13.076 40.0876L23.4995 34.6073L33.923 40.0876C34.2076 40.2391 34.5381 40.2896 34.8548 40.2345C35.6534 40.0968 36.1904 39.3395 36.0527 38.5408L34.0607 26.9331L42.4923 18.7127C42.7218 18.4878 42.8732 18.1941 42.9191 17.8728C43.0431 17.0695 42.4831 16.326 41.6799 16.2067Z"
                      fill="#FEDE03"
                    ></path>
                  </svg>
                ))}
            </div>
            <div className="w-right-logo">
              {Rating?.image?.map((item) => {
                const Imgurl = getImageUrl(item?.Image?.asset?._ref);
                return (
                  <div className="logo-box">
                    <img src={Imgurl} />
                  </div>
                );
              })}
            </div>
          </div>
          <div
            id="faq-section"
            className="faq-sec"
            data-aos-once="true"
            data-aos-duration="1500"
            data-aos="fade-up"
          >
            <div className="faq-left">
              <h3>{Accordions?.title}</h3>
              <Link
                to={`${locale.pathPrefix}/pages/${Accordions?.link}`}
                className="yellow-btn"
              >
                <span data-mce-fragment="1">{Accordions?.ctaButtontext}</span>
              </Link>
            </div>
            <div className="faq-right">
              <section className="accordion">
                {Accordions?.accordion?.groups.map((item, index) => {
                  const uniqueId = `cb-${index}`;
                  const handleToggle = (key) => {
                    setOpenTab(openTab === key ? null : key);
                  };
                  return (
                    <div key={item?._key} className="tab">
                      <input
                        type="checkbox"
                        name="accordion-1"
                        id={uniqueId}
                        checked={openTab === item?._key}
                        onChange={() => handleToggle(item?._key)}
                      />
                      <label htmlFor={uniqueId} className="tab__label">
                        {item?.title}
                      </label>
                      {openTab === item?._key && (
                        <div className="tab__content">
                          <PortableText value={item?.body} />
                        </div>
                      )}
                    </div>
                  );
                })}
                {/* <div className="tab">
                  <input
                    type="checkbox"
                    name="accordion-1"
                    id="cb1"
                    checked="checked"
                  />
                  <label for="cb1" className="tab__label">
                    Was ist das Angebot beim Currywurst-Catering vom Curry Wolf?
                  </label>
                  <div className="tab__content">
                    <p>
                      Ob großes oder kleines Event, Indoor oder Outdoor, ob mit
                      oder ohne … Echte Berliner Currywurst-Kulinarik im
                      Cateringservice mit vielfach bewährtem
                      „All-Inclusive-Service“ vom Curry Wolf. Wir bringen die
                      Original Curry Wolf-Freude in die Gesichter ihrer Gäste!
                    </p>
                  </div>
                </div>
                <div className="tab">
                  <input type="checkbox" name="accordion-1" id="cb2" />
                  <label for="cb2" className="tab__label">
                    Wo kann ich Currywurst-Catering vom Curry Wolf bekommen?
                  </label>
                  <div className="tab__content">
                    <p>
                      Unser Currywurst-Catering ist überall in der
                      Metropolregion Berlin, Potsdam und Brandenburg verfügbar –
                      immer professionell, schnell und unkompliziert.
                    </p>
                  </div>
                </div>
                <div className="tab">
                  <input type="checkbox" name="accordion-1" id="cb3" />
                  <label for="cb3" className="tab__label">
                    Für welche Anlässe lässt sich Currywurst-Catering vom Curry
                    Wolf buchen?
                  </label>
                  <div className="tab__content">
                    <p>
                      Es eignet sich tatsächlich für alle Anlässe: Ob
                      beispielsweise als Mitternachtssnack auf der Hochzeit,
                      Garten- und/oder Office-Party im 9. Stock, Get-together im
                      Fashion Store, Grundsteinlegung in der Baugrube, die nur
                      mit Kran erreichbar ist, ein großes Sommerfest oder aber
                      die enge Toreinfahrt zum kleinen Hinterhoffest, die
                      Firmenfeier auf der Dachterrasse mit schmalem Aufzug, das
                      Flying Buffet im Yachtclub oder vielleicht auch auf dem
                      Messestand usw.
                    </p>
                  </div>
                </div>
                <div className="tab">
                  <input type="checkbox" name="accordion-1" id="cb4" />
                  <label for="cb4" className="tab__label">
                    Wie kann ich mir das Currywurst-Catering vom Curry Wolf auf
                    einer Outdoor-Veranstaltung vorstellen?
                  </label>
                  <div className="tab__content">
                    <p>
                      <span>
                        Draußen machen Live-Cooking und Genuss an unserem
                        mobilen Currywurst-Stand besonders viel Appetit: Die
                        Zubereitung frisch gebratener Currywürste und heiß
                        frittierter Pommes frites vor den Augen der Gäste, ist
                        auf jeder Veranstaltung ein leckeres und allseits
                        beliebtes Highlight.
                      </span>
                    </p>
                  </div>
                </div>
                <div className="tab">
                  <input type="checkbox" name="accordion-1" id="cb5" />
                  <label for="cb5" className="tab__label">
                    Ist ein Currywurst-Catering vom Curry Wolf auch auf einer
                    Innenveranstaltung (Indoor) realisierbar?
                  </label>
                  <div className="tab__content">
                    <p>
                      Selbstverständlich bieten wir Ihnen auch die
                      geruchsneutrale, nachhaltige und stylische Variante mit
                      unserer leckeren Currywurst im hochwertigen, heiß
                      servierten Bügelverschlussglas für Ihre
                      Indoor-Veranstaltung an. Das passt beispielsweise auch
                      immer, wenn es ein Currywurst-Buffet oder ein Flying
                      Buffet geben soll.
                    </p>
                  </div>
                </div>
                <div className="tab">
                  <input type="checkbox" name="accordion-1" id="cb6" />
                  <label for="cb6" className="tab__label">
                    Wie kann ich mir eine Currywurst-Station vom Curry Wolf
                    vorstellen?
                  </label>
                  <div className="tab__content">
                    <p>
                      Unsere mobile Currywurst-Station ist nur 90 cm tief und
                      200 cm breit – sie lässt sich überall hinbringen und
                      aufbauen, passt in jeden Fahrstuhl und ist für alle
                      Wetterlagen und Ortsbegebenheiten geeignet.
                    </p>
                  </div>
                </div>
                <div className="tab">
                  <input type="checkbox" name="accordion-1" id="cb7" />
                  <label for="cb7" className="tab__label">
                    Für welche Personenanzahl wird ein Currywurst-Catering vom
                    Curry Wolf durchgeführt?
                  </label>
                  <div className="tab__content">
                    <p>
                      <span>
                        Unser Currywurst-Caterings bieten wir Ihnen von 50 bis
                        50.000 Personen an. Übrigens Firmen, größere private
                        Gruppen und Reisegruppen können unsere Currywurst auch
                        unmittelbar am Brandenburger Tor genießen – so vereinen
                        sich die zwei beliebtesten Berliner Sehenswürdigkeiten
                        auf einzigartig kulinarische und unvergessliche Art und
                        Weise.
                      </span>
                    </p>
                  </div>
                </div>
                <div className="tab">
                  <input type="checkbox" name="accordion-1" id="cb8" />
                  <label for="cb8" className="tab__label">
                    Gibt es denn nur Currywurst beim Currywurst-Catering vom
                    Curry Wolf?
                  </label>
                  <div className="tab__content">
                    <p>
                      Nein, Sie wählen die Varianten unseres Angebotes: Original
                      Berliner Currywurst mit und ohne Darm, vegane
                      „Fleischbällchen“, mit zweierlei Kartoffelsalat (Essig und
                      Öl oder Majo) und/oder knackigen Pommes (nur Outdoor)
                      und/oder Imbiss-Brötchen? Vielleicht wählen Sie zum heißen
                      Snack für Ihre Gäste auch stilecht ein Glas Champagner
                      dazu, um Ihrem Currywurst-Catering eine ganz besonders
                      exklusive Note zu verleihen?
                    </p>
                  </div>
                </div>
                <div className="tab">
                  <input type="checkbox" name="accordion-1" id="cb9" />
                  <label for="cb9" className="tab__label">
                    Gibt es auch vegane Angebote vom Curry Wolf?
                  </label>
                  <div className="tab__content">
                    <p>
                      Für alle die es fleischlos lieben haben wir die vermutlich
                      leckerste vegane Currywurst sowie leckere vegane
                      „Fleischbällchen" im Angebot. Natürlich sind aber auch
                      unsere Pommes frites sowie die Majo vegan. Für alle ist
                      was dabei.
                    </p>
                  </div>
                </div>
                <div className="tab">
                  <input type="checkbox" name="accordion-1" id="cb10" />
                  <label for="cb10" className="tab__label">
                    Was bedeutet es, wenn beim Currywurst-Catering vom Curry
                    Wolf von „All-Inclusive-Service“ die Rede ist?
                  </label>
                  <div className="tab__content">
                    <p>
                      Mit unserem vielfach bewährten „All-Inclusive-Service“ für
                      einen reibungslosen und professionellen Ablauf ist nach
                      individueller Absprache immer an alles - ohne weitere
                      Nebenkosten - gedacht und wird von uns gleich mitgebracht:
                      Vom Equipment, über die Servicemitarbeiter:innen, eine
                      breite Getränkeauswahl an Softdrinks, Bier und Sekt, sowie
                      Geschirr (Wurst-Gläser und Salat/Pommes-Schalen), Besteck
                      (Piker, "normale" Gabeln), Servietten, sowie Stehtische
                      bis hin zur Müllentsorgung. Selbstverständlich verstehen
                      sich unsere Angebote immer inklusive Anlieferung, Auf- und
                      Abbau.
                    </p>
                  </div>
                </div>
                <div className="tab">
                  <input type="checkbox" name="accordion-1" id="cb11" />
                  <label for="cb11" className="tab__label">
                    Kann ich auch selbst, also ohne „All-Inclusive-Service“, ein
                    Currywurst-Catering durchführen?
                  </label>
                  <div className="tab__content">
                    <p>
                      Wer nicht von uns beliefert werden möchte oder sich unter
                      50 Personen selbst verpflegt, kann natürlich alles auch
                      selbst abholen: An jedem unserer Berliner Standorte oder
                      an unserem Standort in Potsdam sind Currywürste im Glas
                      verfügbar. Diese lassen sich unkompliziert im
                      haushaltsüblichen Backofen erwärmen.
                    </p>
                  </div>
                </div>
                <div className="tab">
                  <input type="checkbox" name="accordion-1" id="cb12" />
                  <label for="cb12" className="tab__label">
                    Lassen sich im Rahmen eines Currywurst-Caterings vom Curry
                    Wolf auch individuelle Absprachen miteinander realisieren?
                  </label>
                  <div className="tab__content">
                    <p>
                      Bitte sprechen Sie mit uns über Ihre konkreten
                      Vorstellungen, auf die wir gerne individuell eingehen! Wir
                      liefern, was wirklich passt: Mit Absenden des Formulars
                      erhalten Sie von uns einen ersten Kostenvoranschlag, auf
                      dessen Basis wir weitere Details miteinander klären
                      können. Wir freuen uns auf Ihre Anfrage! Bei uns heißt es
                      nicht grundlos: Wolf bestellt, hat Schwein gehabt.
                    </p>
                  </div>
                </div> */}
              </section>
            </div>
          </div>
        </div>
      </div>
      ;
    </div>
  );
}

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
