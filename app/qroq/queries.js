import {q, z} from 'groqd';
import {
  ANNOUCEMENT_BAR_ARRAY_FRAGMENT,
  COLOR_SCHEME_FRAGMENT,
  FONT_FRAGMENT,
  IMAGE_FRAGMENT,
  LOCATION_MENU_FRAGMENT,
  MENU_FRAGMENT,
  SETTINGS_FRAGMENT,
} from './fragments.js';
import {THEME_CONTENT_FRAGMENT} from './themeContent';
import {getIntValue} from './utils';
import {LINKS_LIST_SELECTION} from './links';

export const HEADER_QUERY = q('*')
  .filter(`(_type == "header" &&  language == $language)`)
  .grab({
    logo: q('headerlogo').grab(IMAGE_FRAGMENT).nullable(),
    menu: MENU_FRAGMENT.nullable(),
  })
  .slice(0)
  .nullable();

/*
|--------------------------------------------------------------------------
| Footer Query
|--------------------------------------------------------------------------
*/

export const FOOTER_QUERY = q('*')
  .filter(`_type == "footer" && language == $language`)
  .grab({
    logo: q('footerlogo').grab(IMAGE_FRAGMENT).nullable(),
    footerLink: q('FooterLink').grab({
      title: q('title').nullable(),
      menu: MENU_FRAGMENT,
    }),
    footerAddress: q('FooterAddress')
      .grab({
        title: q.string().nullable(),
        phoneNumber: q.string().nullable(),
        faxNumber: q.string().nullable(),
        email: q.string().nullable(),
        address: q.string().nullable(),
      })
      .nullable(),
    footerSocialLinks: q('socialLinks')
      .grab({
        title: q.string().nullable(),
        socialLinks: q
          .array(
            q.object({
              platform: q.string().nullable(),
              url: q.string().nullable(),
            }),
          )
          .nullable(),
      })
      .nullable(),
    FooterRightLogo: q('imageRight').grab(IMAGE_FRAGMENT).nullable(),

    language: q.string().nullable(),
  })
  .slice(0)
  .nullable();

/*
|--------------------------------------------------------------------------
| Page Query
|--------------------------------------------------------------------------
*/
export const PAGE_QUERY = q('*')
  .filter(
    `(
      _type == "page" &&
      ($handle != "home" && slug.current == $handle && language == $language)
    ) || (
      _type == "home" &&
      $handle == "home" && language == $language
    )`,
  )
  .grab({
    _type: q.literal('page').or(q.literal('home')),

    // Video section
    video: q('video')
      .grab({
        videoFile: q('videoFile')
          .grab({
            asset: q('asset')
              .grab({
                url: q.string().nullable(), // Fetch the URL from the asset
              })
              .nullable(), // Allow asset to be nullable
          })
          .nullable(), // Allow videoFile to be nullable
        title: q.string().nullable(),
        caption: q.string().nullable(),
      })
      .nullable(),

    // Homepage Second Section
    homepageSecondSections: q('homepageSecondSections')
      .grab({
        cards: q
          .array(
            q.object({
              image: q('image').grab(IMAGE_FRAGMENT).nullable(),
              title: q.string().nullable(),
              description: q.string().nullable(),
              buttonText: q.string().nullable(),
              buttonLink: q.string().nullable(),
            }),
          )
          .nullable(), // Allow cards array to be nullable
      })
      .nullable(),
    // Homepage Third Section
    homepageThirdSection: q('homepageThirdSection')
      .grab({
        title: q.string().nullable(),
        images: q
          .array(
            q.object({
              image: q('image').grab(IMAGE_FRAGMENT).nullable(),
            }),
          )
          .nullable(), // Allow images array to be nullable
        buttonText: q.string().nullable(),
        buttonLink: q.string().nullable(), // Ensure buttonLink is defined as a string
      })
      .nullable(),

    // SEO section
    seo: q('seo')
      .grab({
        title: q.string().nullable(),
        description: q.string().nullable(),
        image: q('image').nullable(),
      })
      .nullable(), // Allow SEO section to be nullable

    // Include language field
    language: q('language').nullable(),
  })
  .slice(0) // Use slice(0) to ensure you get all results without pagination
  .nullable(); // Allow entire query result to be nullable
