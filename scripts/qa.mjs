// End-to-end QA for the Soft Rituals store.
// Usage: node scripts/qa.mjs <baseUrl> [--expect-order-success]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const EXPECT_ORDER = process.argv.includes("--expect-order-success");
const SHOTS = new URL("../qa-shots/", import.meta.url).pathname;
mkdirSync(SHOTS, { recursive: true });

let failures = 0;
const ok = (name) => console.log(`  ✓ ${name}`);
const fail = (name, detail = "") => {
  failures++;
  console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
};
async function check(name, fn) {
  try {
    await fn();
    ok(name);
  } catch (e) {
    fail(name, e.message?.split("\n")[0]);
  }
}

const browser = await chromium.launch();
const consoleErrors = [];

async function newPage(viewport) {
  const page = await browser.newPage({ viewport });
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(`${page.url()}: ${msg.text()}`);
  });
  page.on("pageerror", (err) => consoleErrors.push(`${page.url()}: ${err.message}`));
  return page;
}

console.log(`\nQA against ${BASE}\n`);

// ---------- 1. Home ----------
const page = await newPage({ width: 1366, height: 900 });
await check("home loads with hero copy", async () => {
  const res = await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  if (!res.ok()) throw new Error(`status ${res.status()}`);
  await page.getByText("Light something.").waitFor({ timeout: 5000 });
});
await check("hero image present", async () => {
  const img = page.locator("img[alt*='Dahlia Bowl Set']").first();
  await img.waitFor({ timeout: 5000 });
  const natural = await img.evaluate((el) => el.naturalWidth);
  if (!natural) throw new Error("hero image failed to load");
});
await page.screenshot({ path: `${SHOTS}home.png`, fullPage: true });

// ---------- 2. Every nav + footer link resolves ----------
await check("all header/footer links resolve", async () => {
  const hrefs = await page.$$eval("header a, footer a", (as) =>
    as.map((a) => a.getAttribute("href")).filter((h) => h && h.startsWith("/"))
  );
  const unique = [...new Set(hrefs)];
  for (const href of unique) {
    const res = await page.request.get(`${BASE}${href}`);
    if (!res.ok()) throw new Error(`${href} → ${res.status()}`);
  }
});

// ---------- 3. Shop & filtering ----------
await check("shop lists all 19 products", async () => {
  await page.goto(`${BASE}/shop`, { waitUntil: "networkidle" });
  const n = await page.locator("[data-testid='product-card']").count();
  if (n !== 19) throw new Error(`expected 19 cards, got ${n}`);
});
await check("category filter narrows the grid", async () => {
  await page.goto(`${BASE}/shop?category=soaps`, { waitUntil: "networkidle" });
  const n = await page.locator("[data-testid='product-card']").count();
  if (n !== 3) throw new Error(`expected 3 soap cards, got ${n}`);
});
await check("sort by price ascending works", async () => {
  await page.goto(`${BASE}/shop?sort=price-asc`, { waitUntil: "domcontentloaded" });
  await page.locator("[data-testid='product-card']").first().waitFor();
  const prices = await page.$$eval("[data-testid='product-card']", (cards) =>
    cards.map((c) => parseInt(c.querySelector("span").textContent.replace(/\D/g, ""), 10))
  );
  for (let i = 1; i < prices.length; i++)
    if (prices[i] < prices[i - 1]) throw new Error(`order broken at index ${i}`);
});
await page.screenshot({ path: `${SHOTS}shop.png`, fullPage: true });

// ---------- 4. Every product page renders with image ----------
await check("all 19 product pages render with their image", async () => {
  const slugs = await page.$$eval("[data-testid='product-card']", (cards) =>
    cards.map((c) => c.getAttribute("href"))
  );
  await page.goto(`${BASE}/shop`, { waitUntil: "networkidle" });
  const allSlugs = await page.$$eval("[data-testid='product-card']", (cards) =>
    cards.map((c) => c.getAttribute("href"))
  );
  for (const href of allSlugs) {
    const res = await page.goto(`${BASE}${href}`, { waitUntil: "domcontentloaded" });
    if (!res.ok()) throw new Error(`${href} → ${res.status()}`);
    const name = await page.locator("[data-testid='pdp-name']").textContent();
    if (!name?.trim()) throw new Error(`${href} has no name`);
    await page
      .locator("main img")
      .first()
      .evaluate(
        (el) =>
          new Promise((resolve, reject) => {
            if (el.complete && el.naturalWidth > 0) return resolve(true);
            el.addEventListener("load", () => resolve(true), { once: true });
            el.addEventListener("error", () => reject(new Error("img error")), { once: true });
            setTimeout(() => reject(new Error("img load timeout")), 8000);
          })
      )
      .catch(() => {
        throw new Error(`${href} image missing`);
      });
  }
});

