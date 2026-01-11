
import { TrimesterGrades, PerformanceStatus } from './types';

export const calculateTrimesterAverage = (grades: TrimesterGrades): number => {
  const { av1, av2, pat } = grades;
  
  const avgAV1 = av1.length > 0 ? av1.reduce((a, b) => a + b, 0) / av1.length : 0;
  const avgAV2 = av2.length > 0 ? av2.reduce((a, b) => a + b, 0) / av2.length : 0;
  const patVal = pat ?? 0;

  // Formula: (PAT * 3 + AV1_avg * 5 + AV2_avg * 2) / 10
  const final = (patVal * 3 + avgAV1 * 5 + avgAV2 * 2) / 10;
  return Number(final.toFixed(2));
};

export const getStatus = (average: number): PerformanceStatus => {
  if (average === 0) return PerformanceStatus.NONE;
  if (average >= 7) return PerformanceStatus.APPROVED;
  if (average >= 5) return PerformanceStatus.AT_RISK;
  return PerformanceStatus.DANGER;
};

export const getStatusColor = (status: PerformanceStatus): string => {
  switch (status) {
    case PerformanceStatus.APPROVED: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case PerformanceStatus.AT_RISK: return 'bg-amber-100 text-amber-700 border-amber-200';
    case PerformanceStatus.DANGER: return 'bg-rose-100 text-rose-700 border-rose-200';
    default: return 'bg-slate-100 text-slate-500 border-slate-200';
  }
};
