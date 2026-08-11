const { chromium } = require("playwright");
const shotDir =
  "/private/tmp/claude-501/-Users-lara-zahran--hani-zahran2-zahran-portal-react/3db254ad-071b-4ec6-870d-6bc43a9206c0/scratchpad/shots";

const ADMIN_ROUTES = [
  "/admin",
  "/admin/pages",
  "/admin/publications",
  "/admin/media",
  "/admin/recommendations",
  "/admin/profile",
  "/admin/career",
  "/admin/education",
  "/admin/expertise",
  "/admin/research-specialties",
  "/admin/memberships",
  "/admin/activities",
  "/admin/interests",
  "/admin/stats",
  "/admin/social-links",
  "/admin/messages",
  "/admin/settings",
  "/admin/admins",
  "/admin/change-password",
];

(async () => {
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto("http://localhost:3000/admin/login", { waitUntil: "networkidle" });

  // Login page itself should already be Arabic/RTL (unauthenticated route).
  const loginHtmlDir = await page.evaluate(() => document.documentElement.dir);
  const loginHtmlLang = await page.evaluate(() => document.documentElement.lang);
  console.log("Login page dir/lang:", loginHtmlDir, loginHtmlLang);
  const loginText = await page.locator("body").innerText();
  console.log("Login page shows Arabic heading?", loginText.includes("تسجيل دخول المسؤول"));
  await page.screenshot({ path: `${shotDir}/ar-admin-login.png` });

  await page.fill('input[name="email"]', "l.zahran.kewan@gmail.com");
  await page.fill('input[name="password"]', "correct-horse-battery-staple-9");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(800);

  const htmlDir = await page.evaluate(() => document.documentElement.dir);
  const htmlLang = await page.evaluate(() => document.documentElement.lang);
  console.log("Post-login dir/lang:", htmlDir, htmlLang);

  // Sidebar should now be docked on the visual RIGHT.
  const sidebarBox = await page
    .locator('[data-slot="sidebar"], [data-sidebar="sidebar"]')
    .first()
    .boundingBox();
  const viewport = page.viewportSize();
  console.log(
    "Sidebar docked on the right?",
    sidebarBox && viewport && sidebarBox.x + sidebarBox.width >= viewport.width - 5,
  );

  for (const path of ADMIN_ROUTES) {
    await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    const text = await page.locator("body").innerText();
    const crashed = text.includes("Something went wrong") || text.includes("didn't load");
    // crude leftover-English heuristic: look for common English admin words that should be gone
    const hasObviousEnglish = /\b(Loading|Save|Cancel|Delete|Edit|Add)\b/.test(text);
    console.log(`${path}: crashed=${crashed} obviousEnglishLeftover=${hasObviousEnglish}`);
  }

  await page.goto("http://localhost:3000/admin", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${shotDir}/ar-admin-dashboard.png`, fullPage: true });

  await page.goto("http://localhost:3000/admin/publications", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${shotDir}/ar-admin-publications.png`, fullPage: true });

  await page.goto("http://localhost:3000/admin/pages", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const pagesRows = await page.locator("li").first();
  await page.screenshot({ path: `${shotDir}/ar-admin-pages.png`, fullPage: true });

  await page.goto("http://localhost:3000/admin/admins", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${shotDir}/ar-admin-admins.png`, fullPage: true });

  await page.goto("http://localhost:3000/admin/research-specialties", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: "إضافة" }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${shotDir}/ar-admin-dialog.png` });
  await page.keyboard.press("Escape").catch(() => {});

  // Public site should be UNAFFECTED - still whatever language it defaults to (English).
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const publicDir = await page.evaluate(() => document.documentElement.dir);
  const publicLang = await page.evaluate(() => document.documentElement.lang);
  console.log("Public homepage dir/lang (should be ltr/en by default):", publicDir, publicLang);
  const publicText = await page.locator("body").innerText();
  console.log("Public homepage still in English?", publicText.includes("Publications"));
  await page.screenshot({ path: `${shotDir}/ar-public-unaffected.png`, fullPage: true });

  console.log("ERRORS:", JSON.stringify(errors));
  await browser.close();
})();
