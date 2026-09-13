import { 
  ResolutionMetrics, 
  FPSMetrics, 
  BrightnessMetrics, 
  SharpnessMetrics, 
  ColorMetrics, 
  QualityScore, 
  DiagnosticReportData 
} from '../types';

export function calculateWebcamHealthScore(
  resolution: ResolutionMetrics,
  fps: FPSMetrics,
  brightness: BrightnessMetrics,
  sharpness: SharpnessMetrics,
  color: ColorMetrics
): QualityScore {
  // 1. Resolution Score
  let resScore = 80;
  if (resolution.category === '4K' || resolution.category === 'Ultra HD') resScore = 100;
  else if (resolution.category === '2K') resScore = 96;
  else if (resolution.category === 'Full HD') resScore = 93;
  else if (resolution.category === 'HD') resScore = 82;
  else if (resolution.category === 'Standard') resScore = 65;
  else resScore = 45;

  // 2. FPS Score
  let fpsScore = 85;
  if (fps.current >= 55) fpsScore = 100;
  else if (fps.current >= 28) fpsScore = 92;
  else if (fps.current >= 22) fpsScore = 80;
  else if (fps.current >= 15) fpsScore = 65;
  else if (fps.current > 0) fpsScore = 45;
  else fpsScore = 30;

  // 3. Lighting Score
  let lightingScore = 88;
  if (brightness.status === 'Good') {
    lightingScore = Math.min(100, 85 + Math.round((1 - Math.abs(brightness.percentage - 50) / 50) * 15));
  } else if (brightness.status === 'Bright') {
    lightingScore = 72;
  } else if (brightness.status === 'Too Dark') {
    lightingScore = Math.max(30, Math.round(brightness.percentage * 1.3));
  } else {
    // Overexposed
    lightingScore = 48;
  }

  // 4. Sharpness Score
  const sharpnessScore = Math.min(100, Math.max(20, sharpness.score));

  // 5. Color Balance Score
  const colorScore = Math.min(100, Math.max(30, color.balance));

  // 6. Stability Score
  const stabilityScore = Math.min(100, Math.max(20, fps.stability));

  // Weighted aggregate
  const weighted = 
    resScore * 0.22 +
    fpsScore * 0.20 +
    lightingScore * 0.20 +
    sharpnessScore * 0.18 +
    colorScore * 0.10 +
    stabilityScore * 0.10;

  const overall = Math.min(99, Math.max(15, Math.round(weighted)));

  let grade: QualityScore['grade'] = 'A';
  if (overall >= 93) grade = 'A+';
  else if (overall >= 85) grade = 'A';
  else if (overall >= 75) grade = 'B';
  else if (overall >= 60) grade = 'C';
  else grade = 'D';

  return {
    overall,
    breakdown: {
      resolution: resScore,
      fps: fpsScore,
      lighting: lightingScore,
      sharpness: sharpnessScore,
      color: colorScore,
      stability: stabilityScore,
    },
    grade,
  };
}

const STORAGE_KEY = 'camaudit_test_history_v1';

export function getLocalTestHistory(): DiagnosticReportData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as DiagnosticReportData[];
  } catch (err) {
    console.warn('Could not read test history from localStorage', err);
    return [];
  }
}

export function saveLocalTestReport(report: DiagnosticReportData): DiagnosticReportData[] {
  try {
    const history = getLocalTestHistory();
    const updated = [report, ...history.filter(item => item.id !== report.id)].slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Could not save test report to localStorage', err);
    return [];
  }
}

export function clearLocalTestHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Could not clear test history', err);
  }
}

// Aliases for seamless app integration
export const calculateQualityScore = (
  resolution: ResolutionMetrics,
  fps: FPSMetrics,
  brightness: BrightnessMetrics,
  sharpness: SharpnessMetrics,
  color: ColorMetrics,
  _exposure?: unknown
) => calculateWebcamHealthScore(resolution, fps, brightness, sharpness, color);

export const loadHistory = getLocalTestHistory;
export const saveReportToHistory = saveLocalTestReport;
export const clearHistory = clearLocalTestHistory;

