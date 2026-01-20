import { chromium } from "playwright";

async function main() {
    const browser = await chromium.launch({
        headless: true,
        proxy: {
            server: "http://142.111.48.253:7030",
            username: "undjpses",
            password: "xfro5kl937n7",
        },
    });


  const page = await browser.newPage();

  // Establish session
  await page.goto("https://search.shopping.naver.com/ns/search?query=iphone", {
    waitUntil: "domcontentloaded",
  });

  const apiUrl =
    "https://search.shopping.naver.com/ns/v1/search/paged-composite-cards" +
    "?cursor=1&pageSize=50&query=iphone&searchMethod=all.basic" +
    "&isFreshCategory=false&isOriginalQuerySearch=false&isCatalogDiversifyOff=true" +
    "&listPage=1&hiddenNonProductCard=false&hasMoreAd=true&hasMore=true";

  const result = await page.evaluate(async (u) => {
    const r = await fetch(u, {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
      },
    });

    const ct = r.headers.get("content-type") ?? "";
    const text = await r.text();

    return {
      status: r.status,
      contentType: ct,
      bodyPreview: text.slice(0, 500),
    };
  }, apiUrl);

  console.log(result);

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
