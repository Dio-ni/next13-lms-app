import { authMiddleware } from '@clerk/nextjs/server';

export default authMiddleware({
  afterAuth: (req, res) => {
    // Custom behavior after auth check
    // Example: allow access or return a custom response
  },
});

export const config = {
  matcher: [
    // Match all routes that are NOT (next.js internals or static assets)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

