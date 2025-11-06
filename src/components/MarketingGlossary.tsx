import { useMemo, useState } from "react"
import { marketingGlossary } from "../data/marketingGlossary"
import { Search, Globe2 } from "lucide-react"

type MarketingGlossaryProps = {
  className?: string
}

export function MarketingGlossary({ className = "" }: MarketingGlossaryProps = {}) {
  const [query, setQuery] = useState("")

  const filteredTerms = useMemo(() => {
    if (!query.trim()) return marketingGlossary

    const safeQuery = query.toLowerCase()

    return marketingGlossary.filter((term) => {
      const haystack = [
        term.heading,
        term.englishHeading,
        term.descriptionTR,
        term.descriptionEN,
        ...term.keywords,
      ]
        .join(" ")
        .toLowerCase()

      return haystack.includes(safeQuery)
    })
  }, [query])

  const termCountLabel = `${filteredTerms.length} terim`

  return (
    <section
      id="dijital-pazarlama-sozlugu"
      className={`relative w-full ${className}`}
      itemScope
      itemType="https://schema.org/DefinedTermSet"
    >
      <div className="flex flex-col gap-10">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Nedir bu terimler?
          </h1>
          <p className="mt-4 text-base text-[#E5E7EB]/90 sm:text-lg">
            İşte sizin için kısa, öz ve bilgilendirici biçimde pazarlama kısaltmalarını tek bakışta çözen mini rehberimiz.
          </p>
          <meta itemProp="name" content="Nedir Bütün Bu Olanlar? Dijital Pazarlama Jargon Kulübü" />
          <meta
            itemProp="description"
            content="SEO, SEM, SMM, PPC, CTR, CRM, CRO, ROI, KPI, otomasyon ve daha fazlasını kısa, öz ve bilgilendirici bir pazarlama sözlüğünde keşfedin."
          />
        </header>

        <div className="flex flex-col gap-4 rounded-2xl border border-white/20 bg-white/10 p-6 shadow-lg shadow-black/30 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
          <label className="relative flex w-full items-center sm:max-w-lg" htmlFor="glossary-search">
            <Search className="pointer-events-none absolute left-3 h-5 w-5 text-red-200/70" aria-hidden="true" />
            <input
              id="glossary-search"
              name="glossary-search"
              type="search"
              autoComplete="off"
              placeholder="Terim, anahtar kelime ya da açıklama ara..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-xl border border-white/20 bg-black/40 py-3 pl-11 pr-4 text-sm text-white placeholder:text-red-100/50 focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-300/50"
            />
          </label>
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-red-100/80">
            <Globe2 className="h-4 w-4" aria-hidden="true" />
            <span>{termCountLabel}</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {filteredTerms.map((term) => (
            <article
              key={term.slug}
              id={`term-${term.slug}`}
              itemScope
              itemType="https://schema.org/DefinedTerm"
              itemProp="hasDefinedTerm"
              className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-6 shadow-xl shadow-black/40 transition-transform duration-300 hover:-translate-y-1"
            >
              <meta itemProp="termCode" content={term.slug} />
              <header className="mb-3 flex flex-col gap-2">
                <h3 className="text-xl font-semibold text-white">
                  <span itemProp="name">{term.heading}</span>
                </h3>
                {term.englishHeading && (
                  <span className="text-sm font-medium uppercase tracking-[0.22em] text-red-200" itemProp="alternateName">
                    {term.englishHeading}
                  </span>
                )}
              </header>

              <p className="text-sm leading-relaxed text-[#E5E7EB]" itemProp="description">
                {term.descriptionTR}
              </p>

              <footer className="mt-5 flex flex-wrap gap-2">
                {term.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-red-500/30 bg-red-500/15 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-red-100/90"
                  >
                    {keyword}
                  </span>
                ))}
              </footer>
            </article>
          ))}

          {filteredTerms.length === 0 && (
            <div className="col-span-full rounded-2xl border border-white/20 bg-white/10 p-8 text-center text-sm text-red-100/70">
              <p>Aradığınız terim henüz sözlüğümüze düşmedi. Bize yazın, birlikte ekleyelim!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

