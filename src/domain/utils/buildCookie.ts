import { Cookie } from "puppeteer";

export function buildCookieHeader(cookies: Cookie[]): string {
  return cookies
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}