import React from 'react';
import { ProcessStep } from '../types';
import DigitalAnalysisForm from './DigitalAnalysisForm';

interface ProcessSectionProps {
  steps: ProcessStep[];
}

const ProcessSection: React.FC<ProcessSectionProps> = ({ steps }) => {
  return (
    <section id="process" className="py-20" style={{ backgroundColor: "#151516" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Çalışma Süreci
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Başlangıçtan teslimat sonrasına kadar standart iş akış sürecimiz
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={step.step} className="flex items-center">
              <div className="flex items-center flex-1">
                <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center 
                               justify-center font-bold text-lg mr-6 flex-shrink-0 border-2 border-red-500/30">
                  {step.step}
                </div>
                <div className="flex-1 bg-black/60 border border-red-500/20 rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-300 mb-4">{step.description}</p>
                  
                  {/* İlk adımda form göster */}
                  {step.step === 1 && (
                    <div className="mt-6">
                      <DigitalAnalysisForm />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
