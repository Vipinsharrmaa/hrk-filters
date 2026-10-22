"use client";

import { useEffect } from "react";
import { DataStore } from "@/lib/store";

/**
 * Global background synchronizer component.
 * Mounted once in RootLayout to ensure every visitor and device immediately
 * pulls the latest products, categories, and vehicle models from Supabase.
 */
export default function StoreSync() {
  useEffect(() => {
    DataStore.syncWithSupabase();
  }, []);

  return null;
}
