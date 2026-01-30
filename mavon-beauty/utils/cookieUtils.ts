// Cookie utilities for auth - middleware runs on server and can only read cookies

const TOKEN_KEY = "accessToken";
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export const setAccessTokenCookie = (token: string): void => {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${TOKEN_MAX_AGE}; SameSite=Lax`;
};

export const clearAccessTokenCookie = (): void => {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
};
