import React, { createContext, useContext, useState, useEffect } from 'react'
import { languages, defaultLanguage } from '../locales'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Try to get language from localStorage, fallback to default
    const saved = localStorage.getItem('jeetp-language')
    return saved && languages[saved] ? saved : defaultLanguage
  })

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem('jeetp-language', currentLanguage)
  }, [currentLanguage])

  const switchLanguage = (langCode) => {
    if (languages[langCode]) {
      setCurrentLanguage(langCode)
    }
  }

  const t = (path) => {
    const keys = path.split('.')
    let value = languages[currentLanguage].data
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key]
      } else {
        // Fallback to English if path doesn't exist
        value = languages[defaultLanguage].data
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey]
          } else {
            return path // Return the path if translation is missing
          }
        }
        break
      }
    }
    
    return value
  }

  const value = {
    currentLanguage,
    switchLanguage,
    t,
    languages: Object.keys(languages).map(code => ({
      code,
      name: languages[code].name,
      flag: languages[code].flag
    }))
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}