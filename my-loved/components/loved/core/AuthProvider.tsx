"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { LogOut } from "lucide-react";

import {
  ClerkProvider as ClerkProviderClient,
  useAuth as useClerkAuth,
  useClerk as useClerkInstance,
  SignInButton as ClerkSignInButton,
  UserButton as ClerkUserButton,
  Show as ClerkShow,
  useUser as useClerkUser,
} from "@clerk/nextjs";

// Determine if we should use Mock Auth or real Clerk
const CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
const IS_MOCK_AUTH = 
  !CLERK_PUBLISHABLE_KEY || 
  CLERK_PUBLISHABLE_KEY.includes("placeholder") || 
  CLERK_PUBLISHABLE_KEY === "pk_test_Y2xlcmsub3VyLXN0b3J5LTg3LmNsZXJrLmFjY291bnRzLmRldiQ";

// Mock Auth Context
interface MockAuthContextType {
  isSignedIn: boolean;
  login: () => void;
  logout: () => void;
}

const MockAuthContext = createContext<MockAuthContextType>({
  isSignedIn: false,
  login: () => {},
  logout: () => {}
});

export function useMockAuth() {
  return useContext(MockAuthContext);
}

// Wrapper for the entire layout auth context
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedStatus = localStorage.getItem("loved_mock_signed_in");
    if (savedStatus === "true") {
      setIsSignedIn(true);
    }
  }, []);

  const login = () => {
    setIsSignedIn(true);
    localStorage.setItem("loved_mock_signed_in", "true");
    // Reload path to refresh auth states across page
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const logout = () => {
    setIsSignedIn(false);
    localStorage.removeItem("loved_mock_signed_in");
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <MockAuthContext.Provider value={{ isSignedIn, login, logout }}>
      {children}
    </MockAuthContext.Provider>
  );
}

// Conditionally wrap Layout in ClerkProvider
export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  if (IS_MOCK_AUTH) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  return (
    <ClerkProviderClient publishableKey={CLERK_PUBLISHABLE_KEY}>
      <AuthProvider>{children}</AuthProvider>
    </ClerkProviderClient>
  );
}

// Export custom hooks that match Clerk's API signatures
export function useAuth() {
  const mock = useMockAuth();
  
  if (IS_MOCK_AUTH) {
    return {
      isSignedIn: mock.isSignedIn,
      userId: mock.isSignedIn ? "mock_user_id" : null,
      isLoaded: true
    };
  }

  return useClerkAuth();
}

export function useClerk() {
  const mock = useMockAuth();

  if (IS_MOCK_AUTH) {
    return {
      openSignIn: () => mock.login(),
      signOut: () => mock.logout(),
      user: mock.isSignedIn ? { firstName: "Romeo", lastName: "Juliet" } : null
    };
  }

  return useClerkInstance();
}

// Export custom Sign In Button
export function SignInButton({ 
  children, 
  mode 
}: { 
  children: React.ReactNode; 
  mode?: "modal" | "redirect" 
}) {
  const mock = useMockAuth();

  if (IS_MOCK_AUTH) {
    return (
      <div onClick={() => mock.login()} className="contents cursor-pointer">
        {children}
      </div>
    );
  }

  return <ClerkSignInButton mode={mode}>{children}</ClerkSignInButton>;
}

// Export custom User Profile Button
export function UserButton() {
  const mock = useMockAuth();

  if (IS_MOCK_AUTH) {
    return (
      <button
        onClick={() => mock.logout()}
        className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold text-xs border border-rose-300/30 transition-all cursor-pointer"
        title="Sign Out (Mock Auth)"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Logout</span>
      </button>
    );
  }

  return <ClerkUserButton />;
}

// Export custom Show wrapper
export function Show({ 
  children, 
  when 
}: { 
  children: React.ReactNode; 
  when: "signed-in" | "signed-out" 
}) {
  const mock = useMockAuth();
  
  if (IS_MOCK_AUTH) {
    if (when === "signed-in" && mock.isSignedIn) return <>{children}</>;
    if (when === "signed-out" && !mock.isSignedIn) return <>{children}</>;
    return null;
  }

  return <ClerkShow when={when}>{children}</ClerkShow>;
}

export function useUser() {
  const mock = useMockAuth();
  const clerkUser = useClerkUser();

  if (IS_MOCK_AUTH) {
    return {
      isLoaded: true,
      isSignedIn: mock.isSignedIn,
      user: mock.isSignedIn ? {
        fullName: "Romeo Montague",
        firstName: "Romeo",
        lastName: "Montague",
        primaryEmailAddress: { emailAddress: "romeo@verona.it" },
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
      } : null
    };
  }

  return clerkUser;
}
