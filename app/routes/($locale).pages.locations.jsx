import {json} from '@shopify/remix-oxygen';
import {Link, NavLink, useLoaderData} from '@remix-run/react';
import {useEffect, useRef, useState} from 'react';
import {mergeMeta} from '../lib/meta';
import {DEFAULT_LOCALE} from 'countries';
import {sanityPreviewPayload} from '../lib/sanity/sanity.payload.server';
import {LOCATION_PAGE_QUERY} from '../qroq/queries';
import {useSanityData} from '../hooks/useSanityData';
import {getPageHandle} from './($locale).$';
import {getImageUrl} from '~/lib/utils';
import '../styles/location-page.css';
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
  const handle = getPageHandle({locale, params, pathname}).replace(
    /^pages\//,
    '',
  );
  const language = locale?.language.toLowerCase();
  const queryParams = {
    defaultLanguage: DEFAULT_LOCALE.language.toLowerCase(),
    handle,
    language,
  };

  const page = await sanity.query({
    groqdQuery: LOCATION_PAGE_QUERY,
    params: queryParams,
  });
  if (!page) {
    throw new Response('Not Found', {status: 404});
  }
  const seo = page.data.seo;
  const canonicalUrl = request.url;
  return json({
    page,
    canonicalUrl,
    seo,
    ...sanityPreviewPayload({
      context,
      params: queryParams,
      query: LOCATION_PAGE_QUERY.query,
    }),
  });
}

