import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { collaborations } from "@/db/schema";
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

const ENTITY_TYPE = "collaboration";
const summarize = (row: Record<string, unknown>) => String(row["position"] ?? row["id"]);

const insertSchema = z.object({
  position: safeString(300, 1),
  positionAr: safeString(300, 1),
  organization: safeString(300, 1),
  organizationAr: safeString(300, 1),
  startLabel: safeString(50, 1),
  endLabel: safeString(50, 1),
  description: safeString(4000).optional(),
  descriptionAr: safeString(4000).optional(),
});
const updateSchema = insertSchema.partial().and(z.object({ id: z.string().uuid() }));
const idSchema = z.object({ id: z.string().uuid() });
const reorderSchema = z.object({ orderedIds: z.array(z.string().uuid()) });

const list = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  requireAdmin(context);
  return genericList(collaborations);
});

const create = createServerFn({ method: "POST" })
  .validator(insertSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    return genericCreate(collaborations, data, ENTITY_TYPE, admin.id, summarize);
  });

const update = createServerFn({ method: "POST" })
  .validator(updateSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    return genericUpdate(collaborations, data, ENTITY_TYPE, admin.id, summarize);
  });

const remove = createServerFn({ method: "POST" })
  .validator(idSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    return genericRemove(collaborations, data.id, ENTITY_TYPE, admin.id, summarize);
  });

const reorder = createServerFn({ method: "POST" })
  .validator(reorderSchema)
  .handler(async ({ data, context }) => {
    requireAdmin(context);
    return genericReorder(collaborations, data.orderedIds);
  });

export const collaborationsCrud = {
  list,
  create,
  update,
  remove,
  reorder,
} as unknown as CollectionCrudApi;
