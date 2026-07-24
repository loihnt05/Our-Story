import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes so Clerk does not force automatic redirects to accounts.dev
const isPublicRoute = createRouteMatcher([
  '/',
  '/number-loved(.*)',
  '/timeline(.*)',
  '/relationship-dashboard(.*)',
  '/games(.*)',
  '/quiz(.*)',
  '/decision-wheel(.*)',
  '/memory-guess(.*)',
  '/api/(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Allow all application routes to load without external Clerk redirect
  if (isPublicRoute(req)) {
    return;
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for Clerk's auto-proxy path
    '/__clerk/:path*',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};