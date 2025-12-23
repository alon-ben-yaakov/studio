'use client';
import { ReactNode, useEffect, useState } from 'react';
import { FirebaseProvider, FirebaseProviderProps } from '@/firebase/provider';
import { initializeFirebase } from '.';

type FirebaseClientProviderProps = {
  children: ReactNode;
};

export function FirebaseClientProvider({
  children,
}: FirebaseClientProviderProps) {
  const [firebase, setFirebase] = useState<FirebaseProviderProps | null>(null);
  useEffect(() => {
    const firebaseInstances = initializeFirebase();
    setFirebase(firebaseInstances);
  }, []);
  if (!firebase) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }
  return <FirebaseProvider {...firebase}>{children}</FirebaseProvider>;
}
