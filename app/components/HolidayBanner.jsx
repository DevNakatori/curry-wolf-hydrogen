import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Holidaybanner from "../assets/ribbon.svg";
import { getImageUrl } from "~/lib/utils";

const HolidayBanner = ({bannerHoliday}) => {
  const targetRef = useRef(null); // Reference to the target div
  const snowCounts = { regular: 75, small: 75 }; // Separate counts for snowflake types
  const imgUrl = getImageUrl(bannerHoliday?.asset?._ref);
  useEffect(() => {
    const target = targetRef.current;
    const w = window.innerWidth;
    const h = window.innerHeight;

    gsap.set(target, { perspective: 900 });

    // Helper function to create snowflakes
    const createSnowflakes = (count, className, sizeRange) => {
      for (let i = 0; i < count; i++) {
        const newDiv = document.createElement("div");
        newDiv.className = className;

        // Set size and styles
        const size = gsap.utils.random(sizeRange.min, sizeRange.max);
        newDiv.style.width = `${size}px`;
        newDiv.style.height = `${size}px`;

        target.appendChild(newDiv);

        // Initial position and animation setup
        gsap.set(newDiv, {
          x: gsap.utils.random(0, w),
          y: gsap.utils.random(-250, -200),
          z: gsap.utils.random(-200, 200),
          scale: gsap.utils.random(0.5, 1),
        });

        // Start falling animation
        fallingSnow(newDiv, w, h);
      }
    };

    // Falling animation
    const fallingSnow = (snow, w, h) => {
      gsap.to(snow, {
        duration: gsap.utils.random(6, 15),
        y: h + 100,
        ease: "none",
        repeat: -1,
        delay: -15,
      });

      gsap.to(snow, {
        duration: gsap.utils.random(4, 10),
        x: gsap.utils.random(["-=10", "+=10", "-=150", "+=150"]),
        rotation: gsap.utils.random(0, 180),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    };

    // Create regular and small snowflakes
    createSnowflakes(snowCounts.regular, "snow", { min: 15, max: 35 });
    createSnowflakes(snowCounts.small, "small-snow", { min: 5, max: 10 });

    // Fade in the snow container
    gsap.to(target, { duration: 3, opacity: 1, ease: "none", delay: 1 });

    // Cleanup on unmount
    return () => {
      target.innerHTML = ""; // Remove child elements
      gsap.killTweensOf(target); // Kill GSAP animations
    };
  }, []);

  return (
    <div className="holiday-banner">
      <div className="holiday-banner-image">
        <div ref={targetRef} className="snow-container"></div>
        <img src={imgUrl} alt="Holiday Banner" />
      </div>
    </div>
  );
};

export default HolidayBanner;
