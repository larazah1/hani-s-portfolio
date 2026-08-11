import type { CurrentAdmin } from "./current-admin";

export class UnauthorizedError extends Error {
  constructor(message = "Not authenticated.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * First line of every mutating server function. Authentication (is there a
 * valid session) is necessary but not sufficient — a server function is a
 * real callable endpoint independent of whatever route rendered the button
 * that called it, so authorization is re-checked here too, not just relied
 * on from a route's `beforeLoad` guard.
 */
export function requireAdmin(context: { admin: CurrentAdmin | null }): CurrentAdmin {
  if (!context.admin) throw new UnauthorizedError();
  return context.admin;
}
