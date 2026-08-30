'use client';

import { useEffect, useMemo } from 'react';
import { useQuiz } from '@/components/providers/QuizProvider';
import { generateMockReport } from '@/lib/generate-mock-report';
import { ReportView } from '@/components/report/ReportView';
import { trackEvent } from '@/lib/analytics/track';

export default function ResultadoPage() {
  const { state, hasHydrated } = useQuiz();
  const report = useMemo(() => generateMockReport(state), [state]);

  useEffect(() => {
    trackEvent('report_view');
  }, []);

  return <ReportView report={report} session={state} sessionReady={hasHydrated} />;
}
