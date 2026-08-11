import { createServerFn } from "@tanstack/react-start";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import {
  admins,
  contactMessages,
  mediaItems,
  pageViewCounts,
  pages,
  publications,
  recommendations,
} from "@/db/schema";
import { requireAdmin } from "./require-admin";

export const getDashboardData = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  requireAdmin(context);

  const [
    [publicationRow],
    [mediaRow],
    [recommendationRow],
    [pageRow],
    [unreadMessageRow],
    [activeAdminRow],
    [totalViewsRow],
    topPages,
    [homePage],
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(publications),
    db.select({ count: sql<number>`count(*)::int` }).from(mediaItems),
    db.select({ count: sql<number>`count(*)::int` }).from(recommendations),
    db.select({ count: sql<number>`count(*)::int` }).from(pages),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(contactMessages)
      .where(eq(contactMessages.status, "unread")),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(admins)
      .where(eq(admins.status, "active")),
    db
      .select({ total: sql<number>`coalesce(sum(${pageViewCounts.count}), 0)::int` })
      .from(pageViewCounts),
    db
      .select({ path: pageViewCounts.path, count: pageViewCounts.count })
      .from(pageViewCounts)
      .orderBy(desc(pageViewCounts.count))
      .limit(5),
    db.select({ id: pages.id }).from(pages).where(eq(pages.path, "/")).limit(1),
  ]);

  return {
    counts: {
      publications: publicationRow?.count ?? 0,
      media: mediaRow?.count ?? 0,
      recommendations: recommendationRow?.count ?? 0,
      pages: pageRow?.count ?? 0,
      unreadMessages: unreadMessageRow?.count ?? 0,
      activeAdmins: activeAdminRow?.count ?? 0,
      totalViews: totalViewsRow?.total ?? 0,
    },
    topPages,
    homePageId: homePage?.id ?? null,
  };
});
