import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { socialLinks } from "@/db/schema";
import { safeString, safeUrl } from "@/lib/text-validation";
import { requireAdmin } from "../require-admin";
import {
  genericCreate,
  genericList,
  genericRemove,
  genericReorder,
  genericUpdate,
} from "../collection-helpers";
import type { CollectionCrudApi } from "../collection-helpers";

const ENTITY_TYPE = "social_link";
const summarize = (row: Record<string, unknown>) => String(row["label"] ?? row["id"]);

const insertSchema = z.object({ label: safeString(100).min(1), url: safeUrl() });
const updateSchema = insertSchema.partial().and(z.object({ id: z.string().uuid() }));
const idSchema = z.object({ id: z.string().uuid() });
const reorderSchema = z.object({ orderedIds: z.array(z.string().uuid()) });

const list = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  requireAdmin(context);
  return genericList(socialLinks);
});

const create = createServerFn({ method: "POST" })
  .validator(insertSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    return genericCreate(socialLinks, data, ENTITY_TYPE, admin.id, summarize);
  });

const update = createServerFn({ method: "POST" })
  .validator(updateSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    return genericUpdate(socialLinks, data, ENTITY_TYPE, admin.id, summarize);
  });

const remove = createServerFn({ method: "POST" })
  .validator(idSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    return genericRemove(socialLinks, data.id, ENTITY_TYPE, admin.id, summarize);
  });

const reorder = createServerFn({ method: "POST" })
  .validator(reorderSchema)
  .handler(async ({ data, context }) => {
    requireAdmin(context);
    return genericReorder(socialLinks, data.orderedIds);
  });

export const socialLinksCrud = {
  list,
  create,
  update,
  remove,
  reorder,
} as unknown as CollectionCrudApi;
