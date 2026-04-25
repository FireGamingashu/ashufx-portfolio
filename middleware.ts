import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "ashufx_admin_session";
const SESSION_VALUE  = "authenticated_ashufx_2025";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes (but NOT /admin/login or /api/admin/*)
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !pathname.startsWith("/api/admin")
  ) {
    const session = req.cookies.get(SESSION_COOKIE)?.value;
    if (session !== SESSION_VALUE) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
