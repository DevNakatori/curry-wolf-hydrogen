
import {motion} from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation ,} from '@remix-run/react';
import { getAllLanguages, getAllLocales } from 'countries/index';
const perspective = {
  initial: {
    opacity: 0,
    rotateX: 90,
    translateY: 30,
    translateX: -10,
  },
  enter: (i) => ({
    opacity: 1,
    rotateX: 0,
    translateY: 0,
    translateX: 0,
    transition: {
      duration: 0.65,
      delay: 0.5 + i * 0.1,
      ease: [0.215, 0.61, 0.355, 1],
      opacity: {duration: 0.35},
    },
  }),
  exit: {
    opacity: 0,
    transition: {duration: 0.5, type: 'linear', ease: [0.76, 0, 0.24, 1]},
  },
};
export default function Languages({isActive,setIsActive  , setSelectedValue}) {
  const languages = getAllLanguages();
  const location = useLocation();
  const supportedLanguages = languages?.map((lang) => lang.id)
  const defaultLang = getAllLocales().find((lang) => lang.default);
  const defaultLanguage =defaultLang.language.toLocaleLowerCase(); 
  
  useEffect(() => {
    const currentLang = supportedLanguages.find((lang) => location.pathname.startsWith(`/${lang}`)) || defaultLanguage;
    setSelectedValue(currentLang);
  }, [location.pathname]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      const targetElement = event.target;
      if (!targetElement.closest(".LanguageSwitcher")) {
        setIsActive(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (event) => {
    const newValue = event.currentTarget.getAttribute('data-value');
    setSelectedValue(newValue);
    setIsActive(false);
  
    const currentLang = supportedLanguages.find((lang) => location.pathname.startsWith(`/${lang}`));
    let newPath;
  
    if (newValue !== currentLang) {
      // Remove the current language prefix if it exists
      const pathWithoutLang = currentLang
        ? location.pathname.replace(`/${currentLang}`, '')
        : location.pathname;
  
      // Add the new language prefix if it's not the default
      newPath = newValue === defaultLanguage ? pathWithoutLang : `/${newValue}${pathWithoutLang}`;
    } else {
      newPath = location.pathname; // No change
    }
  
    window.location.href = newPath || '/';
  };
  
  return (
    <div className="">
      <ul  className="langWarp">
          {languages.map((lang, i) => {
            const {title, flag , id} = lang;
            return (
                <motion.li
                key={`b_${i}`}
                custom={i}
                variants={perspective}
                initial="initial"
                animate="enter"
                exit="exit"
                data-value={id}
                onClick={handleLanguageChange}
              >
                { <img src={flag} alt={title} />} {title}
              </motion.li>
            );
          })}

      </ul>
    </div>
  );
}
