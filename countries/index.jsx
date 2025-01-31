 import  GermanyFlag  from "../app/assets/flag/germany-flag.webp";
 import  UkFlag  from "../app/assets/flag/united-kingdom-flag.webp";
 import  NetherlandsFlag  from "../app/assets/flag/the-netherlands-flag.webp";
 import  ChinaFlag  from "../app/assets/flag/china-flag.webp";


/* eslint perfectionist/sort-objects: 0 */
export const countries = {
  default: {
    country: 'FR',
    currency: 'EUR',
    isoCode: 'de-de',
    label: 'Germany (EUR €)',
    language: 'DE',
    languageLabel: 'German',
    salesChannel: 'hydrogen',
    flag: GermanyFlag
  },
  '/en': {
    country: 'US',
    currency: 'USD',
    isoCode: 'en-us',
    label: 'United States (USD $)',
    language: 'EN',
    languageLabel: 'English',
    salesChannel: 'hydrogen',
    flag: UkFlag
  },
  '/nl': {
    country: 'NL',
    currency: 'EUR',
    isoCode: 'nl-nl',
    label: 'Dutch (EUR €)',
    language: 'NL',
    languageLabel: 'Dutch',
    salesChannel: 'hydrogen',
    flag: NetherlandsFlag
  },
  '/zh': {
  country: 'CN',
  currency: 'USD',
  isoCode: 'zh-CN', // Corrected ISO code for Chinese
  label: 'Chinese (USD $)',
  language: 'ZH', // Shopify's LanguageCode
  languageLabel: 'Chinese',
  salesChannel: 'hydrogen',
  flag: ChinaFlag,
},
};

export const DEFAULT_LOCALE = Object.freeze({
  ...countries.default,
  pathPrefix: '',
  default: true,
});

export function getAllLanguages() {
  const uniqueLanguages = [];
  const seenLanguages = new Set();

  for (const key in countries) {
    const language = countries[key].language;
    // Remove duplicates to avoid having same language multiple times
    if (!seenLanguages.has(language)) {
      uniqueLanguages.push({
        id: language.toLocaleLowerCase(),
        title: countries[key].languageLabel,
        flag: countries[key].flag,
        label: language
      });
      seenLanguages.add(language);
    }
  }

  return uniqueLanguages;
}

export function getLocaleFromRequest(request) {
  const url = new URL(request.url);
  const firstPathPart =
    '/' + url.pathname.substring(1).split('/')[0].toLowerCase();

  return countries[firstPathPart]
    ? {
        ...countries[firstPathPart],
        pathPrefix: firstPathPart,
        default: false,
      }
    : {
        ...countries['default'],
        pathPrefix: '',
        default: true,
      };
}

export function getAllLocales() {
  return Object.keys(countries).map((key) => {
    if (key === 'default') {
      return {
        ...countries[key],
        pathPrefix: '',
        default: true,
      };
    }

    return {
      ...countries[key],
      pathPrefix: key,
      default: false,
    };
  });
}

export function getAllCountries() {
  return Object.keys(countries).map((key) => {
    return countries[key].country;
  });
}
