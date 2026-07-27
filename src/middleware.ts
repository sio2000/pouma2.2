import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API & admin: never run locale middleware
  if (pathname.startsWith("/api") || pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Legacy/wrong URLs: /el/admin → /admin
  const localeAdmin = pathname.match(/^\/(el|en)\/admin(\/.*)?$/);
  if (localeAdmin) {
    const suffix = localeAdmin[2] ?? "";
    return NextResponse.redirect(new URL(`/admin${suffix}`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/",
    "/(el|en)/:path*",
    "/admin/:path*",
    "/api/:path*",
    "/((?!_next|_vercel|admin|api|.*\\..*).*)",
  ],
};
