import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { interests } from "@/db/schema";
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

const ENTITY_TYPE = "interest";
const summarize = (row: Record<string, unknown>) => String(row["en"] ?? row["id"]);

const insertSchema = z.object({ en: safeString(300).min(1), ar: safeString(300).min(1) });
const updateSchema = insertSchema.partial().and(z.object({ id: z.string().uuid() }));
const idSchema = z.object({ id: z.string().uuid() });
const reorderSchema = z.object({ orderedIds: z.array(z.string().uuid()) });

const list = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  requireAdmin(context);
  return genericList(interests);
});

const create = createServerFn({ method: "POST" })
  .validator(insertSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    return genericCreate(interests, data, ENTITY_TYPE, admin.id, summarize);
  });

const update = createServerFn({ method: "POST" })
  .validator(updateSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    return genericUpdate(interests, data, ENTITY_TYPE, admin.id, summarize);
  });

const remove = createServerFn({ method: "POST" })
  .validator(idSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    return genericRemove(interests, data.id, ENTITY_TYPE, admin.id, summarize);
  });

const reorder = createServerFn({ method: "POST" })
  .validator(reorderSchema)
  .handler(async ({ data, context }) => {
    requireAdmin(context);
    return genericReorder(interests, data.orderedIds);
  });

export const interestsCrud = {
  list,
  create,
  update,
  remove,
  reorder,
} as unknown as CollectionCrudApi;
