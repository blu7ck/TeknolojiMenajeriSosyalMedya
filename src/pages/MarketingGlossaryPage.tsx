import { useEffect } from "react"
import { Link } from "react-router-dom"
import { Header } from "../components/Header"
import { MarketingGlossary } from "../components/MarketingGlossary"
import { setMarketingGlossarySEO } from "../lib/seo-utils"

export default function MarketingGlossaryPage() {
  useEffect(() => {
    setMarketingGlossarySEO()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  return (
    <div className="min-h-screen bg-[#050505] text-[#E5E7EB]">
      <Header />
      <main className="relative isolate overflow-hidden py-28">
        <div className="pointer-events-none absolute -left-36 top-[-18rem] h-[32rem] w-[32rem] rounded-full bg-red-500/15 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 bottom-[-14rem] h-[28rem] w-[28rem] rounded-full bg-purple-500/15 blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/10 shadow-[0_35px_120px_rgba(10,10,25,0.55)] backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <div className="absolute -top-24 right-12 h-60 w-60 rounded-full bg-red-500/20 blur-[140px]" />
              <div className="absolute bottom-[-8rem] left-16 h-72 w-72 rounded-full bg-purple-500/15 blur-[150px]" />
              <div className="absolute top-1/3 left-1/2 h-40 w-96 -translate-x-1/2 rounded-full bg-white/5 blur-[160px]" />
            </div>

            <div className="relative px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
              <section className="space-y-8 text-center" aria-labelledby="glossary-companion-insights">
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.38em] text-red-200">Sözlük Rehberi</p>
                  <h2 id="glossary-companion-insights" className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    Terimleri Stratejiye Dönüştürün
                  </h2>
                  <p className="text-base text-[#E2E5EC]/85 sm:text-lg">
                    Kısaltmaları ezberlemekle kalmayın; onları iletişim, reklam ve veri ekosisteminizde nasıl kullanacağınızı keşfedin.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  {[{
                    title: "Kampanya Checklist'i",
                    body: "PPC, CTR, ROI gibi metrikleri kampanya briflerine entegre edip ekiplerle ortak dil yaratın.",
                    ctaLabel: "Kampanya paketleri",
                    to: { pathname: "/", hash: "#services" }
                  }, {
                    title: "İçerik Planlama",
                    body: "Content Strategy ve Calendar başlıklarını editorial takvimlerinizle eşleyip disiplinli yayın akışları kurun.",
                    ctaLabel: "İçerik paketleri",
                    to: { pathname: "/", hash: "#services" }
                  }, {
                    title: "Veri Odaklı Gelişim",
                    body: "Analytics ve CRO tanımlarını dashboard setuplarınıza taşıyarak optimizasyon döngülerini hızlandırın.",
                    ctaLabel: "Süreç akışını keşfet",
                    to: { pathname: "/", hash: "#process" }
                  }].map((card) => (
                    <article
                      key={card.title}
                      className="rounded-2xl border border-white/15 bg-white/10 p-6 text-left text-white/90 shadow-lg shadow-black/40"
                    >
                      <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-[#E5E7EB]/80">{card.body}</p>
                      <Link
                        to={card.to}
                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.28em] text-red-200 transition-colors hover:text-red-100"
                      >
                        {card.ctaLabel}
                        <svg
                          aria-hidden="true"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="m12 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    </article>
                  ))}
                </div>
              </section>

              <MarketingGlossary className="mt-12" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

