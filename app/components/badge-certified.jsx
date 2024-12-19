import React from 'react'
import { getImageUrl } from '~/lib/utils';

const BadgeCertified = ({badgeCertified}) => {
    const imgUrl = getImageUrl(badgeCertified?.asset?._ref);
  return (
    <div className='badge-certified'>
        <div className="badge-certified-warp"><img src={imgUrl} alt="badge-certified" /></div>
    </div>
  )
}

export default BadgeCertified