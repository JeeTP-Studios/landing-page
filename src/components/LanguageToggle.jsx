import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import './LanguageToggle.css'

const LanguageToggle = () => {
  const { currentLanguage, switchLanguage, languages } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageSwitch = (langCode) => {
    switchLanguage(langCode)
    setIsOpen(false)
  }

  const currentLang = languages.find(lang => lang.code === currentLanguage)

  return (
    <div className="language-toggle">
      <button 
        className="language-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change language"
      >
        <span className="language-flag">{currentLang?.flag}</span>
        <span className="language-code">{currentLanguage.toUpperCase()}</span>
        <svg 
          className={`chevron ${isOpen ? 'open' : ''}`}
          width="12" 
          height="12" 
          viewBox="0 0 12 12" 
          fill="currentColor"
        >
          <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      </button>
      
      {isOpen && (
        <>
          <div className="language-backdrop" onClick={() => setIsOpen(false)} />
          <div className="language-dropdown">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`language-option ${lang.code === currentLanguage ? 'active' : ''}`}
                onClick={() => handleLanguageSwitch(lang.code)}
              >
                <span className="option-flag">{lang.flag}</span>
                <span className="option-name">{lang.name}</span>
                {lang.code === currentLanguage && (
                  <svg className="check-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default LanguageToggle