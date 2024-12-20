import React, { useState, useEffect } from 'react';
import { getImageUrl } from '~/lib/utils';

const BadgeCertified = ({badgeCertified}) => {
  const [showBadge, setShowBadge] = useState(true);
    const imgUrl = getImageUrl(badgeCertified?.asset?._ref);
    useEffect(() => {
      const handleScroll = () => {
        const currentScrollPos =
          window.pageYOffset || document.documentElement.scrollTop;
        if (currentScrollPos > 100) {
          setShowBadge(false); 
        } else {
          setShowBadge(true);
        }
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);
  return (
    <div className={`badge-certified ${showBadge ? 'visible' : 'hidden'}`}>
        <div className="badge-certified-warp"><img src={imgUrl} alt="badge-certified" /></div>
    </div>
  )
}
export default BadgeCertified