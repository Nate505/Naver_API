import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { pickRandomProfile } from "./profile.js";

puppeteer.use(StealthPlugin());

export async function runCDP(input: string, maxAttempts = 5) {
    let searchQuery = input;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const profile = pickRandomProfile();
        const sessionId = Math.random().toString(36).substring(7);

        console.log(`\n[CDP Attempt ${attempt}/${maxAttempts}] - Profile: ${profile.name}`);

        const browser = await puppeteer.launch({
            headless: false, 
            args: [
                '--no-sandbox',
                `--proxy-server=http://6n8xhsmh.as.thordata.net:9999`,
                '--disable-blink-features=AutomationControlled',
                '--ignore-certificate-errors',
                `--window-size=${profile.viewport.width},${profile.viewport.height}`
            ]
        });

        try {
            const page = await browser.newPage();
            
            // WebGL Hardware Spoofing
            await page.evaluateOnNewDocument(() => {
                const getParameter = WebGLRenderingContext.prototype.getParameter;
                WebGLRenderingContext.prototype.getParameter = function(parameter) {
                    if (parameter === 37445) return 'NVIDIA Corporation';
                    if (parameter === 37446) return 'NVIDIA GeForce RTX 3080/PCIe/SSE2';
                    return getParameter.apply(this, arguments as any);
                };
            });

            await page.authenticate({
                username: `td-customer-mrscraperTrial-session-${sessionId}-country-kr`,
                password: 'P3nNRQ8C2'
            });

            const client = await page.target().createCDPSession();
            await page.setUserAgent(profile.userAgent);

            // --- STEP 1: WARMING ON NAVER MAIN ---
            console.log("   -> Step 1: Warming on Naver Main...");
            await page.goto("https://www.naver.com", { waitUntil: 'networkidle2' });
            await new Promise(r => setTimeout(r, 3000 + Math.random() * 2000 + 2000));

            // --- STEP 2: TRANSITION TO SHOPPING ---
            console.log("   -> Step 2: Transitioning to Shopping...");
            await page.goto("https://shopping.naver.com/ns/home", { waitUntil: 'networkidle2' });
            
            // Check for initial block
            const isBlocked = await page.evaluate(() => document.body.innerText.includes("정상적인"));
            if (isBlocked) throw new Error("CAPTCHA_ON_SHOPPING_HOME");

            await new Promise(r => setTimeout(r, 40000));
            
            console.log(`   -> Step 3: Searching for "${searchQuery}"`);
            await page.goto("https://search.shopping.naver.com/ns/search?query=" + searchQuery, { waitUntil: 'networkidle2' });
            
            await new Promise(r => setTimeout(r, 10000));

            // --- STEP 4: EXTRACTION & SCROLL ---
            const isBlockedSearch = await page.evaluate(() => document.body.innerText.includes("정상적인"));
            if (isBlockedSearch) throw new Error("CAPTCHA_POST_SEARCH");

            console.log("   -> Step 4: Scrolling to capture API headers...");
            let capturedHeaders: any = null;
            await page.setRequestInterception(true);
            page.on('request', (req) => {
                if (req.url().includes('paged-composite-cards')) capturedHeaders = req.headers();
                req.continue().catch(() => {});
            });

            for (let i = 0; i < 6; i++) {
                await page.mouse.wheel({ deltaY: 800 + Math.random() * 200 });
                await new Promise(r => setTimeout(r, 2000));
                if (capturedHeaders) break;
            }

            const { cookies } = await client.send('Network.getCookies', { urls: ['https://search.shopping.naver.com'] });
            await browser.close();

            return { 
                cookieHeader: capturedHeaders?.['cookie'] || cookies.map(c => `${c.name}=${c.value}`).join('; '), 
                userAgent: profile.userAgent,
                capturedHeaders
            };

        } catch (error: any) {
            console.error(`❌ Attempt failed: ${error.message}`);
            await browser.close();
            await new Promise(r => setTimeout(r, 5000));
        }
    }
    throw new Error("Failed after all attempts.");
}