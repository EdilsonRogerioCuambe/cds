import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

/**
 * Middleware for route protection and role-based access control
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Better Auth session token
  const sessionToken = request.cookies.get("better-auth.session_token")?.value ||
                       request.cookies.get("__secure-better-auth.session_token")?.value

  const isAuthenticated = !!sessionToken

  // Define route groups
  const publicRoutes = ["/", "/sobre", "/contato", "/uploads"]
  const authRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password", "/auth/verify-email"]

  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // 1. If not authenticated and trying to access protected routes
  if (!isAuthenticated && !isPublicRoute && !isAuthRoute && pathname !== "/docs/business-rules") {
    console.log(`[Middleware] Not authenticated, redirecting ${pathname} -> /auth/login`)
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 2. If authenticated and trying to access auth pages
  // We keep this commented out to avoid loops when the session cookie exists but is invalid on the server.
  // The redirection for already logged-in users is now handled by the Server Components in the auth routes.
  /*
  if (isAuthenticated && isAuthRoute) {
    console.log(`[Middleware] Already authenticated, redirecting ${pathname} -> /dashboard`)
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }
  */

  // No more manual role redirection in middleware to avoid loops with Server Components
  // Secondary checks happen in Server Components (Layouts/Pages)

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm|mov)$).*)",
  ],
}
