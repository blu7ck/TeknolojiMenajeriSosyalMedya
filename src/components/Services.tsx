import React from 'react';
import { PackageSelector } from './PackageSelector';

const Services: React.FC = () => {
  return (
    <section id="services" className="py-20 bg-[#050505] text-[#E5E7EB]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Package Selector */}
        <PackageSelector />
      </div>
    </section>
  );
};

export default Services;
