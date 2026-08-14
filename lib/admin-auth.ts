// Web Crypto (crypto.subtle) instead of Node's `crypto` module: this file runs
// in both the Edge middleware and Node route handlers, and subtle is the one
// HMAC API available in both runtimes without a config split.
export const ADMIN_SESSION_COOKIE = 'admin_session';

const SESSION_VALUE = 'admin';

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function getKey(): Promise<CryptoKey> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set');
  return crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
  ]);
}

async function sign(value: string): Promise<string> {
  const key = await getKey();
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return toHex(signature);
}

export async function createAdminSessionCookieValue(): Promise<string> {
  return `${SESSION_VALUE}.${await sign(SESSION_VALUE)}`;
}

export async function isValidAdminSessionCookie(cookieValue: string | undefined): Promise<boolean> {
  if (!cookieValue) return false;
  const [value, signature] = cookieValue.split('.');
  if (value !== SESSION_VALUE || !signature) return false;
  const expected = await sign(value);
  // Lengths are fixed (both hex-encoded SHA-256 digests), so a simple loop
  // comparison here is constant-time enough without needing Node's Buffer.
  if (signature.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < signature.length; i += 1) {
    mismatch |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}
