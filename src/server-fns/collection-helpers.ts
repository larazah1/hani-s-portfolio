/* eslint-disable @typescript-eslint/no-explicit-any -- shared across
   heterogeneous Drizzle tables; each collection module supplies a real,
   concrete Zod schema as the actual runtime safety net. */
import "@tanstack/react-start/server-only";

import { asc, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { activityLog } from "@/db/schema";

// Plain business-logic helpers shared by each collection's server functions.
// Deliberately NOT `createServerFn` calls themselves: TanStack Start's
// compiler splits client/server code by finding `createServerFn(...).handler
// (...)` expressions directly in each module, so hiding that call behind a
// factory function that *returns* server functions breaks the split (the
// whole server-only chain — including the Postgres driver — ends up in the
// client bundle, which crashed with "Buffer is not defined" in testing).
// Each collection module below keeps its own top-level `createServerFn`
// calls and delegates only the repeated logic to these helpers.

type AnyOrderedTable = any;

export type CollectionCrudApi = {
  list: () => Promise<Record<string, any>[]>;
  create: (opts: { data: Record<string, any> }) => Promise<Record<string, any>>;
  update: (opts: { data: Record<string, any> & { id: string } }) => Promise<Record<string, any>>;
  remove: (opts: { data: { id: string } }) => Promise<{ ok: true }>;
  reorder: (opts: { data: { orderedIds: string[] } }) => Promise<{ ok: true }>;
};

export async function logActivity(
  adminId: string,
  action: string,
  entityType: string,
  entityId: string | null,
  summary: string,
) {
  await db.insert(activityLog).values({ adminId, action, entityType, entityId, summary });
}

export async function genericList(table: AnyOrderedTable): Promise<Record<string, any>[]> {
  return db.select().from(table).orderBy(asc(table.sortOrder));
}

export async function genericCreate(
  table: AnyOrderedTable,
  data: Record<string, any>,
  entityType: string,
  adminId: string,
  summarize: (row: Record<string, any>) => string,
): Promise<Record<string, any>> {
  const [row0] = await db
    .select({ maxOrder: sql<number>`coalesce(max(${table.sortOrder}), -1)` })
    .from(table);
  const nextOrder = (row0?.maxOrder ?? -1) + 1;
  const [row] = await db
    .insert(table)
    .values({ ...data, sortOrder: nextOrder })
    .returning();
  const savedRow = row as Record<string, any>;
  await logActivity(adminId, "created", entityType, String(savedRow["id"]), summarize(savedRow));
  return savedRow;
}

export async function genericUpdate(
  table: AnyOrderedTable,
  data: Record<string, any> & { id: string },
  entityType: string,
  adminId: string,
  summarize: (row: Record<string, any>) => string,
): Promise<Record<string, any>> {
  const { id, ...fields } = data;
  const [row] = await db
    .update(table)
    .set({ ...fields, updatedAt: new Date() })
    .where(eq(table.id, id))
    .returning();
  if (!row) throw new Error("Not found.");
  const savedRow = row as Record<string, any>;
  await logActivity(adminId, "updated", entityType, id, summarize(savedRow));
  return savedRow;
}

export async function genericRemove(
  table: AnyOrderedTable,
  id: string,
  entityType: string,
  adminId: string,
  summarize: (row: Record<string, any>) => string,
): Promise<{ ok: true }> {
  const [row] = await db.delete(table).where(eq(table.id, id)).returning();
  if (row) {
    await logActivity(adminId, "deleted", entityType, id, summarize(row));
  }
  return { ok: true };
}

export async function genericReorder(
  table: AnyOrderedTable,
  orderedIds: string[],
): Promise<{ ok: true }> {
  await db.transaction(async (tx) => {
    for (const [index, id] of orderedIds.entries()) {
      await tx.update(table).set({ sortOrder: index }).where(eq(table.id, id));
    }
  });
  return { ok: true };
}
