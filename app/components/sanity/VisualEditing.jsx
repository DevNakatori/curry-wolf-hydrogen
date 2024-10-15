// import {
//   useFetcher,
//   useLocation,
//   useNavigate,
//   useSearchParams,
// } from '@remix-run/react';
// import React, {useCallback, useEffect, lazy, Suspense} from 'react';

// import {useIsInIframe} from '../../hooks/useIsInIframe';
// import {useSanityClient} from '../../hooks/useSanityClient';
// import {useRootLoaderData} from '../../root';
// import {useLiveMode} from '@sanity/react-loader';

// // Lazy load the SanityVisualEditing component
// const SanityVisualEditing = lazy(() =>
//   import('@sanity/visual-editing/remix').then((module) => ({
//     default: module.VisualEditing,
//   })),
// );

// export function VisualEditing() {
//   const isInIframe = useIsInIframe();
//   const client = useSanityClient();
//   // Enable live queries
//   useLiveMode({client});

//   return !isInIframe ? (
//     <>
//       <Suspense fallback={<div>Loading...</div>}>
//         <SanityVisualEditing />
//       </Suspense>
//       <ExitBanner />
//     </>
//   ) : (
//     <Suspense fallback={<div>Loading...</div>}>
//       <SanityVisualEditing />
//     </Suspense>
//   );
// }

// function ExitBanner() {
//   const fetcher = useFetcher({key: 'exit-sanity-preview'});
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const reload = searchParams.get('reload') === 'true';
//   const {env} = useRootLoaderData();
//   const isDev = env.NODE_ENV === 'development';

//   // Reload page to reset sanity loaders and enable preview mode
//   const handleReloadPage = useCallback(() => {
//     searchParams.delete('reload');
//     setSearchParams(searchParams);
//     if (isDev) {
//       setTimeout(() => {
//         navigate(0);
//       }, 1000);
//     }
//   }, [navigate, searchParams, isDev, setSearchParams]);

//   useEffect(() => {
//     if (!reload) return;
//     handleReloadPage();
//   }, [reload, handleReloadPage]);

//   return (
//     <section className="">
//       <div className="container py-6">
//         <fetcher.Form action="/sanity/preview" method="POST">
//           <input name="slug" type="hidden" value={location.pathname} />
//           <div className="flex items-center justify-center gap-6"></div>
//         </fetcher.Form>
//       </div>
//     </section>
//   );
// }
