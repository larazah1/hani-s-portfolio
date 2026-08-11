import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { memberships } from "@/db/schema";
import { safeString } from "@/lib/text-validation";
import { requireAdmin } from "../require-admin";
import {
  genericCreate,
  genericList,
  genericRemove,
  genericReorder,
  genericUpdate,
} from "../collection-helpers";
import type { CollectionCrudApi } from "../collection-helpers";

const ENTITY_TYPE = "membership";
const summarize = (row: Record<string, unknown>) => String(row["title"] ?? row["id"]);

const insertSchema = z.object({
  title: safeString(300).min(1),
  titleAr: safeString(300).min(1),
  period: safeString(100).optional(),
  description: safeString(4000).optional(),
  descriptionAr: safeString(4000).optional(),
});
const updateSchema = insertSchema.partial().and(z.object({ id: z.string().uuid() }));
const idSchema = z.object({ id: z.string().uuid() });
const reorderSchema = z.object({ orderedIds: z.array(z.string().uuid()) });

const list = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  requireAdmin(context);
  return genericList(memberships);
});

const create = createServerFn({ method: "POST" })
  .validator(insertSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    return genericCreate(memberships, data, ENTITY_TYPE, admin.id, summarize);
  });

const update = createServerFn({ method: "POST" })
  .validator(updateSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    return genericUpdate(memberships, data, ENTITY_TYPE, admin.id, summarize);
  });

const remove = createServerFn({ method: "POST" })
  .validator(idSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    return genericRemove(memberships, data.id, ENTITY_TYPE, admin.id, summarize);
  });

const reorder = createServerFn({ method: "POST" })
  .validator(reorderSchema)
  .handler(async ({ data, context }) => {
    requireAdmin(context);
    return genericReorder(memberships, data.orderedIds);
  });

export const membershipsCrud = {
  list,
  create,
  update,
  remove,
  reorder,
} as unknown as CollectionCrudApi;
