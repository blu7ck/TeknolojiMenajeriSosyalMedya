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

  const navItems = [
    { label: "Biz Kimiz?", href: "about", type: "scroll" },
    { label: "Neler Yapıyoruz?", href: "services", type: "scroll" },
    { label: "Blog", href: "/blog", type: "link" },
  ]

  // Blog sayfasında sadece logo ve ana sayfa butonunu göster
  const isBlogPage = location.pathname === "/blog"

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

            {/* Desktop Navigation - Blog sayfasında gizle */}
            {!isBlogPage && (
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item, index) =>
                  item.type === "link" ? (
                    <Link
                      key={index}
                      to={item.href}
                      className="relative px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-all duration-300 group clickable"
                    >
                      <span className="relative z-10">{item.label}</span>
                      <span className="absolute inset-0 bg-blue-100/30 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                    </Link>
                  ) : (
                    <button
                      key={index}
                      onClick={() => scrollToSection(item.href)}
                      className="relative px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-all duration-300 group clickable"
                    >
                      <span className="relative z-10">{item.label}</span>
                      <span className="absolute inset-0 bg-blue-100/30 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                    </button>
                  ),
                )}
              </div>
            )}

            {/* CTA Button */}
            <div className="hidden md:block">
              {location.pathname === "/" ? (
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors clickable"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200/50 bg-white/80 backdrop-blur-xl">
              <div className="px-6 py-4 space-y-3">
                {/* Blog sayfasında navigation gizle */}
                {!isBlogPage && navItems.map((item, index) =>
                  item.type === "link" ? (
                    <Link
                      key={index}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-blue-100/50 rounded-xl transition-all duration-300 clickable"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      key={index}
                      onClick={() => scrollToSection(item.href)}
                      className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-blue-100/50 rounded-xl transition-all duration-300 clickable"
                    >
                      {item.label}
                    </button>
                  ),
                )}
                {location.pathname === "/" ? (
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
