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

/*
|--------------------------------------------------------------------------
| catering Page Query
|--------------------------------------------------------------------------
*/
export const CATERING_PAGE_QUERY = q('*')
  .filter(`_type == "catering" && language == $language`)
  .grab({
    _type: q.literal('page').or(q.literal('catering')),
    title: q.string().nullable(),
    heroTitle: q.string().nullable(),
    ctaButtontext: q.string().nullable(),
    link: q.string().nullable(),
    image: q('image').grab(IMAGE_FRAGMENT).nullable(),
    Description: q.string().nullable(),
    cateringPageImages: q.array(
      q.object({
        image: q('image').grab(IMAGE_FRAGMENT).nullable(),
        title: q.string().nullable(),
        link: q.string().nullable(),
      }),
    ),
    Referenzen: q.object({
      title: q.string().nullable(),
      ReferenzenContent: q.array(
        q.object({
          description: q.string().nullable(),
          title: q.string().nullable(),
        }),
      ),
    }),
    Rating: q.object({
      title: q.string().nullable(),
      number: q.string().nullable(),
      image: q
        .array(
          q.object({
            image: q('image').grab(IMAGE_FRAGMENT).nullable(),
          }),
        )
        .nullable(),
    }),
    Accordions: q.object({
      title: q.string().nullable(),
      ctaButtontext: q.string().nullable(),
      link: q.string().nullable(),
      accordion: q.array(
        q.object({
          title: q.string().nullable(),
          description: q.string().nullable(),
        }),
      ),
    }),
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

export const CATERING_INNER_PAGE_QUERY = q('*')
  .filter(`(slug == $handle && language == $language)`)
  .grab({
    _type: q.literal('page').or(q.literal('cateringInnerPage')),
    title: q.string().nullable(),
    heroTitle: q.string().nullable(),
    ctaButtontext: q.string().nullable(),
    link: q.string().nullable(),
    image: q('image').grab(IMAGE_FRAGMENT).nullable(),
    Description: q.string().nullable(),
    Brandenburger: q.object({
      title: q.string().nullable(),
      description: q.string().nullable(),
    }),
    cateringPageImages: q.array(
      q.object({
        image: q('image').grab(IMAGE_FRAGMENT).nullable(),
        title: q.string().nullable(),
        link: q.string().nullable(),
      }),
    ),
    Referenzen: q.object({
      title: q.string().nullable(),
      ReferenzenContent: q.array(
        q.object({
          description: q.string().nullable(),
          title: q.string().nullable(),
        }),
      ),
    }),
    Rating: q.object({
      title: q.string().nullable(),
      number: q.string().nullable(),
      image: q
        .array(
          q.object({
            image: q('image').grab(IMAGE_FRAGMENT).nullable(),
          }),
        )
        .nullable(),
    }),
    ImagesSection: q.object({
      cateringPageImages: q.array(
        q.object({
          image: q('image').grab(IMAGE_FRAGMENT).nullable(),
          title: q.string().nullable(),
          link: q.string().nullable(),
        }),
      ),
      buttons: q.array(
        q.object({
          buttonText: q.string().nullable(),
          buttonLink: q.string().nullable(),
        }),
      ),
    }),
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
  .slice(0)
  .nullable();
/*
|--------------------------------------------------------------------------
| Our Story Page Query
|--------------------------------------------------------------------------
*/
export const OUR_STORY_PAGE_QUERY = q('*')
  .filter(`_type == "ourStory" && language == $language`)
  .grab({
    _type: q.literal('page').or(q.literal('ourStory')),
    title: q.string().nullable(),
    subtitle: q.string().nullable(),
    sectionFirst: q.object({
      cards: q.array(
        q.object({
          title: q.string().nullable(),
          image: q('image').grab(IMAGE_FRAGMENT).nullable(),
          description: q.string().nullable(),
        }),
      ),
    }),
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
| Our Currywurst Page Query
|--------------------------------------------------------------------------
*/
export const OUR_CURRYWURST_PAGE_QUERY = q('*')
  .filter(`_type == "ourCurrywurst" && language == $language`)
  .grab({
    _type: q.literal('page').or(q.literal('ourCurrywurst')),
    title: q.string().nullable(),
    subtitle: q.string().nullable(),
    sectionFirst: q.object({
      image: q('image').grab(IMAGE_FRAGMENT).nullable(),
    }),
    sectionSecond: q.object({
      title: q.string().nullable(),
    }),
    sectionThird: q.object({
      cards: q.array(
        q.object({
          title: q.string().nullable(),
          image: q('image').grab(IMAGE_FRAGMENT).nullable(),
          description: q.string().nullable(),
        }),
      ),
    }),
    sectionFourth: q.object({
      title: q.string().nullable(),
    }),
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
|  Catering CTA Form Page Query
|--------------------------------------------------------------------------
*/
export const CATERING_CTA_FORM_PAGE_QUERY = q('*')
  .filter(`_type == "cateringCTAForm" && language == $language`)
  .grab({
    _type: q.literal('page').or(q.literal('cateringCTAForm')),
    title: q.string().nullable(),
    sectionFirst: q.object({
      title: q.string().nullable(),
      buttonText: q.string().nullable(),
      buttonLink: q.string().nullable(),
      image: q('image').grab(IMAGE_FRAGMENT).nullable(),
    }),
    sectionSecond: q.object({}).nullable(),
    sectionThird: q.object({
      title: q.string().nullable(),
    }),
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
|  Contact Page Query
|--------------------------------------------------------------------------
*/
export const CONTACT_PAGE_QUERY = q('*')
  .filter(`_type == "contact" && language == $language`)
  .grab({
    _type: q.literal('page').or(q.literal('contact')),
    title: q.string().nullable(),
    sectionFirst: q
      .object({
        title: q.string().nullable(),
        image: q('image').grab(IMAGE_FRAGMENT).nullable(),
      })
      .nullable(),
    sectionSecond: q.object({}).nullable(),
    sectionThird: q.object({}).nullable(),
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

export const ROOT_QUERY = q('')
  .grab({
    _type: ['"root"', q.literal('root')],
    footer: FOOTER_QUERY,
    header: HEADER_QUERY,
  })
  .nullable();
