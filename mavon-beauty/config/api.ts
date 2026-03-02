// Central API configuration for frontend and middleware
// Uses environment variables in production and falls back to localhost in development.

const defaultApiBase = "http://localhost:3001/api/v1";

// Determine the public API base URL for the browser.
// In production the hosting provider (Vercel, Netlify, etc.) should set
// NEXT_PUBLIC_API_BASE_URL to the backend URL.  If the variable is missing
// and we're running in the browser, derive the URL from the current origin
// (`window.location`) so that deployed statically on the same domain still
// points to the correct path.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  (typeof window !== "undefined"
    ? `${window.location.origin}/api/v1`
    : defaultApiBase);

// Origin without the /api/v1 suffix – useful for image URLs and middleware
export const API_ORIGIN =
  API_BASE_URL.replace(/\/api\/v1\/?$/, "") ||
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:3001");

