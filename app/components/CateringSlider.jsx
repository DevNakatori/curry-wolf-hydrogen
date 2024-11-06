import {useLocation} from '@remix-run/react';
import React, {useEffect} from 'react';

const CateringSlider = ({Referenzen}) => {
  const location = useLocation();
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
  }, [location]);
  useEffect(() => {
    if (window.innerWidth < 768) {
      setTimeout(function () {
        const sliderContainer = document.querySelector('.ref-wrap');
        const slides = document.querySelectorAll('.ref-box');
        let currentIndex = 0;
        let slidesToShow = 1;

        function updateSlider() {
          if (window.innerWidth < 768) {
            slidesToShow = 1.2;
          } else {
            slidesToShow = 1;
          }

          const width = sliderContainer.clientWidth / slidesToShow;
          slides.forEach((slide) => {
            slide.style.minWidth = `${width}px`;
          });
          sliderContainer.style.transform = `translateX(${
            -width * currentIndex
          }px)`;
        }

        function nextSlide() {
          if (currentIndex < slides.length - slidesToShow) {
            currentIndex += 1;
          } else {
            currentIndex = 0;
          }
          updateSlider();
        }

        function startAutoplay() {
          setInterval(nextSlide, 3000);
        }

        function resetAutoplay() {
          clearInterval(autoplayInterval);
          startAutoplay();
        }

        window.addEventListener('resize', function () {
          updateSlider();
          currentIndex = 0;
        });

        updateSlider();
        startAutoplay();
      }, 2000);
    }
  }, []);
  return (
    <div className="ref-slider">
      <div className="ref-wrap">
        {Referenzen?.ReferenzenContent.map((item) => {
          return (
            <div key={item?._key} className="ref-box">
              <p className="same-height">{item?.description}</p>
              <div className="ref-title">
                <h4 dangerouslySetInnerHTML={{__html: item?.title}} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CateringSlider;