/*
|--------------------------------------------------------------------------
| Location Page Query
|--------------------------------------------------------------------------
*/
export const LOCATION_PAGE_QUERY = q('*')
  .filter(`_type == "locations" && language == $language`)
  .grab({
    _type: q.literal('page').or(q.literal('locations')),
    title: q.string().nullable(),
    imagesLabels: LOCATION_MENU_FRAGMENT,
    // Homepage Second Section
    locationSecondSection: q('locationSecondSectionType')
      .grab({
        cards: q
          .array(
            q.object({
              image: q('image').grab(IMAGE_FRAGMENT).nullable(),
              title: q.string().nullable(),
              description: q.string().nullable(),
              buttonText: q.string().nullable(),
              buttonLink: q.string().nullable(),
            }),
          )
          .nullable(), // Allow cards array to be nullable
      })
      .nullable(),
    // location Third Section
    locationThirdSection: q('locationThirdSection')
      .grab({
        title: q.string().nullable(),
        images: q
          .array(
            q.object({
              image: q('image').grab(IMAGE_FRAGMENT).nullable(),
            }),
          )
          .nullable(), // Allow images array to be nullable
        buttonText: q.string().nullable(),
        buttonLink: q.string().nullable(), // Ensure buttonLink is defined as a string
      })
      .nullable(),
    // SEO section
    seo: q('seo')
      .grab({
        title: q.string().nullable(),
        description: q.string().nullable(),
        image: q('image').nullable(),
      })
      .nullable(), // Allow SEO section to be nullable

    // Include language field
    language: q('language').nullable(),
  })
  .slice(0) // Use slice(0) to ensure you get all results without pagination
  .nullable(); // Allow entire query result to be nullable
/*
|--------------------------------------------------------------------------
| Location inner Page Query
|--------------------------------------------------------------------------
*/
export const LOCATION_INNER_PAGE_QUERY = q('*')
  .filter(`(slug == $handle && language == $language)`)
  .grab({
    _type: q.literal('page').or(q.literal('locationInnerPage')),
    title: q.string().nullable(),
    Subtitle: q.string().nullable(),
    // Video section
    video: q('video')
      .grab({
        videoFile: q('videoFile')
          .grab({
            asset: q('asset')
              .grab({
                url: q.string().nullable(), // Fetch the URL from the asset
              })
              .nullable(), // Allow asset to be nullable
          })
          .nullable(), // Allow videoFile to be nullable
        title: q.string().nullable(),
        caption: q.string().nullable(),
      })
      .nullable(),
    // Page Background Top Images
    imagesTop: q
      .array(
        q.object({
          image: q('image').grab(IMAGE_FRAGMENT).nullable(),
        }),
      )
      .nullable(),
    imagesBottom: q
      .array(
        q.object({
          image: q('image').grab(IMAGE_FRAGMENT).nullable(),
        }),
      )
      .nullable(),
    openingTimes: q
      .object({
        title: q.string().nullable(),
        OpeningTimes: q
          .array(
            q.object({
              day: q.string().nullable(),
              time: q.string().nullable(),
            }),
          )
          .nullable(),
      })
      .nullable(),
    paymentMethods: q.object({
      title: q.string().nullable(),
      PaymentMethodsImages: q.array(
        q.object({
          image: q('image').grab(IMAGE_FRAGMENT).nullable(),
        }),
      ),
    }),
    route: q.object({
      buttonText: q.string().nullable(),
      buttonLink: q.string().nullable(),
    }),
    locationMenu: q.object({
      title: q.string().nullable(),
      MenuImage: q('image').grab(IMAGE_FRAGMENT).nullable(),
    }),
    seo: q('seo')
      .grab({
        title: q.string().nullable(),
        description: q.string().nullable(),
        image: q('image').nullable(),
      })
      .nullable(),
    language: q('language').nullable(),
  })
  .slice(0)
  .nullable();

export const ROOT_QUERY = q('')
  .grab({
    _type: ['"root"', q.literal('root')],
    footer: FOOTER_QUERY,
    header: HEADER_QUERY,
  })
  .nullable();
