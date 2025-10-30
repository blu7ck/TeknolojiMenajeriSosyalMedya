import React, { Suspense, lazy } from 'react';
import { ProcessStep } from '../types';

const DigitalAnalysisForm = lazy(() => import('./DigitalAnalysisForm'));

interface ProcessSectionProps {
  steps: ProcessStep[];
}

const ProcessSection: React.FC<ProcessSectionProps> = ({ steps }) => {
  return (
    <section id="process" className="py-20 bg-[#0A0B0C] text-[#E5E7EB]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-semibold uppercase tracking-[0.2em] text-red-400 sm:text-4xl">
            Çalışma Süreci
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[#AEB3C2]">
            Başlangıçtan teslimat sonrasına kadar standart iş akışımızın her adımında şeffaf ve ölçülebilir ilerleriz.
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step) => (
            <div key={step.step} className="flex flex-col gap-4 rounded-2xl border border-red-500/25 bg-black/70 p-6 shadow-lg shadow-red-900/15 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-red-500/40 bg-red-600/90 text-lg font-bold text-white">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#F3F4F6]">{step.title}</h3>
                  <p className="text-sm text-[#AEB3C2]">{step.description}</p>
                </div>
              </div>

              {step.step === 1 && (
                <div className="w-full md:ml-auto md:w-1/2">
                  <Suspense fallback={
                    <div className="flex items-center justify-center py-8">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
                    </div>
                  }>
                    <DigitalAnalysisForm />
                  </Suspense>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
