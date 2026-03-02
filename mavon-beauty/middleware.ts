import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Protect admin routes (also support locale-prefixed paths like '/en/admin')
  const segments = pathname.split("/");
  const localePrefix = segments.length > 1 && segments[1] && segments[1] !== "admin" ? `/${segments[1]}` : "";

  // Check either '/admin' or '/:locale/admin'
  if (pathname.startsWith("/admin") || /^\/[a-zA-Z0-9-_]+\/admin/.test(pathname)) {
    try {
      const accessToken = request.cookies.get("accessToken")?.value;

      if (!accessToken) {
        return NextResponse.redirect(new URL(`${localePrefix}/login`, request.url));
      }

      const response = await fetch("http://localhost:3001/api/v1/auth/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        return NextResponse.redirect(new URL(`${localePrefix}/login`, request.url));
      }

      const data = await response.json();
    } catch (error) {
      console.error("Admin middleware error:", error);
      return NextResponse.redirect(new URL(`${localePrefix}/login`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/:locale/admin/:path*"],
};
