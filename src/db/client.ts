import "@tanstack/react-start/server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const databaseUrl = process.env["DATABASE_URL"];
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.");
}

// One connection per serverless function instance — see docs/plan notes on
// pairing this with a pooled connection string (e.g. Neon/Supabase pooler)
// in production to avoid exhausting the database's max_connections.
const queryClient = postgres(databaseUrl, { max: 1 });

export const db = drizzle(queryClient, { schema });
