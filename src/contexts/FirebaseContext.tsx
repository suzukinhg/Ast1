import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

export const AVATAR_SEEDS = ["Felix", "Daisy", "Charlie", "Bella", "Apollo", "Luna", "Milo", "Chloe", "Oliver", "Lily"];

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  OperationType: typeof OperationType;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Sync user to Firestore
        const userRef = doc(db, 'users', user.uid);
        try {
          const userDoc = await getDoc(userRef);
          if (!userDoc.exists()) {
            const randomSeed = AVATAR_SEEDS[Math.floor(Math.random() * AVATAR_SEEDS.length)];
            const randomPhoto = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;
            const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, animals], separator: '', style: 'capital' }) + Math.floor(Math.random() * 100);

            // Fetch any existing or new values
            const finalDisplayName = user.displayName || randomName;
            const finalPhotoURL = user.photoURL || randomPhoto;

            if (!user.displayName || !user.photoURL) {
              await updateProfile(user, {
                displayName: finalDisplayName,
                photoURL: finalPhotoURL
              }).catch(e => console.error(e));
            }

            await setDoc(userRef, {
              userId: user.uid,
              displayName: finalDisplayName,
              email: user.email || null,
              phoneNumber: user.phoneNumber || null,
              photoURL: finalPhotoURL,
              createdAt: serverTimestamp(),
            });
            
            // To ensure ui gets updated after updateProfile
            setUser({ ...user } as User);
          } else {
            setUser(user);
          }
        } catch (error) {
          console.error("Error syncing user profile:", error);
          setUser(user);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  return (
    <FirebaseContext.Provider value={{ user, loading, logout, OperationType }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}
