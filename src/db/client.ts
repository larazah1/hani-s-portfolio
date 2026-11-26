import "@tanstack/react-start/server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl = process.env["DATABASE_URL"];
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.");
}

// Neon's HTTP driver: stateless, one fetch per query, safe for serverless.
// No interactive transactions — use db.batch([...]) for atomic multi-writes.
export const db = drizzle(neon(databaseUrl), { schema });
