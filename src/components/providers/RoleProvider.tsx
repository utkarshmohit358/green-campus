'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserRole, UserSession, DEFAULT_USER_SESSION } from '@/lib/utils';
import { StorageService } from '@/lib/storage';

interface RoleContextType {
  session: UserSession;
  setRole: (role: UserRole) => void;
}

const RoleContext = createContext<RoleContextType>({
  session: DEFAULT_USER_SESSION,
  setRole: () => {},
});

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserSession>(DEFAULT_USER_SESSION);

  useEffect(() => {
    const saved = StorageService.getUserSession();
    setSession(saved);
  }, []);

  const handleSetRole = (role: UserRole) => {
    const updated = StorageService.setUserRole(role);
    setSession(updated);
  };

  return (
    <RoleContext.Provider value={{ session, setRole: handleSetRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
