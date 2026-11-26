import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { researchSpecialties } from "@/db/schema";
import { safeString, uuidList, validateWith } from "@/lib/text-validation";
import { requireAdmin } from "../require-admin";
import {
  genericCreate,
  genericList,
  genericRemove,
  genericReorder,
  genericUpdate,
} from "../collection-helpers";
import type { CollectionCrudApi } from "../collection-helpers";

const ENTITY_TYPE = "research_specialty";
const summarize = (row: Record<string, unknown>) => String(row["en"] ?? row["id"]);

const insertSchema = z.object({
  en: safeString(300, 1),
  ar: safeString(300, 1),
  description: safeString(4000).optional(),
  descriptionAr: safeString(4000).optional(),
});
const updateSchema = insertSchema.partial().and(z.object({ id: z.string().uuid() }));
const idSchema = z.object({ id: z.string().uuid() });
const reorderSchema = z.object({ orderedIds: uuidList() });

const list = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  requireAdmin(context);
  return genericList(researchSpecialties);
});

const create = createServerFn({ method: "POST" })
  .validator(validateWith(insertSchema))
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    return genericCreate(researchSpecialties, data, ENTITY_TYPE, admin.id, summarize);
  });

const update = createServerFn({ method: "POST" })
  .validator(validateWith(updateSchema))
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    return genericUpdate(researchSpecialties, data, ENTITY_TYPE, admin.id, summarize);
  });

const remove = createServerFn({ method: "POST" })
  .validator(validateWith(idSchema))
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    return genericRemove(researchSpecialties, data.id, ENTITY_TYPE, admin.id, summarize);
  });

const reorder = createServerFn({ method: "POST" })
  .validator(validateWith(reorderSchema))
  .handler(async ({ data, context }) => {
    requireAdmin(context);
    return genericReorder(researchSpecialties, data.orderedIds);
  });

export const researchSpecialtiesCrud = {
  list,
  create,
  update,
  remove,
  reorder,
} as unknown as CollectionCrudApi;
