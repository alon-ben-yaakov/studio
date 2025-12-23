'use client';
import { createContext, useContext, ReactNode } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

export type FirebaseProviderProps = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  children: ReactNode;
};

const FirebaseContext = createContext<
  Omit<FirebaseProviderProps, 'children'> | undefined
>(undefined);

export function FirebaseProvider({
  app,
  auth,
  firestore,
  children,
}: FirebaseProviderProps) {
  const value = { app, auth, firestore };
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const useFirebaseApp = () => useFirebase().app;
export const useAuth = () => useFirebase().auth;
export const useFirestore = () => useFirebase().firestore;
