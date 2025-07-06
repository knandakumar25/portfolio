import React, { useEffect, useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import '../assets/header.css';

// Define RTL languages outside component to avoid recreation
const RTL_LANGUAGES = [
  'ar',    // Arabic
  'he',    // Hebrew
  'iw',    // Hebrew (old code)
  'fa',    // Persian/Farsi
  'ur',    // Urdu
  'yi',    // Yiddish
  'ps',    // Pashto
  'sd',    // Sindhi
  'ug',    // Uyghur
  'ku',    // Kurdish
  'dv'     // Dhivehi/Maldivian
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [translateOpen, setTranslateOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Function to check if a language is RTL
  const isRTLLanguage = useCallback((langCode) => {
    return RTL_LANGUAGES.includes(langCode);
  }, []);

  // Function to apply RTL styling
  const applyRTLStyling = useCallback((isRTL) => {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    if (isRTL) {
      htmlElement.setAttribute('dir', 'rtl');
      htmlElement.style.direction = 'rtl';
      bodyElement.style.direction = 'rtl';
      
      // Add RTL class for additional styling
      htmlElement.classList.add('rtl-layout');
      bodyElement.classList.add('rtl-layout');
      
      // Add style tag to preserve center alignment for specific elements in RTL
      let rtlCenterStyle = document.getElementById('rtl-center-preserve-style');
      if (!rtlCenterStyle) {
        rtlCenterStyle = document.createElement('style');
        rtlCenterStyle.id = 'rtl-center-preserve-style';
        document.head.appendChild(rtlCenterStyle);
      }
      
      rtlCenterStyle.textContent = `
        /* Preserve center alignment for specific elements in RTL languages */
        .text-center, .center, .text-centered,
        .navbar-brand, .brand-text, .logo,
        h1.text-center, h2.text-center, h3.text-center,
        .hero-title, .section-title, .page-title,
        .card-title.text-center, .badge.text-center,
        [style*="text-align: center"], [style*="text-align:center"],
        .justify-content-center, .align-items-center {
          text-align: center !important;
          justify-content: center !important;
          align-items: center !important;
        }
        
        /* Keep centered elements centered in flexbox */
        .d-flex.justify-content-center {
          justify-content: center !important;
        }
        
        /* Preserve center alignment for common centered elements */
        .mx-auto {
          margin-left: auto !important;
          margin-right: auto !important;
        }
      `;
    } else {
      htmlElement.setAttribute('dir', 'ltr');
      htmlElement.style.direction = 'ltr';
      bodyElement.style.direction = 'ltr';
      
      // Remove RTL class
      htmlElement.classList.remove('rtl-layout');
      bodyElement.classList.remove('rtl-layout');
      
      // Remove the RTL center preservation style
      const rtlCenterStyle = document.getElementById('rtl-center-preserve-style');
      if (rtlCenterStyle) {
        rtlCenterStyle.remove();
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Google Translate Element Initialization
    const initGoogleTranslate = () => {
      // Remove any existing script
      const existingScript = document.querySelector('script[src*="translate.google.com"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Add the script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      
      // Define the callback function
      window.googleTranslateElementInit = function() {
        console.log('Google Translate initializing...');
        
        try {        
          window.googleTranslateInstance = new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL
          }, 'google_translate_element');
          
          console.log('Google Translate initialized successfully');
          
          // Override Google Translate banner functions
          if (window.google && window.google.translate && window.google.translate.TranslateElement) {
            // Override the banner display function
            const originalShowBanner = window.google.translate.TranslateElement.prototype.showBanner;
            if (originalShowBanner) {
              window.google.translate.TranslateElement.prototype.showBanner = function() {
                console.log('Google Translate banner display blocked');
                // Do nothing - this prevents the banner from showing
              };
            }
            
            // Override any other banner-related functions
            if (window.google.translate._createBanner) {
              window.google.translate._createBanner = function() {
                console.log('Google Translate banner creation blocked');
                return null;
              };
            }
          }
          
          // Wait for the element to be ready and extract languages
          setTimeout(() => {
            const selectElement = document.querySelector('#google_translate_element select');
            if (selectElement) {
              console.log('Google Translate select element found');
              
              // Extract available languages from Google's select element
              const googleLanguages = Array.from(selectElement.options)
                .filter(option => option.value && option.value !== '')
                .map(option => ({
                  code: option.value,
                  name: option.text
                }));
              
              // Always ensure English is available (since Google Translate doesn't include source language)
              const englishOption = { code: 'en', name: 'English' };
              const hasEnglish = googleLanguages.some(lang => lang.code === 'en');
              
              const finalLanguages = hasEnglish 
                ? googleLanguages 
                : [englishOption, ...googleLanguages];
              
              setAvailableLanguages(finalLanguages);
              console.log('Extracted languages from Google Translate:', finalLanguages);
              
              // Hide the default widget
              const widget = document.querySelector('#google_translate_element .goog-te-gadget');
              if (widget) {
                widget.style.display = 'none';
              }
            } else {
              console.warn('Google Translate select element not found');
            }
            
            // Aggressive banner hiding
            const bannerSelectors = [
              '.goog-te-banner-frame',
              '#goog-gt-tt',
              '.goog-te-balloon-frame',
              '.goog-te-ftab',
              '#goog-gt-banner',
              '.goog-te-spinner-pos',
              '.VIpgJd-ZVi9od-xl07Ob'
            ];
            
            bannerSelectors.forEach(selector => {
              const elements = document.querySelectorAll(selector);
              elements.forEach(element => {
                element.style.display = 'none';
                element.style.visibility = 'hidden';
                element.style.opacity = '0';
                element.style.height = '0';
                element.style.position = 'absolute';
                element.style.top = '-9999px';
                try {
                  element.remove();
                } catch (e) {}
              });
            });
            
          }, 1000);
          
        } catch (error) {
          console.error('Error initializing Google Translate:', error);
        }
      };

      script.onerror = () => {
        console.error('Failed to load Google Translate script');
      };

      document.head.appendChild(script);
    };

    // Initialize after a short delay
    const timer = setTimeout(initGoogleTranslate, 500);

    return () => {
      clearTimeout(timer);
      // Clean up
      const script = document.querySelector('script[src*="translate.google.com"]');
      if (script) {
        script.remove();
      }
      if (window.googleTranslateElementInit) {
        delete window.googleTranslateElementInit;
      }
    };
  }, []);

  useEffect(() => {
    // Add MutationObserver to catch Google Translate elements as they're added
    const suppressGoogleTranslateBanner = (element) => {
      if (element && element.nodeType === Node.ELEMENT_NODE) {
        // Check if it's a Google Translate banner element
        const isGoogleTranslateElement = 
          element.classList.contains('goog-te-banner-frame') ||
          element.classList.contains('goog-te-balloon-frame') ||
          element.classList.contains('goog-te-ftab') ||
          element.classList.contains('VIpgJd-ZVi9od-xl07Ob') ||
          element.id === 'goog-gt-tt' ||
          element.id === 'goog-gt-banner' ||
          element.classList.contains('goog-te-spinner-pos') ||
          (element.tagName === 'IFRAME' && element.src && (
            element.src.includes('translate.google') || 
            element.src.includes('translate.googleapis.com')
          )) ||
          (element.className && typeof element.className === 'string' && element.className.includes('goog-te-banner')) ||
          (element.id && element.id.includes('goog-gt'));
        
        if (isGoogleTranslateElement) {
          console.log('Detected and suppressing Google Translate banner element:', element);
          element.style.display = 'none';
          element.style.visibility = 'hidden';
          element.style.opacity = '0';
          element.style.height = '0';
          element.style.width = '0';
          element.style.position = 'absolute';
          element.style.top = '-9999px';
          element.style.left = '-9999px';
          element.style.zIndex = '-1';
          element.style.pointerEvents = 'none';
          
          // Try to remove it entirely
          setTimeout(() => {
            try {
              if (element.parentNode) {
                element.parentNode.removeChild(element);
              }
            } catch (e) {
              console.log('Could not remove element:', e);
            }
          }, 0);
        }
        
        // Check children recursively
        if (element.children) {
          Array.from(element.children).forEach(suppressGoogleTranslateBanner);
        }
      }
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            suppressGoogleTranslateBanner(node);
          });
        }
      });
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Initial cleanup
    setTimeout(() => {
      suppressGoogleTranslateBanner(document.body);
    }, 100);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    // Continuously check and remove Google Translate styling that interferes with header
    const interval = setInterval(() => {
      const body = document.body;
      const html = document.documentElement;
      
      // Remove top positioning from body and html
      if (body && body.style.top && body.style.top !== '0px') {
        body.style.top = '0';
        body.style.position = 'static';
      }
      
      if (html && html.style.top && html.style.top !== '0px') {
        html.style.top = '0';
        html.style.position = 'static';
      }
      
      // Remove margin-top that Google Translate sometimes adds
      if (body.style.marginTop) {
        body.style.marginTop = '0';
      }
      if (html.style.marginTop) {
        html.style.marginTop = '0';
      }
      
      // Remove any classes that Google Translate adds
      if (body.classList.contains('translated-ltr')) {
        body.style.marginTop = '0';
        body.style.top = '0';
        body.style.position = 'static';
      }
      if (body.classList.contains('translated-rtl')) {
        body.style.marginTop = '0';
        body.style.top = '0';
        body.style.position = 'static';
      }
      
      // Hide and remove Google Translate elements
      const googleBanners = [
        document.querySelector('.goog-te-banner-frame'),
        document.querySelector('#goog-gt-tt'),
        document.querySelector('.goog-te-balloon-frame'),
        document.querySelector('.goog-te-ftab'),
        document.querySelector('.goog-te-menu-frame'),
        document.querySelector('#goog-gt-banner'),
        document.querySelector('.goog-te-spinner-pos'),
        ...document.querySelectorAll('iframe[src*="translate.google"]'),
        ...document.querySelectorAll('iframe[src*="translate.googleapis.com"]'),
        ...document.querySelectorAll('.VIpgJd-ZVi9od-xl07Ob'),
        ...document.querySelectorAll('.goog-te-tooltip'),
        ...document.querySelectorAll('[class*="goog-te-banner"]'),
        ...document.querySelectorAll('[id*="goog-gt"]')
      ];
      
      googleBanners.forEach(banner => {
        if (banner) {
          banner.style.display = 'none';
          banner.style.visibility = 'hidden';
          banner.style.opacity = '0';
          banner.style.height = '0';
          banner.style.width = '0';
          banner.style.position = 'absolute';
          banner.style.top = '-9999px';
          banner.style.left = '-9999px';
          banner.style.zIndex = '-1';
          banner.style.pointerEvents = 'none';
          
          // Try to remove the element entirely
          try {
            if (banner.parentNode) {
              banner.parentNode.removeChild(banner);
            }
          } catch (e) {
            // Element might be protected, just hide it
          }
        }
      });
      
      // Check for any elements with Google Translate classes and hide them
      const googleElements = document.querySelectorAll('[class*="goog-te"]:not(#google_translate_element):not(#google_translate_element *), [id*="goog-"]:not(#google_translate_element), [class*="skiptranslate"]');
      googleElements.forEach(element => {
        if (element.id !== 'google_translate_element' && !element.closest('#google_translate_element')) {
          element.style.display = 'none';
          element.style.visibility = 'hidden';
          element.style.opacity = '0';
          element.style.height = '0';
          element.style.width = '0';
          element.style.position = 'absolute';
          element.style.top = '-9999px';
          element.style.left = '-9999px';
          element.style.zIndex = '-1';
          element.style.pointerEvents = 'none';
        }
      });
      
      // Force remove any iframes that might contain Google Translate banners
      const suspiciousIframes = document.querySelectorAll('iframe:not([src]):not([data-src])');
      suspiciousIframes.forEach(iframe => {
        if (iframe.contentWindow) {
          try {
            const iframeDoc = iframe.contentWindow.document;
            if (iframeDoc && (iframeDoc.body.innerText.includes('Translated by Google') || iframeDoc.body.innerText.includes('Show original'))) {
              iframe.style.display = 'none';
              iframe.remove();
            }
          } catch (e) {
            // Cross-origin iframe, can't access content
          }
        }
      });
      
    }, 50); // Check every 50ms for more aggressive suppression

    return () => clearInterval(interval);
  }, []);

  // Detect current language from Google Translate cookie on page load
  useEffect(() => {
    const detectCurrentLanguage = () => {
      const cookies = document.cookie.split(';');
      const googTransCookie = cookies.find(cookie => cookie.trim().startsWith('googtrans='));
      
      if (googTransCookie) {
        const cookieValue = googTransCookie.split('=')[1];
        // Cookie format is usually /en/[target_language]
        const match = cookieValue.match(/\/en\/([a-z-]+)/);
        if (match && match[1] && match[1] !== 'en') {
          console.log('Detected translated language from cookie:', match[1]);
          setCurrentLanguage(match[1]);
          
          // Apply RTL styling if the detected language is RTL
          applyRTLStyling(isRTLLanguage(match[1]));
        } else {
          // If translation is to English or invalid, set to English
          console.log('Translation detected as English or invalid, setting to English');
          setCurrentLanguage('en');
          applyRTLStyling(false);
        }
      } else {
        // No translation cookie found, set to English
        console.log('No translation cookie found, setting to English');
        setCurrentLanguage('en');
        applyRTLStyling(false);
      }
    };

    detectCurrentLanguage();
  }, [applyRTLStyling, isRTLLanguage]);

  // Monitor for Google Translate changes and reapply RTL styling
  useEffect(() => {
    const monitorTranslation = () => {
      let detectedLang = 'en'; // Default to English
      
      // Method 1: Check Google Translate cookie
      const cookies = document.cookie.split(';');
      const googTransCookie = cookies.find(cookie => cookie.trim().startsWith('googtrans='));
      
      if (googTransCookie) {
        const cookieValue = googTransCookie.split('=')[1];
        const match = cookieValue.match(/\/en\/([a-z-]+)/);
        if (match && match[1]) {
          detectedLang = match[1];
          console.log('Language detected from cookie:', detectedLang);
        }
      }
      
      // Method 2: Check Google Translate select element value
      const selectElement = document.querySelector('#google_translate_element select');
      if (selectElement && selectElement.value) {
        const selectLang = selectElement.value;
        if (selectLang !== '' && selectLang !== 'en|en') {
          detectedLang = selectLang;
          console.log('Language detected from select element:', detectedLang);
        }
      }
      
      // Update current language if it changed
      if (detectedLang !== currentLanguage) {
        console.log('Language change detected:', currentLanguage, '→', detectedLang);
        setCurrentLanguage(detectedLang);
        applyRTLStyling(isRTLLanguage(detectedLang));
      }
      
      // Also check if Google Translate has removed our attributes and reapply them
      const htmlElement = document.documentElement;
      const isCurrentlyRTL = isRTLLanguage(currentLanguage);
      const hasCorrectDir = htmlElement.getAttribute('dir') === (isCurrentlyRTL ? 'rtl' : 'ltr');
      
      if (!hasCorrectDir && currentLanguage !== 'en') {
        console.log('Reapplying RTL styling due to attribute removal');
        applyRTLStyling(isCurrentlyRTL);
      }
    };

    // Check every 500ms for translation changes
    const interval = setInterval(monitorTranslation, 500);
    return () => clearInterval(interval);
  }, [currentLanguage, applyRTLStyling, isRTLLanguage]);

  const translatePage = (langCode) => {
    console.log('=== TRANSLATE PAGE DEBUG ===');
    console.log('Attempting to translate to:', langCode);
    console.log('Is RTL language?', isRTLLanguage(langCode));
    console.log('RTL_LANGUAGES array:', RTL_LANGUAGES);
    console.log('langCode type:', typeof langCode);
    console.log('=== END DEBUG ===');
    
    // Apply RTL styling before translation
    applyRTLStyling(isRTLLanguage(langCode));
    
    if (langCode === 'en') {
      // Reset to English - clear translation and apply LTR styling
      applyRTLStyling(false);
      translatePageWithCookie('en');
      return;
    }
    
    // Use Google Translate's native method by changing the select value
    const selectElement = document.querySelector('#google_translate_element select');
    if (selectElement) {
      selectElement.value = langCode;
      selectElement.dispatchEvent(new Event('change', { bubbles: true }));
      setCurrentLanguage(langCode);
      setTranslateOpen(false);
      setSearchTerm('');
    } else {
      // Fallback to cookie method
      translatePageWithCookie(langCode);
    }
  };

  // Alternative translation method using cookies (Google Translate's method)
  const translatePageWithCookie = (langCode) => {
    console.log('Using cookie-based translation method for:', langCode);
    
    // Apply RTL styling before setting cookie
    applyRTLStyling(isRTLLanguage(langCode));
    
    // Set Google Translate cookie
    const cookieName = 'googtrans';
    const cookieValue = langCode === 'en' ? '/en/en' : `/en/${langCode}`;
    
    // Clear any existing translation cookies first
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
    
    // Set new translation cookie
    document.cookie = `${cookieName}=${cookieValue}; path=/; domain=${window.location.hostname}`;
    document.cookie = `${cookieName}=${cookieValue}; path=/`;
    
    console.log('Set translation cookie:', cookieValue);
    
    // Update UI state before reload
    setCurrentLanguage(langCode);
    setTranslateOpen(false);
    setSearchTerm('');
    
    // Reload the page to apply translation
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const getCurrentLanguage = () => {
    return availableLanguages.find(lang => lang.code === currentLanguage) || 
           { code: 'en', name: 'English' };
  };

  const filteredLanguages = availableLanguages.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (translateOpen && !event.target.closest('.custom-translate-dropdown')) {
        setTranslateOpen(false);
        setSearchTerm(''); // Clear search when dropdown closes
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [translateOpen]);

  return (
    <nav className={`modern-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <NavLink className="navbar-brand" to="/">
          <span className="brand-text">Karthik Nandakumar</span>
          <div className="brand-underline"></div>
        </NavLink>
        
        <button 
          className="mobile-toggle" 
          type="button" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
        </button>
        
        <div className={`navbar-collapse ${mobileMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                to="/"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="nav-text">Home</span>
                <div className="nav-indicator"></div>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                to="/experiences"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="nav-text">Experiences</span>
                <div className="nav-indicator"></div>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                to="/projects"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="nav-text">Projects</span>
                <div className="nav-indicator"></div>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                to="/certifications"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="nav-text">Certifications</span>
                <div className="nav-indicator"></div>
              </NavLink>
            </li>
          </ul>
          
          <div className="navbar-utilities">
            <div className="custom-translate-dropdown">
              <button 
                className="translate-button"
                onClick={() => setTranslateOpen(!translateOpen)}
                aria-label="Select Language"
              >
                <span className="current-lang-text">{getCurrentLanguage().name}</span>
                <span className={`dropdown-arrow ${translateOpen ? 'open' : ''}`}>▼</span>
              </button>
              
              {translateOpen && (
                <div className="translate-dropdown">
                  <div className="translate-search">
                    <input
                      type="text"
                      placeholder="Search languages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="language-search-input"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="translate-options-container">
                    {filteredLanguages.map((language) => (
                      <button
                        key={language.code}
                        className={`translate-option ${currentLanguage === language.code ? 'active' : ''}`}
                        onClick={() => translatePage(language.code)}
                      >
                        <span className="lang-name">{language.name}</span>
                      </button>
                    ))}
                    {filteredLanguages.length === 0 && (
                      <div className="no-languages-found">
                        No languages found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Google Translate Element - Visible but styled to be hidden */}
            <div id="google_translate_element" style={{ 
              opacity: 0,
              height: 0,
              overflow: 'hidden',
              pointerEvents: 'none'
            }}></div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
