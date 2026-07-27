/**
 * Store selector. Returns the Supabase backend when configured, otherwise the
 * native Blobs backend — so the system always has a working data layer.
 */

import { isSupabaseConfigured } from "@/lib/workshops/store/supabase-client";
import { blobsStore } from "@/lib/workshops/store/blobs-store";
import { supabaseStore } from "@/lib/workshops/store/supabase-store";
import type { WorkshopStore } from "@/lib/workshops/store/store-interface";

export function getWorkshopStore(): WorkshopStore {
  return isSupabaseConfigured() ? supabaseStore : blobsStore;
}

export type { WorkshopStore };
