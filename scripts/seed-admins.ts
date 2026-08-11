// Creates (or, if still pending, re-invites) the initial admin accounts.
// Safe to re-run: existing active/disabled admins are left untouched.
//
// Usage: npm run db:seed  (runs this, then seed-content.ts)
// Or directly: tsx --env-file=.env.local scripts/seed-admins.ts

import { eq } from "drizzle-orm";
import { db } from "../src/db/client";
import { admins } from "../src/db/schema";
import { generateToken, sha256Hex } from "../src/lib/security";

const INITIAL_ADMIN_EMAILS = ["l.zahran.kewan@gmail.com", "zahran.hm@sgs.gov.sa"];

const SETUP_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const siteUrl = process.env["SITE_URL"] ?? "http://localhost:3000";

async function seedAdmin(rawEmail: string) {
  const email = rawEmail.trim().toLowerCase();
  const [existing] = await db.select().from(admins).where(eq(admins.email, email)).limit(1);

  if (existing && existing.status !== "pending") {
    console.log(`- ${email}: already ${existing.status}, skipping.`);
    return;
  }

  const token = generateToken();
  const setupTokenHash = await sha256Hex(token);
  const setupTokenExpiresAt = new Date(Date.now() + SETUP_TOKEN_TTL_MS);

  if (existing) {
    await db
      .update(admins)
      .set({ setupTokenHash, setupTokenExpiresAt, updatedAt: new Date() })
      .where(eq(admins.id, existing.id));
    console.log(`- ${email}: pending invite refreshed.`);
  } else {
    await db.insert(admins).values({
      email,
      status: "pending",
      setupTokenHash,
      setupTokenExpiresAt,
    });
    console.log(`- ${email}: created pending invite.`);
  }

  console.log(`  Setup link: ${siteUrl}/admin/setup?token=${token}`);
}

async function main() {
  console.log("Seeding admin accounts...\n");
  for (const email of INITIAL_ADMIN_EMAILS) {
    await seedAdmin(email);
  }
  console.log("\nDone. Setup links are one-time use and expire in 7 days.");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
