import React, { useState, useMemo } from 'react';
import { INITIAL_SPECIAL_CASES } from './data/initialData';
import { SpecialCase, SpecialCaseTimeMetrics } from './types';
import { Header } from './components/Header';
import { TimeOverviewView } from './components/TimeOverviewView';
import { CaseDetailModal } from './components/CaseDetailModal';
import { DataUploadModal } from './components/DataUploadModal';
import { ExportModal } from './components/ExportModal';
import { calculateComprehensiveStats } from './utils/timeStats';

export const App: React.FC = () => {
  const [allCases, setAllCases] = useState<SpecialCase[]>(INITIAL_SPECIAL_CASES);

  // Modals state
  const [selectedCase, setSelectedCase] = useState<SpecialCase | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Comprehensive Time & Statistical Metrics in Hours
  const timeMetrics: SpecialCaseTimeMetrics = useMemo(() => {
    const stats = calculateComprehensiveStats(allCases);

    const totalCases = allCases.length;
    const resolvedCases = allCases.filter((c) => c.estado === 'Resuelto').length;
    const pendingCases = totalCases - resolvedCases;
    const resolutionRate = totalCases > 0 ? Number(((resolvedCases / totalCases) * 100).toFixed(1)) : 0;

    // Tipificacion ranking for times in hours
    const tipifTimes: Record<string, { sumHours: number; count: number }> = {};
    allCases.forEach((c) => {
      if (!tipifTimes[c.tipificacion]) tipifTimes[c.tipificacion] = { sumHours: 0, count: 0 };
      tipifTimes[c.tipificacion].sumHours += Math.round(c.tiempoSolucionDias * 24);
      tipifTimes[c.tipificacion].count += 1;
    });

    const rankedTipifs = Object.entries(tipifTimes)
      .map(([name, data]) => ({
        name,
        avgHours: Number((data.sumHours / data.count).toFixed(2)),
        count: data.count,
      }))
      .filter((t) => t.count >= 3)
      .sort((a, b) => b.avgHours - a.avgHours);

    const topSlowTipificacion = rankedTipifs[0] || { name: 'N/A', avgHours: 0, count: 0 };
    const topFastTipificacion = rankedTipifs[rankedTipifs.length - 1] || { name: 'N/A', avgHours: 0, count: 0 };

    // Area ranking in hours
    const areaTimes: Record<string, { sumHours: number; count: number }> = {};
    allCases.forEach((c) => {
      const area = c.areaResolucion || 'No asignada';
      if (!areaTimes[area]) areaTimes[area] = { sumHours: 0, count: 0 };
      areaTimes[area].sumHours += Math.round(c.tiempoSolucionDias * 24);
      areaTimes[area].count += 1;
    });

    const rankedAreas = Object.entries(areaTimes)
      .map(([name, data]) => ({
        name,
        avgHours: Number((data.sumHours / data.count).toFixed(2)),
        count: data.count,
      }))
      .sort((a, b) => b.avgHours - a.avgHours);

    const topSlowArea = rankedAreas[0] || { name: 'N/A', avgHours: 0, count: 0 };

    // Supervisor ranking in hours
    const supTimes: Record<string, { sumHours: number; count: number }> = {};
    allCases.forEach((c) => {
      const sup = c.supervisor || 'No asignado';
      if (!supTimes[sup]) supTimes[sup] = { sumHours: 0, count: 0 };
      supTimes[sup].sumHours += Math.round(c.tiempoSolucionDias * 24);
      supTimes[sup].count += 1;
    });

    const rankedSups = Object.entries(supTimes)
      .map(([name, data]) => ({
        name,
        avgHours: Number((data.sumHours / data.count).toFixed(2)),
        count: data.count,
      }))
      .sort((a, b) => a.avgHours - b.avgHours);

    const topFastSupervisor = rankedSups[0] || { name: 'N/A', avgHours: 0, count: 0 };

    return {
      totalCases,
      resolvedCases,
      pendingCases,
      resolutionRate,
      topSlowTipificacion,
      topFastTipificacion,
      topSlowArea,
      topFastSupervisor,
      stats,
    };
  }, [allCases]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header
        onOpenUpload={() => setIsUploadOpen(true)}
        onExport={() => setIsExportOpen(true)}
        totalCases={allCases.length}
        totalSumHours={timeMetrics.stats.sumHours}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-5">
        {/* Main Clean Statistical Analytics Dashboard (100% in Hours) */}
        <TimeOverviewView
          cases={allCases}
          metrics={timeMetrics}
          onSelectCase={(c) => setSelectedCase(c)}
        />
      </main>

      {/* Case Detail Modal */}
      <CaseDetailModal
        caseItem={selectedCase}
        onClose={() => setSelectedCase(null)}
      />

      {/* Upload Modal */}
      <DataUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpdateSpecialCases={(newCases) => setAllCases(newCases)}
        onResetToDefaults={() => {
          setAllCases(INITIAL_SPECIAL_CASES);
        }}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        filteredCases={allCases}
      />
    </div>
  );
};

export default App;
