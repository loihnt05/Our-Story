"use client";

import { useEffect, useRef } from "react";
import { useUser } from "./AuthProvider";

export default function UserSyncHandler() {
  const { isSignedIn, user } = useUser();
  const syncedRef = useRef<string | null>(null);

  useEffect(() => {
    // Check if real user or mock user is signed in
    if (isSignedIn && user) {
      // Avoid duplicate calls for the same user instance in a session
      const userIdentifier = (user as any).id || (user as any).primaryEmailAddress?.emailAddress || "mock";
      
      if (syncedRef.current === userIdentifier) return;
      syncedRef.current = userIdentifier;

      fetch("/api/sync-user", { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log("[UserSyncHandler] Successfully auto-synced user to Neon DB:", data.user);
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
