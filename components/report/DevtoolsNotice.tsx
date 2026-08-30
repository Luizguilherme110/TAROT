'use client';

import { useEffect } from 'react';

/**
 * A note for whoever opens DevTools looking for the paid text.
 *
 * It is only a joke — the actual protection is that the paid copy lives in
 * lib/report-full.ts (server-only) and comes out of /api/report/full after a
 * payment check, so there is genuinely nothing in this page to find. Printed
 * only for readers who have not paid; someone who did pay is not snooping, and
 * a taunt in their console would just read as strange.
 */
export function DevtoolsNotice({ paid }: { paid: boolean }) {
  useEffect(() => {
    if (paid) return;

    const title = 'font-size:16px;font-weight:bold;color:#e8c46a;';
    const body = 'font-size:12px;color:#c9c2b4;line-height:1.6;';

    console.log('%c🔮 Procurando a leitura completa por aqui?', title);
    console.log(
      '%cEla não está nesta página. O texto que você quer fica no servidor e só é\n' +
        'entregue depois que o pagamento é confirmado — não tem versão escondida no\n' +
        'código, no bundle, nem no localStorage. Pode procurar à vontade. 😉\n\n' +
        'Pra ler a sua de verdade: é só concluir o pagamento e ela aparece aqui mesmo.',
      body,
    );
  }, [paid]);

  return null;
}
