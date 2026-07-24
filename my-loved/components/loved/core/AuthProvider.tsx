"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { LogOut, RefreshCw } from "lucide-react";

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
  CLERK_PUBLISHABLE_KEY === "pk_test_Y2xlcmsub3VyLXN0b3J5LTg3LmNsZXJrLmFjY291bnRzLmRldiQ" ||
  true; // Enable test account authentication mode by default for local development

export type TestAccount = "romeo" | "juliet";

// Mock Auth Context
interface MockAuthContextType {
  isSignedIn: boolean;
  account: TestAccount;
  login: (account?: TestAccount) => void;
  logout: () => void;
  switchAccount: (account: TestAccount) => void;
}

const MockAuthContext = createContext<MockAuthContextType>({
  isSignedIn: false,
  account: "romeo",
  login: () => {},
  logout: () => {},
  switchAccount: () => {},
});

export function useMockAuth() {
  return useContext(MockAuthContext);
}

// Wrapper for the entire layout auth context
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [account, setAccount] = useState<TestAccount>("romeo");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedStatus = localStorage.getItem("loved_mock_signed_in");
    const savedAccount = (localStorage.getItem("loved_mock_account") as TestAccount) || "romeo";
    
    if (savedStatus === "true") {
      setIsSignedIn(true);
      setAccount(savedAccount);
    }
  }, []);

  const login = (selectedAccount: TestAccount = "romeo") => {
    setIsSignedIn(true);
    setAccount(selectedAccount);
    localStorage.setItem("loved_mock_signed_in", "true");
    localStorage.setItem("loved_mock_account", selectedAccount);
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const switchAccount = (selectedAccount: TestAccount) => {
    setAccount(selectedAccount);
    localStorage.setItem("loved_mock_account", selectedAccount);
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
    <MockAuthContext.Provider value={{ isSignedIn, account, login, logout, switchAccount }}>
      {children}
    </MockAuthContext.Provider>
  );
}

import UserSyncHandler from "./UserSyncHandler";

// Conditionally wrap Layout in ClerkProvider
export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UserSyncHandler />
      {children}
    </AuthProvider>
  );
}

// Export custom hooks that match Clerk's API signatures
export function useAuth() {
  const mock = useMockAuth();
  
  return {
    isSignedIn: mock.isSignedIn,
    userId: mock.isSignedIn 
      ? mock.account === "juliet" ? "user_juliet_456" : "mock_user_id"
      : null,
    isLoaded: true
  };
}

export function useClerk() {
  const mock = useMockAuth();

  return {
    openSignIn: (options?: any) => mock.login("romeo"),
    signOut: () => mock.logout(),
    user: mock.isSignedIn
      ? mock.account === "juliet"
        ? { firstName: "Juliet", lastName: "Capulet" }
        : { firstName: "Romeo", lastName: "Montague" }
      : null
  };
}

// Export custom Sign In Button
export function SignInButton({ 
  children, 
  mode,
  account = "romeo"
}: { 
  children?: React.ReactNode; 
  mode?: "modal" | "redirect";
  account?: TestAccount;
}) {
  const mock = useMockAuth();

  return (
    <div onClick={() => mock.login(account)} className="contents cursor-pointer">
      {children || (
        <button className="px-4 py-2 bg-rose-500 text-white rounded-full font-semibold text-sm hover:bg-rose-600 transition-all">
          Sign In as {account === "juliet" ? "Juliet 👰‍♀️" : "Romeo 🤵‍♂️"}
        </button>
      )}
    </div>
  );
}

// Export custom User Profile Button with Partner Switching capability
export function UserButton() {
  const mock = useMockAuth();
  const isJuliet = mock.account === "juliet";

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => mock.switchAccount(isJuliet ? "romeo" : "juliet")}
        className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500/15 hover:bg-pink-500/25 text-pink-600 dark:text-pink-300 font-semibold text-xs border border-pink-400/30 transition-all cursor-pointer shadow-sm"
        title={`Currently logged in as ${isJuliet ? "Juliet" : "Romeo"}. Click to switch to ${isJuliet ? "Romeo" : "Juliet"}`}
      >
        <RefreshCw className="w-3 h-3 animate-spin-slow" />
        <span>{isJuliet ? "Juliet 👰‍♀️ (Switch to Romeo)" : "Romeo 🤵‍♂️ (Switch to Juliet)"}</span>
      </button>

      <button
        onClick={() => mock.logout()}
        className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold text-xs border border-rose-300/30 transition-all cursor-pointer"
        title="Sign Out"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Logout</span>
      </button>
    </div>
  );
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
  
  if (when === "signed-in" && mock.isSignedIn) return <>{children}</>;
  if (when === "signed-out" && !mock.isSignedIn) return <>{children}</>;
  return null;
}

export function useUser() {
  const mock = useMockAuth();
  const isJuliet = mock.account === "juliet";

  return {
    isLoaded: true,
    isSignedIn: mock.isSignedIn,
    user: mock.isSignedIn ? {
      id: isJuliet ? "user_juliet_456" : "mock_user_id",
      fullName: isJuliet ? "Juliet Capulet" : "Romeo Montague",
      firstName: isJuliet ? "Juliet" : "Romeo",
      lastName: isJuliet ? "Capulet" : "Montague",
      primaryEmailAddress: { emailAddress: isJuliet ? "juliet@verona.it" : "romeo@verona.it" },
      imageUrl: isJuliet 
        ? "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=256&auto=format&fit=crop"
        : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
    } : null
  };
}
