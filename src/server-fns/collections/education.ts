import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { educationEntries } from "@/db/schema";
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

const ENTITY_TYPE = "education_entry";
const summarize = (row: Record<string, unknown>) => String(row["degree"] ?? row["id"]);

const insertSchema = z.object({
  degree: safeString(300).min(1),
  degreeAr: safeString(300).min(1),
  field: safeString(300).min(1),
  fieldAr: safeString(300).min(1),
  university: safeString(300).min(1),
  universityAr: safeString(300).min(1),
  location: safeString(300).min(1),
  locationAr: safeString(300).min(1),
  year: safeString(20).min(1),
  description: safeString(4000).optional(),
  descriptionAr: safeString(4000).optional(),
});
const updateSchema = insertSchema.partial().and(z.object({ id: z.string().uuid() }));
const idSchema = z.object({ id: z.string().uuid() });
const reorderSchema = z.object({ orderedIds: z.array(z.string().uuid()) });

const list = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  requireAdmin(context);
  return genericList(educationEntries);
});

const create = createServerFn({ method: "POST" })
  .validator(insertSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    return genericCreate(educationEntries, data, ENTITY_TYPE, admin.id, summarize);
  });

const update = createServerFn({ method: "POST" })
  .validator(updateSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    return genericUpdate(educationEntries, data, ENTITY_TYPE, admin.id, summarize);
  });

const remove = createServerFn({ method: "POST" })
  .validator(idSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    return genericRemove(educationEntries, data.id, ENTITY_TYPE, admin.id, summarize);
  });

const reorder = createServerFn({ method: "POST" })
  .validator(reorderSchema)
  .handler(async ({ data, context }) => {
    requireAdmin(context);
    return genericReorder(educationEntries, data.orderedIds);
  });

export const educationCrud = {
  list,
  create,
  update,
  remove,
  reorder,
} as unknown as CollectionCrudApi;
