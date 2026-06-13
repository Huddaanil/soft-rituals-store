// Live owner-panel QA. Logs in, exercises every owner action against the
// REAL site + database, adversarially verifies persistence via the public
// REST API, and cleans up all test data.
//
// Usage: node scripts/admin-qa.mjs <baseUrl> <adminPassword>
import { chromium } from "playwright";

const BASE = (process.argv[2] ?? "https://www.ssoftrituals.com").replace(/\/$/, "");
const PW = process.argv[3];
if (!PW) {
  console.error("Provide the admin password as the 2nd argument.");
  process.exit(2);
}
const SUPA = "https://famgmcdoximypahdbqzn.supabase.co";
const ANON = "sb_publishable_nH3UIomo6dHa4dligNiukQ_OjuOCMN_";
const IMG = new URL("../public/products/blossom.jpg", import.meta.url).pathname;

let fails = 0;
const ok = (m) => console.log(`  ✓ ${m}`);
const no = (m, d = "") => { fails++; console.log(`  ✗ ${m}${d ? " — " + d : ""}`); };
const check = async (m, fn) => { try { await fn(); ok(m); } catch (e) { no(m, e.message?.split("\n")[0]); } };

// Read the DB through the public API (read-only) to prove persistence.
async function db(path) {
  const r = await fetch(`${SUPA}/rest/v1/${path}`, {
    headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
  });
  return r.ok ? r.json() : [];
}
async function dbProduct(slug) {
  const rows = await db(`store_products?slug=eq.${slug}&select=slug,name,price,active,image,category`);
  return rows[0] ?? null;
}
async function retry(fn, tries = 8, gapMs = 2500) {
  for (let i = 0; i < tries; i++) {
    try { if (await fn()) return true; } catch {}
    await new Promise((r) => setTimeout(r, gapMs));
  }
  return false;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
const consoleErrors = [];
page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
page.on("pageerror", (e) => consoleErrors.push(e.message));

console.log(`\nOwner-panel QA against ${BASE}\n`);

// ---------- LOGIN ----------
await check("login with the owner password reaches the dashboard", async () => {
  await page.goto(`${BASE}/admin/login`, { waitUntil: "networkidle" });
  await page.fill("input[name=password]", PW);
  await page.click("button[type=submit]");
  await page.waitForURL("**/admin", { timeout: 12000 });
  const body = await page.textContent("body");
  if (!body.includes("Owner panel")) throw new Error("dashboard heading missing");
  if (body.includes("not set up yet"))
    throw new Error("ADMIN_PASSWORD/SERVICE key not configured in Vercel");
  if (body.includes("is not set"))
    throw new Error("SUPABASE_SERVICE_ROLE_KEY not set in Vercel");
});

await check("dashboard lists real products (service-role read works)", async () => {
  const rows = await page.locator("li:has-text('Iced Latte')").count();
  if (rows < 1) throw new Error("Iced Latte row not found in admin list");
});

// ---------- pre-clean any leftovers from a previous run ----------
async function removeIfExists(slug) {
  if (await dbProduct(slug)) {
    await page.goto(`${BASE}/admin/product/${slug}`, { waitUntil: "networkidle" });
    if (await page.locator("text=Remove this product").count()) {
      await page.click("text=Remove this product");
      await page.locator("[data-testid=confirm-delete]").click();
      await page.waitForURL("**/admin**", { timeout: 12000 });
    }
  }
}
await removeIfExists("qa-temp-candle");

// ---------- TEST A: edit a price, verify, revert ----------
const SENTINEL = 13577;
let originalPrice = null;
await check("edit price saves and shows on the public product page", async () => {
  const before = await dbProduct("iced-latte");
  if (!before) throw new Error("iced-latte missing");
  originalPrice = before.price;
  await page.goto(`${BASE}/admin/product/iced-latte`, { waitUntil: "networkidle" });
  await page.fill("input[name=price]", String(SENTINEL));
  await page.click("button:has-text('Save changes')");
  await page.waitForURL("**/admin?saved=**", { timeout: 12000 });
  const persisted = await retry(async () => (await dbProduct("iced-latte"))?.price === SENTINEL);
  if (!persisted) throw new Error("price did not persist to DB");
  const shown = await retry(async () => {
    const r = await fetch(`${BASE}/products/iced-latte`, { cache: "no-store" });
    const html = await r.text();
    return html.includes("13 577") || html.includes("13,577");
  });
  if (!shown) throw new Error("new price not visible on public PDP");
});
await check("revert price leaves the catalog unchanged", async () => {
  await page.goto(`${BASE}/admin/product/iced-latte`, { waitUntil: "networkidle" });
  await page.fill("input[name=price]", String(originalPrice));
  await page.click("button:has-text('Save changes')");
  await page.waitForURL("**/admin?saved=**", { timeout: 12000 });
  const back = await retry(async () => (await dbProduct("iced-latte"))?.price === originalPrice);
  if (!back) throw new Error("price not reverted");
});

// ---------- TEST B: hide then show a product ----------
await check("hiding a product removes it from the public shop", async () => {
  await page.goto(`${BASE}/admin/product/blossom`, { waitUntil: "networkidle" });
  const cb = page.locator("input[name=active]");
  if (await cb.isChecked()) await cb.uncheck();
  await page.click("button:has-text('Save changes')");
  await page.waitForURL("**/admin?saved=**", { timeout: 12000 });
  const hidden = await retry(async () => (await dbProduct("blossom"))?.active === false);
  if (!hidden) throw new Error("not marked inactive in DB");
  const goneFromShop = await retry(async () => {
    const html = await (await fetch(`${BASE}/shop`, { cache: "no-store" })).text();
    return !html.includes("/products/blossom");
  });
  if (!goneFromShop) throw new Error("still listed on /shop");
});
await check("showing it again restores it", async () => {
  await page.goto(`${BASE}/admin/product/blossom`, { waitUntil: "networkidle" });
  const cb = page.locator("input[name=active]");
  if (!(await cb.isChecked())) await cb.check();
  await page.click("button:has-text('Save changes')");
  await page.waitForURL("**/admin?saved=**", { timeout: 12000 });
  const back = await retry(async () => (await dbProduct("blossom"))?.active === true);
  if (!back) throw new Error("not restored to active");
});

// ---------- TEST C: add a section, verify, delete ----------
await check("adding a section makes it appear in the shop", async () => {
  await page.goto(`${BASE}/admin`, { waitUntil: "networkidle" });
  await page.fill("input[name=name]", "QA Temp Bath");
  await page.click("button:has-text('Add section')");
  await page.waitForURL("**/admin?saved=**", { timeout: 12000 });
  const inShop = await retry(async () => {
    const html = await (await fetch(`${BASE}/shop`, { cache: "no-store" })).text();
    return html.includes("category=qa-temp-bath");
  });
  if (!inShop) throw new Error("new section not in /shop nav");
});
await check("deleting the empty section removes it", async () => {
  await page.goto(`${BASE}/admin`, { waitUntil: "networkidle" });
  await page.click("button[aria-label='Remove the QA Temp Bath section']");
  const gone = await retry(async () => {
    const rows = await db("store_categories?slug=eq.qa-temp-bath&select=slug");
    return rows.length === 0;
  });
  if (!gone) throw new Error("section still in DB");
});

// ---------- TEST D: add a product with a photo, verify, delete ----------
await check("adding a product with an uploaded photo works end-to-end", async () => {
  await page.goto(`${BASE}/admin/product/new`, { waitUntil: "networkidle" });
  await page.fill("input[name=name]", "QA Temp Candle");
  await page.fill("input[name=price]", "999");
  await page.selectOption("select[name=category]", "candles");
  await page.fill("input[name=short]", "Temporary QA item — safe to ignore.");
  await page.setInputFiles("input[name=photo]", IMG);
  await page.click("button:has-text('Add product')");
  await page.waitForURL("**/admin?saved=**", { timeout: 20000 });
  const row = await retry(async () => {
    const p = await dbProduct("qa-temp-candle");
    return p && p.image.includes("supabase.co/storage") ? p : false;
  });
  if (!row) throw new Error("product missing or photo not stored in Supabase Storage");
  const onShop = await retry(async () => {
    const html = await (await fetch(`${BASE}/shop`, { cache: "no-store" })).text();
    return html.includes("/products/qa-temp-candle");
  });
  if (!onShop) throw new Error("new product not on /shop");
});
await check("deleting the test product cleans it up", async () => {
  await page.goto(`${BASE}/admin/product/qa-temp-candle`, { waitUntil: "networkidle" });
  await page.click("text=Remove this product");
  await page.locator("[data-testid=confirm-delete]").click();
  await page.waitForURL("**/admin**", { timeout: 12000 });
  const gone = await retry(async () => (await dbProduct("qa-temp-candle")) === null);
  if (!gone) throw new Error("product still in DB after delete");
});

// ---------- logout re-gates the panel ----------
await check("signing out re-locks the panel", async () => {
  await page.goto(`${BASE}/admin`, { waitUntil: "networkidle" });
  await page.click("button:has-text('Sign out')");
  await page.waitForURL("**/admin/login**", { timeout: 12000 });
  const r = await fetch(`${BASE}/admin`, { redirect: "manual" });
  if (r.status !== 307 && r.status !== 308)
    throw new Error(`/admin not gated after logout (status ${r.status})`);
});

const realErrors = consoleErrors.filter((e) => !/favicon|hydration|Download the React/i.test(e));
realErrors.length ? no(`console errors (${realErrors.length})`, realErrors[0]) : ok("no console errors during admin QA");

await browser.close();
console.log(fails === 0 ? "\nOWNER-PANEL QA: ALL PASSED\n" : `\n${fails} CHECK(S) FAILED\n`);
process.exit(fails === 0 ? 0 : 1);
