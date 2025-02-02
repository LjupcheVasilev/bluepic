"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Session } from "@/app/api/auth/types";

interface UserContextType {
  session: Session;
  user: User | null;
  isLoading: boolean;
  setSession: React.Dispatch<React.SetStateAction<Session>>;
}

const UserContext = createContext<UserContextType>({
  session: { did: "" },
  user: null,
  isLoading: true,
  setSession: () => {},
});

type User = {
  did: string;
  name?: string;
  avatarLink?: string;
  createdAt: Date;
  updatedAt?: Date;
  handle: string;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session>({ did: "" });
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/session", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        setSession(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!session?.did) return;

    fetch(`/api/users/${session.did}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      });
  }, [session]);

  return (
    <UserContext.Provider value={{ session, user, isLoading, setSession }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserSession = () => useContext(UserContext);
