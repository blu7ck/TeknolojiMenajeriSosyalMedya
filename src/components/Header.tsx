"use client"

import { useEffect, useMemo, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { useTranslation } from "react-i18next"

const languages = [
  { code: "tr", labelKey: "language.turkish", shortKey: "language.short" },
  { code: "en", labelKey: "language.english", shortKey: "language.short" }
] as const

export function Header() {
  const { t, i18n } = useTranslation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const headerHeight = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
      setIsMobileMenuOpen(false)
    }
  }

  const isMarketingPage = location.pathname === "/marketingGlossary"
  const isHomePage = location.pathname === "/"
  const isBlogPage = location.pathname === "/blog"

  const navItems = useMemo(
    () => [
      { label: t("header.nav.about"), type: "scroll" as const, target: "about" },
      { label: t("header.nav.services"), type: "scroll" as const, target: "services" },
      { label: t("header.nav.glossary"), type: "route" as const, target: "/marketingGlossary" }
    ],
    [t]
  )

  const renderLanguageSwitcher = (variant: "light" | "dark" = "light") => (
    <div className="flex items-center gap-2">
      {languages.map(({ code, labelKey }) => {
        const isActive = i18n.language === code || (code === "tr" && i18n.language.startsWith("tr"))
        return (
          <button
            key={code}
            onClick={() => void i18n.changeLanguage(code)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              variant === "dark"
                ? isActive
                  ? "bg-white text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
                : isActive
                  ? "bg-black text-white"
                  : "bg-black/5 text-gray-700 hover:bg-black/10"
            }`}
            aria-pressed={isActive}
          >
            {t(labelKey)}
          </button>
        )
      })}
    </div>
  )

  if (isMarketingPage) {
    return (
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "py-3" : "py-4"}`}>
        <div className="container mx-auto px-4 md:px-6">
          <nav
            className={`relative flex items-center justify-between rounded-full border border-white/15 bg-white/5 px-5 py-3 backdrop-blur-xl transition-all duration-500 ${
              isScrolled ? "shadow-lg shadow-red-900/15" : "shadow-sm shadow-red-900/10"
            }`}
          >
            <div className="flex flex-1 items-center gap-3">
              <Link
                to="/"
                className={`inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.32em] transition-all duration-300 clickable ${
                  isHomePage ? "text-white" : "text-white/80 hover:border-white/30 hover:bg-white/10 hover:text-white"
                }`}
              >
                <svg
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  viewBox="0 0 24 24"
                >
                  <path d="m15 19-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t("header.home")}
              </Link>

              <Link
                to="/marketingGlossary"
                className={`mx-auto text-sm font-semibold tracking-[0.5em] transition-colors duration-300 ${
                  isMarketingPage ? "text-red-200" : "text-white hover:text-red-200"
                } clickable`}
                aria-current="page"
              >
                {t("header.marketingGlossary")}
              </Link>
            </div>

            <div className="flex items-center gap-3">{renderLanguageSwitcher("dark")}</div>
          </nav>
        </div>
      </header>
    )
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "py-2" : "py-2"}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div
          className={`relative overflow-hidden rounded-3xl transition-all duration-500 ${
            isScrolled
              ? "bg-white/70 backdrop-blur-xl shadow-lg border border-white/20"
              : "bg-white/40 backdrop-blur-md border border-white/30"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 animate-gradient pointer-events-none" />

          <nav className="relative flex items-center justify-between px-6 md:px-8 py-4">
            <Link
              to="/"
              className="flex items-center gap-3 text-xl md:text-2xl font-bold tracking-tight text-gray-900 hover:text-blue-600 transition-colors duration-300 clickable"
            >
              <img
                src="/favicon.png"
                alt="Teknoloji Menajeri"
                className="w-10 h-10 md:w-12 md:h-12 object-contain"
                width="48"
                height="48"
                loading="eager"
              />
              <span className="text-gray-800">#SosyalMedyaAjansı</span>
            </Link>

            {!isBlogPage && (
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item, index) => {
                  if (item.type === "route") {
                    return (
                      <Link
                        key={index}
                        to={item.target}
                        className="relative px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-all duration-300 group clickable"
                      >
                        <span className="relative z-10">{item.label}</span>
                        <span className="absolute inset-0 bg-blue-100/30 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                      </Link>
                    )
                  }

                  return isHomePage ? (
                    <button
                      key={index}
                      onClick={() => scrollToSection(item.target)}
                      className="relative px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-all duration-300 group clickable"
                    >
                      <span className="relative z-10">{item.label}</span>
                      <span className="absolute inset-0 bg-blue-100/30 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                    </button>
                  ) : (
                    <Link
                      key={index}
                      to={{ pathname: "/", hash: `#${item.target}` }}
                      className="relative px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-all duration-300 group clickable"
                    >
                      <span className="relative z-10">{item.label}</span>
                      <span className="absolute inset-0 bg-blue-100/30 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                    </Link>
                  )
                })}
              </div>
            )}

            <div className="hidden md:flex items-center gap-3">
              {renderLanguageSwitcher("light")}
              {isHomePage ? (
                <button
                  onClick={() => scrollToSection("process")}
                  className="relative overflow-hidden bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-2 font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg clickable"
                >
                  <span className="relative z-10">{t("header.cta.start")}</span>
                </button>
              ) : (
                <Link
                  to="/"
                  className="relative overflow-hidden bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-2 font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg inline-block clickable"
                >
                  <span className="relative z-10">{t("header.cta.home")}</span>
                </Link>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors clickable"
              aria-label={t("header.mobileToggle")}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>

          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200/50 bg-white/80 backdrop-blur-xl">
              <div className="px-6 py-4 space-y-3">
                <div className="flex justify-end">{renderLanguageSwitcher("light")}</div>
                {!isBlogPage &&
                  navItems.map((item, index) => {
                    if (item.type === "route") {
                      return (
                        <Link
                          key={index}
                          to={item.target}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-blue-100/50 rounded-xl transition-all duration-300 clickable"
                        >
                          {item.label}
                        </Link>
                      )
                    }

                    if (isHomePage) {
                      return (
                        <button
                          key={index}
                          onClick={() => scrollToSection(item.target)}
                          className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-blue-100/50 rounded-xl transition-all duration-300 clickable"
                        >
                          {item.label}
                        </button>
                      )
                    }

                    return (
                      <Link
                        key={index}
                        to={{ pathname: "/", hash: `#${item.target}` }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-blue-100/50 rounded-xl transition-all duration-300 clickable"
                      >
                        {item.label}
                      </Link>
                    )
                  })}
                {isHomePage ? (
                  <button
                    onClick={() => scrollToSection("process")}
                    className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 font-medium clickable"
                  >
                    {t("header.cta.start")}
                  </button>
                ) : (
                  <Link
                    to="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 font-medium text-center clickable"
                  >
                    {t("header.cta.home")}
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
