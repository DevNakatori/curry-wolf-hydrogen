import {MdArrowDropDown} from 'react-icons/md';
import {IoEarthOutline} from 'react-icons/io5';
import {IoMdCloseCircleOutline} from 'react-icons/io';
import {AnimatePresence, motion} from 'framer-motion';
import '../styles/LanguageSwitcherButton.css';
import Languages from './Languages';
import {useLocation} from '@remix-run/react';
import {getAllLanguages, getAllLocales} from 'countries/index';

const langMenu = {
  open: {
    width: '140px',
    height: '170px',
    top: '-11px',
    right: '-4px',
    zIndex: 9,
    transition: {duration: 0.75, type: 'tween', ease: [0.76, 0, 0.24, 1]},
  },
  closed: {
    width: '0',
    height: '0',
    top: '0px',
    right: '0px',
    zIndex: 9,
    transition: {
      duration: 0.75,
      delay: 0.35,
      type: 'tween',
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

export default function LanguageSwitcherButton({
  isActive,
  toggleMenu,
  setIsActive,
  selectedValue,
  setSelectedValue,
}) {
  const countries = getAllLanguages();
  const defaultCountry = countries.map((country) => country.id);
  const languageObject = Object.fromEntries(
    defaultCountry.map((lang) => [lang, lang]),
  );
  const defaultLabel = 'De';
  const location = useLocation();
  const pathname = location?.pathname;

  // Determine the language label based on the pathname
  const languagePrefix = Object.keys(languageObject).find((lang) =>
    pathname.startsWith(`/${lang}`),
  );

  const label = languageObject[languagePrefix] || defaultLabel;

  return (
    <div className="LanguageSwitcherButton">
      <motion.div
        className="lang-menu"
        variants={langMenu}
        animate={isActive ? 'open' : 'closed'}
        initial="closed"
      >
        <AnimatePresence>
          {isActive && (
            <Languages
              setSelectedValue={setSelectedValue}
              setIsActive={setIsActive}
              isActive={isActive}
            />
          )}
        </AnimatePresence>
      </motion.div>
      <motion.div
        className="LanguageSwitcherButton_slider"
        transition={{duration: 0.5, type: 'tween', ease: [0.76, 0, 0.24, 1]}}
      >
        <div
          className="LanguageSwitcherButton_el"
          onClick={() => {
            toggleMenu();
          }}
        >
          <PerspectiveText
            label={label}
            className={'lang'}
            Icon={<MdArrowDropDown className='arrow' size={25} />}
          />
        </div>
      </motion.div>
    </div>
  );
}

<PerspectiveText className="close" label="Close" />;
function PerspectiveText({label, Icon, isActive, className}) {
  return (
    <div className={`${className} perspectiveText`}>
      <p>
        {label}
        <span>{Icon}</span>
      </p>
      <p>
        {className === 'lang' && (
          <span>
            <IoEarthOutline size={25} />
          </span>
        )}
        {Icon}
      </p>
    </div>
  );
}
