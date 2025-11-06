import { Header } from "../components/Header"
import { processSteps } from "../data/packages"
import { setHomePageSEO } from "../lib/seo-utils"
import { Suspense, lazy, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { MarvelColumns } from "../components/MarvelColumns"
import Loader from "../components/Loader"

// Lazy load heavy components for better performance
const ProcessSection = lazy(() => import("../components/ProcessSection"))
const AboutUs = lazy(() => import("../components/AboutUs"))
const Services = lazy(() => import("../components/Services"))

export default function HomePage() {
  // SEO ayarlarını güncelle
  setHomePageSEO()

  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '')
      const element = document.getElementById(targetId)
      if (element) {
        const headerHeight = 100
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        })
      }
    }
  }, [location.hash])

  const socialLinks = [
    {
      href: "https://www.linkedin.com/company/teknoloji-menajeri",
      label: "LinkedIn",
      title: "Teknoloji Menajeri LinkedIn",
      icon: (
        <svg
          aria-hidden="true"
          className="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M22.225 0H1.771C.792 0 0 .771 0 1.723v20.555C0 23.23.792 24 1.771 24h20.451C23.2 24 24 23.23 24 22.278V1.723C24 .771 23.2 0 22.225 0zM7.336 20.452H3.777V9h3.559v11.452zM5.556 7.433c-1.139 0-2.062-.926-2.062-2.068 0-1.144.923-2.069 2.062-2.069 1.139 0 2.062.925 2.062 2.069 0 1.142-.923 2.068-2.062 2.068zM20.452 20.452h-3.555v-5.569c0-1.328-.025-3.036-1.849-3.036-1.849 0-2.132 1.445-2.132 2.939v5.666H9.361V9h3.414v1.561h.049c.476-.9 1.639-1.851 3.37-1.851 3.601 0 4.258 2.37 4.258 5.455v6.287z" />
        </svg>
      )
    },
    {
      href: "https://www.instagram.com/teknolojimenajeri",
      label: "Instagram",
      title: "Teknoloji Menajeri Instagram",
      icon: (
        <svg
          aria-hidden="true"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          viewBox="0 0 24 24"
        >
          <rect height="16" rx="4" width="16" x="4" y="4" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="18" cy="6" r="1.3" fill="currentColor" stroke="none" />
        </svg>
      )
    },
    {
      href: "https://x.com/teknomenajer",
      label: "X",
      title: "Teknoloji Menajeri X (Twitter)",
      icon: (
        <svg
          aria-hidden="true"
          className="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M3 3h3.3l5.47 7.56L17.25 3H21l-7.19 9.36L21.55 21h-3.3l-5.87-8.11L6.48 21H3.06l7.39-9.63L3 3z" />
        </svg>
      )
    }
  ]

  return (
    <>
      <Header />
      <div className="pt-0 bg-[#050505] text-[#E5E7EB]">
        {/* Marvel Columns Section */}
        <MarvelColumns />

        {/* About Us Section */}
        <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loader /></div>}>
          <AboutUs />
        </Suspense>

        {/* Services Section */}
        <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loader /></div>}>
          <Services />
        </Suspense>
        {/* Important Notes Section */}
        <section className="py-12 border-t border-red-500/15 bg-[#0E0F0F]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold uppercase tracking-[0.2em] text-red-400">Önemli Noktalar</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[{
                title: "Revizyon Hakkı",
                body: "Her içerik seti için 1 revizyon hakkı dahil",
                icon: "1"
              }, {
                title: "Telif Hakları",
                body: "Kullanım hakları net olarak tanımlanır",
                icon: "©"
              }, {
                title: "SLA Garantisi",
                body: "24-48 saat destek süresi",
                icon: "24"
              }, {
                title: "Ölçeklenebilirlik",
                body: "Paket genişletme imkanı",
                icon: "↗"
              }].map((item) => (
                <div key={item.title} className="rounded-xl border border-red-500/30 bg-black/75 p-6 text-center shadow-lg shadow-red-900/15 transition-transform duration-200 hover:-translate-y-1">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-500/90 text-sm font-bold text-white">
                    {item.icon}
                  </div>
                  <h4 className="mb-2 text-sm font-semibold text-[#F3F4F6] uppercase tracking-[0.18em]">{item.title}</h4>
                  <p className="text-xs text-[#9CA3AF]">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

         <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loader /></div>}>
           <ProcessSection steps={processSteps} />
         </Suspense>

        {/* Footer */}
        <footer className="relative overflow-hidden py-12 bg-gradient-to-b from-[#0B0C10]/85 via-[#050505]/95 to-[#050505] text-[#E5E7EB]">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -top-20 left-1/4 h-56 w-56 rounded-full bg-red-500/15 blur-[120px]" />
            <div className="absolute bottom-[-6rem] right-12 h-64 w-64 rounded-full bg-purple-500/15 blur-[130px]" />
          </div>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <img
                src="/favicon_black.png"
                alt="Teknoloji Menajeri Logo"
                className="h-24 w-auto drop-shadow-[0_8px_20px_rgba(255,60,60,0.25)]"
                width="96"
                height="96"
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget
                  img.style.display = 'none'
                  const textLogo = document.createElement('div')
                  textLogo.className = 'text-2xl font-bold text-red-500'
                  textLogo.textContent = 'TEKNOLOJİ MENAJERİ'
                  if (img.parentNode) {
                    img.parentNode.appendChild(textLogo)
                  }
                }}
              />
            </div>
            <div className="mb-6 flex justify-center">
              <div className="flex items-center gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-red-400 hover:text-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
                    aria-label={link.label}
                    title={link.title}
                  >
                    <span className="sr-only">{link.label}</span>
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
            <p className="mt-3 text-sm text-white/70">
              © 2025{' '}
              <a 
                href="https://www.teknolojimenajeri.com.tr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-red-300 transition-colors hover:text-red-200"
              >
                TEKNOLOJİ MENAJERİ
              </a>
              . Tüm hakları saklıdır.
            </p>
          </div>
        </footer>
      </div>

      <Link
        to="/gallery"
        className="group fixed bottom-6 right-5 z-50 flex items-center gap-3 rounded-full bg-gradient-to-r from-red-500 via-rose-500 to-amber-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white shadow-xl shadow-red-900/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
        aria-label="Galeri sayfasına git"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-sm">
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h1l.4-.8A1.5 1.5 0 0 1 9.3 3.5h5.4a1.5 1.5 0 0 1 1.4.9l.4.8h1A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5zm8 2.75A3.25 3.25 0 1 0 15.25 13.5 3.25 3.25 0 0 0 12 10.25Z" />
          </svg>
        </span>
        <span className="flex flex-col items-start leading-tight tracking-normal">
          <span className="text-[0.55rem] font-medium uppercase tracking-[0.42em] text-white/70">Teknoloji</span>
          <span className="text-base font-semibold uppercase tracking-[0.28em]">Galeri</span>
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white transition-all duration-300 group-hover:bg-white/25">
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </Link>
    </>
  )
}
