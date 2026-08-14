export function buildCaktoCheckoutUrl(sessionId: string): string {
  const base = process.env.NEXT_PUBLIC_CAKTO_CHECKOUT_URL;
  if (!base) throw new Error('NEXT_PUBLIC_CAKTO_CHECKOUT_URL not configured');
  const url = new URL(base);
  url.searchParams.set('utm_content', sessionId);
  return url.toString();
}
