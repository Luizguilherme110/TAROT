'use client';

import { useMemo } from 'react';
import { useQuiz } from '@/components/providers/QuizProvider';
import { generateMockReport } from '@/lib/generate-mock-report';
import { ReportView } from '@/components/report/ReportView';

export default function ResultadoPage() {
  const { state } = useQuiz();
  const report = useMemo(() => generateMockReport(state), [state]);

  return <ReportView report={report} />;
}
