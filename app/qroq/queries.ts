import {q, z} from 'groqd';

import {FOOTERS_FRAGMENT} from './footers';
import {
  ANNOUCEMENT_BAR_ARRAY_FRAGMENT,
  COLOR_SCHEME_FRAGMENT,
  FONT_FRAGMENT,
  IMAGE_FRAGMENT,
  MENU_FRAGMENT,
  SETTINGS_FRAGMENT,
} from './fragments';
import {
  COLLECTION_SECTIONS_FRAGMENT,
  PRODUCT_SECTIONS_FRAGMENT,
  SECTIONS_FRAGMENT,
} from './sections';
import {THEME_CONTENT_FRAGMENT} from './themeContent';
import {getIntValue} from './utils';

/*
|--------------------------------------------------------------------------
| Template Queries
|--------------------------------------------------------------------------
*/
export const DEFAULT_PRODUCT_TEMPLATE = q('*')
  .filter("_type == 'productTemplate' && default == true")
  .grab({
    _type: q.literal('productTemplate'),
    name: q.string().nullable(),
    sections: PRODUCT_SECTIONS_FRAGMENT,
  })
  .slice(0)
  .nullable();

export const DEFAULT_COLLECTION_TEMPLATE = q('*')
  .filter("_type == 'collectionTemplate' && default == true")
  .grab({
    _type: q.literal('collectionTemplate'),
    name: q.string().nullable(),
    sections: COLLECTION_SECTIONS_FRAGMENT,
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
        // thumbnail: q('thumbnail').grab(IMAGE_FRAGMENT).nullable(),
      })
      .nullable(),

    // Homepage Second Section
    homepageSecondSection: q('homepageSecondSection')
      .grab({
        title: q.string().nullable(),
        description: q.string().nullable(),
        buttonText: q.string().nullable(),
        buttonLink: q.string().nullable(),
      })
      .nullable(),

    // // Homepage Third Section
    // homepageThirdSection: q('homepageThirdSection')
    //   .grab({
    //     title: q.string().nullable(),
    //     images: q
    //       .array(
    //         q.object({
    //           image: q('image').grab(IMAGE_FRAGMENT).nullable(),
    //         }),
    //       )
    //       .nullable(), // Allow array of images to be nullable
    //     buttonText: q.string().nullable(),
    //     buttonLink: q.string().nullable(),
    //   })
    //   .nullable(), // Allow homepageThirdSection to be nullable

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
| Product Query
|--------------------------------------------------------------------------
*/
export const PRODUCT_QUERY = q('').grab({
  _type: ['"product"', q.literal('product')],
  defaultProductTemplate: DEFAULT_PRODUCT_TEMPLATE,
  product: q('*')
    .filter(`_type == "product" && store.slug.current == $productHandle`)
    .grab({
      store: q('store').grab({
        gid: q.string(),
      }),
      template: q('template').deref().grab({
        sections: PRODUCT_SECTIONS_FRAGMENT,
      }),
    })
    .slice(0)
    .nullable(),
});

/*
|--------------------------------------------------------------------------
| Collection Query
|--------------------------------------------------------------------------
*/
export const COLLECTION_QUERY = q('').grab({
  _type: ['"collection"', q.literal('collection')],
  collection: q('*')
    .filter(`_type == "collection" && store.slug.current == $collectionHandle`)
    .grab({
      store: q('store').grab({
        gid: q.string(),
      }),
      template: q('template').deref().grab({
        sections: COLLECTION_SECTIONS_FRAGMENT,
      }),
    })
    .slice(0)
    .nullable(),
  defaultCollectionTemplate: DEFAULT_COLLECTION_TEMPLATE,
});

/*
|--------------------------------------------------------------------------
| CMS Settings Queries
|--------------------------------------------------------------------------
*/
export const FONTS_QUERY = q('*')
  .filter("_type == 'typography'")
  .grab({
    body: q('body').grab(FONT_FRAGMENT),
    extra: q('extra').grab(FONT_FRAGMENT),
    heading: q('heading').grab(FONT_FRAGMENT),
  })
  .order('_createdAt asc')
  .slice(0)
  .nullable();

export const DEFAULT_COLOR_SCHEME_QUERY = q('*')
  .filter("_type == 'colorScheme' && default == true")
  .grab(COLOR_SCHEME_FRAGMENT)
  .slice(0)
  .nullable();

export const SETTINGS_QUERY = q('*')
  .filter("_type == 'settings'")
  .grab(SETTINGS_FRAGMENT)
  .slice(0)
  .nullable();

export const HEADER_QUERY = q('*')
  .filter("_type == 'header'")
  .grab({
    annoucementBar: ANNOUCEMENT_BAR_ARRAY_FRAGMENT,
    annoucementBarColorScheme: q('annoucementBarColorScheme')
      .deref()
      .grab(COLOR_SCHEME_FRAGMENT),
    autoRotateAnnoucements: q.boolean().nullable(),
    blur: q.boolean().nullable(),
    colorScheme: q('colorScheme').deref().grab(COLOR_SCHEME_FRAGMENT),
    desktopLogoWidth: q.number().nullable(),
    menu: MENU_FRAGMENT,
    padding: q
      .object({
        bottom: q.number().nullable(),
        top: q.number().nullable(),
      })
      .nullable(),
    showSeparatorLine: q.boolean().nullable(),
    sticky: z.enum(['none', 'always', 'onScrollUp']).nullable(),
  })
  .slice(0)
  .nullable();

export const FOOTER_QUERY = q('*')
  .filter("_type == 'footer'")
  .grab({
    footer: FOOTERS_FRAGMENT,
    sections: SECTIONS_FRAGMENT,
  })
  .slice(0)
  .nullable();

export const THEME_CONTENT_QUERY = q('*')
  .filter("_type == 'themeContent'")
  .grab(THEME_CONTENT_FRAGMENT)
  .slice(0)
  .nullable();

export const ROOT_QUERY = q('')
  .grab({
    _type: ['"root"', q.literal('root')],
    defaultColorScheme: DEFAULT_COLOR_SCHEME_QUERY,
    fonts: FONTS_QUERY,
    footer: FOOTER_QUERY,
    header: HEADER_QUERY,
    settings: SETTINGS_QUERY,
    themeContent: THEME_CONTENT_QUERY,
  })
  .nullable();
