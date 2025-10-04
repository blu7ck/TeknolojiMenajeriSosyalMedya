"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerHeight = 100; // Account for fixed header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { label: "Biz Kimiz?", href: "about" },
    { label: "Neler Yapıyoruz?", href: "services" },
    { label: "Bize Ulaşın!", href: "contact" },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? "py-4" : "py-6"
    }`}>
      <div className="container mx-auto px-4 md:px-6">
        <div
          className={`relative overflow-hidden rounded-3xl transition-all duration-500 ${
            isScrolled
              ? "bg-white/70 backdrop-blur-xl shadow-lg border border-white/20"
              : "bg-white/40 backdrop-blur-md border border-white/30"
          }`}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 animate-gradient pointer-events-none" />

          <nav className="relative flex items-center justify-between px-6 md:px-8 py-4">
            {/* Logo */}
            <a
              href="#"
              className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 hover:text-blue-600 transition-colors duration-300"
            >
              <span className="font-mono">Teknoloji</span>
              <span className="text-accent">Menajeri</span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(item.href)}
                  className="relative px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-all duration-300 group"
                >
                  <span className="relative z-10">{item.label}</span>
                  <span className="absolute inset-0 bg-blue-100/30 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                </button>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <button 
                onClick={() => scrollToSection("process")}
                className="relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <span className="relative z-10">Başlayalım</span>
                <span className="absolute inset-0 bg-accent/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200/50 bg-white/80 backdrop-blur-xl">
              <div className="px-6 py-4 space-y-3">
                {navItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSection(item.href)}
                    className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-blue-100/50 rounded-xl transition-all duration-300"
                  >
                    {item.label}
                  </button>
                ))}
                <button 
                  onClick={() => scrollToSection("process")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-medium"
                >
                  Başlayalım
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}