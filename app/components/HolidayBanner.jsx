import React from 'react'
import Holidaybanner from '../assets/HolidayBanner.svg'
const HolidayBanner = () => {
  return (
    <div className='holiday-banner'>
       <div className="holiday-banner-image"> <img src={Holidaybanner} alt='holiday-banner' /></div>
    </div>
  )
}

export default HolidayBanner