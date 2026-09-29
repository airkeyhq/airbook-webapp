import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Check for Better Auth session cookie
  const sessionToken = 
    request.cookies.get('better-auth.session_token')?.value ||
    request.cookies.get('__Secure-better-auth.session_token')?.value;

  // Redirect legacy /brand to internal /in/brand
  if (path === '/brand' || path === '/brand/') {
    return NextResponse.redirect(new URL('/in/brand', request.url));
  }

  // Redirect unauthenticated /onboarding directly to Founding Client Waitlist
  if (path.startsWith('/onboarding') && !sessionToken) {
    return NextResponse.redirect(new URL('/founding', request.url));
  }

  const isProtectedPath = path.startsWith('/dashboard') || path.startsWith('/in');

  // If trying to access protected route without session token, redirect to /login
  if (isProtectedPath && !sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding/:path*', '/in', '/in/:path*', '/brand'],
};
