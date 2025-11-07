import { Header } from "../components/Header"
import { setHomePageSEO } from "../lib/seo-utils"
import { Suspense, lazy, useEffect, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { MarvelColumns } from "../components/MarvelColumns"
import Loader from "../components/Loader"
import styled from "styled-components"
import { useTranslation } from "react-i18next"

// Lazy load heavy components for better performance
const ProcessSection = lazy(() => import("../components/ProcessSection"))
const AboutUs = lazy(() => import("../components/AboutUs"))
const Services = lazy(() => import("../components/Services"))

export default function HomePage() {
  const location = useLocation()
  const { t } = useTranslation()
  const [showFloatingButtons, setShowFloatingButtons] = useState(false)
  const floatingButtonsSentinelRef = useRef<HTMLDivElement | null>(null)
  const importantNotes = t("home.importantNotes.items", { returnObjects: true }) as Array<{
    icon: string
    title: string
    body: string
  }>

  useEffect(() => {
    setHomePageSEO()
  }, [])

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
          className="social-icon"
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
          className="social-icon"
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
          className="social-icon"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M3 3h3.3l5.47 7.56L17.25 3H21l-7.19 9.36L21.55 21h-3.3l-5.87-8.11L6.48 21H3.06l7.39-9.63L3 3z" />
        </svg>
      )
    }
  ]

  const blogButtonCopy = t("home.blogButton", { returnObjects: true }) as { label: string; aria: string }
  const galleryButtonLabel = `${t("home.galleryCta.taglineTop")} ${t("home.galleryCta.taglineMain")}`

  useEffect(() => {
    const sentinel = floatingButtonsSentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowFloatingButtons(true)
        } else {
          const isAboveViewport = entry.boundingClientRect.top < 0
          setShowFloatingButtons(isAboveViewport)
        }
      },
      { threshold: 0, rootMargin: "0px 0px -40%" }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <PageBackground>
        <div className="relative isolate overflow-hidden">
          <div className="pointer-events-none absolute -left-28 top-[-22rem] h-[40rem] w-[40rem] rounded-full bg-rose-200/50 blur-[140px]" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-32 bottom-[-18rem] h-[36rem] w-[36rem] rounded-full bg-sky-200/55 blur-[160px]" aria-hidden="true" />
          <Header />
          <div className="relative pt-0 text-slate-800">
            {/* Marvel Columns Section */}
            <MarvelColumns />
            <div ref={floatingButtonsSentinelRef} className="h-1" aria-hidden="true" />

            {/* About Us Section */}
            <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loader /></div>}>
              <AboutUs />
            </Suspense>

            {/* Services Section */}
            <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loader /></div>}>
              <Services />
            </Suspense>
            {/* Important Notes Section */}
            <section className="py-20 border-t border-rose-100/70">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold uppercase tracking-[0.2em] text-rose-500">
                    {t("home.importantNotes.title")}
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {importantNotes.map((item) => (
                    <div key={item.title} className="rounded-2xl border border-rose-200/70 bg-white/80 p-6 text-center shadow-xl shadow-rose-200/40 backdrop-blur transition-transform duration-200 hover:-translate-y-1 hover:shadow-rose-200/60">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-amber-300 text-sm font-bold text-white shadow-md">
                        {item.icon}
                      </div>
                      <h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-800">{item.title}</h4>
                      <p className="text-xs text-slate-600">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loader /></div>}>
              <ProcessSection />
            </Suspense>

            {/* Footer */}
            <footer className="relative overflow-hidden py-16">
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-rose-200/40 blur-[140px]" />
                <div className="absolute bottom-[-8rem] right-12 h-72 w-72 rounded-full bg-sky-200/45 blur-[150px]" />
              </div>
              <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Logo */}
                <div className="mb-6 flex justify-center">
                  <img
                    src="/favicon_black.png"
                    alt="Teknoloji Menajeri Logo"
                    className="h-24 w-auto drop-shadow-[0_12px_30px_rgba(244,114,182,0.25)]"
                    width="96"
                    height="96"
                    loading="lazy"
                    onError={(e) => {
                      const img = e.currentTarget
                      img.style.display = 'none'
                      const textLogo = document.createElement('div')
                      textLogo.className = 'text-2xl font-bold text-rose-500'
                      textLogo.textContent = 'TEKNOLOJİ MENAJERİ'
                      if (img.parentNode) {
                        img.parentNode.appendChild(textLogo)
                      }
                    }}
                  />
                </div>
                <StyledFooterSocial className="mb-6">
                  <div className="social-button" role="group" aria-label="Teknoloji Menajeri sosyal medya bağlantıları">
                    <span>{t("home.footer.socialLabel")}</span>
                    <div className="social-icons">
                      {socialLinks.map((link, index) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={link.label}
                          title={link.title}
                          style={{ transitionDelay: `${0.45 + index * 0.2}s` }}
                        >
                          <span className="sr-only">{link.label}</span>
                          {link.icon}
                        </a>
                      ))}
                    </div>
                  </div>
                </StyledFooterSocial>
                <p className="mt-3 text-sm text-slate-600">
                  © 2025{" "}
                  <a
                    href="https://www.teknolojimenajeri.com.tr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-rose-500 transition-colors hover:text-rose-400"
                  >
                    TEKNOLOJİ MENAJERİ
                  </a>
                  . {t("home.footer.legal")}
                </p>
              </div>
            </footer>
          </div>
        </div>
      </PageBackground>

      <FloatingButtonsWrapper>
        <BlogButton
          to="/blog"
          aria-label={blogButtonCopy.aria}
          $visible={showFloatingButtons}
        >
          {blogButtonCopy.label}
        </BlogButton>
        <GalleryButton
          to="/gallery"
          aria-label="Galeri sayfasına git"
          $visible={showFloatingButtons}
          data-glitch={galleryButtonLabel}
        >
          {galleryButtonLabel}
        </GalleryButton>
      </FloatingButtonsWrapper>
    </>
  )
}

