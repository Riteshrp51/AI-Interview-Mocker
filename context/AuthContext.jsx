"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check local storage on mount
    const stored = window.localStorage.getItem("aimocker_user");
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored);
        setUser(parsedUser);
        console.log("AuthContext: Restored user from storage", parsedUser);
      } catch (e) {
        console.error("AuthContext: Failed to parse stored auth user", e);
        window.localStorage.removeItem("aimocker_user");
      }
    } else {
      console.log("AuthContext: No user found in storage");
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized || typeof window === "undefined") return;

    if (user) {
      window.localStorage.setItem("aimocker_user", JSON.stringify(user));
      console.log("AuthContext: User state updated (logged in)", user);
    } else {
      window.localStorage.removeItem("aimocker_user");
      console.log("AuthContext: User logged out");
    }
  }, [user, initialized]);

  const login = async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    setUser(data.user);
    return data.user;
  };

  const signup = async (username, email, password) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Signup failed");
    }

    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, initialized, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
