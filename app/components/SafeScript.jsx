import {useEffect, useState} from 'react';

function SafeScript({nonce}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <>
      <script
        async
        data-nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1092539505646208');
              fbq('track', 'PageView');
            `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{display: 'none'}}
          src="https://www.facebook.com/tr?id=1092539505646208&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
    </>
  );
}

export default SafeScript;
