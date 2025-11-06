"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X } from "lucide-react"

export function Header() {
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
        behavior: "smooth",
      })
      setIsMobileMenuOpen(false)
    }
  }

  const isMarketingPage = location.pathname === "/marketingGlossary"
  const isHomePage = location.pathname === "/"
  const isBlogPage = location.pathname === "/blog"

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
                Ana Sayfa
              </Link>

              <Link
                to="/marketingGlossary"
                className={`mx-auto text-sm font-semibold tracking-[0.5em] transition-colors duration-300 ${
                  isMarketingPage ? "text-red-200" : "text-white hover:text-red-200"
                } clickable`}
                aria-current="page"
              >
                #KNOWLEDGE
              </Link>
            </div>

            <Link
              to="/blog"
              className={`inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.32em] transition-all duration-300 clickable ${
                isBlogPage ? "text-red-100" : "text-red-200 hover:border-red-500/50 hover:bg-red-500/25 hover:text-red-100"
              }`}
              aria-current={isBlogPage ? "page" : undefined}
            >
              Blog Yazıları
              <svg
                aria-hidden="true"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                viewBox="0 0 24 24"
              >
                <path d="m9 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </nav>
        </div>
      </header>
    )
  }

  const navItems = [
    { label: "Biz Kimiz?", type: "scroll" as const, target: "about" },
    { label: "Neler Yapıyoruz?", type: "scroll" as const, target: "services" },
    { label: "Pazarlama Sözlüğü", type: "route" as const, target: "/marketingGlossary" },
    { label: "Blog", type: "route" as const, target: "/blog" },
  ]

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

            <div className="hidden md:block">
              {isHomePage ? (
                <button
                  onClick={() => scrollToSection("process")}
                  className="relative overflow-hidden bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-2 font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg clickable"
                >
                  <span className="relative z-10">Başlayalım</span>
                </button>
              ) : (
                <Link
                  to="/"
                  className="relative overflow-hidden bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-2 font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg inline-block clickable"
                >
                  <span className="relative z-10">Ana Sayfa</span>
                </Link>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors clickable"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>

          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200/50 bg-white/80 backdrop-blur-xl">
              <div className="px-6 py-4 space-y-3">
                {!isBlogPage && navItems.map((item, index) => {
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
                    Başlayalım
                  </button>
                ) : (
                  <Link
                    to="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 font-medium text-center clickable"
                  >
                    Ana Sayfa
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
