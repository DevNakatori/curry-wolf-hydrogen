/* eslint perfectionist/sort-objects: 0 */

export const countries = {
  default: {
    country: 'FR',
    currency: 'EUR',
    isoCode: 'de-de',
    label: 'Germany (EUR €)',
    language: 'DE',
    languageLabel: 'Deutsch',
    salesChannel: 'hydrogen',
  },
  '/en': {
    country: 'US',
    currency: 'USD',
    isoCode: 'en-us',
    label: 'United States (USD $)',
    language: 'EN',
    languageLabel: 'English',
    salesChannel: 'hydrogen',
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
