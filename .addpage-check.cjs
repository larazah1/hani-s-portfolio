const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });

  await page.goto("http://localhost:3000/admin/login", { waitUntil: "networkidle" });
  await page.fill('input[name="email"]', "l.zahran.kewan@gmail.com");
  await page.fill('input[name="password"]', "correct-horse-battery-staple-9");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(800);

  await page.goto("http://localhost:3000/admin/pages", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const listText = await page.locator("body").innerText();
  console.log("Pages list still loads (crashed)?", listText.includes("Something went wrong"));
  console.log("'Add Page' button gone from list?", !listText.includes("إضافة صفحة"));
  console.log("Existing pages still listed?", /\/about|\/contact|\/publications/.test(listText));

  await page.goto("http://localhost:3000/admin/pages/new", { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  const newPageText = await page.locator("body").innerText();
  console.log("/admin/pages/new now 404s?", newPageText.includes("Not Found") || newPageText.toLowerCase().includes("404"));

  await page.goto("http://localhost:3000/admin", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const dashText = await page.locator("body").innerText();
  console.log("Dashboard crashed?", dashText.includes("Something went wrong"));
  console.log("Dashboard no longer shows 'Add New Page' quick action?", !dashText.includes("إضافة صفحة جديدة"));
  console.log("Dashboard still shows 'Edit Homepage Sections'?", dashText.includes("تعديل أقسام الصفحة الرئيسية"));

  // Confirm editing an existing page's sections still fully works.
  await page.goto("http://localhost:3000/admin/pages", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.getByRole("link", { name: "تعديل الأقسام" }).first().click();
  await page.waitForTimeout(500);
  const editText = await page.locator("body").innerText();
  console.log("Page section editor still works?", editText.includes("إضافة قسم"));

  await browser.close();
})();
