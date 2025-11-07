import React from "react"
import { useTranslation } from "react-i18next"

const AboutUs: React.FC = () => {
  const { t } = useTranslation()
  const cards = t("about.cards", { returnObjects: true }) as Array<{
    key: string
    title: string
    body: string
  }>

  return (
    <section id="about" className="py-20 text-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-semibold uppercase tracking-[0.2em] text-rose-500 sm:text-4xl">
            {t("about.title")}
          </h2>
          <p className="mx-auto max-w-4xl text-lg leading-relaxed text-slate-600">
            {t("about.description")}
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-rose-200/70 bg-white/85 p-8 text-center shadow-xl shadow-rose-100/60 backdrop-blur transition-transform duration-200 hover:-translate-y-1 hover:shadow-rose-200/80"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-amber-300 text-2xl font-bold text-white shadow-md">
                {item.key}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-800">{item.title}</h3>
              <p className="text-sm text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutUs
