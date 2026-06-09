import React, { createContext, useContext, useState, useEffect } from 'react';

const TranslationContext = createContext(null);

export const TranslationProvider = ({ children }) => {
  const [browserLang, setBrowserLang] = useState('en');

  useEffect(() => {
    // Detect browser language
    const detectBrowserLanguage = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const queryLang = urlParams.get('lang');
      if (queryLang) {
        setBrowserLang(queryLang);
        return;
      }

      const navLang = navigator.language || (navigator.languages && navigator.languages[0]);
      if (navLang) {
        setBrowserLang(navLang);
      }
    };

    detectBrowserLanguage();
  }, []);

  return (
    <TranslationContext.Provider value={{ browserLang }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
