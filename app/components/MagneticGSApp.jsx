import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function MagneticGSApp({ children }) {
  const magneticRef = useRef(null);

  useEffect(() => {
    if (!magneticRef.current) return; // Ensure ref is attached to a DOM element

    const xTo = gsap.quickTo(magneticRef.current, 'x', {
      duration: 1,
      ease: 'elastic.out(1, 0.3)',
    });
    const yTo = gsap.quickTo(magneticRef.current, 'y', {
      duration: 1,
      ease: 'elastic.out(1, 0.3)',
    });

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } =
        magneticRef.current.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);

      xTo(x);
      yTo(y);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    const magneticEl = magneticRef.current;
    magneticEl.addEventListener('mousemove', handleMouseMove);
    magneticEl.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      magneticEl.removeEventListener('mousemove', handleMouseMove);
      magneticEl.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return React.cloneElement(children, { ref: magneticRef });
}
