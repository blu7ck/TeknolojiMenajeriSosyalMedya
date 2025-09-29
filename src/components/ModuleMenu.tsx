import React from 'react';
import { Module } from '../types';
import { Settings } from 'lucide-react';

interface ModuleMenuProps {
  modules: Module[];
  categoryTitle: string;
  onPackageBuilderOpen?: () => void;
}

export const ModuleMenu: React.FC<ModuleMenuProps> = ({ modules, categoryTitle, onPackageBuilderOpen }) => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">{categoryTitle}</h3>
        {onPackageBuilderOpen && (
          <button
            onClick={onPackageBuilderOpen}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg 
                     hover:bg-blue-700 transition-colors duration-200"
          >
            <Settings size={20} className="mr-2" />
            Kendi Paketini Oluştur
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Modül</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Açıklama</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Teslimatlar</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Fiyat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {modules.map((module, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{module.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-700 text-sm">{module.description}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-700 text-sm">{module.deliverables}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-green-600 font-semibold">{module.price}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};