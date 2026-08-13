import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE, isValidAdminSessionCookie } from '@/lib/admin-auth';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const valid = await isValidAdminSessionCookie(cookie);
  if (!valid) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
