export interface TestProfile {
    name: string;
    userAgent: string;
    acceptLanguage: string;
    timezoneId: string;
    platform: string;
    hardwareConcurrency: number;
    deviceMemory: number;
    viewport: {
      width: number;
      height: number;
      deviceScaleFactor?: number;
      isMobile?: boolean;
      hasTouch?: boolean;
    };
  }
  
  export const PROFILES: TestProfile[] = [
    {
      name: "Windows Desktop (High End)",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      acceptLanguage: "ko-KR,ko;q=0.9,en-US;q=0.8",
      timezoneId: "Asia/Seoul",
      platform: "Win32",
      hardwareConcurrency: 16,
      deviceMemory: 16,
      viewport: { width: 1920, height: 1080 },
    },
    {
      name: "Macbook Air (Standard)",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      acceptLanguage: "ko-KR,ko;q=0.9",
      timezoneId: "Asia/Seoul",
      platform: "MacIntel",
      hardwareConcurrency: 8,
      deviceMemory: 8,
      viewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
    },
    {
      name: "Windows Laptop (Mid Range)",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      acceptLanguage: "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      timezoneId: "Asia/Seoul",
      platform: "Win32",
      hardwareConcurrency: 4,
      deviceMemory: 4,
      viewport: { width: 1366, height: 768 },
    },
    {
      name: "iPhone 14 Pro",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1",
      acceptLanguage: "ko-KR,ko;q=0.9,en-US;q=0.8",
      timezoneId: "Asia/Seoul",
      platform: "iPhone",
      hardwareConcurrency: 6,
      deviceMemory: 8,
      viewport: { width: 393, height: 852, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    },
    {
      name: "Samsung Galaxy S23",
      userAgent: "Mozilla/5.0 (Linux; Android 13; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36",
      acceptLanguage: "ko-KR,ko;q=0.9,en-US;q=0.8",
      timezoneId: "Asia/Seoul",
      platform: "Linux armv8l",
      hardwareConcurrency: 8,
      deviceMemory: 8,
      viewport: { width: 360, height: 800, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    },
    {
      name: "4K High-End Windows",
      userAgent: "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      acceptLanguage: "ko-KR,ko;q=0.9,en-US;q=0.8",
      timezoneId: "Asia/Seoul",
      platform: "Win32",
      hardwareConcurrency: 24,
      deviceMemory: 32,
      viewport: { width: 2560, height: 1440 },
    },
    {
      name: "iPad Air",
      userAgent: "Mozilla/5.0 (iPad; CPU OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
      acceptLanguage: "ko-KR,ko;q=0.9,en-US;q=0.8",
      timezoneId: "Asia/Seoul",
      platform: "iPad",
      hardwareConcurrency: 8,
      deviceMemory: 8,
      viewport: { width: 820, height: 1180, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    },
    {
        name: "Windows 11 Desktop (Modern Chrome)",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        acceptLanguage: "ko-KR,ko;q=0.9,en-US;q=0.8",
        timezoneId: "Asia/Seoul",
        platform: "Win32",
        hardwareConcurrency: 12,
        deviceMemory: 16,
        viewport: { width: 1920, height: 1080 },
    },
    {
        name: "Windows 10 Desktop (Microsoft Edge)",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
        acceptLanguage: "ko-KR,ko;q=0.9,en-US;q=0.8",
        timezoneId: "Asia/Seoul",
        platform: "Win32",
        hardwareConcurrency: 8,
        deviceMemory: 16,
        viewport: { width: 1920, height: 1080 },
    },
    {
        name: "Windows 11 Laptop (Dell XPS style)",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
        acceptLanguage: "ko-KR,ko;q=0.9,en-US;q=0.8",
        timezoneId: "Asia/Seoul",
        platform: "Win32",
        hardwareConcurrency: 8,
        deviceMemory: 12,
        viewport: { width: 1536, height: 864 },
    },
    {
        name: "Windows Desktop (Older Chrome v115)",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        acceptLanguage: "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        timezoneId: "Asia/Seoul",
        platform: "Win32",
        hardwareConcurrency: 4,
        deviceMemory: 8,
        viewport: { width: 1440, height: 900 },
    },
    {
        name: "Windows 11 (Surface Pro)",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        acceptLanguage: "ko-KR,ko;q=0.9",
        timezoneId: "Asia/Seoul",
        platform: "Win32",
        hardwareConcurrency: 8,
        deviceMemory: 16,
        viewport: { width: 2880, height: 1920, deviceScaleFactor: 2 },
    },
    {
        name: "Windows 10 Business Laptop",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
        acceptLanguage: "ko-KR,ko;q=0.9,en-US;q=0.8",
        timezoneId: "Asia/Seoul",
        platform: "Win32",
        hardwareConcurrency: 4,
        deviceMemory: 4,
        viewport: { width: 1280, height: 720 },
    },
    {
        name: "Windows 11 Workstation",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        acceptLanguage: "ko-KR,ko;q=0.9,en-US;q=0.8",
        timezoneId: "Asia/Seoul",
        platform: "Win32",
        hardwareConcurrency: 20,
        deviceMemory: 32,
        viewport: { width: 2560, height: 1600 },
    },
    {
        name: "Windows 10 Budget Desktop",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
        acceptLanguage: "ko-KR,ko;q=0.9,en-US;q=0.8",
        timezoneId: "Asia/Seoul",
        platform: "Win32",
        hardwareConcurrency: 2,
        deviceMemory: 4,
        viewport: { width: 1024, height: 768 },
    },
    {
        name: "Windows 11 (Chrome Dev Edition)",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        acceptLanguage: "ko-KR,ko;q=0.9,en-US;q=0.8",
        timezoneId: "Asia/Seoul",
        platform: "Win32",
        hardwareConcurrency: 16,
        deviceMemory: 16,
        viewport: { width: 1920, height: 1080 },
    }
  ];
  
  export function pickRandomProfile(): TestProfile {
    return PROFILES[Math.floor(Math.random() * PROFILES.length)];
  }