export default function Page() {
  /* @type {LoaderReturnData} */

  const {page} = useLoaderData();
  const {data, encodeDataAttribute} = useSanityData({
    initial: page,
  });

  const locationSecondSection = data?.locationSecondSection;
  const cards = locationSecondSection?.cards || [];
  const locationThirdSection = data?.locationThirdSection;
  const images = locationThirdSection?.images || [];

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      videoRef.current.play();
    }
  }, [isPlaying]);

  useEffect(() => {
    const videoElement = document.querySelector('video');
    if (videoElement) {
      videoRef.current = videoElement;
      setIsPlaying(true);
    }

    return () => {
      if (videoElement) {
        setIsPlaying(false);
      }
    };
  }, []);

  useEffect(() => {
    const video1 = document.getElementById('video1');
    const video2 = document.getElementById('video2');
    const videocontainer = document.getElementById('video-container');
    const overlayImages = document.querySelectorAll('.overlayImage');
    const isMobile = window.innerWidth < 768;
    const positions = isMobile
      ? [
          {
            x: 25,
            y: 22,
            label:
              '<img src="https://cdn.shopify.com/oxygen-v2/32730/22017/45614/725053/assets/CurryWolf_Logo_footer-BNigDRwe.svg" />',
            additionalLabel: 'Steglitz',
            additionalLabel2: 'Mehr Info',
          },
          {
            x: 22,
            y: 30,
            label:
              '<img src="https://cdn.shopify.com/oxygen-v2/32730/22017/45614/725053/assets/CurryWolf_Logo_footer-BNigDRwe.svg" />',
            additionalLabel: 'Potsdam',
            additionalLabel2: 'Mehr Info',
          },
          {
            x: 33.5,
            y: 13,
            label:
              '<img src="https://cdn.shopify.com/oxygen-v2/32730/22017/45614/725053/assets/CurryWolf_Logo_footer-BNigDRwe.svg" />',
            additionalLabel: 'Brandenburger Tor',
            additionalLabel2: 'Mehr Info',
          },
          {
            x: 32,
            y: 27,
            label:
              '<img src="https://cdn.shopify.com/oxygen-v2/32730/22017/45614/725053/assets/CurryWolf_Logo_footer-BNigDRwe.svg" />',
            additionalLabel: 'Kudamm',
            additionalLabel2: 'Mehr Info',
          },
          {
            x: 40,
            y: 25,
            label:
              '<img src="https://cdn.shopify.com/oxygen-v2/32730/22017/45614/725053/assets/CurryWolf_Logo_footer-BNigDRwe.svg" />',
            additionalLabel: 'Lichtenrade',
            additionalLabel2: 'Mehr Info',
          },
        ]
      : [
          {
            x: 15,
            y: 22,
            label:
              '<img src="https://cdn.shopify.com/oxygen-v2/32730/22017/45614/725053/assets/CurryWolf_Logo_footer-BNigDRwe.svg" />',
            additionalLabel: 'Steglitz',
            additionalLabel2: 'Mehr Info',
          },
          {
            x: 9,
            y: 35,
            label:
              '<img src="https://cdn.shopify.com/oxygen-v2/32730/22017/45614/725053/assets/CurryWolf_Logo_footer-BNigDRwe.svg" />',
            additionalLabel: 'Potsdam',
            additionalLabel2: 'Mehr Info',
          },
          {
            x: 24,
            y: 17.5,
            label:
              '<img src="https://cdn.shopify.com/oxygen-v2/32730/22017/45614/725053/assets/CurryWolf_Logo_footer-BNigDRwe.svg" />',
            additionalLabel: 'Brandenburger Tor',
            additionalLabel2: 'Mehr Info',
          },
          {
            x: 22,
            y: 28,
            label:
              '<img src="https://cdn.shopify.com/oxygen-v2/32730/22017/45614/725053/assets/CurryWolf_Logo_footer-BNigDRwe.svg" />',
            additionalLabel: 'Kudamm',
            additionalLabel2: 'Mehr Info',
          },
          {
            x: 31,
            y: 29,
            label:
              '<img src="https://cdn.shopify.com/oxygen-v2/32730/22017/45614/725053/assets/CurryWolf_Logo_footer-BNigDRwe.svg" />',
            additionalLabel: 'Lichtenrade',
            additionalLabel2: 'Mehr Info',
          },
        ];

    const apiData =
      data?.imagesLabels ||
      []?.map(({name, anchor}) => ({
        additionalLabel: name,
        additionalLabel2: anchor,
      }));

    const updatedPositions = positions.map((position, index) => ({
      ...position, // Keep the existing position data
      additionalLabel:
        apiData[index]?.additionalLabel || position.additionalLabel, // Merge or fallback to original
      additionalLabel2:
        apiData[index]?.additionalLabel2 || position.additionalLabel2, // Merge or fallback to original
    }));
    const overlayLabels = [];

    function positionOverlayImages() {
      const rect = videocontainer.getBoundingClientRect();

      if (window.innerWidth <= 767) {
        overlayImages.forEach((image, index) => {
          const xPercentage = updatedPositions[index].x;
          const yPercentage = updatedPositions[index].y;
          const xPos =
            rect.left + (rect.width * xPercentage) / 100 - image.width / 2;
          const yPos =
            rect.top + (rect.height * yPercentage) / 100 - image.height / 2;

          const xPoss = rect.left + (rect.width * xPercentage) / 100 - 60;
          const yPoss = rect.top + (rect.height * yPercentage) / 100 - 70;

          // const xPoss = rect.left + (rect.width * xPercentage / 100) - (isMobile ? 100 : 50);
          // const yPoss = rect.top + (rect.height * yPercentage / 100) - (isMobile ? 140 : 70);

          image.style.left = `${xPercentage}%`;
          image.style.top = `${yPercentage}%`;
          image.style.transform = `translate(${xPos}px, ${yPos}px)`;

          const label = document.createElement('div');
          label.classList.add('overlayLabel');
          label.innerHTML = `
            <span class="mainLabel">${updatedPositions[index].label}</span>
            <span class="additionalLabel">${updatedPositions[index].additionalLabel}</span>
            <span class="additionalLabel2">${updatedPositions[index].additionalLabel2}</span>
          `;
          label.style.opacity = 0;
          videocontainer.appendChild(label);
          overlayLabels.push(label);

          label.style.position = 'absolute';
          label.style.left = `${xPercentage}%`;
          label.style.top = `${yPercentage}%`;
          label.style.transform = `translate(${xPoss}px, ${yPoss}px)`;

          image.addEventListener('mouseenter', () => {
            image.style.transform = `translate(${xPos}px, ${yPos}px) translateY(-10px)`;
          });

          image.addEventListener('mouseleave', () => {
            image.style.transform = `translate(${xPos}px, ${yPos}px) translateY(0px)`;
          });
        });
      } else {
        overlayImages.forEach((image, index) => {
          const xPercentage = updatedPositions[index].x;
          const yPercentage = updatedPositions[index].y;
          const xPos =
            rect.left + (rect.width * xPercentage) / 100 - image.width / 2;
          const yPos =
            rect.top + (rect.height * yPercentage) / 100 - image.height / 2;

          const xPoss = rect.left + (rect.width * xPercentage) / 100 - 100;
          const yPoss = rect.top + (rect.height * yPercentage) / 100 - 140;

          // const xPoss = rect.left + (rect.width * xPercentage / 100) - (isMobile ? 100 : 50);
          // const yPoss = rect.top + (rect.height * yPercentage / 100) - (isMobile ? 140 : 70);

          image.style.left = `${xPercentage}%`;
          image.style.top = `${yPercentage}%`;
          image.style.transform = `translate(${xPos}px, ${yPos}px)`;

          const label = document.createElement('div');
          label.classList.add('overlayLabel');
          label.innerHTML = `
            <span class="mainLabel">${updatedPositions[index].label}</span>
            <span class="additionalLabel">${updatedPositions[index].additionalLabel}</span>
            <span class="additionalLabel2">${updatedPositions[index].additionalLabel2}</span>
          `;
          label.style.opacity = 0;
          videocontainer.appendChild(label);
          overlayLabels.push(label);

          label.style.position = 'absolute';
          label.style.left = `${xPercentage}%`;
          label.style.top = `${yPercentage}%`;
          label.style.transform = `translate(${xPoss}px, ${yPoss}px)`;

          image.addEventListener('mouseenter', () => {
            image.style.transform = `translate(${xPos}px, ${yPos}px) translateY(-10px)`;
          });

          image.addEventListener('mouseleave', () => {
            image.style.transform = `translate(${xPos}px, ${yPos}px) translateY(0px)`;
          });
        });
      }
    }

    function showImagesSequentially() {
      overlayImages.forEach((image, index) => {
        setTimeout(() => {
          image.style.opacity = 1;
          overlayLabels[index].style.opacity = 1;
        }, index * 500);
      });
    }

    video1.addEventListener('ended', () => {
      video1.style.display = 'none';
      video2.style.display = 'block';
      video2.play();
      // positionOverlayImages();
      //showImagesSequentially();
    });

    //  window.addEventListener('resize', () => {
    //     positionOverlayImages();
    //     showImagesSequentially();
    // });

    function detectMobile() {
      var userAgent = navigator.userAgent || navigator.vendor || window.opera;
      if (/android/i.test(userAgent)) {
        return true;
      }
      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return true;
      }
      return false;
    }

    if (detectMobile()) {
      const parent = document.querySelector('.thereedmainsection');
      const child = document.querySelector('.video-container');
      let isDown = false;
      let startX;
      let scrollLeft;
      const centerChild = () => {
        const parentWidth = parent.offsetWidth;
        const childWidth = child.offsetWidth;
        const scrollPosition = (childWidth - parentWidth) / 2;
        parent.scrollLeft = scrollPosition;
      };
      centerChild();
      window.addEventListener('resize', centerChild);
      parent.addEventListener('touchstart', (e) => {
        isDown = true;
        child.style.cursor = 'grabbing';
        startX = e.touches[0].pageX - child.offsetLeft;
        scrollLeft = parent.scrollLeft;
      });
      parent.addEventListener('touchend', () => {
        isDown = false;
        child.style.cursor = 'grab';
      });
      parent.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.touches[0].pageX - child.offsetLeft;
        const walk = (x - startX) * 2;
        parent.scrollLeft = scrollLeft - walk;
      });

      console.log('This is a mobile device.');
      setTimeout(function () {
        showImagesSequentially();
        positionOverlayImages();
      }, 2000);
    } else {
      console.log('This is not a mobile device.');
      // positionOverlayImages();
      setTimeout(function () {
        showImagesSequentially();
        positionOverlayImages();
      }, 2000);
    }
  }, []);

  return (
    <div className="page location-main">
      <main>
        <section className="thereedmainsection">
          <div id="video-container" className="video-container">
            {data?.imagesLabels?.map((item) => {
              const slug = item?.link?.slug;
              return (
                <Link key={item?._key} to={`/pages/${slug}`}>
                  <img
                    className="overlayImage"
                    src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/CurryWolf-BerlinMap-StoreButton.png?v=1718286508"
                    alt={`Overlay Image ${item?.name}`}
                  />
                </Link>
              );
            })}
            <div className="video_one">
              <video id="video1" muted autoPlay playsInline>
                <source
                  src="https://cdn.shopify.com/videos/c/o/v/5f70395797e84acb87b9244598f082ef.webm"
                  type="video/webm"
                />
                <source
                  src="https://cdn.shopify.com/videos/c/o/v/6505d5c2cef7490fa1be7b4603f6c345.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="video_two">
              <video
                playsInline
                loop
                muted
                id="video2"
                style={{display: 'none'}}
              >
                <source
                  src="https://cdn.shopify.com/videos/c/o/v/f983f8e33ce1416ab2d81f8c32b8b82e.webm"
                  type="video/webm"
                />
                <source
                  src="https://cdn.shopify.com/videos/c/o/v/0863e1d535974ad49b2d8fc1038cb5b0.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          <div className="onlytouchdevice">
            <p>Move to navigate through the map</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 48 24"
              height="24"
              width="48"
            >
              <path
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="1.5"
                stroke="#fff"
                d="M19.5 12.0003L17.496 14.6723C17.216 15.0456 17.0754 15.505 17.0984 15.9711C17.1214 16.4371 17.3066 16.8805 17.622 17.2243L21.406 21.3523C21.784 21.7653 22.318 22.0003 22.879 22.0003H27.5C29.9 22.0003 31.5 20.0003 31.5 18.0003V9.42934C31.5 7.14334 28.5 7.14334 28.5 9.42934V10.0003"
              />
              <path
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="1.5"
                stroke="#fff"
                d="M28.5 10V8.286C28.5 6 25.5 6 25.5 8.286V10V7.5C25.5 5.214 22.5 5.214 22.5 7.5V10V3.499C22.4997 3.10135 22.3416 2.72007 22.0603 2.43899C21.779 2.1579 21.3977 2 21 2C20.6022 2 20.2206 2.15804 19.9393 2.43934C19.658 2.72064 19.5 3.10218 19.5 3.5V15"
              />
              <path stroke="#fff" d="M5.1194 9L1 12.5L5.1194 16" />
              <path stroke="#fff" d="M1 12.5H9.92537" />
              <path stroke="#fff" d="M42.8806 16L47 12.5L42.8806 9" />
              <path stroke="#fff" d="M47 12.5L38.0746 12.5" />
            </svg>
          </div>
        </section>
        <div className="main-location-curry">
          <div className="container">
            <div
              className="curry-image-content"
              data-aos-duration="1500"
              data-aos="fade-up"
              data-aos-once="true"
            >
              {cards?.map((card, index) => {
                const imageUrl = getImageUrl(card.image.asset._ref);
                return (
                  <div key={index} className="c-two-box">
                    <div className="c-left">
                      <img src={imageUrl} alt="shop-image" />
                    </div>
                    <div className="c-right">
                      <h2>{card?.title}</h2>
                      <p className="same-height">{card?.description}</p>
                      <Link href={card?.buttonLink} className="yellow-btn">
                        {card?.buttonText}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="follow-currywolf">
              <div
                data-aos-once="true"
                data-aos="fade-up"
                data-aos-duration="1500"
              >
                <h2>{locationThirdSection?.title}</h2>
                <div className="curry-new-btn">
                  <a
                    href={locationThirdSection?.buttonLink}
                    className="yellow-border-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {locationThirdSection?.buttonText}
                  </a>
                </div>
              </div>
              <div className="follow-box">
                <div
                  className="c-s-image-section"
                  data-aos="fade-right"
                  data-aos-once="true"
                  data-aos-duration="2000"
                >
                  {images?.map((image, index) => {
                    const imageUrl = getImageUrl(image.image.asset._ref);
                    return (
                      <div
                        key={index}
                        className="img-big-wrap"
                        data-aos={`${
                          index === 1 || index === 2 ? 'zoom-in' : ''
                        }`}
                      >
                        <div className="img-one">
                          <div className="inner-white-box">
                            <img src={imageUrl} alt="" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/**  @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/**  @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/**  @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
