import React from 'react';
import { 
  UploadCloud, 
  Download, 
  Printer,
  Timer,
  ShieldCheck,
  Clock,
  Briefcase
} from 'lucide-react';

interface HeaderProps {
  onOpenUpload: () => void;
  onExport: () => void;
  totalCases: number;
  totalSumHours: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenUpload,
  onExport,
  totalCases,
  totalSumHours,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs print:static print:border-none print:shadow-none">
      <div className="max-w-5xl mx-auto px-3 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 sm:h-16 gap-3">
          {/* Logo & Branding */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Tiempos de Solución de Casos Especiales
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                  <ShieldCheck className="w-3 h-3" />
                  {totalCases.toLocaleString()} Casos
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                  <Briefcase className="w-3 h-3" />
                  Base 8h Hábiles
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Sumatoria auditada ({totalSumHours.toLocaleString()} hrs hábiles), Media, Mediana y Moda
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-1.5 print:hidden shrink-0">
            <button
              id="upload-excel-btn"
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
            >
              <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden xs:inline">Cargar Excel</span>
            </button>

            <button
              id="export-report-btn"
              onClick={onExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </button>

            <button
              id="print-report-btn"
              onClick={handlePrint}
              title="Imprimir o Guardar PDF"
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
