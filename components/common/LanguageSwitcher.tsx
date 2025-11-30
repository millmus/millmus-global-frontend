import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'

interface Language {
  code: string
  name: string
}

const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
]

export default function LanguageSwitcher() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLanguage = languages.find(lang => lang.code === router.locale) || languages[0]

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleLanguageChange = (langCode: string) => {
    const { pathname, asPath, query } = router
    router.push({ pathname, query }, asPath, { locale: langCode })
    setIsOpen(false)

    // 쿠키에 언어 설정 저장
    document.cookie = `NEXT_LOCALE=${langCode};path=/;max-age=31536000`
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-[#3e4247] transition-colors"
        aria-label="언어 선택"
      >
        <span className="text-xs font-semibold text-gray-400">{currentLanguage.code.toUpperCase()}</span>
        <span className="text-sm font-medium">{currentLanguage.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-300 bg-[#3e4247] shadow-lg z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-[#171718] transition-colors first:rounded-t-lg last:rounded-b-lg ${
                lang.code === router.locale ? 'bg-[#171718] text-blue-600' : ''
              }`}
            >
              <span className="text-xs font-semibold text-gray-400 min-w-[24px]">{lang.code.toUpperCase()}</span>
              <span className="text-sm font-medium">{lang.name}</span>
              {lang.code === router.locale && (
                <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
