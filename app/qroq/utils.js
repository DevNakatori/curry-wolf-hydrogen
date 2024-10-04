export const getIntValue = (value) =>
  `coalesce(
    ${value}[_key == $language][0].value,
    ${value}[_key == $defaultLanguage][0].value,
  )`;
