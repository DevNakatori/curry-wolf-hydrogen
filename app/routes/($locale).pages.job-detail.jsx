// import {json} from '@shopify/remix-oxygen';
// import {useLoaderData} from '@remix-run/react';
// import '../styles/job-detail.css';
// /**
//  * @type {MetaFunction<typeof loader>}
//  */
// export const meta = ({data}) => {
//   return [
//     {title: `Curry Wolf | ${data?.page.title ?? ''}`},
//     {name: 'description', content: data.page.seo.description},
//     {
//       tagName: 'link',
//       rel: 'canonical',
//       href: data.canonicalUrl,
//     },
//   ];
// };

// /**
//  * @param {LoaderFunctionArgs}
//  */
// export async function loader({params, request, context}) {
//   const canonicalUrl = request.url;
//   const handle = params.handle || 'job-detail';
//   const {page} = await context.storefront.query(PAGE_QUERY, {
//     variables: {
//       handle: handle,
//     },
//   });

//   if (!page) {
//     throw new Response('Not Found', {status: 404});
//   }

//   return json({page, canonicalUrl});
// }

// export default function Page() {
//   /** @type {LoaderReturnData} */
//   const {page} = useLoaderData();

//   return (
//     <div className="page job-detail-main">
//       <main dangerouslySetInnerHTML={{__html: page.body}} />
//     </div>
//   );
// }

// const PAGE_QUERY = `#graphql
//   query Page(
//     $language: LanguageCode,
//     $country: CountryCode,
//     $handle: String!
//   )
//   @inContext(language: $language, country: $country) {
//     page(handle: $handle) {
//       id
//       title
//       body
//       seo {
//         description
//         title
//       }
//     }
//   }
// `;

// /** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
// /** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
// /** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
