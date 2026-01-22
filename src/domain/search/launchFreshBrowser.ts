import puppeteer, { Browser, Cookie, HTTPResponse, Page } from "puppeteer";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export type LaunchOptions = {
  headless?: boolean | "shell";
  extraArgs?: string[];
  executablePath?: string;
};

export type RestartDecisionInput = {
  attempt: number;
  url: string;
  mainStatus?: number;
  response?: HTTPResponse | null;
  error?: unknown;
};

export type TestProfile = {
  name: string;
  userAgent?: string;
  acceptLanguage?: string;
  timezoneId?: string;
  platform?: string;
  hardwareConcurrency?: number;
  deviceMemory?: number;
  viewport?: {
    width: number;
    height: number;
    deviceScaleFactor?: number;
    isMobile?: boolean;
    hasTouch?: boolean;
  };
};

export function createFreshProfileDir(prefix = "puppeteer-profile"): string {
  const dir = path.join(
    os.tmpdir(),
    `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
  );
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export async function launchFreshBrowser(
  opts: LaunchOptions = {}
): Promise<{ browser: Browser; userDataDir: string }> {
  const userDataDir = createFreshProfileDir("pptr");

  const browser = await puppeteer.launch({
    headless: opts.headless ?? true,
    userDataDir,
    executablePath: opts.executablePath,
    args: [
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-blink-features=AutomationControlled",
      ...(opts.extraArgs ?? []),
    ],
  });

  return { browser, userDataDir };
}

export function buildCookieHeader(cookies: Cookie[]): string {
  return cookies.map((c) => `${c.name}=${c.value}`).join("; ");
}

export async function applyTestProfile(page: Page, profile?: TestProfile): Promise<void> {
  if (!profile) return;

  const client = await page.createCDPSession();

  // 1. Viewport setup
  if (profile.viewport) {
    await page.setViewport({
      width: profile.viewport.width,
      height: profile.viewport.height,
      deviceScaleFactor: profile.viewport.deviceScaleFactor ?? 1,
      isMobile: profile.viewport.isMobile ?? false,
      hasTouch: profile.viewport.hasTouch ?? false,
    });
  }

  // 2. CDP Overrides (UA, Language, Platform)
  await client.send("Network.enable");
  await client.send("Network.setUserAgentOverride", {
    userAgent: profile.userAgent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    acceptLanguage: profile.acceptLanguage || "en-US,en;q=0.9",
    platform: profile.platform || "Win32",
  });

  if (profile.timezoneId) {
    await client.send("Emulation.setTimezoneOverride", { timezoneId: profile.timezoneId });
  }

  // 3. JS Fingerprint Injection (Fixed Prototype Errors)
  await page.evaluateOnNewDocument((p) => {
    // --- Hardware Spoofing ---
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => p.hardwareConcurrency || 8 });
    Object.defineProperty(navigator, 'deviceMemory', { get: () => p.deviceMemory || 8 });
    
    // --- Canvas Fingerprint Noise ---
    const shift = {
      r: Math.floor(Math.random() * 10) - 5,
      g: Math.floor(Math.random() * 10) - 5,
      b: Math.floor(Math.random() * 10) - 5,
    };

    const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
    CanvasRenderingContext2D.prototype.getImageData = function(x, y, w, h) {
      const imageData = originalGetImageData.apply(this, [x, y, w, h]);
      for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] += shift.r;
        imageData.data[i + 1] += shift.g;
        imageData.data[i + 2] += shift.b;
      }
      return imageData;
    };

    // --- WebGL Vendor/Renderer Spoofing ---
    const spoofWebGL = (context: any) => {
      if (!context || !context.prototype) return;
      const originalGetParameter = context.prototype.getParameter;
      context.prototype.getParameter = function(parameter: number) {
        // UNMASKED_VENDOR_WEBGL (0x9245)
        if (parameter === 37445) return "Google Inc. (NVIDIA)";
        // UNMASKED_RENDERER_WEBGL (0x9246)
        if (parameter === 37446) return "ANGLE (NVIDIA, NVIDIA GeForce RTX 3080 Direct3D11 vs_5_0 ps_5_0, D3D11)";
        return originalGetParameter.apply(this, [parameter]);
      };
    };

    spoofWebGL(WebGLRenderingContext);
    spoofWebGL(WebGL2RenderingContext);
    
  }, profile);
}

export async function runWithRestart<T>(params: {
  url: string;
  maxAttempts?: number;
  launchOptions?: LaunchOptions;
  runOnce: (ctx: {
    browser: Browser;
    userDataDir: string;
    attempt: number;
    url: string;
  }) => Promise<{
    value: T;
    mainStatus?: number;
    response?: HTTPResponse | null;
  }>;
  shouldRestart: (info: RestartDecisionInput) => boolean;
}): Promise<T> {
  const maxAttempts = params.maxAttempts ?? 3;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const { browser, userDataDir } = await launchFreshBrowser(params.launchOptions);

    try {
      const { value, mainStatus, response } = await params.runOnce({
        browser,
        userDataDir,
        attempt,
        url: params.url,
      });

      const restart = params.shouldRestart({ attempt, url: params.url, mainStatus, response });
      await browser.close();
      if (!restart) return value;
    } catch (err) {
      lastError = err;
      const restart = params.shouldRestart({ attempt, url: params.url, error: err });
      try { await browser.close(); } catch {}
      if (!restart) throw err;
    }
  }
  throw lastError ?? new Error("All attempts exhausted");
}

export async function getCookieHeaderForUrlWithRestart(params: {
  url: string;
  profile?: TestProfile;
  maxAttempts?: number;
  launchOptions?: LaunchOptions;
  waitUntil?: "domcontentloaded" | "load" | "networkidle0" | "networkidle2";
  timeoutMs?: number;
  shouldRestart: (info: RestartDecisionInput) => boolean;
}): Promise<{ cookieHeader: string; userAgent: string }> {
  return runWithRestart<{ cookieHeader: string; userAgent: string }>({
    url: params.url,
    maxAttempts: params.maxAttempts ?? 1,
    launchOptions: params.launchOptions,
    shouldRestart: params.shouldRestart,
    runOnce: async ({ browser, url }) => {
      const page = await browser.newPage();
      const timeout = params.timeoutMs ?? 60_000;
      page.setDefaultTimeout(timeout);

      await applyTestProfile(page, params.profile);

      let response: HTTPResponse | null = null;
      try {
        response = await page.goto(url, {
          waitUntil: params.waitUntil ?? "domcontentloaded",
          timeout,
        });
      } catch (e) { /* ignore */ }

      const client = await page.createCDPSession();
      const { userAgent } = await client.send("Browser.getVersion");

      const cookies = await page.cookies(url);
      const cookieHeader = buildCookieHeader(cookies);

      await page.close();
      return { value: { cookieHeader, userAgent }, mainStatus: response?.status(), response };
    },
  });
}