const PageBackground = styled.div`
  min-height: 100vh;
  background:
    radial-gradient(1200px at 10% 20%, rgba(255, 241, 242, 0.85), transparent 60%),
    radial-gradient(1000px at 90% 30%, rgba(240, 249, 255, 0.9), transparent 70%),
    linear-gradient(135deg, #fef9f5 0%, #f5f3ff 45%, #f0f9ff 100%);
  color: #0f172a;
  position: relative;
  isolation: isolate;
`

const StyledFooterSocial = styled.div`
  display: flex;
  justify-content: center;

  .social-button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: pointer;
    width: 220px;
    height: 60px;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.85);
    border: none;
    padding: 0 90px;
    box-shadow: 0 20px 45px rgba(244, 114, 182, 0.15);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .social-button:hover {
    transform: scale(1.05);
    box-shadow: 0 28px 55px rgba(244, 114, 182, 0.25);
  }

  .social-button span {
    position: absolute;
    z-index: 2;
    width: 100%;
    height: 100%;
    border-radius: 9999px;
    font-family: "Courier New", Courier, monospace;
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.24em;
    color: #fff7ed;
    background: linear-gradient(135deg, rgba(244, 114, 182, 0.95), rgba(251, 191, 36, 0.85));
    display: grid;
    place-items: center;
    transition: opacity 1s ease;
    pointer-events: none;
  }

  .social-icons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border-radius: 9999px;
  }

  .social-icons a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    color: #fb7185;
    background: rgba(255, 255, 255, 0.75);
    opacity: 0;
    transform: translateY(14px);
    transition: opacity 0.55s ease, transform 0.55s ease, background-color 0.35s ease, color 0.35s ease;
    pointer-events: none;
  }

  .social-icons a:hover,
  .social-icons a:focus-visible {
    background: rgba(244, 114, 182, 0.12);
    color: #db2777;
    outline: none;
  }

  .social-icons a:focus-visible {
    box-shadow: 0 0 0 3px rgba(244, 114, 182, 0.35);
  }

  .social-button:hover span {
    opacity: 0;
  }

  .social-button:hover .social-icons a {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .social-button:focus-within span {
    opacity: 0;
  }

  .social-button:focus-within .social-icons a {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .social-icons a .social-icon {
    width: 28px;
    height: 28px;
    transition: transform 0.25s ease, color 0.25s ease;
  }

  .social-icons a:hover .social-icon,
  .social-icons a:focus-visible .social-icon {
    transform: scale(1.1);
    color: currentColor;
  }

  @media (max-width: 480px) {
    .social-button {
      width: 190px;
      height: 54px;
      padding: 0 70px;
    }

    .social-button span {
      letter-spacing: 0.18em;
      font-size: 0.8rem;
    }

    .social-icons a {
      width: 44px;
      height: 44px;
    }

    .social-icons a .social-icon {
      width: 24px;
      height: 24px;
    }
  }
`

