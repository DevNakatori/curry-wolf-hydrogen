import {Link} from '@remix-run/react';
import React from 'react';

const FaqBtn = ({to, ButtonText}) => {
  return (
    <div className="faq-btn">
      <Link
        // onClick={() => handleClick(e)}
        to={to}
        className="yellow-border-btn"
      >
        {ButtonText}
      </Link>
    </div>
  );
};

export default FaqBtn;
