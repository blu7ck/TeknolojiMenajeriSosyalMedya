import React, { Suspense, lazy } from "react"
import Loader from "./Loader"
import { useTranslation } from "react-i18next"

const DigitalAnalysisForm = lazy(() => import("./DigitalAnalysisForm"))

const ProcessSection: React.FC = () => {
  const { t } = useTranslation()
  const steps = t("process.steps", { returnObjects: true }) as Array<{
    step: number
    title: string
    description: string
  }>

  return (
    <section id="process" className="py-20 text-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-semibold uppercase tracking-[0.2em] text-rose-500 sm:text-4xl">
            {t("process.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            {t("process.description")}
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step) => (
            <div
              key={step.step}
              className="flex flex-col gap-4 rounded-2xl border border-rose-200/70 bg-white/85 p-6 shadow-xl shadow-rose-100/60 backdrop-blur md:flex-row md:items-center transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-rose-200/80"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-white/60 bg-gradient-to-br from-rose-400 to-amber-300 text-lg font-bold text-white shadow-md">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">{step.title}</h3>
                  <p className="text-sm text-slate-600">{step.description}</p>
                </div>
              </div>

              {step.step === 1 && (
                <div className="w-full md:ml-auto md:w-1/2">
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center py-8">
                        <Loader />
                      </div>
                    }
                  >
                    <DigitalAnalysisForm />
                  </Suspense>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProcessSection
