import React from 'react';
import { Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Sosyal Medya Paketleri</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => scrollToSection('packages')}
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Paketler
            </button>
            <button
              onClick={() => scrollToSection('modules')}
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Modül Menüsü
            </button>
            <button
              onClick={() => scrollToSection('process')}
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Süreç
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              İletişim
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <button
                onClick={() => scrollToSection('packages')}
                className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600"
              >
                Paketler
              </button>
              <button
                onClick={() => scrollToSection('modules')}
                className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600"
              >
                Modül Menüsü
              </button>
              <button
                onClick={() => scrollToSection('process')}
                className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600"
              >
                Süreç
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600"
              >
                İletişim
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};