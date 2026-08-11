import "@tanstack/react-start/server-only";

import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { admins } from "@/db/schema";
import { getAdminSessionAdminId } from "@/lib/session.server";

export type CurrentAdmin = {
  id: string;
  email: string;
  status: "pending" | "active" | "disabled";
};

/**
 * Resolves the admin for the current request from the session cookie,
 * re-checking their live DB status on every call. This is what makes
 * disabling an admin take effect instantly, without a sessions table to
 * separately revoke — there's nothing to revoke, the next request just
 * won't resolve to an admin anymore.
 */
export async function resolveCurrentAdmin(): Promise<CurrentAdmin | null> {
  const adminId = await getAdminSessionAdminId();
  if (!adminId) return null;

  const [row] = await db
    .select({ id: admins.id, email: admins.email, status: admins.status })
    .from(admins)
    .where(eq(admins.id, adminId))
    .limit(1);

  if (!row || row.status !== "active") return null;
  return row;
}
