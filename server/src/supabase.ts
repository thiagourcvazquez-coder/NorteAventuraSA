import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

/**
 * Cliente Supabase con service role (solo server-side).
 * Devuelve null si faltan credenciales: el server sigue funcionando
 * y las reservas se resuelven igual vía WhatsApp.
 */
export function getSupabase(): SupabaseClient | null {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.warn('[supabase] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY no configuradas — modo sin persistencia');
    return null;
  }
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}
