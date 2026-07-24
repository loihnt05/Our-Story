"use client";

import { useEffect, useRef } from "react";
import { useUser } from "./AuthProvider";

export default function UserSyncHandler() {
  const { isSignedIn, user } = useUser();
  const syncedRef = useRef<string | null>(null);

  useEffect(() => {
    if (isSignedIn && user) {
      const userId = (user as any).id || "mock_user_id";
      
      if (syncedRef.current === userId) return;
      syncedRef.current = userId;

      fetch("/api/sync-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerkId: userId, email: (user as any).primaryEmailAddress?.emailAddress }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log("[UserSyncHandler] Successfully synced account to Neon DB:", data.user);
          } else {
            console.log("[UserSyncHandler] Sync status:", data.error || data);
          }
        })
        .catch((err) => {
          console.error("[UserSyncHandler] Auto-sync failed:", err);
          syncedRef.current = null;
        });
    }
  }, [isSignedIn, user]);

  return null;
}