// ---------- 5. Cart flow ----------
await check("add to cart updates count and drawer", async () => {
  await page.goto(`${BASE}/products/iced-latte`, { waitUntil: "networkidle" });
  await page.locator("[data-testid='add-to-cart']").click();
  await page.locator("[data-testid='cart-line']").waitFor({ timeout: 5000 });
  const count = await page.locator("[data-testid='cart-count']").textContent();
  if (count.trim() !== "1") throw new Error(`cart count ${count}`);
});
await check("quantity stepper updates subtotal", async () => {
  await page.getByLabel("Increase quantity of Iced Latte").click();
  await page.waitForTimeout(300);
  const subtotal = await page.locator("[data-testid='cart-subtotal']").textContent();
  if (!subtotal.includes("400")) throw new Error(`subtotal ${subtotal}`);
});
await page.screenshot({ path: `${SHOTS}cart.png` });

// ---------- 6. Checkout ----------
await check("checkout form renders with summary", async () => {
  await page.locator("[data-testid='go-to-checkout']").click();
  await page.waitForURL("**/checkout");
  await page.locator("[data-testid='checkout-form']").waitFor();
  const total = await page.locator("[data-testid='checkout-total']").textContent();
  if (!total.includes("400")) throw new Error(`total ${total}`);
});
await check("checkout validates empty fields", async () => {
  await page.locator("[data-testid='place-order']").click();
  const invalid = await page.$$eval(":invalid", (els) => els.length);
  if (invalid === 0) throw new Error("native validation did not trigger");
});
await page.screenshot({ path: `${SHOTS}checkout.png`, fullPage: true });

await check(
  EXPECT_ORDER ? "order placement succeeds (database live)" : "order placement responds (db may be pending)",
  async () => {
    await page.fill("input[name='name']", "QA Tester");
    await page.fill("input[name='phone']", "+258 84 123 4567");
    await page.selectOption("select[name='area']", "Polana");
    await page.fill("textarea[name='note']", "Playwright QA order — safe to ignore");
    await page.locator("[data-testid='place-order']").click();
    if (EXPECT_ORDER) {
      await page.waitForURL("**/order/SR-**", { timeout: 15000 });
      await page.locator("[data-testid='order-thanks']").waitFor();
      const num = await page.locator("[data-testid='order-number']").textContent();
      if (!num.startsWith("SR-")) throw new Error(`bad order number ${num}`);
      await page.screenshot({ path: `${SHOTS}order-confirmation.png`, fullPage: true });
    } else {
      await Promise.race([
        page.waitForURL("**/order/SR-**", { timeout: 15000 }),
        page.locator("[data-testid='checkout-error']").waitFor({ timeout: 15000 }),
      ]);
    }
  }
);

// ---------- 7. Mobile ----------
const mobile = await newPage({ width: 390, height: 844 });
await check("mobile home + menu works", async () => {
  await mobile.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await mobile.getByLabel("Toggle menu").click();
  await mobile.locator("nav[aria-label='Mobile'] a", { hasText: "Shop" }).click();
  await mobile.waitForURL("**/shop");
  const n = await mobile.locator("[data-testid='product-card']").count();
  if (n < 1) throw new Error("no products on mobile shop");
});
await mobile.screenshot({ path: `${SHOTS}mobile-home.png`, fullPage: false });

// ---------- 8. SEO basics ----------
await check("product page has JSON-LD and meta description", async () => {
  await page.goto(`${BASE}/products/blossom`, { waitUntil: "domcontentloaded" });
  const ld = await page.locator("script[type='application/ld+json']").textContent();
  if (!ld.includes('"Product"')) throw new Error("missing Product JSON-LD");
  const desc = await page
    .locator("meta[name='description']")
    .getAttribute("content");
  if (!desc || desc.length < 40) throw new Error("weak meta description");
});
await check("sitemap lists product urls", async () => {
  const res = await page.request.get(`${BASE}/sitemap.xml`);
  const xml = await res.text();
  if (!xml.includes("/products/dahlia-bowl-set")) throw new Error("sitemap incomplete");
});

// ---------- console errors ----------
const realErrors = consoleErrors.filter(
  (e) => !e.includes("favicon") && !(EXPECT_ORDER ? false : e.includes("store_orders"))
);
if (realErrors.length) {
  fail(`console errors (${realErrors.length})`, realErrors[0]);
} else {
  ok("no console errors across the run");
}

await browser.close();
console.log(
  failures === 0
    ? `\nAll checks passed. Screenshots in qa-shots/.\n`
    : `\n${failures} CHECK(S) FAILED.\n`
);
process.exit(failures === 0 ? 0 : 1);
