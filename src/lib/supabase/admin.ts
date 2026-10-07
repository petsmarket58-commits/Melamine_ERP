import "server-only"

import { createClient } from "@supabase/supabase-js"

import { publicEnv } from "@/lib/env"

/**
 * Service-role client. BYPASSES ROW LEVEL SECURITY.
 *
 * Only for trusted server-side operations that cannot run as the user
 * (e.g. NCA super-admin provisioning, sending invites). Never import this
 * from a Client Component, and always authorise the caller first.
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set")
  }

  return createClient(publicEnv().NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
