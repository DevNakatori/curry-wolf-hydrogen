import React, {useEffect, useRef} from 'react';
import {gsap} from 'gsap';
const Marquee = ({duration, children}) => {
    const marqueeRef = useRef(null);
    const animationRefs = useRef([]);
  
    useEffect(() => {
      const marquee = marqueeRef.current;
  
      if (!marquee) return;
  
      const marqueeInner = marquee.querySelector('.marquee__inner');
      const marqueeContent = marqueeInner.querySelector('.marquee__content');
  
      // Clone the content element
      const marqueeContentClone = marqueeContent.cloneNode(true);
      marqueeInner.appendChild(marqueeContentClone);
  
      // Select all marquee content elements (original + clone)
      const marqueeContentAll = marqueeInner.querySelectorAll('.marquee__content');
  
      // Animate all content elements
      marqueeContentAll.forEach((element, index) => {
        const animation = gsap.to(element, {
          x: '-115%',
          repeat: -1,
          duration,
          ease: 'linear',
        });
        animationRefs.current[index] = animation; // Store animations for later use
      });
  
      // Cleanup on component unmount
      return () => {
        animationRefs.current.forEach((animation) => animation.kill());
      };
    }, [duration]);
  
    const handleMouseEnter = () => {
      animationRefs.current.forEach((animation) =>animation.timeScale(0.2));
    };
  
    const handleMouseLeave = () => {
      animationRefs.current.forEach((animation) => animation.timeScale(1));
    };

  return (
    <div 
    ref={marqueeRef}  
    class="marquee" 
    marquee-duration={duration}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    >
      <div  class="marquee__inner">
        <div className="marquee__content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
