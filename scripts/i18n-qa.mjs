// Bilingual behaviour QA (locale routing, toggle, localized chrome/cart/checkout,
// hreflang, admin PT fields). Product *content* translation is verified live
// after the DB migration; here product fields may fall back to English.
import { chromium } from "playwright";

const BASE = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const ADMIN_PW = process.argv[3] ?? "test-pass-123";
let fails = 0;
const ok = (m) => console.log(`  ✓ ${m}`);
const no = (m, d = "") => { fails++; console.log(`  ✗ ${m}${d ? " — " + d : ""}`); };
const check = async (m, fn) => { try { await fn(); ok(m); } catch (e) { no(m, e.message?.split("\n")[0]); } };

const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 1280, height: 1000 } });

console.log(`\nBilingual QA against ${BASE}\n`);

await check("/ redirects to /pt (Portuguese default)", async () => {
  const r = await fetch(`${BASE}/`, { redirect: "manual" });
  const loc = r.headers.get("location") || "";
  if (!(r.status === 307 || r.status === 308) || !loc.endsWith("/pt"))
    throw new Error(`got ${r.status} → ${loc}`);
});

await check("PT home: Portuguese hero + lang attr", async () => {
  await page.goto(`${BASE}/pt`, { waitUntil: "networkidle" });
  const lang = await page.locator("html").getAttribute("lang");
  if (lang !== "pt") throw new Error(`html lang=${lang}`);
  const body = await page.textContent("body");
  if (!body.includes("Trabalha demais")) throw new Error("PT hero missing");
});

await check("EN home: English hero + lang attr", async () => {
  await page.goto(`${BASE}/en`, { waitUntil: "networkidle" });
  const lang = await page.locator("html").getAttribute("lang");
  if (lang !== "en") throw new Error(`html lang=${lang}`);
  const body = await page.textContent("body");
  if (!body.includes("You work too much")) throw new Error("EN hero missing");
});

await check("toggle EN→PT preserves the page (shop stays shop)", async () => {
  await page.goto(`${BASE}/en/shop`, { waitUntil: "networkidle" });
  await page.click("a[aria-current='true'] ~ a, [role='group'] a:has-text('PT')");
  await page.waitForURL("**/pt/shop**", { timeout: 8000 });
});

await check("toggle keeps you on the same product", async () => {
  await page.goto(`${BASE}/pt/products/iced-latte`, { waitUntil: "networkidle" });
  await page.locator("[role='group'] a:has-text('EN')").click();
  await page.waitForURL("**/en/products/iced-latte", { timeout: 8000 });
});

await check("nav links are locale-prefixed", async () => {
  await page.goto(`${BASE}/pt`, { waitUntil: "networkidle" });
  const hrefs = await page.$$eval("header nav a", (as) => as.map((a) => a.getAttribute("href")));
  if (!hrefs.every((h) => h && h.startsWith("/pt/")))
    throw new Error("found non-/pt nav link: " + hrefs.join(","));
});

await check("cart drawer is localized (PT)", async () => {
  await page.goto(`${BASE}/pt/products/iced-latte`, { waitUntil: "networkidle" });
  await page.locator("[data-testid=add-to-cart]").click();
  await page.locator("[data-testid=cart-line]").waitFor({ timeout: 5000 });
  const drawer = await page.textContent("[role=dialog]");
  if (!drawer.includes("Finalizar encomenda")) throw new Error("PT checkout button missing");
  if (!drawer.includes("Subtotal")) throw new Error("subtotal label missing");
});

await check("checkout page is localized (PT)", async () => {
  await page.goto(`${BASE}/pt/checkout`, { waitUntil: "networkidle" });
  const body = await page.textContent("body");
  if (!body.includes("Finalizar encomenda")) throw new Error("PT checkout title missing");
  if (!body.includes("Zona de entrega")) throw new Error("PT area label missing");
});

await check("checkout page is localized (EN)", async () => {
  await page.goto(`${BASE}/en/checkout`, { waitUntil: "networkidle" });
  const body = await page.textContent("body");
  if (!body.includes("Delivery area")) throw new Error("EN area label missing");
});

await check("product page exposes hreflang alternates", async () => {
  await page.goto(`${BASE}/pt/products/blossom`, { waitUntil: "domcontentloaded" });
  const alts = await page.$$eval("link[rel=alternate]", (ls) =>
    ls.map((l) => l.getAttribute("hreflang") + ":" + l.getAttribute("href"))
  );
  const hasPt = alts.some((a) => a.startsWith("pt:") && a.includes("/pt/products/blossom"));
  const hasEn = alts.some((a) => a.startsWith("en:") && a.includes("/en/products/blossom"));
  if (!hasPt || !hasEn) throw new Error("missing hreflang: " + alts.join(" | "));
});

await check("admin still gated and login works", async () => {
  const r = await fetch(`${BASE}/admin`, { redirect: "manual" });
  if (r.status !== 307 && r.status !== 308) throw new Error(`/admin not gated (${r.status})`);
  await page.goto(`${BASE}/admin/login`, { waitUntil: "networkidle" });
  await page.fill("input[name=password]", ADMIN_PW);
  await page.click("button[type=submit]");
  await page.waitForURL("**/admin", { timeout: 10000 });
});

await check("admin edit form has Portuguese fields", async () => {
  await page.goto(`${BASE}/admin/product/iced-latte`, { waitUntil: "networkidle" });
  const hasNamePt = await page.locator("input[name=name_pt]").count();
  const hasStoryPt = await page.locator("textarea[name=story_pt]").count();
  if (!hasNamePt || !hasStoryPt) throw new Error("PT fields missing on product form");
});

await check("admin section manager has Portuguese fields", async () => {
  await page.goto(`${BASE}/admin`, { waitUntil: "networkidle" });
  const hasNamePt = await page.locator("input[name=name_pt]").count();
  if (!hasNamePt) throw new Error("PT field missing on category manager");
});

await b.close();
console.log(fails === 0 ? "\nBILINGUAL QA: ALL PASSED\n" : `\n${fails} FAILED\n`);
process.exit(fails === 0 ? 0 : 1);
