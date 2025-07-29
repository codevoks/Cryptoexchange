import authMiddleware from "./lib/middleware/auth.middleware"

export const middleware = authMiddleware;

export const config = {
  matcher: ['/dashboard/:path*','/api/v1/me','/markets'],
}