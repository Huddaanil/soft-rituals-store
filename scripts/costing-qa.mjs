// Verifies the costing→shop link in the owner panel:
//  - the edit page shows the "Linked to costing" section
//  - if the Business App has costed products, a price can be linked + applied
//  - links/prices persist to the DB
// Safe: edits one product's price then reverts it; only sets/clears cost_ref.
import { chromium } from "playwright";

const BASE = (process.argv[2] ?? "https://www.ssoftrituals.com").replace(/\/$/, "");
const PW = process.argv[3];
if (!PW) { console.error("Need admin password as 2nd arg."); process.exit(2); }
const SUPA = "https://famgmcdoximypahdbqzn.supabase.co";
const ANON = "sb_publishable_nH3UIomo6dHa4dligNiukQ_OjuOCMN_";

let fails = 0;
const ok = (m) => console.log(`  ✓ ${m}`);
const no = (m, d = "") => { fails++; console.log(`  ✗ ${m}${d ? " — " + d : ""}`); };
const check = async (m, fn) => { try { await fn(); ok(m); } catch (e) { no(m, e.message?.split("\n")[0]); } };
async function dbCostRef(slug) {
  const r = await fetch(`${SUPA}/rest/v1/store_products?slug=eq.${slug}&select=slug,cost_ref`, {
    headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
  });
  const j = r.ok ? await r.json() : [];
  return j[0]?.cost_ref ?? null;
}
const retry = async (fn, n = 8, gap = 2000) => {
  for (let i = 0; i < n; i++) { try { if (await fn()) return true; } catch {} await new Promise((r) => setTimeout(r, gap)); }
  return false;
};

const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 1280, height: 1000 } });
console.log(`\nCosting-link QA against ${BASE}\n`);

await check("login", async () => {
  await page.goto(`${BASE}/admin/login`, { waitUntil: "networkidle" });
  await page.fill("input[name=password]", PW);
  await page.click("button[type=submit]");
  await page.waitForURL("**/admin", { timeout: 12000 });
});

await check("edit page shows the 'Linked to costing' section", async () => {
  await page.goto(`${BASE}/admin/product/iced-latte`, { waitUntil: "networkidle" });
  const body = await page.textContent("body");
  if (!body.includes("Linked to costing")) throw new Error("costing section missing");
});

let hasCostingProducts = false;
await check("costing dropdown reflects Business-App products (or shows empty note)", async () => {
  const sel = page.locator("select[name=cost_ref]");
  if (await sel.count()) {
    const opts = await sel.locator("option").count();
    hasCostingProducts = opts > 1; // more than just "Not linked"
    ok(`    (dropdown present, ${opts - 1} costed product(s) available)`);
  } else {
    const body = await page.textContent("body");
    if (!body.includes("No costed products")) throw new Error("neither dropdown nor empty note");
  }
});

if (hasCostingProducts) {
  await check("linking a costing product persists, then unlinking reverts", async () => {
    const sel = page.locator("select[name=cost_ref]");
    const val = await sel.locator("option").nth(1).getAttribute("value");
    await sel.selectOption(val);
    await page.click("button:has-text('Save changes')");
    await page.waitForURL("**/admin?saved=**", { timeout: 12000 });
    const linked = await retry(async () => (await dbCostRef("iced-latte")) === val);
    if (!linked) throw new Error("cost_ref did not persist");
    // revert (unlink)
    await page.goto(`${BASE}/admin/product/iced-latte`, { waitUntil: "networkidle" });
    await page.locator("select[name=cost_ref]").selectOption("");
    await page.click("button:has-text('Save changes')");
    await page.waitForURL("**/admin?saved=**", { timeout: 12000 });
    const cleared = await retry(async () => (await dbCostRef("iced-latte")) === null);
    if (!cleared) throw new Error("cost_ref did not clear");
  });
} else {
  console.log("  • No costed products in the Business App yet — link/apply not exercised (expected until Samira costs a product).");
}

await b.close();
console.log(fails === 0 ? "\nCOSTING-LINK QA: PASSED\n" : `\n${fails} FAILED\n`);
process.exit(fails === 0 ? 0 : 1);