const FloatingButtonsWrapper = styled.div`
  position: fixed;
  bottom: 1.5rem;
  left: 1.25rem;
  right: 1.25rem;
  z-index: 50;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`

const BlogButton = styled(Link)<{ $visible: boolean }>`
  position: relative;
  display: inline-block;
  padding: 0.6em 1em;
  border: 4px solid #fa725a;
  background-color: transparent;
  color: #fa725a;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  line-height: 1;
  box-shadow: 0 12px 28px rgba(250, 114, 90, 0.25);
  transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease-in-out, color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
  transform: ${({ $visible }) => ($visible ? "translateX(0)" : "translateX(-140%)")};

  &:hover {
    transform: ${({ $visible }) =>
      $visible ? "translateX(0) scale(1.2) rotate(10deg)" : "translateX(-140%)"};
    background-color: #fa725a;
    color: #ffffff;
    box-shadow: 0 16px 36px rgba(250, 114, 90, 0.35);
  }

  &:focus-visible {
    outline: 2px solid rgba(250, 114, 90, 0.85);
    outline-offset: 4px;
    transform: ${({ $visible }) => ($visible ? "translateX(0) scale(1.05)" : "translateX(-140%)")};
  }
`

const GalleryButton = styled(Link)<{ $visible: boolean }>`
  position: relative;
  display: inline-block;
  line-height: 1;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  text-decoration: none;
  color: #ffffff;
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
  transform: ${({ $visible }) => ($visible ? "translateX(0)" : "translateX(140%)")};
  transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;

  &,
  &::after {
    padding: 16px 24px;
    background: linear-gradient(45deg, transparent 5%, #ff2e63 5%);
    border: 0;
    box-shadow: 6px 0px 0px rgba(59, 130, 246, 0.85);
  }

  &::after {
    --slice-0: inset(50% 50% 50% 50%);
    --slice-1: inset(80% -6px 0 0);
    --slice-2: inset(50% -6px 30% 0);
    --slice-3: inset(10% -6px 85% 0);
    --slice-4: inset(40% -6px 43% 0);
    --slice-5: inset(80% -6px 5% 0);
    content: attr(data-glitch);
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      transparent 3%,
      rgba(56, 189, 248, 0.95) 3%,
      rgba(56, 189, 248, 0.95) 5%,
      #ff2e63 5%
    );
    text-shadow: -3px -3px 0px rgba(253, 224, 71, 0.9), 3px 3px 0px rgba(56, 189, 248, 0.9);
    clip-path: var(--slice-0);
    transform: translate(0);
  }

  &:hover::after,
  &:focus-visible::after {
    animation: gallery-glitch 1s steps(2, end);
  }

  &:hover {
    color: #ffffff;
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
    transform: ${({ $visible }) => ($visible ? "translateX(0)" : "translateX(140%)")};
  }

  @keyframes gallery-glitch {
    0% {
      clip-path: var(--slice-1);
      transform: translate(-20px, -10px);
    }
    10% {
      clip-path: var(--slice-3);
      transform: translate(10px, 10px);
    }
    20% {
      clip-path: var(--slice-1);
      transform: translate(-10px, 10px);
    }
    30% {
      clip-path: var(--slice-3);
      transform: translate(0px, 5px);
    }
    40% {
      clip-path: var(--slice-2);
      transform: translate(-5px, 0px);
    }
    50% {
      clip-path: var(--slice-3);
      transform: translate(5px, 0px);
    }
    60% {
      clip-path: var(--slice-4);
      transform: translate(5px, 10px);
    }
    70% {
      clip-path: var(--slice-2);
      transform: translate(-10px, 10px);
    }
    80% {
      clip-path: var(--slice-5);
      transform: translate(20px, -10px);
    }
    90% {
      clip-path: var(--slice-1);
      transform: translate(-10px, 0px);
    }
    100% {
      clip-path: var(--slice-0);
      transform: translate(0);
    }
  }
`
