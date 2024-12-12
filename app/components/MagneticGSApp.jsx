import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function MagneticGSApp({ children }) {
  const magnetic = useRef(null);

  useEffect(() => {
    if (!magnetic.current) return;

    const xTo = gsap.quickTo(magnetic.current, "x", {
      duration: 1,
      ease: "elastic.out(1, 0.3)",
    });
    const yTo = gsap.quickTo(magnetic.current, "y", {
      duration: 1,
      ease: "elastic.out(1, 0.3)",
    });

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = magnetic.current.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      const z = (x + y) / 25;

      xTo(x);
      yTo(y);
      gsap.to(magnetic.current, {
        rotateZ: z,
        duration: 1,
        ease: "elastic.out(1, 0.3)",
      });
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      gsap.to(magnetic.current, {
        rotateZ: 0,
        duration: 1,
        ease: "elastic.out(1, 0.3)",
      });
    };

    magnetic.current.addEventListener("mousemove", handleMouseMove);
    magnetic.current.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (magnetic.current) {
        magnetic.current.removeEventListener("mousemove", handleMouseMove);
        magnetic.current.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  if (!React.isValidElement(children)) {
    console.error("MagneticGSApp requires a valid React element as a child.");
    return null;
  }

  return React.cloneElement(children, { ref: magnetic });
}
