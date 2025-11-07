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
    <div className="mb-12 rounded-[32px] border border-rose-100/70 bg-white/80 p-6 shadow-[0_35px_100px_-60px_rgba(244,114,182,0.55)] backdrop-blur">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h3 className="text-2xl font-bold text-slate-900">{categoryTitle}</h3>
        {onPackageBuilderOpen && (
          <button
            onClick={onPackageBuilderOpen}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-200/40 transition-all duration-300 hover:-translate-y-[1px] hover:shadow-rose-300/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <Settings size={18} className="h-4 w-4" />
            Kendi Paketini Oluştur
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full overflow-hidden rounded-3xl border border-rose-100/70 bg-white/90 shadow-[0_30px_90px_-50px_rgba(244,114,182,0.45)] backdrop-blur">
          <thead className="bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-rose-500">Modül</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-rose-500">Açıklama</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-rose-500">Teslimatlar</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-rose-500">Fiyat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-100/60">
            {modules.map((module, index) => (
              <tr key={index} className="transition-colors hover:bg-rose-50">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900">{module.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-600">{module.description}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-600">{module.deliverables}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-rose-500">{module.price}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
