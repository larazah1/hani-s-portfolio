// Ultimate-fallback account recovery, for when every admin is locked out and
// there's no one else to generate a reset link from inside the panel. Requires
// direct server/database access (this is the point — it's a stronger bar than
// just knowing someone's email address).
//
// Usage: tsx --env-file=.env.local scripts/reset-admin-password.ts <email>

import { eq } from "drizzle-orm";
import { db } from "../src/db/client";
import { admins } from "../src/db/schema";
import { generateToken, sha256Hex } from "../src/lib/security";

const SETUP_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const siteUrl = process.env["SITE_URL"] ?? "http://localhost:3000";

async function main() {
  const rawEmail = process.argv[2];
  if (!rawEmail) {
    console.error("Usage: tsx --env-file=.env.local scripts/reset-admin-password.ts <email>");
    process.exit(1);
  }
  const email = rawEmail.trim().toLowerCase();

  const [existing] = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
  if (!existing) {
    console.error(`No admin found with email ${email}.`);
    process.exit(1);
  }

  const token = generateToken();
  const setupTokenHash = await sha256Hex(token);
  const setupTokenExpiresAt = new Date(Date.now() + SETUP_TOKEN_TTL_MS);

  await db
    .update(admins)
    .set({ setupTokenHash, setupTokenExpiresAt, updatedAt: new Date() })
    .where(eq(admins.id, existing.id));

  console.log(`Reset link for ${email}: ${siteUrl}/admin/setup?token=${token}`);
  if (existing.status === "disabled") {
    console.warn(
      "Note: this admin's status is currently 'disabled' — setting a new password will not " +
        "by itself let them log in. Re-enable the account first (via db:studio or another " +
        "active admin's Admins page).",
    );
  }
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
