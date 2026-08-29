import { getSessionExport } from '@/lib/admin-metrics';

export const dynamic = 'force-dynamic';

// Semicolon plus a BOM because this file gets opened in Excel in pt-BR far more
// often than in anything else, and Excel there splits on ';' and needs the BOM
// to read the accents right.
const SEPARATOR = ';';

function toCsvField(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function toCsv(headers: string[], rows: string[][]): string {
  return [headers, ...rows].map((row) => row.map(toCsvField).join(SEPARATOR)).join('\r\n');
}

/**
 * Lives under /admin (not /api/admin) on purpose: the admin cookie is scoped to
 * that path and the middleware matcher guards it, so the export is protected by
 * the same check as the panel itself.
 */
export async function GET() {
  const { headers, rows } = await getSessionExport();
  const date = new Date().toISOString().slice(0, 10);

  return new Response(`\ufeff${toCsv(headers, rows)}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="tarot-respostas-${date}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
