import React, {useEffect, useRef, useState} from 'react';

const Home = ({data}) => {
  const videoRef = useRef(null);
  const indicatorRef = useRef(null);
  const videoOverlayRef = useRef(null);
  const sliderWrapperRef = useRef(null);
  const dotsContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [totalSlides, setTotalSlides] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const {video} = data;
  console.log(data);
  // Handle video playback
  useEffect(() => {
    const videoElement = document.querySelector('video');
    if (videoElement) {
      videoRef.current = videoElement;
      setIsPlaying(true);
    }

    return () => {
      setIsPlaying(false);
    };
  }, []);

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      videoRef.current.play();
    }
  }, [isPlaying]);

  // Handle scroll for indicator
  useEffect(() => {
    let lastScrollTop = 0;
    const indicatorDiv = document.getElementById('indicator');

    const handleScroll = () => {
      if (!indicatorDiv) return;

      let currentScroll =
        window.pageYOffset || document.documentElement.scrollTop;

      if (currentScroll === 0) {
        indicatorDiv.style.bottom = '0';
        indicatorDiv.style.opacity = '1';
      } else if (currentScroll > lastScrollTop) {
        indicatorDiv.style.bottom = '-100px';
        indicatorDiv.style.opacity = '0';
      }

      lastScrollTop = Math.max(0, currentScroll);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle video overlay on scroll
  useEffect(() => {
    const handleOverlayScroll = () => {
      const videoOverlay = document.getElementById('videoOverlay');
      if (videoOverlay) {
        let scrollPosition = window.scrollY;

        if (scrollPosition > 180) {
          videoOverlay.style.opacity = 1;
        } else {
          videoOverlay.style.opacity = 0;
        }
      }
    };

    window.addEventListener('scroll', handleOverlayScroll);

    return () => {
      window.removeEventListener('scroll', handleOverlayScroll);
    };
  }, []);

  // Initialize and manage slider functionality
  useEffect(() => {
    if (window.innerWidth < 768) {
      const initializeSlider = () => {
        const sliderWrapper = document.getElementById('slider-wrapper');
        const slides = document.querySelectorAll('.slide');
        const dotsContainer = document.getElementById('dots-container');
        const totalSlides = slides.length;
        let currentIndex = 1;
        let startX = 0;
        let endX = 0;

        if (dotsContainer.children.length === 0) {
          // Clear any existing clones
          sliderWrapper.innerHTML = '';
          slides.forEach((slide) => sliderWrapper.appendChild(slide));

          // Clone the first and last slides
          const firstSlideClone = slides[0].cloneNode(true);
          const lastSlideClone = slides[totalSlides - 1].cloneNode(true);

          sliderWrapper.appendChild(firstSlideClone);
          sliderWrapper.insertBefore(lastSlideClone, sliderWrapper.firstChild);
        }

        const allSlides = document.querySelectorAll('.slide');

        // Clear existing dots
        dotsContainer.innerHTML = '';

        for (let i = 0; i < Math.min(totalSlides, 3); i++) {
          const dot = document.createElement('span');
          dot.classList.add('dot');
          if (i === 0) {
            dot.classList.add('active');
          }
          dot.addEventListener('click', () => {
            currentIndex = i + 1;
            sliderWrapper.style.transition = 'transform 0.5s ease';
            updateSlider();
          });
          dotsContainer.appendChild(dot);
        }

        function updateDots() {
          const dots = dotsContainer.children;
          Array.from(dots).forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === currentIndex - 1) {
              dot.classList.add('active');
            }
          });
        }

        function updateSlider() {
          const newTransform = -(currentIndex * 33.33) + 33.33;
          sliderWrapper.style.transform = `translateX(${newTransform}%)`;
          Array.from(allSlides).forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === currentIndex) {
              slide.classList.add('active');
            }
          });
          updateDots();
        }

        sliderWrapper.addEventListener('transitionend', () => {
          if (currentIndex >= totalSlides + 1) {
            sliderWrapper.style.transition = 'none';
            currentIndex = 1;
            updateSlider();
            setTimeout(() => {
              sliderWrapper.style.transition = 'transform 0.5s ease';
            }, 50);
          } else if (currentIndex <= 0) {
            sliderWrapper.style.transition = 'none';
            currentIndex = totalSlides;
            updateSlider();
            setTimeout(() => {
              sliderWrapper.style.transition = 'transform 0.5s ease';
            }, 50);
          }
        });

        // Touch events for swipe functionality
        sliderWrapper.addEventListener('touchstart', (e) => {
          startX = e.touches[0].clientX;
        });

        sliderWrapper.addEventListener('touchmove', (e) => {
          endX = e.touches[0].clientX;
        });

        sliderWrapper.addEventListener('touchend', () => {
          const diffX = startX - endX;
          if (diffX > 50) {
            // Swipe left (next slide)
            currentIndex++;
            sliderWrapper.style.transition = 'transform 0.5s ease';
            updateSlider();
          } else if (diffX < -50) {
            // Swipe right (previous slide) currentIndex--;
            sliderWrapper.style.transition = 'transform 0.5s ease';
            updateSlider();
          }
        });
        updateSlider();
      };
      setTimeout(initializeSlider, 2000);
    }
  }, []);

  return (
    <div className="index-wrapper">
      <>
        <section>
          <video
            playsInline
            loop
            autoPlay
            muted
            id="bgVideo"
            width="100%"
            height="100%"
          >
            <source
              src="https://cdn.shopify.com/videos/c/o/v/593a0228047649b8878549d76b6c0a26.mp4"
              type="video/mp4"
            />
            <source
              src="https://cdn.shopify.com/videos/c/o/v/c24e26db9bcc4276b1227fb21cbab14c.webm"
              type="video/webm"
            />
          </video>
        </section>
        <div id="videoOverlay" className="video-overlay" />
        <div className="mouse-wrap" id="indicator">
          <div className="mouse">
            <div className="scrollWheel" />
          </div>
        </div>
        <section>
          <div id="text1" className="first-time-video-text hidden">
            <div className="container">
              <h1
                data-aos="zoom-in-up"
                className="visible"
                id="inner-text1"
                data-aos-duration={3000}
                data-aos-once="true"
              >
                {video?.title ? (
                  <span className="text-small">{video?.title}</span>
                ) : (
                  <span className="text-small">{''}</span>
                )}
                {video.caption && (
                  <span data-mce-fragment={1}>{video.caption}</span>
                )}
              </h1>
            </div>
          </div>
        </section>
        <section>
          <div id="text2" className="second-time-video-text hidden">
            <div id="slider-container" className="slider-container">
              <div
                id="slider-wrapper"
                className="slider-wrapper aos-init"
                data-aos-duration={1500}
                data-aos="fade-up"
                data-aos-once="true"
                ref={sliderWrapperRef}
              >
                <div
                  className="slide aos-init"
                  data-aos-duration={1500}
                  data-aos="fade-up"
                  data-aos-once="true"
                >
                  <div
                    data-aos-once="true"
                    data-aos-duration={1500}
                    data-aos="fade-up"
                    className="aos-init"
                  >
                    <div className="inner-slider">
                      <h3>
                        <meta charSet="UTF-8" />
                        <span>Für dem Wolfshunger.</span>
                      </h3>
                      <img
                        alt="Hungry like a wolf"
                        src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/webp_store_1_1_98766e44-17b6-4f1a-a57e-4e87d631a48c.webp?v=1721732901"
                      />
                      <p className="same-height">
                        <meta charSet="UTF-8" />
                        <span>
                          Fünfmal in Berlin und Potsdam an den besten Plätzen
                          der Stadt.
                        </span>
                      </p>
                      <div className="btn-wrap">
                        <a className="yellow-btn" href="/pages/locations">
                          Standorte
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="slide"
                  data-aos-duration={1500}
                  data-aos="fade-up"
                  data-aos-once="true"
                >
                  <div className="inner-slider">
                    <h3>Wolf bestellt. Schwein gehabt.</h3>
                    <img
                      alt="Wolf bestellt"
                      src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/webp_truck_1_1_f66bb9e1-e0c8-4e54-8943-d4b8f0c79cd4.webp?v=1721732901"
                    />
                    <p className="same-height">
                      <span>
                        Catering ist Geschmacks - und Vertrauenssache - deshalb
                        CURRY WOLF
                      </span>
                    </p>
                    <div className="btn-wrap">
                      <a href="/pages/catering" className="yellow-btn">
                        Catering
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  className="slide"
                  data-aos-duration={1500}
                  data-aos="fade-up"
                  data-aos-once="true"
                >
                  <div
                    data-aos-once="true"
                    data-aos-duration={1500}
                    data-aos="fade-up"
                    className="aos-init"
                  >
                    <div className="inner-slider">
                      <h3>Feine Geschmacksache&nbsp;😋</h3>
                      <img
                        alt="A Berlin tidbit"
                        src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/webp_product_1_1_b22ea210-5694-4495-a9e5-e132036c96c1.webp?v=1721732901"
                      />
                      <p className="same-height">
                        <meta charSet="UTF-8" />
                        Als frisch zubereiteter Genuss an einem CURRY WOLF
                        Imbiss genießen und vieles auch über unseren Onlineshop
                        zu bestellen – für zuhause, unterwegs oder als Geschenk.
                      </p>
                      <div className="btn-wrap">
                        <a className="yellow-btn" href="/collections/all">
                          Shop
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div id="dots-container" ref={dotsContainerRef} />
            </div>
            <div className="s-wrap">
              <div className="b-title">
                <h2
                  data-aos-duration={3000}
                  data-aos="fade-up"
                  data-aos-once="true"
                >
                  Family Business
                  <br />
                  Originalrezept
                  <br />
                  Made In Berlin
                </h2>
              </div>
              <div
                className="c-s-image-section"
                data-aos="fade-up"
                data-aos-once="true"
                data-aos-duration={2000}
              >
                <div
                  className="img-big-wrap"
                  data-aos="fade-right"
                  data-aos-once="true"
                  data-aos-duration={2000}
                >
                  <div className="img-one">
                    <div className="inner-white-box">
                      <img src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/2.png?v=1716978818" />
                    </div>
                  </div>
                </div>
                <div
                  className="img-big-wrap"
                  data-aos="zoom-in"
                  data-aos-once="true"
                  data-aos-duration={2000}
                >
                  <div className="img-one">
                    <div className="inner-white-box">
                      <img src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/unsere_story_01_1.webp?v=1721392013" />
                    </div>
                  </div>
                </div>
                <div
                  className="img-big-wrap"
                  data-aos="fade-left"
                  data-aos-once="true"
                  data-aos-duration={2000}
                >
                  <div className="img-one">
                    <div className="inner-white-box">
                      <img src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/458245312-foto-fur-catering-brandenburger-tor2.webp?v=1721730189" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              data-aos-duration={2000}
              data-aos="fade-up"
              data-aos-once="true"
              className="btn-wrap"
            >
              <a className="yellow-btn" href="/pages/our-story">
                Unsere Story
              </a>
            </div>
          </div>
        </section>
      </>
    </div>
  );
};

export default Home;
