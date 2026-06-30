// src/lib/supabase-admin.ts
import { createClient } from "@supabase/supabase-js";

// OJO: este cliente usa la SECRET key y tiene acceso total.
// NUNCA importar este archivo en un componente "use client".
// Solo se usa dentro de src/app/api/**/route.ts (código de servidor).
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);