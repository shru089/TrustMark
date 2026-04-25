/**
 * TrustMark – Firebase client initialisation & Google OAuth helper.
 *
 * This module is imported by any component that needs Firebase services.
 * It initialises the app once (idempotent via getApps()) and exports:
 *   • auth  – Firebase Auth instance
 *   • db    – Firestore client (for direct client-side queries if needed)
 *   • signInWithGoogle() – triggers Google OAuth popup flow
 *   • signOut()          – signs the current user out
 *   • getIdToken()       – returns a fresh Firebase ID token for API calls
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ---------------------------------------------------------------------------
// Firebase project configuration (all values from environment variables)
// ---------------------------------------------------------------------------

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "missing-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "missing-auth-domain",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "missing-project-id",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "missing-storage-bucket",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "missing-sender-id",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "missing-app-id",
};

// Prevent re-initialisation in Next.js hot-module-replacement cycles
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

// ---------------------------------------------------------------------------
// Google OAuth
// ---------------------------------------------------------------------------

const googleProvider = new GoogleAuthProvider();
// Request the user's email address in the OAuth scope
googleProvider.addScope("email");
googleProvider.addScope("profile");

/**
 * Opens a Google OAuth popup and signs the user in.
 * Returns the signed-in User on success.
 */
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

/**
 * Signs the current user out of Firebase Auth.
 */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Returns a fresh Firebase ID token for the currently signed-in user.
 * Pass `forceRefresh = true` if the cached token may be stale.
 *
 * Throws if no user is signed in.
 */
export async function getIdToken(forceRefresh = false): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No authenticated user – cannot obtain ID token.");
  }
  return user.getIdToken(forceRefresh);
}

/**
 * Subscribe to auth state changes.
 * Returns an unsubscribe function to clean up the listener.
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export type { User };
