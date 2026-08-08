/**
 * Partner-only content authorization boundary.
 *
 * The team has not yet selected an external identity provider or supplied a
 * contracted-company allowlist. Until those are connected, every browser
 * request remains public and protected details are never rendered.
 */
export interface PartnerAccess {
  authorized: boolean;
  authorizationConnected: boolean;
}

export async function getPartnerAccess(): Promise<PartnerAccess> {
  return { authorized: false, authorizationConnected: false };
}
