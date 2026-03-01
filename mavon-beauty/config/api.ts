// Central API configuration for frontend and middleware
// Uses environment variables in production and falls back to localhost in development.

const defaultApiBase = "http://localhost:3001/api/v1";

// Public base URL used in the browser (set this on Vercel as NEXT_PUBLIC_API_BASE_URL)
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  defaultApiBase;

// Origin without the /api/v1 suffix – useful for image URLs and middleware
export const API_ORIGIN =
  API_BASE_URL.replace(/\/api\/v1\/?$/, "") || "http://localhost:3001";

