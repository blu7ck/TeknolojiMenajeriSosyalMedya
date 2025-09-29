import React from 'react';
import { ProcessStep } from '../types';
import { ArrowRight } from 'lucide-react';

interface ProcessSectionProps {
  steps: ProcessStep[];
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ steps }) => {
  return (
    <section id="process" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Çalışma Süreci
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Başlangıçtan teslimat sonrasına kadar standart iş akış sürecimiz
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={step.step} className="flex items-center">
              <div className="flex items-center flex-1">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center 
                               justify-center font-bold text-lg mr-6 flex-shrink-0">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight size={24} className="text-gray-400 ml-6" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};